/* ===========================================================
   CONTENT FILE — edit this to change the site.
   Or open index.html?edit=1, toggle things, hit Copy config,
   and paste the result over this whole file.
   =========================================================== */

window.PORTFOLIO = {
  "_readme": "Edit this file to change site content. Or open index.html?edit=1 to toggle things visually, then click 'Copy config' and paste the result back here.",
  "profile": {
    "name": "Simon Chen",
    "title": "Senior Technical Product Manager",
    "kicker": "Risk & Identity Platform · Morgan Stanley",
    "tagline": "I build AI products, not just roadmaps for them.",
    "lede": "Nine years shipping risk, identity, and pricing platforms in financial services. Nights and weekends I ship the AI systems myself — LLM pipelines with evals, cost ceilings, and human-in-the-loop guardrails. The projects below are the ones I still run.",
    "location": "Atlanta, GA",
    "email": "simonchen0993@gmail.com",
    "linkedin": "https://linkedin.com/in/schen93",
    "github": "https://github.com/KIBA0993",
    "availability": ""
  },
  "sections": {
    "hero": {
      "enabled": true,
      "label": "Hero — name, tagline, contact"
    },
    "stats": {
      "enabled": true,
      "label": "Stat band under the hero"
    },
    "overview": {
      "enabled": true,
      "label": "Project overview strip (high level)"
    },
    "projects": {
      "enabled": true,
      "label": "Projects"
    },
    "approach": {
      "enabled": true,
      "label": "How I build with AI"
    },
    "experience": {
      "enabled": true,
      "label": "Experience timeline"
    },
    "skills": {
      "enabled": true,
      "label": "Skills / tooling"
    },
    "contact": {
      "enabled": true,
      "label": "Contact footer"
    }
  },
  "stats": [
    {
      "enabled": true,
      "value": "9+",
      "label": "Years in product"
    },
    {
      "enabled": true,
      "value": "3",
      "label": "AI systems shipped solo"
    },
    {
      "enabled": true,
      "value": "MBA",
      "label": "Emory Goizueta"
    },
    {
      "enabled": true,
      "value": "24/7",
      "label": "Pipelines running in prod"
    }
  ],
  "projects": [
    {
      "id": "options-scanner",
      "enabled": true,
      "featured": true,
      "title": "Stock Options Scanner",
      "subtitle": "An LLM trading-signal pipeline that critiques and rewrites its own scoring rules every week",
      "status": "Active",
      "period": "Jun 2026 — present",
      "role": "Solo — product, architecture, code",
      "repo": "https://github.com/KIBA0993/stock-options-scanner",
      "lede": "Most retail screeners hand you 300 tickers and no judgment. This one applies a named trading framework to every candidate, tracks whether that framework was right, and drafts amendments to itself when it repeatedly misses the same way.",
      "show": {
        "problem": true,
        "build": true,
        "decisions": true,
        "metrics": true,
        "stack": true,
        "diagram": true
      },
      "problem": "A technical screen produces candidates, not decisions. Turning volume and TA signals into a trade requires a framework — and frameworks decay silently as market regime shifts. The gap I wanted to close was the feedback loop: nothing in a normal screener knows whether last month's logic still works.",
      "build": [
        "Scans NASDAQ/NYSE daily for RSI, MACD, EMA, and relative-volume setups via tradingview-screener.",
        "Distills trading frameworks from four public traders' posts into versioned markdown (`framework-v1.md`) the LLM scores against.",
        "Scores each candidate with an LLM against those frameworks, capped at 5–10 alerts per week, and pushes to Telegram/email.",
        "Logs every trade to an append-only journal and computes P&L in R-multiples; a backtester validates signal quality against yfinance history.",
        "Every Friday a launchd job runs the reflection loop: it finds repeating miss patterns and drafts a framework amendment for human approval."
      ],
      "decisions": [
        {
          "k": "Self-modification stays human-gated",
          "v": "The reflection loop drafts `framework-v2.md` but never applies it. A person runs `apply` or `reject --reason`. An agent that silently rewrites its own trading logic is a liability, not a feature."
        },
        {
          "k": "Five LLM providers, one interface",
          "v": "Vertex Gemini 2.5 Flash at ~$1–3/mo is the default; Anthropic, Mammouth, and local Ollama swap by config; a `--no-llm` heuristic path keeps the pipeline alive with zero credentials. Cost is a product constraint, not an afterthought."
        },
        {
          "k": "A hard budget on output",
          "v": "10 trades/week, enforced in code with an explicit `--ignore-budget` escape hatch. Constraining what the system is allowed to recommend is what makes the win-rate number mean anything."
        },
        {
          "k": "Every artifact is auditable",
          "v": "Scored output archived per scan for 14 days, reflection decisions in a JSONL ledger. When the system is wrong I can reconstruct exactly which framework version produced the call."
        }
      ],
      "metrics": [
        {
          "enabled": true,
          "k": "Python",
          "v": "743 KB"
        },
        {
          "enabled": true,
          "k": "Commits",
          "v": "32"
        },
        {
          "enabled": true,
          "k": "LLM providers",
          "v": "5"
        },
        {
          "enabled": true,
          "k": "Alert budget",
          "v": "10/wk"
        }
      ],
      "stack": [
        "Python",
        "tradingview-screener",
        "yfinance",
        "Vertex AI · Gemini 2.5 Flash",
        "Anthropic Claude",
        "Ollama",
        "Telegram API",
        "launchd",
        "Docker",
        "pytest"
      ],
      "notes": "Deployed to a Synology NAS for always-on wired scanning. Test suite under `tests/`.",
      "proves": "LLM orchestration with evals, cost ceilings, and gated self-modification"
    },
    {
      "id": "ai-learning-skill",
      "enabled": true,
      "featured": false,
      "title": "AI Learning Skill",
      "subtitle": "An agent skill that turns any real AI product into a 15-day, role-specific curriculum",
      "status": "Shipped",
      "period": "Apr 2026",
      "role": "Solo — spec design and prompt architecture",
      "repo": "https://github.com/KIBA0993/ai-learning-skill",
      "lede": "Generic \"intro to AI\" courses don't help a PM who needs to understand the product they're competing with next quarter. This skill takes a real product — Cursor, Perplexity, Notion AI — and a job function, then researches and generates a curriculum grounded in that specific product.",
      "show": {
        "problem": true,
        "build": true,
        "decisions": true,
        "metrics": true,
        "stack": true,
        "diagram": true
      },
      "problem": "AI upskilling material is either too shallow to be useful or too general to be actionable. The thing a PM actually needs is: how does *this* product work, who is it losing to, and what does that mean for my function. That curriculum doesn't exist off the shelf because it has to be generated per product, per role.",
      "build": [
        "Reverse-engineers a named product's tech stack and competitive landscape through live research at generation time.",
        "Calibrates depth with a short learner profile plus a placement quiz — vocabulary and density shift across PM, engineer, UX, ops, and analyst.",
        "Emits 15 mobile-friendly HTML sessions of 15–20 minutes each, with multiple-choice and open-ended quizzes and model answers.",
        "Writes a `manifest.json` that drives which day opens next, plus a curriculum map with per-module focus lines derived from actual session content.",
        "Optional macOS launchd + SMTP job delivers one session per day at a chosen time."
      ],
      "decisions": [
        {
          "k": "Source diversity is a rule, not a suggestion",
          "v": "The skill prioritizes neutral third-party sources and uses vendor docs sparingly. A curriculum about a product, sourced from that product's marketing site, teaches you the pitch instead of the system."
        },
        {
          "k": "No fixed source count",
          "v": "Enough sources to actually learn the topic, rather than a quota that gets padded. Quotas produce filler."
        },
        {
          "k": "Secrets never touch the profile",
          "v": "SMTP credentials live in a separate gitignored `.smtp-config.json`, never in `.user-profile.json`. Two files because they have two different blast radii."
        },
        {
          "k": "Preference updates are scoped",
          "v": "\"Update delivery\" changes the email and send time only; \"update my profile\" regenerates calibration. Forcing a full re-run to change an email address is the kind of friction that kills adoption."
        }
      ],
      "metrics": [
        {
          "enabled": true,
          "k": "Sessions generated",
          "v": "15"
        },
        {
          "enabled": true,
          "k": "Roles supported",
          "v": "5"
        },
        {
          "enabled": true,
          "k": "Run time",
          "v": "~10 min"
        },
        {
          "enabled": false,
          "k": "GitHub stars",
          "v": "1"
        }
      ],
      "stack": [
        "Claude agent skill spec",
        "Prompt architecture",
        "Markdown",
        "HTML",
        "JSON manifest",
        "launchd",
        "SMTP"
      ],
      "notes": "Runs in Cursor, Claude Code, and other Claude-powered hosts. Published with OpenClaw homepage metadata.",
      "proves": "Agent and prompt architecture, personalised at generation time"
    },
    {
      "id": "unhooked",
      "enabled": true,
      "featured": false,
      "title": "Unhooked",
      "subtitle": "A screen-time app where healthier phone habits feed a virtual pet — spec'd to build-ready depth",
      "status": "Spec + prototype",
      "period": "Oct 2025 — Jun 2026",
      "role": "Product Manager — PRD, economy design, UI system",
      "repo": "https://github.com/KIBA0993/Gamelikeuipackage",
      "lede": "Stay under a self-set daily phone limit, earn Energy, spend it caring for an original pixel-art companion. The interesting work here isn't the pet — it's the economy design, the fairness guardrails, and the payments hardening that keep a habit app from becoming a slot machine.",
      "show": {
        "problem": true,
        "build": true,
        "decisions": true,
        "metrics": true,
        "stack": true,
        "diagram": true
      },
      "problem": "Habit apps that gamify tend to drift into the exact compulsion loops they were built to interrupt. The design problem was making progression feel rewarding without making the reward the new addiction — and without letting paid currency buy an advantage.",
      "build": [
        "PRD v1.8 taken to build-ready: health system (Healthy → Sick → Dead) with timers, visuals, recovery/revive/restart flows, cooldowns, and limits.",
        "Dual-currency economy — Energy earned by behavior, Gems paid — with a hard rule that Food is Energy-only and Cosmetics never affect gameplay.",
        "Payments hardened at the spec level: server-side receipt validation, entitlement rollback on refunds, idempotency keys, and ledgers.",
        "Admin portal / CMS scope for recovery pricing, species scoping, seasonal windows, and memorials.",
        "React + Radix component package with a stage-specific evolution animation system, built out from the Figma design."
      ],
      "decisions": [
        {
          "k": "Paid currency buys no advantage",
          "v": "Cosmetics are cosmetic-only and paid recovery restores baseline health, nothing more. The moment Gems buy progression, the behavior change the app exists for stops being the point."
        },
        {
          "k": "A numeric fairness ceiling",
          "v": "avg_daily_buff ≤ 0.20, written into the guardrails section. A fairness principle nobody can measure gets negotiated away in the first scope cut."
        },
        {
          "k": "No leaderboards, explicitly a non-goal",
          "v": "Public comparison is the fastest path to the compulsion loop the product is trying to break. Naming it as a non-goal in the PRD stops it from being re-proposed every quarter."
        },
        {
          "k": "Accessibility as a build constraint",
          "v": "VoiceOver/TalkBack, ≥4.5:1 contrast, and large-text layouts specified up front rather than filed as post-launch cleanup."
        }
      ],
      "metrics": [
        {
          "enabled": true,
          "k": "PRD version",
          "v": "v1.8"
        },
        {
          "enabled": true,
          "k": "TypeScript",
          "v": "364 KB"
        },
        {
          "enabled": true,
          "k": "Platforms",
          "v": "iOS + Android"
        },
        {
          "enabled": false,
          "k": "Commits",
          "v": "2"
        }
      ],
      "stack": [
        "Product spec",
        "Economy design",
        "React",
        "TypeScript",
        "Radix UI",
        "Tailwind",
        "Motion",
        "Figma",
        "Vite"
      ],
      "notes": "Repo originated as a Figma code-bundle export; the PRD, economy model, and evolution system are mine.",
      "proves": "A vague brief taken to a build-ready PRD with numeric guardrails"
    }
  ],
  "approach": {
    "title": "How I build with AI",
    "lede": "The same four questions decide whether an AI feature ships or quietly burns money. I answer them in my own projects before I ask a team to answer them at work.",
    "items": [
      {
        "enabled": true,
        "k": "Evals before scale",
        "v": "The options scanner backtests its own signals and journals every outcome in R-multiples. If you can't say whether last month's model was right, you can't say anything about this month's."
      },
      {
        "enabled": true,
        "k": "Cost is a design constraint",
        "v": "Five swappable providers spanning $0 to moderate, with a documented per-month cost and a heuristic path that runs on no credentials at all. Unit economics decide architecture."
      },
      {
        "enabled": true,
        "k": "Humans gate self-modification",
        "v": "Systems that rewrite their own rules draft; people approve. Every amendment carries an apply/reject decision with a logged reason."
      },
      {
        "enabled": true,
        "k": "Guardrails are numbers",
        "v": "10 alerts per week. avg_daily_buff ≤ 0.20. Contrast ≥ 4.5:1. A principle without a threshold is a preference, and preferences lose scope negotiations."
      }
    ],
    "showDiagram": true
  },
  "experience": {
    "title": "Experience",
    "note": "Add one outcome metric per role — see README.",
    "items": [
      {
        "enabled": true,
        "company": "Morgan Stanley",
        "title": "Senior Technical Product Manager — Risk & Identity Platform",
        "location": "Atlanta, GA",
        "period": "Jan 2023 — Present",
        "bullets": []
      },
      {
        "enabled": true,
        "company": "Super Zaizai",
        "title": "Founding Product Manager (Part-Time)",
        "location": "Remote",
        "period": "Dec 2023 — Sep 2024",
        "bullets": []
      },
      {
        "enabled": true,
        "company": "Mercury Insurance",
        "title": "Product Manager — Risk Platform & Market Expansion",
        "location": "Atlanta, GA",
        "period": "Jun 2022 — Jan 2023",
        "bullets": []
      },
      {
        "enabled": true,
        "company": "Kemper Insurance",
        "title": "Product Manager — Portfolio Strategy & Pricing",
        "location": "Atlanta, GA",
        "period": "Jan 2020 — Jun 2022",
        "bullets": []
      },
      {
        "enabled": true,
        "company": "Farmers Insurance",
        "title": "Senior Product Analyst — Pricing & Monetization",
        "location": "Independence, OH",
        "period": "Feb 2016 — Jan 2020",
        "bullets": []
      }
    ],
    "education": [
      {
        "enabled": true,
        "school": "Emory University — Goizueta Business School",
        "degree": "MBA, Product Strategy · Operations · Data Science",
        "year": "2023"
      },
      {
        "enabled": true,
        "school": "Kent State University",
        "degree": "BA Finance, Applied Mathematics minor",
        "year": "2016"
      }
    ]
  },
  "skills": {
    "title": "Tooling",
    "groups": [
      {
        "enabled": true,
        "label": "AI / ML",
        "items": [
          "LLM orchestration",
          "Prompt & agent design",
          "Evals and backtesting",
          "RAG patterns",
          "Vertex AI",
          "Anthropic API",
          "Ollama"
        ]
      },
      {
        "enabled": true,
        "label": "Build",
        "items": [
          "Python",
          "TypeScript / React",
          "SQL",
          "Docker",
          "pytest",
          "launchd / cron"
        ]
      },
      {
        "enabled": true,
        "label": "Product",
        "items": [
          "Platform & API strategy",
          "Risk / identity / fraud",
          "Pricing & monetization",
          "PRD to build-ready spec",
          "Experimentation",
          "Roadmapping"
        ]
      },
      {
        "enabled": true,
        "label": "Domain",
        "items": [
          "Fintech",
          "Brokerage & wealth",
          "Insurance & underwriting",
          "Payments",
          "B2B SaaS"
        ]
      }
    ]
  },
  "contact": {
    "title": "Get in touch",
    "lede": "Open to Senior and Principal product roles in fintech, risk, and AI platforms.",
    "showEmail": true,
    "showLinkedin": true,
    "showGithub": true,
    "showLocation": true
  },
  "overview": {
    "title": "Three systems, one method",
    "lede": "Each project answers a different question a hiring manager actually asks: can you ship an AI system that knows when it is wrong, can you turn a vague brief into a spec, and can you design an economy that does not eat its users."
  }
};
