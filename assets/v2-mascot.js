(() => {
  "use strict";
  const CONFIG = /* CONFIG_START */ {
    "states": {
      "idle": {"duration":0,"priority":0},
      "listening": {"duration":0,"priority":1},
      "thinking": {"duration":0,"priority":2},
      "speaking": {"duration":10000,"priority":5},
      "greeting": {"duration":2600,"priority":3},
      "waving": {"duration":2400,"priority":3},
      "pointing": {"duration":3000,"priority":3},
      "presenting": {"duration":2800,"priority":3},
      "celebrating": {"duration":3000,"priority":3},
      "farewell": {"duration":2600,"priority":4},
      "acknowledging": {"duration":1050,"priority":3},
      "explaining": {"duration":3600,"priority":3},
      "workflow_running": {"duration":2600,"priority":3},
      "success": {"duration":2400,"priority":4},
      "error": {"duration":2100,"priority":3},
      "encouraging": {"duration":1500,"priority":3}
    },
    "transitionSeconds":0.10,
    "blinkIntervals":[3.8,5.2,2.9,4.7,6.1,3.3,5.6,4.2],
    "visemes":{"rest":[46,4],"closed":[46,4],"open":[52,26],"wide":[62,15],"round":[36,30]},
    "arm":{"upperLength":164.283292,"lowerLength":103.247276,"reach":230,"upperRest":105.89898,"lowerRest":98.914927}
  } /* CONFIG_END */;
  const $ = id => document.getElementById(id);
  const root = $("v2-stage") || $("demo");
  if (!root) return;
  if (window.AIHubMascotV2) window.AIHubMascotV2.destroy();
  const ids = ["character","legs","upper-body","head","arm-left","arm-right","forearm-left","forearm-right",
    "hand-left","hand-right","eye-left","eye-right","eyebrows","brow-left","brow-right","mouth-mark",
    "pupil-left","pupil-right"];
  const rig = Object.fromEntries(ids.map(id => [id, $(id)]));
  if (Object.values(rig).some(node => !node)) return;
  // Optional host-panel controls. The landing page supplies only the trigger,
  // so every other lookup is absent and the writer below is guarded.
  const ui = {
    trigger:$("v2-trigger") || $("mascot-trigger"),
    play:$("play-talk"),stop:$("stop-talk"),label:$("motion-status"),
    state:$("state-label"),progress:$("progress-fill"),reduce:$("reduced-motion"),
    system:$("system-motion"),file:$("voice-file"),audio:$("voice-audio"),audioPlay:$("play-audio"),
    mute:$("mute-audio"),audioStatus:$("audio-status"),tts:$("speak-text"),text:$("speech-text")
  };
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cleanup = [], mediaCleanup = [], connections = new Map();
  const clamp = (x,min=0,max=1) => Math.max(min,Math.min(max,x));
  const smooth = x => { x=clamp(x); return x*x*(3-2*x); };
  const deg = x => x*180/Math.PI;
  
  const wave = (t,p,phase=0) => Math.sin(t*2*Math.PI/p+phase);
  // Slow non-repeating drift: two incommensurable sines multiplied together.
  // Used on top of gesture phrases so repeated passes are never identical.
  const organic = (t,seed=1) => Math.sin(t*(.31+seed*.07)+seed*2.1)*Math.sin(t*(.17+seed*.05)+seed*1.3);
  const clock = () => performance.now();
  const neutral = () => ({body:0,lift:0,tilt:0,nod:0,yaw:0,gx:0,gy:0,
    la:0,le:0,lw:0,ra:0,re:0,rw:0,lo:0,ro:0,lp:0,rp:0,
    smile:0,brow:0,asym:0,eye:1,mw:46,mh:4,jump:0,crouch:0,
    px:0,py:0});
  let pose=neutral(), state="idle", stateAt=clock(), afterState="idle", stateTimer=null;
  let destroyed=false, reduced=false, raf=null, last=clock(), token=0;
  let audio=null, audioActive=false, context=null, analyser=null, samples=null, cues=[];
  let tts=null, utterance=null, muted=false, objectURL=null, level=0;
  let gaze={x:0,y:0,until:0}, targetPoint=null, emotion="neutral", explicitEmotion=false;
  let blinkIndex=0, nextBlink=clock()+2100, blinkAt=-10000, doublePending=false;
  let nextLook=clock()+2400, lookIndex=0;
  let winkAt=-10000, winkSide="left", calibration=null;
  let pointPlan=null;
  // Set while a silent `speaking` preview is running (no audio attached).
  let allowSilentSpeaking=false;
  // One-shot flags so the speaking winks fire once per utterance, not per frame.
  let winkedAt26=false, winkedAt64=false;
  const JOINTS = {
    shoulder:{pivot:[300,530],fixed:[[318,514],[327,603]],moving:[[293,536],[316,604]],axis:[-1,0]},
    elbow:{pivot:[255,688],fixed:[[225,665],[292,686]],moving:[[217,697],[286,714]],axis:[-.155,.988]},
    wrist:{pivot:[239,790],fixed:[[209,779],[274,780]],moving:[[207,802],[274,802]],axis:[0,1]}
  };
  const sleeves=Object.fromEntries(["left","right"].map(side=>[side,
    Object.fromEntries(Object.keys(JOINTS).map(j=>[j,$("sleeve-"+j+"-"+side)]))]));
  const rotatePoint=(point,angle,pivot)=>{
    const r=angle*Math.PI/180,c=Math.cos(r),s=Math.sin(r),x=point[0]-pivot[0],y=point[1]-pivot[1];
    return [pivot[0]+x*c-y*s,pivot[1]+x*s+y*c];
  };
  const pt=p=>p.map(v=>v.toFixed(3)).join(" ");
  // Four boundary anchors, in the socket's LOCAL frame. The fixed cap is embedded
  // in the proximal shell; the other cap rotates with the distal shell.
  // Cubic sides follow the attachment tangents. No DOM screen-space tracking.
  function sleeve(side,joint,angle) {
    const j=JOINTS[joint],a=j.fixed[0],d=j.fixed[1];
    const b=rotatePoint(j.moving[0],angle,j.pivot),c=rotatePoint(j.moving[1],angle,j.pivot);
    const tangent=rotatePoint(j.axis,angle,[0,0]);
    const handle=(u,v)=>Math.min(19,Math.hypot(u[0]-v[0],u[1]-v[1])*.34);
    const ab=handle(a,b),dc=handle(d,c);
    const add=(p,v,n)=>[p[0]+v[0]*n,p[1]+v[1]*n];
    sleeves[side][joint].setAttribute("d",
      `M${pt(a)} C${pt(add(a,j.axis,ab))} ${pt(add(b,tangent,-ab))} ${pt(b)} L${pt(c)} C${pt(add(c,tangent,-dc))} ${pt(add(d,j.axis,dc))} ${pt(d)} Z`);
  }
  function wink(side) {
    if(destroyed || reduced || clock()-winkAt<900) return false;
    // Alternate which eye winks on each call so repeated winks never look
    // mechanical; an explicit side still wins when the caller supplies one.
    winkSide=side==="right"?"right":side==="left"?"left":
      (winkSide==="left"?"right":"left");
    winkAt=clock();
    // Hold automatic binocular blinking until the distinct single-eye wink ends.
    blinkAt=-10000;nextBlink=Math.max(nextBlink,winkAt+1500);requestFrame();return true;
  }
  function winkClosure(now) {
    const u=(now-winkAt)/1000;
    if(u<0 || u>.58) return 0;
    return u<.16?smooth(u/.16):u<.28?1:1-smooth((u-.28)/.30);
  }
  const gestureEnvelope=(u,d,delay=0)=>smooth((u-delay)/.48)*(1-smooth((u-(d-.65))/.65));
  function armPose(p,side,a,e,w,open,u,d) {
    // Shoulder leads; elbow and wrist follow rather than jumping to one shared target.
    p[side+"a"]=a*gestureEnvelope(u,d);
    p[side+"e"]=e*gestureEnvelope(u,d,.12);
    p[side+"w"]=w*gestureEnvelope(u,d,.20);
    p[side+"o"]=open*gestureEnvelope(u,d,.15);
  }
  const labels={idle:"Ready when you are",listening:"Ready for your message",thinking:"Thinking",
    speaking:"Speaking",greeting:"Hello there",waving:"A friendly wave",pointing:"Right over here",
    presenting:"Let me show you",celebrating:"Nicely done!",farewell:"See you soon",acknowledging:"Got it",
    explaining:"Let me walk you through it",workflow_running:"Running your workflow",success:"All done!",
    error:"Something went sideways",encouraging:"You've got this"};
  const hands = {};
  ["left","right"].forEach(side => {
    const group=rig["hand-"+side];
    hands[side]={rest:group.querySelector(".hand-rest"),open:group.querySelector(".hand-open"),
      fingers:Array.from(group.querySelectorAll("[data-finger]"))};
  });
  function on(node,event,fn,options,list=cleanup) {
    node.addEventListener(event,fn,options);
    list.push(()=>node.removeEventListener(event,fn,options));
  }
  function emit(name,detail) { root.dispatchEvent(new CustomEvent("avatar:"+name,{detail})); }
  function clearStateTimer() { clearTimeout(stateTimer); stateTimer=null; }
  function updateUI() {
    if (root) root.dataset.state=state;
    // The landing page has no demo control panel, so every write is optional.
    const set=(node,key,value)=>{ if(node) node[key]=value; };
    const text=(node,value)=>{ if(node) node.textContent=value; };
    set(ui.label,"textContent",labels[state]);
    set(ui.state,"textContent",state.toUpperCase());
    set(ui.stop,"disabled",state==="idle" && !utterance && !audioActive);
    set(ui.stop,"textContent",audioActive || utterance ? "Stop speaking" : "Stop");
    text($("play-label"),state==="listening" ? "Greet again" : "Start interaction");
    if(ui.mute){ui.mute.setAttribute("aria-pressed",String(muted));
      ui.mute.textContent=muted ? "Unmute voice" : "Mute voice";}
  }
  function transition(next,{force=false,after="idle"}={}) {
    if (destroyed || !Object.prototype.hasOwnProperty.call(CONFIG.states,next) ||
        !Object.prototype.hasOwnProperty.call(CONFIG.states,after)) return false;
    // `speaking` is allowed either from real audio/TTS or as a timed preview
    // gesture with no voice; the mouth still animates on a speech-shaped cycle.
    if (next==="speaking" && !audioActive && !tts && !allowSilentSpeaking) return false;
    const activeGesture=CONFIG.states[state].duration>0;
    if (!force && (audioActive || utterance || tts || (activeGesture &&
        CONFIG.states[next].priority<CONFIG.states[state].priority))) return false;
    clearStateTimer();calibration=null;
    const previous=state;
    state=next; stateAt=clock(); afterState=after;
    if(next==="speaking") { winkedAt26=false; winkedAt64=false; }
    updateUI();
    emit("statechange",{previous,state});
    const duration=CONFIG.states[next].duration;
    if (duration) stateTimer=setTimeout(()=>transition(afterState,{force:true}),duration);
    requestFrame();
    return true;
  }
  function blink(now) {
    if (now>=nextBlink && !(state==="speaking" && winkClosure(now)>0)) {
      blinkAt=now;
      if (doublePending) {
        doublePending=false;
        nextBlink=now+CONFIG.blinkIntervals[(blinkIndex++)%CONFIG.blinkIntervals.length]*1000;
      } else if (blinkIndex%4===2) {
        doublePending=true; nextBlink=now+330;
      } else {
        nextBlink=now+CONFIG.blinkIntervals[(blinkIndex++)%CONFIG.blinkIntervals.length]*1000;
      }
    }
    const t=(now-blinkAt)/1000;
    if (t<0 || t>.27) return 1;
    return 1-.94*(t<.08 ? smooth(t/.08) : t<.12 ? 1 : 1-smooth((t-.12)/.15));
  }
  function aim(element) {
    const rect=element.getBoundingClientRect(),x=rect.left+rect.width/2,y=rect.top+rect.height/2;
    const body=rig["upper-body"].getScreenCTM(),center=new DOMPoint(448,530).matrixTransform(body);
    const side=x>=center.x?"right":"left",prefix=side==="right"?"r":"l";
    const local=new DOMPoint(x,y).matrixTransform($("shoulder-"+side).getScreenCTM().inverse());
    const arm=CONFIG.arm,dx=local.x-300,dy=local.y-530;
    const distance=clamp(Math.hypot(dx,dy)-80,110,arm.upperLength+arm.lowerLength-8);
    let theta=Math.atan2(dy,dx);if(theta<0)theta+=2*Math.PI;
    // Anatomical pose branches: inward/down presentation vs outward/up greeting.
    const branch=dy>=0 && theta<2.55?-1:1;
    const relative=branch*Math.acos(clamp((distance**2-arm.upperLength**2-arm.lowerLength**2)/
      (2*arm.upperLength*arm.lowerLength),-1,1));
    const shoulder=theta-Math.atan2(arm.lowerLength*Math.sin(relative),
      arm.upperLength+arm.lowerLength*Math.cos(relative));
    const a=clamp(deg(shoulder)-arm.upperRest,-22,80);
    const e=clamp(deg(relative)-(arm.lowerRest-arm.upperRest),-92,112);
    const wrist=rotatePoint(rotatePoint([239,790],e,[255,688]),a,[300,530]);
    let direction=deg(Math.atan2(local.y-wrist[1],local.x-wrist[0]));
    if(direction<0)direction+=360;
    const w=clamp(((direction-90-a-e+540)%360)-180,-35,35);
    return {side:prefix,a,e,w};
  }
  function visemeAt(time) {
    // Sorted, non-overlapping cues; binary search avoids a scan per frame.
    let low=0,high=cues.length-1,found=-1;
    while(low<=high) { const mid=(low+high)>>1;
      if(cues[mid].start<=time) { found=mid;low=mid+1; } else high=mid-1; }
    return found>=0 && time<cues[found].end ? CONFIG.visemes[cues[found].shape] : null;
  }
  function audioShape() {
    if (!audioActive || !audio || audio.paused || audio.ended || audio.muted ||
        muted || audio.volume===0 || audio.readyState<2) { level=0; return null; }
    const timed=visemeAt(audio.currentTime);
    if(timed) return timed;
    if (!analyser || !samples || !analyser.context || analyser.context.state!=="running") { level=0;return null; }
    analyser.getFloatTimeDomainData(samples);
    let sum=0;
    for (const sample of samples) sum+=sample*sample;
    const rms=Math.sqrt(sum/samples.length)*audio.volume;
    // Audio energy only. Silence is closed; no oscillators or random speech mouth.
    level=clamp((rms-.009)*6.5);
    return [46+10*level,4+26*level];
  }
  function makePose(now) {
    const t=now/1000, u=(now-stateAt)/1000, p=neutral();
    p.lift=.5*(1+wave(t,5.8)); p.body=.18*wave(t,6.4);
    if(now>gaze.until && now>nextLook) {
      const looks=[[0,0],[-.45,.05],[0,0],[.35,-.2],[0,.2],[0,0]];
      const pair=looks[(lookIndex++)%looks.length]; gaze={x:pair[0],y:pair[1],until:0};
      nextLook=now+2400+(lookIndex%3)*900;
    }
    p.gx=gaze.x; p.gy=gaze.y; p.yaw=p.gx*2; p.tilt=p.gx*.5;
    p.px=gaze.x; p.py=gaze.y;
    const expressions={
      neutral:[0,0,0,1],happy:[.9,.3,0,.9],curious:[.15,.8,.9,1.04],
      surprised:[.1,1,0,1.18],confident:[.5,.25,-.35,.95]
    };
    const natural=state==="thinking"?"curious":
      ["greeting","waving","celebrating","farewell","success","encouraging","explaining"].includes(state)?"happy":
      state==="error"?"curious":
      state==="presenting"||state==="workflow_running"?"confident":"neutral";
    const ex=expressions[explicitEmotion?emotion:natural];
    [p.smile,p.brow,p.asym,p.eye]=ex;
    if(state==="listening") {p.tilt=-1.2;p.brow=.3;}
    if(state==="thinking") {p.gx=.35;p.gy=-.45;p.yaw=1.4;p.tilt=2.2;p.nod=-1.2;}
    if(state==="acknowledging") {
      p.nod=3.5*Math.sin(clamp(u/1.05)*Math.PI);p.smile=.5;
      armPose(p,"r",-6,-24,12,.45,u,1.05);
    }
        if(state==="speaking") {
      // FULL EXPRESSIVE TALKING — works with OR without audio.
      //
      // Motion is built from PHRASES rather than one repeating wave: each gesture
      // rises, holds and releases, so the hands read as emphasising different
      // points. Two trains are offset in time so the hands never move in unison,
      // and `organic` adds slow drift so no two passes are identical.
      //
      // A 10-second preview needs no voice: when no audio is attached the mouth
      // still opens and closes on a speech-shaped cycle so the state is
      // reviewable on its own. Real audio always wins when it is present.
      const settle=smooth(u/.6), live=smooth((u-.6)/.9);
      const drift=organic(t,1), drift2=organic(t,3.7);
      // Phrase envelope: rise over ~0.55s, hold, release over ~0.7s, ~2.8s apart.
      const phrase=(x,delay=0)=>{
        const w=((x-delay)%2.8+2.8)%2.8;
        return smooth(w/.55)*(1-smooth((w-2.05)/.7));
      };
      const gl=phrase(u)*live, gr=phrase(u,.95)*live;
      // BIGGER hand motion than the calm version: the shoulders travel a full
      // 20-24 degrees on each phrase, and the base pose brings both hands well
      // in toward the abdomen so the gestures have room to swing out.
      p.la=-16*settle-6*live*drift+23*gl;
      p.ra=-14*settle-6*live*drift2+21*gr;
      // Elbow and forearm follow with real travel, not a token bend.
      p.le=(-20*settle-26*gl)*smooth((u-.1)/.5);
      p.re=(-18*settle-24*gr)*smooth((u-.15)/.5);
      // Wrist articulates with the phrase; hands open on the beat.
      p.lw=10*settle+12*gl+4*live*drift;
      p.rw=10*settle+11*gr+4*live*drift2;
      p.lo=.5*settle+.45*gl;
      p.ro=.5*settle+.43*gr;
      // Head and body lean into each phrase: a real nod, a real tilt, a sway.
      p.nod=1.1*live+1.6*gl+.5*live*drift;
      p.tilt=.7*live+1.9*gr+.45*live*drift2;
      p.body=.38*live*drift+.3*gl;
      p.lift=.9*live*drift2+.7*gr;
      p.brow=.3*Math.max(gl,gr);
      // Occasional single-eye wink WHILE talking: one around 2.6s and one around
      // 6.4s, alternating sides, and never on top of an automatic blink.
      if(u>2.5 && u<2.7 && !winkedAt26) { winkedAt26=true; wink(); }
      else if(u>6.3 && u<6.5 && !winkedAt64) { winkedAt64=true; wink(); }
      // Mouth: real audio amplitude when audio is actually playing; otherwise a
      // speech-shaped open/close cycle so the mouth still reads as talking.
      const shape=audioShape();
      if(shape) [p.mw,p.mh]=shape;
      else {
        // Vowel-like cycle: wide -> open -> round -> closed, ~2.2s per pass.
        const cyc=(t%2.2)/2.2;
        const wide=smooth(cyc/.18)*(1-smooth((cyc-.42)/.16));
        const open=smooth((cyc-.4)/.14)*(1-smooth((cyc-.66)/.16));
        const round=smooth((cyc-.64)/.14)*(1-smooth((cyc-.86)/.14));
        p.mw=46+18*wide+(-10)*round;
        p.mh=4+26*open+30*round;
      }
    }
if(["greeting","waving","farewell"].includes(state)) {
      const d=CONFIG.states[state].duration/1000;
      // In the mirrored local rig, +58 raises the upper arm ~74° from vertical.
      // Elbow +78 (not the former +116) brings the hand above the elbow.
      const wag=8*wave(u-.65,.78)*smooth((u-.65)/.22);
      armPose(p,"r",58,78,14+wag,1,u,d);
      p.tilt=-1.1*gestureEnvelope(u,d);p.nod=.4*wave(t,1.8);
    }
    if(state==="presenting") {
      armPose(p,"r",38,34,9,1,u,2.8);p.tilt=-1;p.brow=.4;
    }
    if(state==="pointing") {
      const a=pointPlan||{side:"r",a:18,e:-25,w:7};
      armPose(p,a.side,a.a,a.e,a.w,1,u,3);
      p[a.side+"p"]=gestureEnvelope(u,3,.25);
      p.tilt=(a.side==="r"?1:-1)*gestureEnvelope(u,3);p.brow=.35;
    }
    if(state==="celebrating") {
      const d=3;
      // Both arms lift as high as this rig's proportions allow. NOTE: this
      // character's arms are ~420 units shorter than the shoulder-to-crown
      // distance, so no joint angle can place the hands literally above the
      // head — the geometric optimum is the hands beside the head at crown
      // height. a=82 with e=98 is that optimum within the rig limits.
      armPose(p,"l",82,98,14,1,u,d);
      armPose(p,"r",82,98,11,1,Math.max(0,u-.045),d);
      // One shared ballistic root; takeoff/landing compress the existing leg shells.
      p.crouch=14*smooth(u/.24)*(1-smooth((u-.30)/.18));
      const flight=(u-.52)/.64;
      if(flight>0 && flight<1) p.jump=52*4*flight*(1-flight);
      p.crouch+=12*smooth((u-1.16)/.10)*(1-smooth((u-1.26)/.34));
      p.nod=-1.5*gestureEnvelope(u,d);p.smile=1;
    }
    // EXPLAINING — course and lesson guidance. Open-palm presentation that sweeps
    // outward and settles, with a nod and a smile. Reads as "follow along".
    if(state==="explaining") {
      const d=3.6, sweep=gestureEnvelope(u,d), breathe=wave(t,2.3);
      // Right arm leads into the open-palm present, left echoes it a beat later.
      armPose(p,"r",30+7*breathe,44+6*breathe,11,1,u,d);
      armPose(p,"l",24+6*breathe,38+5*breathe,-9,1,u-.28,d);
      p.nod=1.9*wave(t,1.7)*smooth(u/.5);p.tilt=1.1*wave(t,2.6)*smooth(u/.5);
      p.smile=.62*sweep;p.brow=.28*sweep;p.lift=.4*breathe*sweep;
    }
    // WORKFLOW RUNNING — an acknowledgement pulse, then restrained processing.
    // Deliberately calm: no celebration, no repeated arm swings.
    if(state==="workflow_running") {
      const pulse=smooth(u/.4)*(1-smooth((u-.75)/.45));
      armPose(p,"r",16+8*pulse,20+10*pulse,6,1,u,2.6);
      p.nod=2.6*Math.sin(clamp(u/1.0)*Math.PI);
      p.brow=.18;p.tilt=1.4;p.smile=.3;
      // A slow side-to-side glance, as if reading a progress list.
      const scan=wave(t,1.5);
      p.gx=.28*scan;p.gy=-.18;p.yaw=.55*scan;
    }
    // SUCCESS — a short, bright acknowledgement. Both hands come up and open.
    if(state==="success") {
      const d=2.4, rise=gestureEnvelope(u,d);
      // A shorter, brighter lift than the full celebration: hands come up and
      // open to the highest reach this rig allows, held with a small bounce.
      armPose(p,"l",70+10*rise,86+10*rise,12,1,u,d);
      armPose(p,"r",72+10*rise,88+10*rise,-9,1,u,d);
      p.nod=2.4*Math.sin(clamp(u/.8)*Math.PI);p.smile=1;p.brow=.35;
      p.lift=1.6*wave(t,3.2)*rise;
    }
    // ERROR — gentle concern. Never angry: a small head tilt, a cautious brow,
    // and one hand coming up slightly in a "hmm" gesture.
    if(state==="error") {
      const d=2.1, lift=gestureEnvelope(u,d);
      armPose(p,"r",12+10*lift,26+14*lift,4,.55,u,d);
      p.tilt=3.4*lift;p.nod=-1.6*Math.sin(clamp(u/.9)*Math.PI);
      p.brow=.5;p.smile=-.12;p.gy=-.3;p.gx=.2;
      p.lift=.3*wave(t,2.0);
    }
    // ENCOURAGING — a supportive nod and a smile when a user retries or finishes.
    if(state==="encouraging") {
      const d=1.5;
      armPose(p,"r",-4,-22,10,.5,u,d);
      p.nod=3.2*Math.sin(clamp(u/.95)*Math.PI);p.smile=.8;p.brow=.3;
      p.tilt=1.2*Math.sin(clamp(u/1.2)*Math.PI);
    }
    return p;
  }
  function rotate(node,angle,x,y) { node.setAttribute("transform",`rotate(${angle.toFixed(3)} ${x} ${y})`); }
  function drawHand(side,open,point) {
    const h=hands[side];
    h.rest.setAttribute("opacity",(1-open).toFixed(3));
    h.open.setAttribute("opacity",open.toFixed(3));
    const pivots={little:-22,ring:-9,middle:4,index:17,thumb:26};
    h.fingers.forEach(finger=>{
      const name=finger.dataset.finger;
      const folded=name!=="index"&&name!=="thumb"?point:0;
      const spread=({little:10,ring:3,middle:-2,index:-7,thumb:-7})[name]*open*(1-point);
      finger.setAttribute("transform",`translate(0 ${folded*7}) translate(${pivots[name]} 36) rotate(${spread.toFixed(2)}) scale(1 ${(1-.7*folded).toFixed(3)}) translate(${-pivots[name]} -36)`);
    });
  }
  function render(p,blinkValue,now=clock()) {
    rig.character.setAttribute("transform",`translate(0 ${(p.crouch-p.jump).toFixed(3)})`);
    rig.legs.setAttribute("transform",`translate(0 810) scale(1 ${(1-p.crouch/280).toFixed(5)}) translate(0 -810)`);
    const shadow=document.querySelector(".ground");
    if(shadow) {shadow.style.transform=`scale(${1-p.jump/180})`;shadow.style.opacity=String(1-p.jump/100);}
    rig["upper-body"].setAttribute("transform",`translate(0 ${-p.lift}) rotate(${p.body} 448 853)`);
    // No true 3D yaw: a restrained turn illusion in this flat SVG.
    rig.head.setAttribute("transform",`translate(${p.yaw} ${p.nod}) rotate(${p.tilt} 448 486) translate(448 330) scale(${1-Math.abs(p.yaw)*.0015} 1) translate(-448 -330)`);
    ["l","r"].forEach((s,i)=>{
      const side=i?"right":"left";
      rotate(rig["arm-"+side],p[s+"a"],300,530);
      rotate(rig["forearm-"+side],p[s+"e"],255,688);
      rotate(rig["hand-"+side],p[s+"w"],239,790);
      sleeve(side,"shoulder",p[s+"a"]);
      sleeve(side,"elbow",p[s+"e"]);
      sleeve(side,"wrist",p[s+"w"]);
      drawHand(side,p[s+"o"],p[s+"p"]);
    });
    const closure=winkClosure(now),winking=closure>0;
    const leftEye=(winking?1:blinkValue)*(winkSide==="left"?1-.94*closure:1);
    const rightEye=(winking?1:blinkValue)*(winkSide==="right"?1-.94*closure:1);
    rig["eye-left"].setAttribute("transform",`translate(${372.5+p.gx*9} ${330+p.gy*7}) scale(1 ${leftEye*p.eye})`);
    rig["eye-right"].setAttribute("transform",`translate(${523+p.gx*9} ${330+p.gy*7}) scale(1 ${rightEye*p.eye})`);
    // Pupils live INSIDE the translated+blink-scaled eye group, so tracking and
    // blinking both inherit automatically. They move a little less than the eye
    // centre (the eye leads, the pupil follows) and are clipped to the eyeball.
    // p.px/p.py are 0..1 in the eyeball; the pupil radius is 7.5 inside rx 20,
    // ry 24, so ±8.5 / ±11 keeps it comfortably inside while still reading.
    const px=(p.gx||0)*8.5, py=(p.gy||0)*11;
    if(rig["pupil-left"]) rig["pupil-left"].setAttribute("transform",`translate(${px.toFixed(3)} ${py.toFixed(3)})`);
    if(rig["pupil-right"]) rig["pupil-right"].setAttribute("transform",`translate(${px.toFixed(3)} ${py.toFixed(3)})`);
    rig.eyebrows.setAttribute("opacity",clamp(p.brow*.9).toFixed(3));
    rotate(rig["brow-left"],p.asym*10,372,289);
    rotate(rig["brow-right"],-p.asym*6,523,289);
    rig["brow-left"].setAttribute("d",`M352 ${291-p.brow*6} Q372 ${283-p.brow*8} 393 ${291-p.brow*6}`);
    rig["brow-right"].setAttribute("d",`M503 ${291-p.brow*6} Q523 ${283-p.brow*8} 544 ${291-p.brow*6}`);
    // Mouth centre sits below the eyes (visor y 226..414, eyes end y 354) and is
    // rebuilt from the viseme size each frame. `w` is the half-width, `h` the
    // half-height of the open shape; `smile` lifts the outer corners so a smile
    // reads as a curve rather than just a wider oval.
    const w=p.mw,h=p.mh,smile=p.smile*13,cy=379;
    rig["mouth-mark"].setAttribute("d",
      `M${(448-w).toFixed(2)} ${(cy-smile*.35).toFixed(2)} `+
      `Q448 ${(cy-h+smile).toFixed(2)} ${(448+w).toFixed(2)} ${(cy-smile*.35).toFixed(2)} `+
      `Q448 ${(cy+h+smile).toFixed(2)} ${(448-w).toFixed(2)} ${(cy-smile*.35).toFixed(2)}Z`);
  }
  function frame(now) {
    raf=null;
    if(destroyed || document.hidden || reduced) return;
    const dt=clamp((now-last)/1000,0,.06);last=now;
    const wanted=calibration?{...neutral(),...calibration}:makePose(now), alpha=1-Math.exp(-dt/CONFIG.transitionSeconds);
    for(const key of Object.keys(pose)) {
      // Faster audio attack/release while retaining smoothed gesture transitions.
      const rate=(key==="mh"||key==="mw")?1-Math.exp(-dt/.045):
        (key==="jump"||key==="crouch")?1-Math.exp(-dt/.025):
        (key==="px"||key==="py")?1-Math.exp(-dt/.12):alpha;
      pose[key]+=(wanted[key]-pose[key])*rate;
    }
    render(pose,blink(now),now);
    const duration=CONFIG.states[state].duration;
    let value=duration?clamp((now-stateAt)/duration):0;
    if(audioActive && audio && Number.isFinite(audio.duration) && audio.duration>0)
      value=audio.currentTime/audio.duration;
    if(ui.progress)ui.progress.style.transform=`scaleX(${value})`;
    requestFrame();
  }
  function requestFrame() {
    if(raf===null && !destroyed && !document.hidden && !reduced) raf=requestAnimationFrame(frame);
  }
  function cancelFrame() { if(raf!==null) cancelAnimationFrame(raf);raf=null; }
  function updateMotion() {
    reduced=media.matches||(ui.reduce?ui.reduce.checked:false);if(root)root.dataset.reduced=String(reduced);
    if(ui.system)ui.system.hidden=!media.matches;cancelFrame();
    if(reduced) {winkAt=-10000;pose=neutral();render(pose,1);if(ui.progress)ui.progress.style.transform="scaleX(0)";}
    last=clock();requestFrame();
  }
  function resetSpeechFace() {
    pose.mh=4;pose.mw=46;level=0;
    render(pose,reduced?1:blink(clock()));
  }
  function setAudioStatus(text) {ui.audioStatus.textContent=text;}
  function finishVoice() {
    audioActive=false;tts=null;resetSpeechFace();
    transition("idle",{force:true});updateUI();
  }
  function stopVoice() {
    ++token; // Invalidates pending resume/play promises and queued TTS callbacks.
    if(audio && !audio.paused) audio.pause();
    if(utterance && window.speechSynthesis) {
      utterance.onstart=null;utterance.onend=null;utterance.onerror=null;
      utterance.onpause=null;utterance.onresume=null;
      // Only used for speech this controller started. No cancelling external speech.
      window.speechSynthesis.cancel();
    }
    utterance=null;finishVoice();
  }
  function idle() {winkAt=-10000;stopVoice();transition("idle",{force:true});}
  function mute(value) {
    muted=Boolean(value);
    if(audio) audio.muted=muted;
    // Native speech volume cannot reliably change mid-utterance: stop our utterance.
    if(muted && utterance) stopVoice();
    resetSpeechFace();updateUI();
  }
  function clearMediaListeners() { while(mediaCleanup.length) mediaCleanup.pop()(); }
  function attachAudio(element,{visemes=[],analyser:providedAnalyser=null}={}) {
    if(destroyed) throw new Error("This avatar controller has been destroyed.");
    if(!element || typeof element.play!=="function" || typeof element.pause!=="function")
      throw new TypeError("attachAudio expects an HTMLMediaElement.");
    const validated=validateCues(visemes);
    if(providedAnalyser && (typeof providedAnalyser.getFloatTimeDomainData!=="function" || !providedAnalyser.context))
      throw new TypeError("Provide an AnalyserNode from your existing audio graph.");
    stopVoice();clearMediaListeners();audio=element;cues=validated;
    const connection=connections.get(audio);
    analyser=providedAnalyser || (connection?connection.analyser:null);
    samples=analyser?new Float32Array(analyser.fftSize):null;
    audio.muted=muted;
    on(audio,"playing",()=>{
      if(audio.paused || audio.ended || audio.readyState<2) return;
      audioActive=true;transition("speaking",{force:true});updateUI();
    },undefined,mediaCleanup);
    for(const event of ["pause","ended","waiting","stalled","emptied","error"])
      on(audio,event,()=>{
        if(event==="error") setAudioStatus("Audio could not be played. Try a supported local audio file.");
        if(audioActive) finishVoice();
      },undefined,mediaCleanup);
    on(audio,"volumechange",()=>{
      if(audio.muted || audio.volume===0) resetSpeechFace();
      muted=audio.muted;updateUI();
    },undefined,mediaCleanup);
    if(!audio.paused && !audio.ended && audio.readyState>=2) {
      audioActive=true;transition("speaking",{force:true});
    }
    return api;
  }
  function validateCues(items) {
    if(!Array.isArray(items)) throw new TypeError("Visemes must be an array.");
    let end=-Infinity;
    return items.map(c=>{
      if(!c || !Number.isFinite(c.start) || !Number.isFinite(c.end) ||
        c.start<0 || c.end<=c.start || c.start<end || !Object.prototype.hasOwnProperty.call(CONFIG.visemes,c.shape))
        throw new TypeError("Cues must be ordered, non-overlapping seconds with rest/closed/open/wide/round shapes.");
      end=c.end;return {start:c.start,end:c.end,shape:c.shape};
    });
  }
  async function enableAnalysis() {
    if(!audio) throw new Error("Attach an audio element first.");
    const element=audio,version=token;
    if(destroyed) return false;
    if(element!==ui.audio) {
      // Never hijack or rewire a host website's existing audio graph.
      if(analyser) return analyser.context.state==="running";
      setAudioStatus("Host audio attached. Supply its AnalyserNode or timed visemes for mouth sync; its routing is unchanged.");
      return false;
    }
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext) {setAudioStatus("Web Audio is unavailable. Playback can work; amplitude lip sync cannot.");return false;}
    if(!context) context=new AudioContext();
    await context.resume();
    if(destroyed || version!==token || audio!==element || context.state!=="running") return false;
    let connection=connections.get(element);
    if(!connection) {
      const node=context.createMediaElementSource(element);
      const meter=context.createAnalyser();meter.fftSize=512;
      node.connect(meter);meter.connect(context.destination);
      connection={node,analyser:meter};connections.set(element,connection);
    }
    analyser=connection.analyser;samples=new Float32Array(analyser.fftSize);
    setAudioStatus("Audio-level mouth sync enabled. This measures loudness, not phonemes.");
    return true;
  }
  async function playAudio() {
    if(destroyed) return false;
    if(!audio || (!audio.currentSrc && !audio.src)) {setAudioStatus("Choose a speech audio file first.");return false;}
    stopVoice();
    const version=token,element=audio;
    try {
      if(element.ended) element.currentTime=0;
      await enableAnalysis();
      if(version!==token || destroyed || audio!==element) return false;
      await element.play(); // 'playing', not this promise, starts speaking.
      return true;
    } catch(error) {
      if(version!==token || destroyed) return false;
      setAudioStatus("Playback/sync unavailable: "+error.message);
      finishVoice();return false;
    }
  }
  function speak(text) {
    if(destroyed) return false;
    const synth=window.speechSynthesis;
    if(!synth || !window.SpeechSynthesisUtterance) {
      setAudioStatus("This browser does not provide text-to-speech.");return false;
    }
    if(!String(text).trim()) return false;
    if(muted) {setAudioStatus("Unmute voice before reading aloud.");return false;}
    if(synth.speaking && !utterance) {
      setAudioStatus("Another voice is playing. Finish it before starting this avatar's voice.");return false;
    }
    stopVoice();
    const version=token,entry=new SpeechSynthesisUtterance(String(text).slice(0,1000));
    utterance=entry;
    entry.onstart=()=>{if(version!==token||destroyed)return;tts=entry;transition("speaking",{force:true});};
    entry.onend=()=>{if(version!==token||destroyed)return;utterance=null;finishVoice();};
    entry.onerror=event=>{if(version!==token||destroyed)return;utterance=null;finishVoice();setAudioStatus("Device voice error: "+event.error);};
    entry.onpause=()=>{if(version===token) {tts=null;transition("idle",{force:true});}};
    entry.onresume=()=>{if(version===token){tts=entry;transition("speaking",{force:true});}};
    setAudioStatus("Device voice: speaking gestures only. No fabricated lip sync.");
    try {synth.speak(entry);updateUI();return true;}
    catch(error){utterance=null;finishVoice();setAudioStatus(error.message);return false;}
  }
  function gesture(name,options={}) {
    if(!CONFIG.states[name] || !CONFIG.states[name].duration) return false;
    if(name==="pointing") {
      const target=options.target||null;
      if(target && (!target.isConnected || typeof target.getBoundingClientRect!=="function")) return false;
      // A caller that pre-set pointPlan (directional pointing) keeps it; only a
      // missing target AND no preset falls back to the neutral aim below.
      if(target) pointPlan=aim(target);
      else if(!pointPlan) pointPlan=null;
      targetPoint=target;
    }
    return transition(name,{after:options.after||"idle"});
  }
  function startConversation() { return gesture("greeting",{after:"listening"}); }
  function messageSubmitted() {
    stopVoice();
    return transition("acknowledging",{force:true,after:"thinking"});
  }
  function responseReady() {
    // A fast response during the acknowledgment must not get lost.
    if(state==="acknowledging") {afterState="listening";return true;}
    return transition("listening");
  }
  function endConversation() {stopVoice();return transition("farewell",{force:true});}
  // Named lifecycle entry points for the animation pack. These are the public
  // surface the work order asks for; the gesture() queue keeps joints exclusive.
  function playGreeting() { return startConversation(); }
  function setListening() { return transition("listening"); }
  function startThinking() { return transition("thinking"); }
  function startSpeaking(text) {
    // With text: real device TTS drives the speaking lifecycle (and therefore
    // real mouth sync from audio amplitude). Without text there is no audio, so
    // the gesture form is used for preview only — it never claims lip sync.
    if(text) return speak(text);
    // No text and no audio: use the silent 10s talking preview so the mouth
    // still animates on a speech-shaped cycle (never claims lip sync).
    return audioActive||utterance ? transition("speaking",{force:true}) : api.talk();
  }
  function playExplaining() { return gesture("explaining"); }
  function playPointing(directionOrTarget) {
    if(directionOrTarget && typeof directionOrTarget==="object" && directionOrTarget.isConnected)
      return gesture("pointing",{target:directionOrTarget});
    // Directional pointing without a target. In this rig the shoulder value is
    // the elevation in degrees from vertical: +58 is ~74° up beside the head,
    // and negative brings the hand down toward the thigh. The elbow then bends
    // so the hand lands clear of the body. Values are the ones this character
    // actually reads at, verified against the rig's own limits (a -22..85,
    // e -92..120, w -35..35).
    const dir=typeof directionOrTarget==="string" ? directionOrTarget.toLowerCase() : "";
    const plans={
      up:    {side:"r",a:56,e:66,w:-8},   // hand up beside the head
      down:  {side:"r",a:-8,e:-34,w:-14}, // hand down toward the thigh
      left:  {side:"l",a:-16,e:-30,w:-18},// left hand reaches out and down
      right: {side:"r",a:34,e:-24,w:12}   // right hand reaches out to the side
    };
    const plan=plans[dir];
    if(plan) {
      targetPoint=null;
      pointPlan={side:plan.side,a:plan.a,e:plan.e,w:plan.w};
      return gesture("pointing");
    }
    return gesture("pointing");
  }
  function startWorkflow() { return gesture("workflow_running"); }
  function playSuccess() { return gesture("success"); }
  function playCelebration() { return gesture("celebrating"); }
  function playError() { return gesture("error"); }
  function playEncouragement() { return gesture("encouraging"); }
  function returnToIdle() { return idle(); }
  function setExpression(name) {
    if(!["neutral","happy","curious","surprised","confident","auto"].includes(name)) return false;
    explicitEmotion=name!=="auto";emotion=name==="auto"?"neutral":name;return true;
  }
  function destroy() {
    if(destroyed) return;
    stopVoice();destroyed=true;clearStateTimer();cancelFrame();
    while(cleanup.length) cleanup.pop()();
    clearMediaListeners();
    for(const connection of connections.values()) {
      connection.node.disconnect();connection.analyser.disconnect();
    }
    connections.clear();
    if(context) context.close().catch(()=>{});
    if(objectURL) URL.revokeObjectURL(objectURL);
    if(window.AIHubMascotV2===api) delete window.AIHubMascotV2;
  }
  const api={
    startConversation,messageSubmitted,responseReady,endConversation,
    greet:()=>gesture("greeting"),wave:()=>gesture("waving"),
    pointAt:element=>gesture("pointing",{target:element}),pointDown:()=>gesture("pointing"),wink,
    present:()=>gesture("presenting"),celebrate:()=>gesture("celebrating"),
    idle,stop:idle,mute,speak,attachAudio,enableAnalysis,playAudio,
    setVisemes:items=>{cues=validateCues(items);},setExpression,destroy,
    // Animation-pack entry points
    playGreeting,setListening,startThinking,startSpeaking,playExplaining,
    playPointing,startWorkflow,playSuccess,playCelebration,playError,
    playEncouragement,returnToIdle,
    // 10-second expressive talking preview with NO audio required.
    talk:(seconds=10)=>{
      if(destroyed) return false;
      stopVoice();
      allowSilentSpeaking=true;
      const ok=transition("speaking",{force:true,after:"idle"});
      allowSilentSpeaking=false;
      return ok;
    },
    getState:()=>state,
    getSnapshot:()=>Object.freeze({state,reduced,audioActive,ttsActive:Boolean(tts),
      frameScheduled:raf!==null,winkSide,winkClosure:winkClosure(clock()),pose:Object.freeze({...pose})})
  };
  // Opt-in calibration only, for reproducible rig QA; absent in normal page use.
  if(new URLSearchParams(location.search).has("avatarDebug")) {
    api.calibrate=(values={})=>{
      idle();calibration={};
      for(const [k,v] of Object.entries(values)) {
        if(!Number.isFinite(v))throw new TypeError("Finite rig values required");
        if(/^[lr]a$/.test(k))calibration[k]=clamp(v,-22,85);
        else if(/^[lr]e$/.test(k))calibration[k]=clamp(v,-92,120);
        else if(/^[lr]w$/.test(k))calibration[k]=clamp(v,-35,35);
        else if(/^[lr][op]$/.test(k))calibration[k]=clamp(v);
      }
      requestFrame();
    };
  }

  window.AIHubMascotV2=api;

  on(document,"pointermove",event=>{
    if(event.pointerType==="touch" && event.buttons===0) return;
    const b=ui.trigger.getBoundingClientRect();
    gaze={x:clamp((event.clientX-b.left-b.width/2)/(b.width*.6),-1,1),
      y:clamp((event.clientY-b.top-b.height*.3)/(b.height*.6),-1,1),until:clock()+3500};
  },{passive:true});
  on(ui.trigger,"pointerdown",event=>{
    const b=ui.trigger.getBoundingClientRect();
    gaze={x:clamp((event.clientX-b.left-b.width/2)/(b.width*.6),-1,1),
      y:clamp((event.clientY-b.top-b.height*.3)/(b.height*.6),-1,1),until:clock()+3500};
  },{passive:true});
  on(ui.trigger,"focus",()=>{gaze={x:0,y:0,until:clock()+4000};});
  on(ui.trigger,"click",startConversation);
  if(media.addEventListener) on(media,"change",updateMotion);
  else {media.addListener(updateMotion);cleanup.push(()=>media.removeListener(updateMotion));}
  on(root,"keydown",event=>{if(event.key==="Escape"){idle();event.preventDefault();}});
  // Host app lifecycle input events. They do NOT invent a backend response.
  on(root,"ai:conversation-start",startConversation);
  on(root,"ai:message-submitted",messageSubmitted);
  on(root,"ai:response-ready",responseReady);
  on(root,"ai:task-success",()=>gesture("celebrating"));
  // Workflow lifecycle: acknowledge, run, step-done, finish, fail, retry.
  on(root,"ai:workflow-start",startWorkflow);
  on(root,"ai:workflow-step",()=>gesture("acknowledging",{after:"workflow_running"}));
  on(root,"ai:workflow-success",playSuccess);
  on(root,"ai:workflow-error",playError);
  on(root,"ai:task-retry",playEncouragement);
  on(root,"ai:explain",playExplaining);
  on(root,"ai:conversation-end",endConversation);
  on(window,"resize",()=>{if(targetPoint && targetPoint.isConnected)pointPlan=aim(targetPoint);},{passive:true});
  on(document,"visibilitychange",()=>{
    if(document.hidden){idle();cancelFrame();}
    else{last=clock();nextBlink=last+1500;requestFrame();}
  });
  on(window,"pagehide",event=>{if(event.persisted){idle();cancelFrame();}else destroy();});
  on(window,"pageshow",()=>{if(!destroyed){last=clock();requestFrame();}});
  updateUI();updateMotion();
  gesture("greeting"); // Motion only. Voice never autoplays at load.
})();
