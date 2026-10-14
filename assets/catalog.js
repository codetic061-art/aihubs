/* AI Hub catalogue — extracted verbatim from the project content index
   (src/content/{en,ar}.json, 85 entries per locale).
   Titles and descriptions are real; nothing here is invented.
   Keys are singular type names. Regenerate: node build-catalog.js */
window.AIHUB_CATALOG = {
  "en": {
    "doc": [
      [
        "Install Claude Code",
        "Step-by-step guide to installing and setting up the Claude Code CLI on macOS, Linux, and Windows."
      ]
    ],
    "lesson": [
      [
        "Your First Conversation with the Claude API",
        "Send your first Messages request, read the response shape, and carry a multi-turn conversation."
      ],
      [
        "Set Up Your Claude API Key",
        "Create an API key, store it safely as an environment variable, and confirm the SDK can read it."
      ]
    ],
    "skill": [
      [
        "Claude Agent SDK",
        "Build production agents with the same tools, agent loop and context management that power Claude Code, as a library for Python and TypeScript."
      ],
      [
        "Agent Skills (Anthropic)",
        "Anthropic's reference collection of skills - folders of instructions, scripts and resources that Claude loads dynamically for specialised tasks."
      ],
      [
        "Agentic Plugin Marketplace (wshobson/agents)",
        "A large multi-harness plugin marketplace - 94 plugins, 202 agents, 184 skills - generated idiomatically for six coding agents from one source."
      ],
      [
        "Claude Code Action",
        "A GitHub Action that runs Claude Code on pull requests and issues to answer questions, review code and implement changes."
      ],
      [
        "SpecKit",
        "Spec-driven development workflow that makes AI coding agents write a spec and a plan before they write code."
      ],
      [
        "Superpowers",
        "A complete software development methodology for coding agents, built from composable skills that trigger automatically."
      ]
    ],
    "mcp": [
      [
        "Fetch MCP Server",
        "Reference MCP server that fetches a URL and converts the page to markdown, with start_index for reading long pages in chunks."
      ],
      [
        "Filesystem MCP Server",
        "Official MCP server that exposes read and write access to explicitly allowed directories."
      ],
      [
        "Git MCP Server",
        "Reference MCP server that gives an AI agent tools to read, search and manipulate Git repositories."
      ],
      [
        "Memory MCP Server",
        "Reference MCP server that persists information across chats as a local knowledge graph of entities, relations and observations."
      ],
      [
        "Sequential Thinking MCP Server",
        "Reference MCP server exposing a single tool for step-by-step reasoning with the ability to revise and branch."
      ],
      [
        "Time MCP Server",
        "Reference MCP server giving an agent the current time and timezone conversion using IANA timezone names."
      ]
    ],
    "freeCredit": [
      [
        "Anthropic Startup Credits",
        "API credits for eligible startups through Anthropic's startup program."
      ]
    ],
    "course": [
      [
        "Evaluating AI Output",
        "How to write success criteria that survive reality, and how to pick a scoring method that will not lie to you."
      ],
      [
        "AI Fluency",
        "A beginner course on how generative AI and large language models actually work, where they fail, and how to judge their output."
      ],
      [
        "LLM Fundamentals",
        "Tokens, context windows, logits, sampling and temperature — the machinery that decides what your model can see and how confidently it speaks."
      ],
      [
        "Model Limitations and Hallucinations",
        "Where confident false statements come from, what makes them worse, and the mitigation techniques that genuinely help."
      ],
      [
        "What Is Generative AI?",
        "What actually happens when you send a prompt, and the three ideas — training, inference, model — that people blur together."
      ],
      [
        "Context and Evidence",
        "Decide what the model can see: what enters context, what stays on disk, and what it will never know."
      ],
      [
        "Failure and Decomposition",
        "Specify edge cases and failure behaviour, then decompose work into ordered steps and bounded sub-agent tasks."
      ],
      [
        "Prompt Engineering for Engineers",
        "Write prompts as structured task specifications — scope, context, constraints, acceptance criteria, tool permissions and verification."
      ],
      [
        "Output and Verification",
        "Specify expected output as a schema or a shape, then state acceptance criteria that either pass or fail."
      ],
      [
        "Task Definition and Scope",
        "Turn a one-line request into a task statement with a scope boundary, explicit constraints and named non-goals."
      ]
    ],
    "session": [
      [
        "Choosing a Scoring Method",
        "Exact checks, fuzzy metrics, model-as-judge and human review — what each detects, and which metric will quietly lie to you."
      ],
      [
        "Define Success Criteria Before You Write the Test",
        "Turn a vague requirement into a criterion you could actually fail, and build the eval dataset that tests it."
      ],
      [
        "Inference and Sampling",
        "What happens between 'the prompt arrived' and 'the sentence exists' — logits, softmax, sampling, temperature, top-k and top-p."
      ],
      [
        "Tokens and the Context Window",
        "How text becomes tokens, why the count differs from words or characters, and how to budget a context window before you hit the limit."
      ],
      [
        "Mitigating Hallucinations",
        "The mitigation toolkit — grounding, permission to refuse, quote-first extraction, citations, verification — and the honest limits of each."
      ],
      [
        "Why Models Confidently Fabricate",
        "Where a fabricated citation actually comes from, which errors are most dangerous, and the prompt conditions that raise hallucination rates."
      ],
      [
        "Next-Token Prediction: The Actual Mechanism",
        "Build next-token prediction from word counts alone, then see how the same idea scales to modern language models."
      ],
      [
        "Training, Inference, and the Model Artifact",
        "The three ideas public discussion blurs — training, inference, and the weights on disk — and what each one can and cannot change."
      ],
      [
        "Context Visibility and Blind Spots",
        "Audit what the model can actually see, place long material by influence not convenience, and forbid reasoning about unopened code."
      ],
      [
        "Repository and File Context",
        "Decide what belongs in the prompt, in an instruction file, or in a file the agent reads — and write instructions concrete enough to be followed."
      ],
      [
        "Edge Cases and Failure Behaviour",
        "Name the branches a task will hit, state what happens at each one, and calibrate how much improvisation to allow."
      ],
      [
        "Planning and Sub-Agent Delegation",
        "Write the plan as part of the specification, and route each unit of work to the main conversation or a sub-agent by context cost and reversibility."
      ],
      [
        "Expected Output and Acceptance Criteria",
        "Pin the expected output as a shape, write acceptance criteria that can fail, and require the agent to run the verification itself."
      ],
      [
        "Tool Boundaries and Permissions",
        "Write tool descriptions as specifications, set permission scope by reversibility, and stop the model inventing parameters."
      ],
      [
        "Scope Boundaries and Non-Goals",
        "Name where the work stops, list the non-goals a reasonable engineer would assume are in scope, and convert prohibitions into redirects."
      ],
      [
        "Task Specification and Decomposition",
        "Turn a one-line activity request into a task statement, an ordered procedure, and a boundary you can check the output against."
      ]
    ],
    "quiz": [
      [
        "Quiz: Evaluation Methods",
        "Five questions on evaluating AI output: why vibes are not evidence, what a good eval set contains, and which method fits which failure."
      ],
      [
        "Quiz: Tokens and Context Windows",
        "Five questions on tokens and the context window: what a token is, how the input and output share one budget, and why long contexts fail."
      ],
      [
        "Quiz: Model Limitations and Hallucinations",
        "Five questions on why models hallucinate: sampling, knowledge cutoffs, confident error, and the mitigations that actually work."
      ],
      [
        "Quiz: What Is Generative AI?",
        "Five questions on generative AI: what the word commits you to, why its output is plausible rather than true, and how a response is actually produced."
      ]
    ],
    "exam": [
      [
        "AI Fluency Final Exam",
        "The course final for AI Fluency: nine questions across all four modules, weighted toward the judgement calls that decide whether AI output ships."
      ]
    ],
    "concept": [
      [
        "Agent",
        "An AI application that runs a loop: gather context, decide, act through tools, observe, repeat."
      ],
      [
        "Agentic development",
        "Practising software development through an agent that writes the code - shifting the work from typing to specifying, reviewing and verifying."
      ],
      [
        "API",
        "A model provider's programmatic interface - stateless requests carrying messages and tools, billed per token, with limits that shape your design."
      ],
      [
        "CLI",
        "A command-line interface as the interface to an agent: composable, scriptable, and the same tool in an interactive session and in CI."
      ],
      [
        "Context Engineering",
        "Curating which tokens enter the model's context window on every turn, and why it superseded prompt engineering as the frame."
      ],
      [
        "Context Window",
        "The bounded, per-request working memory of a model — everything it can reference when producing a response."
      ],
      [
        "Embedding",
        "A vector representation of text or media that encodes meaning so similar items land close together - the machinery under semantic search and retrieval."
      ],
      [
        "Eval",
        "A repeatable test for an AI system: give it an input, apply grading logic to its output, and measure success against criteria you defined in advance."
      ],
      [
        "Evaluation",
        "Defining measurable success criteria for an LLM feature and building a test set that measures them, so quality claims are evidence."
      ],
      [
        "Guardrails",
        "The policy and permission layer that constrains what an agent may do - read-only by default, explicit approval for writes, scoped roots and denied tools."
      ],
      [
        "Hallucination",
        "Fluent, confident output that is not supported by fact — and the mitigations that actually reduce it."
      ],
      [
        "Harness",
        "The runtime around a model - the loop, tools, permissions and context management that turn a model into a usable agent."
      ],
      [
        "Hook",
        "A command, HTTP endpoint or prompt fired automatically at a fixed point in an agent's lifecycle - deterministic where a tool needs a decision."
      ],
      [
        "Inference",
        "Running a trained model to produce output - the compute step where prompt in, tokens out, latency and cost are incurred."
      ],
      [
        "MCP Client",
        "The per-server protocol component inside a host application, and how it differs from the host itself."
      ],
      [
        "MCP Connector",
        "A configured instance of an MCP server in a client, and the network reality of remote connectors on Claude."
      ],
      [
        "MCP Server",
        "The program that implements the server half of MCP, exposes tools and resources, and stays deliberately small."
      ],
      [
        "MCP (Model Context Protocol)",
        "The open protocol for connecting AI applications to external systems, and why it is a protocol rather than a product."
      ],
      [
        "Model",
        "The trained weights and tokenizer that predict tokens. Everything that makes an agent useful is engineered around it, not inside it."
      ],
      [
        "Observability",
        "Instrumenting an AI system so you can see what it did in production - traces, token usage, tool calls and latency - and attribute failures to a cause."
      ],
      [
        "Orchestration",
        "The coordination layer that decides which agents, tools and models run, in what order, and with what isolation and context."
      ],
      [
        "Plugin",
        "A self-contained, shareable bundle of skills, agents, hooks and MCP server configuration for Claude Code."
      ],
      [
        "Prompt injection",
        "An attack where instructions hidden in content the model reads - a web page, a document, a tool result - override the task it was given."
      ],
      [
        "Prompt",
        "The input you send to a model: instructions, context and data, assembled by a harness rather than typed fresh each turn."
      ],
      [
        "Prompting",
        "Writing and organising model instructions so the literal reading of your words produces what you intended."
      ],
      [
        "RAG",
        "Retrieval-Augmented Generation: fetching relevant passages at query time and putting them in the prompt, so answers come from current data."
      ],
      [
        "Rate limits",
        "Per-organisation caps on requests and tokens per minute, enforced with a token bucket, plus monthly spend limits your architecture must respect."
      ],
      [
        "Skill (Agent Skill)",
        "A packaged instruction set — a SKILL.md directory — that teaches an agent a procedure and loads only when relevant."
      ],
      [
        "Structured Outputs",
        "A decoding constraint that makes the model's response match your JSON Schema, so downstream parsing never fails."
      ],
      [
        "Sub-Agent",
        "A delegated worker with its own context window, system prompt and tool access, returning a summary instead of a transcript."
      ],
      [
        "Temperature",
        "The sampling knob controlling how much randomness a model uses when picking the next token - and why the default is usually right."
      ],
      [
        "Token",
        "The unit a model reads and writes. Tokens are what context windows are measured in and what you are billed for."
      ],
      [
        "Tool Calling",
        "The round trip in which a model requests a tool, your application executes it, and the result returns to the model."
      ],
      [
        "Tool",
        "A single named capability a model can invoke — name, description and input schema — regardless of who defined it."
      ],
      [
        "Vector database",
        "Storage specialised for vectors that answers nearest-neighbour queries fast, so semantic search scales without comparing every pair."
      ],
      [
        "Workflow",
        "An agentic system where LLMs and tools are orchestrated through predefined code paths, as opposed to a model that decides its own steps."
      ]
    ],
    "promptAssessment": [
      [
        "Prompt Assessment: Flaky CI Test",
        "Two prompts for one real task — diagnosing a test that fails only in CI — scored against the nine-criterion prompt rubric."
      ],
      [
        "Prompt Assessment: Orders Pagination",
        "Two prompts for one real task — adding cursor pagination to an orders endpoint — scored against the nine-criterion prompt rubric."
      ]
    ]
  },
  "ar": {
    "doc": [
      [
        "تثبيت Claude Code",
        "دليل خطوة بخطوة لتثبيت وإعداد واجهة Claude Code على macOS و Linux و Windows."
      ]
    ],
    "lesson": [
      [
        "محادثتك الأولى مع Claude API",
        "أرسل أول طلب عبر واجهة Messages، وافهم بنية الاستجابة، وتابع محادثة متعددة الأدوار."
      ],
      [
        "إعداد مفتاح Claude API",
        "أنشئ مفتاح API، واحفظه بأمان كمتغير بيئة، وتأكد من قراءة المكتبة الرسمية له."
      ]
    ],
    "skill": [
      [
        "حزمة Claude Agent SDK",
        "ابنِ وكلاء إنتاج بحزمة الأدوات وحلقة الوكيل وإدارة السياق نفسها التي تقوم عليها Claude Code، كمكتبة بايثون وTypeScript."
      ],
      [
        "مهارات الوكلاء (Anthropic)",
        "مجموعة Anthropic المرجعية من المهارات - مجلدات تعليمات وسكربتات وموارد يحمّلها Claude ديناميكياً لمهام متخصصة."
      ],
      [
        "سوق الإضافات الوكيلية (wshobson/agents)",
        "سوق إضافات كبير متعدد الحوامز - 94 إضافة و202 وكيل و184 مهارة - تُولَّد بقالب أصيل لكل ستة وكلاء من مصدر واحد."
      ],
      [
        "Claude Code Action",
        "إجراء GitHub يشغّل Claude Code على طلبات السحب والمشكلات للإجابة عن الأسئلة ومراجعة الشيفرة وتنفيذ التغييرات."
      ],
      [
        "SpecKit",
        "منهجية تطوير قائمة على المواصفات تجعل وكلاء البرمجة يكتبون المواصفة والخطة قبل كتابة الشيفرة."
      ],
      [
        "Superpowers",
        "منهجية تطوير برمجيات كاملة لوكلاء البرمجة، مبنية من مهارات مركّبة تُطلق تلقائياً."
      ]
    ],
    "mcp": [
      [
        "خادم Fetch MCP",
        "خادم MCP مرجعي يجلب عنواناً ويحوّل الصفحة إلى Markdown، مع فهرس بداية لقراءة الصفحات الطويلة على دفعات."
      ],
      [
        "خادم Filesystem MCP",
        "خادم MCP رسمي يتيح القراءة والكتابة ضمن مجلدات محددة صراحةً فقط."
      ],
      [
        "خادم Git MCP",
        "خادم MCP مرجعي يمنح وكيل الذكاء الاصطناعي أدوات لقراءة مستودعات Git والبحث فيها وتعديلها."
      ],
      [
        "خادم الذاكرة MCP",
        "خادم MCP مرجعي يحفظ المعلومات بين المحادثات كرسم بياني معرفي محلي من كيانات وعلاقات وملاحظات."
      ],
      [
        "خادم التفكير التسلسلي MCP",
        "خادم MCP مرجعي يكشف أداة واحدة للاستدلال خطوة بخطوة مع القدرة على المراجعة والتفرّع."
      ],
      [
        "خادم الوقت MCP",
        "خادم MCP مرجعي يمنح الوكيل الوقت الحالي وتحويل المناطق الزمنية بأسماء المناطق من معيار IANA."
      ]
    ],
    "freeCredit": [
      [
        "أرصدة Anthropic للشركات الناشئة",
        "أرصدة API للشركات الناشئة المؤهلة عبر برنامج Anthropic للشركات الناشئة."
      ]
    ],
    "course": [
      [
        "تقييم مخرجات الذكاء الاصطناعي",
        "كيف تكتب معايير نجاح تصمد أمام الواقع، وكيف تختار أسلوب تقييم لا يكذب عليك."
      ],
      [
        "الطلاقة في الذكاء الاصطناعي",
        "دورة للمبتدئين حول كيفية عمل الذكاء الاصطناعي التوليدي ونماذج اللغة الكبيرة فعليًا، ومواضع فشلها، وكيفية الحكم على مخرجاتها."
      ],
      [
        "أساسيات نماذج اللغة الكبيرة",
        "الرموز ونوافذ السياق والقيم اللوغاريتمية وأخذ العينات ودرجة الحرارة: الآلية التي تقرر ما يراه نموذجك وبأي ثقة يتحدث."
      ],
      [
        "حدود النماذج والهلوسة",
        "من أين تأتي العبارات الخاطئة الواثقة، وما الذي يزيدها سوءًا، وتقنيات الحد التي تنفع فعلًا."
      ],
      [
        "ما هو الذكاء الاصطناعي التوليدي؟",
        "ما يحدث فعليًا عند إرسال طلب، والأفكار الثلاثة التي يخلطها الناس: التدريب والاستدلال والنموذج."
      ],
      [
        "السياق والأدلة",
        "قرّر ما يراه النموذج فعلًا: ما يدخل السياق، وما يبقى على القرص، وما لن يعرفه أبدًا."
      ],
      [
        "الفشل والتفكيك",
        "حدّد الحالات الحدّية وسلوك الفشل، ثم فكّك العمل إلى خطوات مرتبة ومهام محدودة للوكلاء الفرعيين."
      ],
      [
        "هندسة صياغة الطلبات للمهندسين",
        "اكتب صياغة الطلبات بوصفها مواصفات مهام مُهيكلة: النطاق والسياق والقيود ومعايير القبول وصلاحيات الأدوات والتحقق."
      ],
      [
        "المخرجات والتحقق",
        "حدّد المخرجات المتوقعة على صورة مخطط أو شكل، ثم اكتب معايير قبول إمّا أن تنجح وإمّا أن تفشل."
      ],
      [
        "تعريف المهمة وحدود النطاق",
        "حوّل طلبًا في سطر واحد إلى بيان مهمة مع حدّ للنطاق وقيود صريحة وأهداف غير مرغوبة مسمّاة."
      ]
    ],
    "session": [
      [
        "اختيار أسلوب التقييم",
        "الفحوص الدقيقة والمقاييس التقريبية والحَكَم النموذجي والمراجعة البشرية: ما يكتشفه كل منها، وأي مقياس سيكذب عليك بهدوء."
      ],
      [
        "حدِّد معايير النجاح قبل كتابة الاختبار",
        "حوّل متطلبًا غامضًا إلى معيار يمكن أن يفشل فعلًا، وابنِ مجموعة بيانات التقييم التي تختبره."
      ],
      [
        "الاستدلال وأخذ العينات",
        "ما يحدث بين وصول الطلب ولحظة وجود الجملة: القيم اللوغاريتمية، ودالة softmax، وأخذ العينات، والحرارة، وtop-k وtop-p."
      ],
      [
        "الرموز ونافذة السياق",
        "كيف يتحوّل النص إلى رموز، ولماذا يختلف العدد عن الكلمات أو الأحرف، وكيف تخطّط لميزانية نافذة السياق قبل بلوغ الحد."
      ],
      [
        "الحد من الهلوسة",
        "حقيبة الحد من الهلوسة: التأريض، والإذن للرفض، والاستخراج بالاقتباس أولًا، والاستشهادات، والتحقق، والحدود الصادقة لكل منها."
      ],
      [
        "لماذا تختلق النماذج بثقة",
        "من أين تأتي الاستشهادات المختلقة فعليًا، وأي الأخطاء هي الأخطر، وشروط الطلب التي ترفع معدلات الهلوسة."
      ],
      [
        "التنبؤ بالرمز التالي: الآلية الحقيقية",
        "ابنِ التنبؤ بالرمز التالي من عدّ الكلمات وحدها، ثم شاهد كيف تتوسّع الفكرة نفسها إلى نماذج اللغة الحديثة."
      ],
      [
        "التدريب والاستدلال ونموذج الأوزان",
        "الأفكار الثلاثة التي يخلطها النقاش العام: التدريب والاستدلال والأوزان على القرص، وما يمكن لكل منها تغييره وما لا يمكنه."
      ],
      [
        "رؤية السياق والنقاط العمياء",
        "دقّق فيما يراه النموذج فعلًا، ورتّب المواد الطويلة بحسب الأثر لا الراحة، واكتب فقرة تمنع الاستنتاج عن شيفرة لم تُفتح."
      ],
      [
        "سياق المستودع والملفات",
        "قرّر ما الذي ينتمي إلى الطلب وما الذي ينتمي إلى ملف تعليمات وما الذي يقرؤه الوكيل عند الحاجة، واكتب تعليمات ملموسة بما يكفي ليمكن التحقق منه."
      ],
      [
        "الحالات الحدّية وسلوك الفشل",
        "سمِّ نقاط التفرّع التي ستصطدم بها المهمة، وحدّد سلوك كل منها، واضبط مقدار الارتجال المسموح."
      ],
      [
        "التخطيط وتفويض الوكلاء الفرعيين",
        "اكتب الخطة كجزء من المواصفة، ووجّه كل وحدة عمل إلى المحادثة الرئيسية أو وكيل فرعي بحسب كلفة السياق وقابلية العكس."
      ],
      [
        "المخرجات المتوقعة ومعايير القبول",
        "حوّل الصفات إلى فحوص قابلة للحسم، وثبّت شكل المخرجات بالمخرجات المهيكلة، واشترط على الوكيل تنفيذ التحقق بنفسه."
      ],
      [
        "حدود الأدوات والصلاحيات",
        "اكتب وصف الأداة بوصفه مواصفة، واضبط نطاق الصلاحية بحسب قابلية العكس، وأوقف النموذج من اختراع المعاملات."
      ],
      [
        "حدود النطاق والأهداف غير المرغوبة",
        "سمِّ أين يتوقف العمل، واذكر الأهداف غير المرغوبة التي كان مهندس كفء سيعدّها ضمن النطاق، وحوّل المحظورات إلى توجيهات."
      ],
      [
        "مواصفة المهمة وتفكيكها",
        "حوّل طلبًا في سطر واحد ينصّ على نشاط إلى بيان مهمة وإجراء مرتب وحدّ يمكنك فحص المخرجات في ضوئه."
      ]
    ],
    "quiz": [
      [
        "اختبار: طرق التقييم",
        "خمسة أسئلة عن تقييم مخرجات الذكاء الاصطناعي: لماذا لا يكفي الانطباع، وما الذي يجب أن يحتويه مجموعة تقييم جيدة، وأي طريقة تناسب أي خلل."
      ],
      [
        "اختبار: الرموز ونافذة السياق",
        "خمسة أسئلة عن الرموز ونافذة السياق: ما الرمز، وكيف تتقاسم المُدخلات والمخرجات ميزانيةً واحدة، ولماذا تفشل السياقات الطويلة."
      ],
      [
        "اختبار: حدود النماذج والهلوسة",
        "خمسة أسئلة عن سبب هلوسة النماذج: أخذ العينات، وحدود المعرفة التدريبية، والخطأ الواثق، والتخفيفات التي تنفع فعلًا."
      ],
      [
        "اختبار: ما هو الذكاء الاصطناعي التوليدي؟",
        "خمسة أسئلة عن الذكاء الاصطناعي التوليدي: ما الذي تلتزم به هذه التسمية، ولماذا يكون الناتج معقولًا لا صحيحًا بالضرورة، وكيف يُنتَج الرد فعليًا."
      ]
    ],
    "exam": [
      [
        "الامتحان النهائي: إتقان الذكاء الاصطناعي",
        "الامتحان النهائي لمسار إتقان الذكاء الاصطناعي: تسعة أسئلة تغطي الوحدات الأربع، موزونة نحو القرارات التي تحدد إن كان مخرج الذكاء الاصطناعي يصل إلى الإنتاج أم لا."
      ]
    ],
    "concept": [
      [
        "الوكيل (Agent)",
        "تطبيق ذكاء اصطناعي يشغّل حلقة: يجمع السياق، ويقرّر، ويتصرّف عبر الأدوات، ويلاحظ، ويكرّر."
      ],
      [
        "التطوير الوكيلي",
        "ممارسة تطوير البرمجيات عبر وكيل يكتب الشيفرة - ينقل الجهد من الكتابة إلى التوصيف والمراجعة والتحقق الآلي."
      ],
      [
        "الواجهة البرمجية (API)",
        "الواجهة البرمجية لمزوّد النموذج - طلبات بلا حالة تحمل الرسائل والأدوات، وتُحاسب بالرموز، وحدودها شكّل تصميمك."
      ],
      [
        "واجهة سطر الأوامر (CLI)",
        "واجهة سطر أوامر لقيادة وكيل ذكاء اصطناعي - قابلة للتركيب والتشغيل الآلي، والأداة نفسها في جلسة تفاعلية وفي التكامل المستمر."
      ],
      [
        "هندسة السياق (Context Engineering)",
        "اختيار الرموز التي تدخل نافذة سياق النموذج في كل دورة، ولماذا حلت محلّ هندسة المطالبات sebagai الإطار."
      ],
      [
        "نافذة السياق (Context Window)",
        "الذاكرة العاملة المحدودة والمخصّصة لكل طلب للنموذج — كل ما يستطيع الإشارة إليه عند إنتاج رد."
      ],
      [
        "التضمين",
        "تمثيل متجهي للنص أو الوسائط يعبّر عن المعنى بحيث تتقارب المتجهات المتقاربة دلالياً - وهو المحرك الذي يقوم عليه البحث الدلالي والاسترجاع."
      ],
      [
        "التقييم",
        "اختبار قابل للتكرار لنظام ذكاء اصطناعي: مُدخل، ثم منطق تصحيح لمخرجه، وقياس للنجاح مقابل معايير عرّفتها مسبقاً."
      ],
      [
        "التقييم (Evaluation)",
        "تحديد معايير نجاح قابلة للقياس لميزة تعتمد على نموذج لغوي وبناء مجموعة اختبارات تقيسها، فتصير ادّعاءات الجودة أدلّة."
      ],
      [
        "حواجز الأمان",
        "طبقة السياسة والصلاحيات التي تحدّ ما يجوز للوكيل فعله - قراءة فقط افتراضياً، وموافقة صريحة على الكتابة، ونطاقات محددة وأدوات ممنوعة."
      ],
      [
        "الهلوسة (Hallucination)",
        "مخرج بليغ وواثق غير مدعوم بحقيقة — ووسائل التخفيف التي تقلّلها فعلاً."
      ],
      [
        "المِحوار (Harness)",
        "بيئة التشغيل حول النموذج - الحلقة والأدوات والصلاحيات وإدارة السياق التي تحوّل النموذج إلى وكيل صالح للاستخدام."
      ],
      [
        "الخطّاف",
        "أمر أو نقطة HTTP أو مطالبة تُطلَق تلقائياً عند نقطة ثابتة في دورة حياة جلسة الوكيل - سلوك حتمي حيث تحتاج الأداة قراراً."
      ],
      [
        "الاستدلال",
        "تشغيل نموذج مدرَّب للحصول على مخرجات - خطوة الحوسبة التي تُدخِل فيها مطالبة وتخرج رموز، وتُدفع فيها زمن الاستجابة والتكلفة."
      ],
      [
        "عميل MCP",
        "مكوّن البروتوكول الخاص بكل خادم داخل تطبيق المضيف، وكيف يختلف عن المضيف نفسه."
      ],
      [
        "موصّل MCP",
        "نسخة مُهيّأة من خادم MCP داخل عميل، وحقيقة الشبكة في الموصّلات البعيدة على Claude."
      ],
      [
        "خادم MCP",
        "البرنامج الذي ينفّذ جانب الخادم في MCP، ويعرض الأدوات والموارد، ويبقى صغيراً عن قصد."
      ],
      [
        "MCP (بروتوكول سياق النموذج)",
        "البروتوكول المفتوح لربط تطبيقات الذكاء الاصطناعي بالأنظمة الخارجية، ولماذا هو بروتوكول لا منتج."
      ],
      [
        "النموذج",
        "الأوزان المدرَّبة والمُقطِّع اللفظي اللذان يتنبآن بالرموز. كل ما يجعل الوكيل مفيداً يُهندس حوله لا داخله."
      ],
      [
        "إمكانية الرؤية",
        "تجهيز نظام ذكاء اصطناعي لتعرف ما فعله في الإنتاج - آثار للاستدعاءات والرموز والاستدعاءات وزمن الاستجابة - فتنسب الإخفاقات إلى سبب."
      ],
      [
        "التنسيق",
        "طبقة التنسيق التي تقرر أي الوكلاء والأدوات والنماذج تعمل، وبأي ترتيب، وبأي عزل للسياق."
      ],
      [
        "إضافة (Plugin)",
        "حزمة مكتفيّة ذاتياً وقابلة للمشاركة من مهارات ووكلاء وخطافات وإعدادات خوادم MCP لـ Claude Code."
      ],
      [
        "حقن المطالبات",
        "هجوم تُدخَل فيه تعليمات مخفية في محتوى يقرأه النموذج - صفحة ويب أو مستند أو نتيجة أداة - فتتجاوز المهمة التي أُعطيت له."
      ],
      [
        "المطالبة",
        "المُدخل الذي ترسله إلى النموذج: تعليمات وسياق وبيانات، يجمّعه الحزام بدل كتابته من جديد كل دورة."
      ],
      [
        "هندسة المطالبات (Prompting)",
        "كتابة تعليمات النموذج وتنظيمها بحيث تكون القراءة الحرفية لكلماتك هي السلوك المقصود."
      ],
      [
        "التوليد المعزَّز بالاسترجاع (RAG)",
        "استرجاع المقاطع ذات الصلة وقت الطلب وإضافتها إلى المطالبة، فيجيب النموذج من بيانات حالية بدل الاعتماد على أوزانه وحدها."
      ],
      [
        "حدود المعدّل",
        "سقوف على مستوى المؤسسة للطلبات والرموز في الدقيقة، تُطبَّق بخوارزمية دلو الرموز، مع حدود إنفاق شهرية - المكبح الذي يجب أن تحترمه بنية نظامك."
      ],
      [
        "مهارة (Agent Skill)",
        "مجموعة تعليمات معبّأة — مجلد SKILL.md — تعلّم الوكيل إجراءً، وتُحمَّل فقط عند الملاءمة."
      ],
      [
        "المخرجات المنظّمة (Structured Outputs)",
        "قيد على فك الترميز يجعل رد النموذج يطابق مخطط JSON لديك، فلا يفشل التحليل اللاحق أبداً."
      ],
      [
        "وكيل فرعي (Sub-agent)",
        "عامل مُسنَد بنافذة سياق خاصة وموجّه نظام وصلاحية أدوات، ويعيد ملخّصاً بدل النسخة الكاملة."
      ],
      [
        "درجة الحرارة",
        "مفتاح أخذ العينات الذي يتحكم بقدر العشوائية في اختيار النموذج للرمز التالي - ولماذا يكون الافتراضي هو الصحيح عادةً."
      ],
      [
        "الرمز",
        "الوحدة التي يقرأها النموذج ويكتبها. الرموز هي ما تُقاس به نوافذ السياق وبها تُحاسب، والحدود تُصاغ جزءاً منها."
      ],
      [
        "استدعاء الأدوات (Tool Calling)",
        "الدورة التي يطلب فيها النموذج أداة، فينفّذها تطبيقك، وتعود النتيجة إلى النموذج."
      ],
      [
        "الأداة (Tool)",
        "قدرة واحدة مسمّاة يستطيع النموذج استدعاؤها — اسم ووصف ومخطط إدخال — أياً كان من عرّفها."
      ],
      [
        "قاعدة المتجهات",
        "تخزين مُخصَّص للمتجهات يجيب على استعلامات أقرب الجيران بسرعة، فيتحول البحث الدلالي دون مقارنة كل زوج."
      ],
      [
        "سير العمل",
        "نظام وكيلي تُنسَّق فيه النماذج والأدوات عبر مسارات شيفرة محددة سلفاً، بخلاف نموذج يقرر خطواته بنفسه."
      ]
    ],
    "promptAssessment": [
      [
        "تقييم مطالبة: اختبار CI متذبذب",
        "مطالبتان لمهمة واحدة — تشخيص اختبار ينجح محليًا ويفشل أحيانًا في CI — مُقيَّمتان بمعايير المطابقة من تسعة."
      ],
      [
        "تقييم مطالبة: تقسيم صفحات الطلبات",
        "مطالبتان لمهمة واحدة — إضافة تقسيم الصفحات بمؤشر إلى نقطة الطلبات — مُقيَّمتان بمعايير المطابقة من تسعة."
      ]
    ]
  }
};
