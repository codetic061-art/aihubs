/* =====================================================================
   AI HUB — CENTRALISED CONTENT DICTIONARY
   Every translated string, every guide explanation and every code snippet
   lives here. Rendering logic reads this file; it never hard-codes copy.
   Adding a locale = add one block. Nothing else in the page changes.

   The catalogue itself (course/concept/skill/MCP titles and descriptions)
   lives in assets/catalog.js, extracted verbatim from the project's own
   content index. Counts quoted in copy are computed from that catalogue
   at render time, so they can never drift from the real data.
   ===================================================================== */
window.AIHUB_I18N = {
  /* BCP-47 → copy. `dir` drives the whole layout via <html dir>. */
  en: {
    dir: 'ltr',
    label: 'English',
    htmlLang: 'en',
    nav: ['Explore', 'Learn', 'Models', 'Tools', 'Updates'],
    search: 'Search',
    signUp: 'Sign up',
    guideHelp: 'Ask for help',
    heroTitle: ['Everything AI.', 'One intelligent hub.'],
    heroLede: 'A curated hub of courses, concepts, MCP servers, agent skills and prompt material — written for developers, engineers and learners who work with AI models.',
    btnSearch: 'Search the hub',
    btnBrowse: 'Browse the catalogue',
    heroStats: [
      ['{n}', 'courses'],
      ['{n}', 'concepts explained'],
      ['{n}', 'MCP servers'],
      ['{n}', 'agent skills']
    ],

    /* ---- What is AI Hub? ---- */
    whatEyebrow: 'What is AI Hub?',
    whatHeading: 'A working reference for people building with AI models.',
    whatBody: [
      'AI Hub collects the material you actually need when working with language models: short concept entries that define terms precisely, courses that walk through a topic end to end, and reference pages for the tools that surround a model.',
      'The concept entries are the backbone. Each one defines a single term — context window, eval, hallucination, MCP server, sub-agent — states what it is, and names what it is not, so you can settle an argument or onboard a teammate without hunting through blog posts.',
      'Courses build on those definitions. Each is a self-contained track with lessons, sessions, quizzes and a final exam, so you can measure whether the material landed rather than assume it did.',
      'Reference pages cover the surrounding tooling: MCP servers you can point at a local or hosted environment, and agent skills that package a repeatable behaviour.'
    ],
    whatFacts: [
      ['{n}', 'concept entries'],
      ['{n}', 'courses'],
      ['{n}', 'lesson sessions'],
      ['{n}', 'skills & MCP servers']
    ],

    /* ---- Platform areas ---- */
    areasEyebrow: 'Explore the platform',
    areasHeading: 'Six collections, one index.',
    areasLede: 'Every entry is tagged and cross-referenced, so a course can point at the concepts it assumes and the tools it demonstrates.',
    areas: [
      ['Courses', 'Ten end-to-end tracks, each with lessons, sessions, quizzes and a final exam. Start with AI Fluency or LLM Fundamentals.', '{n} courses'],
      ['Concepts', 'A precise glossary of the terms you meet in real work — from context window and temperature to RAG and prompt injection.', '{n} entries'],
      ['Lesson sessions', 'Short focused sessions that sit inside a course and each teach one thing you can check you understood.', '{n} sessions'],
      ['MCP servers', 'Reference pages for Model Context Protocol servers: what each exposes, and how to point it at an environment.', '{n} servers'],
      ['Agent skills', 'Packaged, repeatable behaviours you can install into an agent rather than re-prompting for every time.', '{n} skills'],
      ['Quizzes & exams', 'Per-course checks plus a final exam per track, so progress is measured rather than assumed.', '{n} checks']
    ],

    /* ---- Tools and resources ---- */
    resEyebrow: 'Tools and resources',
    resHeading: 'Start from the real catalogue.',
    resLede: 'These are entries from the index itself. Follow a link to read the full page.',
    resCols: [
      { title: 'MCP servers', type: 'mcp', n: '{n}' },
      { title: 'Agent skills', type: 'skill', n: '{n}' },
      { title: 'Concepts', type: 'concept', n: '{n}' }
    ],

    /* ---- How it works ---- */
    howEyebrow: 'How it works',
    howHeading: 'From term to shipped behaviour.',
    howLede: 'The hub is built so you can enter at whichever level you are already at.',
    steps: [
      ['Settle a term', 'Look up a concept entry when a definition matters — before a design review or an argument with a teammate.'],
      ['Take a course', 'Follow a track end to end. Each one has sessions, quizzes and an exam so you can verify what stuck.'],
      ['Add a tool', 'Point an MCP server at your environment, or install a skill that packages a behaviour you keep re-prompting for.'],
      ['Check yourself', 'Use the quizzes and the final exam to confirm the material landed before you rely on it in real work.']
    ],

    /* ---- Final CTA ---- */
    ctaHeading: 'Start with one entry.',
    ctaBody: 'Pick a concept, open a course, or read a reference page for an MCP server. The index is free to browse and every entry is self-contained.',
    ctaBtnPrimary: 'Browse the catalogue',
    ctaBtnSecondary: 'Search the hub',
    ctaNote: 'No account needed to read. Sign up only if you want to track progress.',

    /* ---- Footer ---- */
    footAbout: 'A curated reference for AI concepts, courses, MCP servers and agent skills.',
    footCols: [
      { h: 'Learn', items: ['Courses', 'Concepts', 'Sessions', 'Quizzes'] },
      { h: 'Tools', items: ['MCP servers', 'Agent skills', 'Prompt library'] },
      { h: 'Platform', items: ['About', 'Contact', 'Privacy', 'Terms'] },
      { h: 'Language', items: ['English', 'العربية'] }
    ],
    footCopy: 'AI Hub',
    footLegal: ['Privacy', 'Terms', 'Contact'],

    /* ---- Code window ---- */
    codePanelTitle: 'Sample output',
    codePanelCaption: 'Sample snippets only — a frontend demonstration, not a live system feed.',
    codeWindowAria: 'Example code snippet',

    /* ---- small contextual guide ---- */
    guideAria: 'AI Hub guide',
    'guide-idle': 'Need anything? I’m here to help.',
    guideChatTitle: 'AI Hub guide',
    guideChatIntro: 'I can explain what any part of this page does. Hover something and press M, or double-click me to chat.',
    guideChatTopics: 'Courses · Concepts · MCP servers · Agent skills',
    guideChatPlaceholder: 'Ask about this page…',
    guideChatReply: 'This is a local demo, so I can’t look things up. Hover a section and press M for what it does, or open the catalogue to read the real entries.',
    guideSend: 'Send',
    guide: {
      'guide-help': 'Ask me to explain a section: hover it, then press M. Double-click me to open this chat.',
      'nav-explore': 'Jump to the catalogue of everything on the hub.',
      'nav-learn': 'Courses with lessons, sessions, quizzes and an exam.',
      'nav-models': 'Concept entries that define model terms precisely.',
      'nav-tools': 'MCP servers and agent skills you can install.',
      'nav-updates': 'What shipped recently and what is next.',
      'search': 'Search the catalogue, concepts, courses and tools.',
      'sign-up': 'Create an account to save progress across courses.',
      'hero-search': 'Search the whole catalogue.',
      'hero-browse': 'Open the full resource lists.',
      'code-panel': 'A fixed-size window that types sample snippets to show the editor surface. A demo, not a live feed.',
      'journey': 'The large robot reacts to your pointer. Hover it or press it.',
      'theme': 'Switch between the light and dark themes.',
      'lang': 'Switch the page to Arabic.',
      'area-0': 'Courses — ten end-to-end tracks with lessons, sessions, quizzes and an exam.',
      'area-1': 'Concepts — a precise glossary of 36 AI terms.',
      'area-2': 'Sessions — short focused lessons inside a course.',
      'area-3': 'MCP servers — reference pages for Model Context Protocol servers.',
      'area-4': 'Agent skills — packaged, repeatable agent behaviours.',
      'area-5': 'Quizzes and exams — per-course checks plus a final exam.',
      'res-0': 'MCP servers from the index. Open one to read its reference page.',
      'res-1': 'Agent skills from the index. Open one to read its reference page.',
      'res-2': 'Concept entries from the index. Open one to read the full definition.',
      'step': 'One step of the term → course → tool → check path.',
    }
  },

  ar: {
    dir: 'rtl',
    label: 'العربية',
    htmlLang: 'ar',
    nav: ['استكشف', 'تعلّم', 'المفاهيم', 'الأدوات', 'التحديثات'],
    search: 'بحث',
    signUp: 'إنشاء حساب',
    guideHelp: 'اطلب مساعدة',
    heroTitle: ['كل ما يخص الذكاء الاصطناعي.', 'في مركز واحد ذكي.'],
    heroLede: 'مرجع منتقى من الدورات والمفاهيم وخوادم MCP ومهارات الوكلاء ومواد صياغة الطلبات — لمطوري ومهندسي ومتعلّمي الذكاء الاصطناعي.',
    btnSearch: 'ابحث في المنصة',
    btnBrowse: 'استعرض الكتالوج',
    heroStats: [
      ['{n}', 'دورة'],
      ['{n}', 'مفهومًا موضّحًا'],
      ['{n}', 'خادم MCP'],
      ['{n}', 'مهارة وكيل']
    ],

    whatEyebrow: 'ما هو AI Hub؟',
    whatHeading: 'مرجع عملي لمن يبني بنماذج الذكاء الاصطناعي.',
    whatBody: [
      'يجمع AI Hub ما تحتاجه فعليًا عند العمل مع النماذج اللغوية: مدخلات مفاهيم قصيرة تُعرّف المصطلحات بدقة، ودورات تسير بموضوع من بدايته إلى نهايته، وصفحات مرجعية للأدوات المحيطة بالنموذج.',
      'مدخلات المفاهيم هي العمود الفقري. كل مدخل يُعرّف مصطلحًا واحدًا — نافذة السياق، التقييم، الهلوسة، خادم MCP، الوكيل الفرعي — ويذكر ما هو، ويسمّي ما ليس هو، لتستطيع حسم نقاش أو تأهيل زميل جديد دون البحث في مقالات متفرقة.',
      'الدورات تبني على تلك التعريفات. كل دورة مسار متكامل يحتوي على دروس وجلسات واختبارات قصيرة وامتحان نهائي، فيمكنك قياس ما إذا ثبتت المادة بدلًا من افتراض ذلك.',
      'صفحات المراجع تغطي الأدوات المحيطة: خوادم MCP يمكن توجيهها إلى بيئة محلية أو مستضافة، ومهارات وكيل تُغلّف سلوكًا متكررًا.'
    ],
    whatFacts: [
      ['{n}', 'مفهومًا'],
      ['{n}', 'دورة'],
      ['{n}', 'جلسة تعليمية'],
      ['{n}', 'مهارة وخادم']
    ],

    areasEyebrow: 'استكشف المنصة',
    areasHeading: 'ست مجموعات، فهرس واحد.',
    areasLede: 'كل مدخل مُوسّم ومُربط بالمراجع الأخرى، فتشير الدورة إلى المفاهيم التي تفترضها والأدوات التي توضّحها.',
    areas: [
      ['الدورات', 'عشرة مسارات متكاملة، كل منها بدروس وجلسات واختبارات وامتحان نهائي. ابدأ بالطلاقة في الذكاء الاصطناعي أو أساسيات النماذج اللغوية.', '{n} دورة'],
      ['المفاهيم', 'معجم دقيق للمصطلحات التي تصادفها في العمل الحقيقي — من نافذة السياق ودرجة الحرارة إلى RAG وحقن الطلبات.', '{n} مفهومًا'],
      ['الجلسات التعليمية', 'جلسات قصيرة مركّزة داخل الدورة، كل منها تعلّم شيئًا واحدًا يمكنك التحقق من فهمك له.', '{n} جلسة'],
      ['خوادم MCP', 'صفحات مرجعية لخوادم Model Context Protocol: ما يعرضه كل خادم، وكيف توجهه إلى بيئة.', '{n} خادم'],
      ['مهارات الوكلاء', 'سلوكيات متكررة مُغلّفة يمكن تثبيتها في وكيل بدلًا من إعادة صياغة الطلب في كل مرة.', '{n} مهارة'],
      ['الاختبارات والامتحانات', 'فحوص لكل دورة مع امتحان نهائي لكل مسار، فيُقاس التقدّم بدلًا من افتراضه.', '{n} فحصًا']
    ],

    resEyebrow: 'الأدوات والموارد',
    resHeading: 'ابدأ من الكتالوج الحقيقي.',
    resLede: 'هذه مدخلات من الفهرس نفسه. افتح الرابط لقراءة الصفحة الكاملة.',
    resCols: [
      { title: 'خوادم MCP', type: 'mcp', n: '{n}' },
      { title: 'مهارات الوكلاء', type: 'skill', n: '{n}' },
      { title: 'المفاهيم', type: 'concept', n: '{n}' }
    ],

    howEyebrow: 'كيف تعمل',
    howHeading: 'من المصطلح إلى سلوك منشور.',
    howLede: 'المنصة مبنية لتستطيع الدخول من المستوى الذي أنت فيه.',
    steps: [
      ['حسم مصطلح', 'ابحث عن مدخل المفهوم عندما تكون الدقة مهمة — قبل مراجعة تصميم أو نقاش مع الفريق.'],
      ['خذ دورة', 'اتبع مسارًا من بدايته إلى نهايته. لكل دورة جلسات واختبارات وامتحان تتحقق به مما ثبت.'],
      ['أضف أداة', 'وجّه خادم MCP إلى بيئتك، أو ثبّت مهارة تُغلّف سلوكًا تعيد صياغته باستمرار.'],
      ['اختبر نفسك', 'استخدم الاختبارات القصيرة والامتحان النهائي لتتأكد من ثبات المادة قبل الاعتماد عليها في عمل حقيقي.']
    ],

    ctaHeading: 'ابدأ بمدخل واحد.',
    ctaBody: 'اختر مفهومًا، أو افتح دورة، أو اقرأ صفحة مرجعية لخادم MCP. الفهرس مجاني للاستعراض وكل مدخل مستقل بذاته.',
    ctaBtnPrimary: 'استعرض الكتالوج',
    ctaBtnSecondary: 'ابحث في المنصة',
    ctaNote: 'لا حاجة لحساب للقراءة. أنشئ حسابًا فقط إن أردت متابعة التقدّم.',

    footAbout: 'مرجع منتقى لمفاهيم ودورات وخوادم MCP ومهارات وكلاء الذكاء الاصطناعي.',
    footCols: [
      { h: 'التعلّم', items: ['الدورات', 'المفاهيم', 'الجلسات', 'الاختبارات'] },
      { h: 'الأدوات', items: ['خوادم MCP', 'مهارات الوكلاء', 'مكتبة الطلبات'] },
      { h: 'المنصة', items: ['عن المنصة', 'اتصل بنا', 'الخصوصية', 'الشروط'] },
      { h: 'اللغة', items: ['العربية', 'English'] }
    ],
    footCopy: 'AI Hub',
    footLegal: ['الخصوصية', 'الشروط', 'اتصل بنا'],

    codePanelTitle: 'مخرجات نموذجية',
    codePanelCaption: 'مقتطفات نموذجية فقط — عرض توضيحي للواجهة وليس بثًا حقيقيًا للنظام.',
    codeWindowAria: 'مثال على مقتطف برمجي',

    guideAria: 'مرشد AI Hub',
    'guide-idle': 'تحتاج شيئًا؟ أنا هنا للمساعدة.',
    guideChatTitle: 'مرشد AI Hub',
    guideChatIntro: 'أستطيع شرح ما يفعله أي جزء من هذه الصفحة. مرّر فوق عنصر واضغط M، أو انقر نقرًا مزدوجًا عليّ للمحادثة.',
    guideChatTopics: 'الدورات · المفاهيم · خوادم MCP · مهارات الوكلاء',
    guideChatPlaceholder: 'اسأل عن هذه الصفحة…',
    guideChatReply: 'هذا عرض محلي، فلا أستطيع البحث. مرّر فوق قسم واضغط M لمعرفة وظيفته، أو افتح الكتالوج لقراءة المدخلات الحقيقية.',
    guideSend: 'إرسال',
    guide: {
      'guide-help': 'اطلب مني شرح قسم: مرّر فوقه ثم اضغط M. انقر نقرًا مزدوجًا عليّ لفتح هذه المحادثة.',
      'nav-explore': 'انتقل إلى كتالوج كل ما في المنصة.',
      'nav-learn': 'دورات بدروس وجلسات واختبارات وامتحان.',
      'nav-models': 'مدخلات مفاهيم تُعرّف مصطلحات النماذج بدقة.',
      'nav-tools': 'خوادم MCP ومهارات وكلاء يمكن تثبيتها.',
      'nav-updates': 'ما نُشر حديثًا وما هو قادم.',
      'search': 'ابحث في الكتالوج والمفاهيم والدورات والأدوات.',
      'sign-up': 'أنشئ حسابًا لحفظ تقدّمك في الدورات.',
      'hero-search': 'ابحث في الكتالوج بالكامل.',
      'hero-browse': 'افتح قوائم الموارد الكاملة.',
      'code-panel': 'نافذة بحجم ثابت تكتب مقتطفات نموذجية لعرض سطح المحرر. عرض تجريبي وليس بثًا حقيقيًا.',
      'journey': 'الروبوت الكبير يتفاعل مع مؤشرك. مرّر فوقه أو اضغطه.',
      'theme': 'بدّل بين المظهر الفاتح والداكن.',
      'lang': 'بدّل الصفحة إلى الإنجليزية.',
      'area-0': 'الدورات — عشرة مسارات متكاملة بدروس وجلسات واختبارات وامتحان.',
      'area-1': 'المفاهيم — معجم دقيق من 36 مصطلحًا في الذكاء الاصطناعي.',
      'area-2': 'الجلسات — دروس قصيرة مركّزة داخل الدورة.',
      'area-3': 'خوادم MCP — صفحات مرجعية لخوادم Model Context Protocol.',
      'area-4': 'مهارات الوكلاء — سلوكيات وكيل متكررة ومُغلّفة.',
      'area-5': 'الاختبارات والامتحانات — فحوص لكل دورة مع امتحان نهائي.',
      'res-0': 'خوادم MCP من الفهرس. افتح واحدًا لقراءة صفحته المرجعية.',
      'res-1': 'مهارات الوكلاء من الفهرس. افتح واحدة لقراءة صفحتها المرجعية.',
      'res-2': 'مدخلات المفاهيم من الفهرس. افتح واحدًا لقراءة التعريف الكامل.',
      'step': 'خطوة واحدة من مسار: مصطلح ← دورة ← أداة ← تحقق.',
    }
  }
};

/* =====================================================================
   CODE WINDOW SNIPPETS — a small, fixed, predefined collection.
   Frontend demonstration only: these are NOT real code changes, real
   system operations, or a live AI execution. Nothing here is claimed to
   be connected to a backend.
   ===================================================================== */
window.AIHUB_SNIPPETS = [
  {
    lang: 'python',
    file: 'agents/router.py',
    lines: [
      'from hub.tools import registry, ToolSpec',
      '',
      'ROUTES = {',
      '    "search":  registry.get("vector-search"),',
      '    "execute": registry.get("sandbox-run"),',
      '}',
      '',
      'async def dispatch(intent: str, ctx: Ctx):',
      '    spec = ROUTES.get(intent)',
      '    if spec is None:',
      '        raise UnknownIntent(intent)',
      '    return await spec.run(ctx, timeout=8.0)'
    ]
  },
  {
    lang: 'javascript',
    file: 'guide/contextual-guide.js',
    lines: [
      'const target = document.querySelector("[data-guide]");',
      '',
      '// The guide rests in the corner and only moves on request.',
      'function explain(el) {',
      '  const key = el.dataset.guide;',
      '  const r = el.getBoundingClientRect();',
      '  guide.style.setProperty("--gx", r.left + "px");',
      '  guide.style.setProperty("--gy", r.bottom + "px");',
      '  return bubble.show(key);',
      '}',
      '',
      'addEventListener("keydown", e => {',
      '  if (e.key === "m") explain(currentTarget());',
      '});'
    ]
  },
  {
    lang: 'json',
    file: 'catalog/models.json',
    lines: [
      '{',
      '  "courses": [',
      '    { "id": "llm-fundamentals", "level": "intro",',
      '      "sessions": 4, "exam": true },',
      '    { "id": "mcp-server-dev", "level": "intermediate",',
      '      "sessions": 6, "exam": true }',
      '  ],',
      '  "concepts": 36,',
      '  "mcp_servers": 6',
      '}'
    ]
  },
  {
    lang: 'bash',
    file: 'pipeline/build.sh',
    lines: [
      '#!/usr/bin/env bash',
      'set -euo pipefail',
      '',
      'npm run catalog:build   # from src/content/*.json',
      'npm run tokens:verify   # design tokens unchanged',
      'npm run test:mascots    # both mascots, both themes',
      'npm run build -- --theme=light,dark',
      '',
      'echo "build ok -> dist/"'
    ]
  }
];
