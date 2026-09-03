export interface StudyLoopStep {
  step: string;
  whatToDo: string;
  timeBudget: string;
}

export interface PracticeCategory {
  category: string;
  environment: string;
  tasks: string[];
}

export interface ScenarioStep {
  stepNumber: number;
  name: string;
  action: string;
}

export interface UnknownTemplateStep {
  stepNumber: number;
  name: string;
  guidance: string;
}

export interface FlagshipStorySlot {
  slot: string;
  fillWith: string;
  promptExample?: string;
}

export interface AnswerTierLevel {
  tier: string;
  soundsLike: string;
  verdict: string;
  isTarget?: boolean;
}

export interface RedFlag {
  phrase: string;
  signal: string;
}

export interface DaySchedule {
  day: string;
  focus: string;
  note: string;
  isHighLeverage?: boolean;
}

export interface Section0Data {
  title: string;
  meta: {
    audience: string;
    existingStrength: string;
    goal: string;
  };
  mindsetShift: {
    title: string;
    description: string;
    threeLenses: {
      number: number;
      name: string;
      description: string;
    }[];
    internalTest: string;
    warning: string;
  };
  studyLoop: {
    title: string;
    steps: StudyLoopStep[];
    speakingWarning: string;
    tierUsage: {
      tierBadge: string;
      tierName: string;
      stepsUsed: string;
      note: string;
    }[];
  };
  deepVsMemorizeVsRecognize: {
    title: string;
    learnDeeply: string[];
    memorize: string[];
    justRecognize: string[];
  };
  practiceNonNegotiables: {
    title: string;
    callout: string;
    categories: PracticeCategory[];
    handsOnWarning: string;
  };
  scenarioQuestions: {
    title: string;
    description: string;
    exampleQuestion: string;
    steps: ScenarioStep[];
    microAnswerSkeleton: string;
    timingNotice: string;
  };
  unknownQuestions: {
    title: string;
    principle: string;
    template: UnknownTemplateStep[];
    exampleQuote: string;
    verdict: string;
  };
  flagshipSnowflakeExperience: {
    title: string;
    interviewPrompt: string;
    storyStructure: FlagshipStorySlot[];
    rules: {
      rule: string;
      explanation: string;
    }[];
    versions: string;
  };
  seniorLevelDistinction: {
    title: string;
    description: string;
    tiers: AnswerTierLevel[];
    rule: string;
  };
  redFlags: {
    title: string;
    description: string;
    flags: RedFlag[];
    remedy: string;
  };
  sevenDayPlan: {
    title: string;
    intro: string;
    days: DaySchedule[];
    highestRoiNote: string;
  };
  groundRules: {
    title: string;
    rules: string[];
  };
  quickRevision: {
    title: string;
    points: string[];
  };
}

export const SECTION_0_DATA: Section0Data = {
  title: "Section 0 — How to Use This Study Guide",
  
  meta: {
    audience: "4+ year data engineer preparing for an Infosys DE interview (5–10 YOE band).",
    existingStrength: "Snowflake + core data engineering workflows.",
    goal: "Convert existing knowledge into interview-ready senior-level answers and close gaps in PySpark, Spark internals, Databricks, Delta Lake, ADF, CDC, and lakehouse architecture."
  },

  mindsetShift: {
    title: "0.1 The mindset shift you need before anything else",
    description: "At 5–10 YOE, interviewers do not test whether you know definitions. They test three things:",
    threeLenses: [
      {
        number: 1,
        name: "Depth",
        description: "Can you explain what happens internally when your code runs?"
      },
      {
        number: 2,
        name: "Judgment",
        description: "Can you defend why you chose an approach over the alternatives?"
      },
      {
        number: 3,
        name: "Failure reasoning",
        description: "Can you describe what breaks first at scale, and how you'd detect and fix it?"
      }
    ],
    internalTest: "If the interviewer asks me how this works, why I'd use it, and what fails at 10× the data — can I answer all three in under two minutes without hand-waving?",
    warning: "Every topic in this guide should be studied through those three lenses. If you can only recite the definition, you are not ready for that topic yet. If the answer is no, revisit that topic."
  },

  studyLoop: {
    title: "0.2 How to study each section (the loop)",
    steps: [
      {
        step: "1. Read",
        whatToDo: "Read the section end-to-end once, no notes",
        timeBudget: "~20%"
      },
      {
        step: "2. Rebuild",
        whatToDo: "Close the guide. Explain the topic out loud as if teaching a junior.",
        timeBudget: "~15%"
      },
      {
        step: "3. Code",
        whatToDo: "Type (don't paste) the code examples. Break them, then fix them.",
        timeBudget: "~30%"
      },
      {
        step: "4. Interrogate",
        whatToDo: "Answer the interview + follow-up questions out loud.",
        timeBudget: "~25%"
      },
      {
        step: "5. Compress",
        whatToDo: "Write 5–10 bullet points into your own cheat sheet.",
        timeBudget: "~10%"
      }
    ],
    speakingWarning: "Skipping step 2 or 4 is the single most common reason strong engineers underperform in interviews. You must practice speaking the answer, not just reading it.",
    tierUsage: [
      {
        tierBadge: "🔴 MUST MASTER",
        tierName: "Tier 1 Topics",
        stepsUsed: "Use all 5 steps (1. Read, 2. Rebuild, 3. Code, 4. Interrogate, 5. Compress)",
        note: "Non-negotiable core topics requiring end-to-end hands-on and spoken mastery."
      },
      {
        tierBadge: "🟠 INTERVIEW READY",
        tierName: "Tier 2 Topics",
        stepsUsed: "Use steps 1, 4, 5 only (Read, Interrogate, Compress)",
        note: "Know the interview-ready answer and concept boundaries; do not sink endless coding time."
      },
      {
        tierBadge: "🟡 AWARENESS",
        tierName: "Tier 3 Topics",
        stepsUsed: "Use steps 1 and 5 only (Read, Compress)",
        note: "Know what it is and why enterprises use it — do not sink time here."
      }
    ]
  },

  deepVsMemorizeVsRecognize: {
    title: "0.3 What to learn deeply vs. memorize vs. just recognize",
    learnDeeply: [
      "Spark execution model: job → stage → task, shuffle boundaries, DAG",
      "Delta Lake transaction log + MERGE semantics",
      "Window functions and deduplication / SCD2 patterns",
      "Incremental load + watermark + idempotency logic",
      "Partition pruning (Snowflake micro-partitions AND Spark/Delta partitions)",
      "How to diagnose skew, OOM, small-file problem",
      "Metadata-driven pipeline design in ADF"
    ],
    memorize: [
      "Narrow vs wide transformations (with 3 examples each)",
      "Broadcast join threshold default (10MB) and how to change it",
      "Delta commands: OPTIMIZE, VACUUM, Z-ORDER, MERGE, RESTORE",
      "Snowflake object hierarchy: account → database → schema → table/warehouse/stage",
      "ADF activity types and when to use each",
      "SCD Type 1 vs Type 2 mechanics",
      "Bronze / Silver / Gold responsibilities"
    ],
    justRecognize: [
      "Adeptia and SnapLogic details beyond \"what and why\"",
      "Exact syntax of every rarely-used ADF expression",
      "Every single Spark config flag (know the ~10 that matter)"
    ]
  },

  practiceNonNegotiables: {
    title: "0.4 How to practice — the non-negotiables",
    callout: "You will not clear a senior DE round by reading. Practice these before the interview:",
    categories: [
      {
        category: "SQL",
        environment: "Do these on a real engine (Snowflake trial or Postgres):",
        tasks: [
          "Top-N-per-group with ROW_NUMBER",
          "Deduplication keeping latest record by timestamp",
          "Running totals and moving averages",
          "Gaps and islands (consecutive-day streaks)",
          "SCD2 with MERGE",
          "Incremental load with watermark"
        ]
      },
      {
        category: "PySpark",
        environment: "Run these locally or on Databricks Community Edition:",
        tasks: [
          "Read CSV/JSON/Parquet with an explicit schema",
          "Window function on a DataFrame (rank + dedupe)",
          "Broadcast join (and inspect the physical plan)",
          "Nested JSON with explode and struct access",
          "Simple structured streaming from a file source with checkpoint",
          "MERGE into a Delta table"
        ]
      },
      {
        category: "Databricks",
        environment: "Platform workflow execution:",
        tasks: [
          "Create a notebook, attach to a cluster, run a Delta MERGE",
          "Create a Job with parameters and a task dependency",
          "Read spark.sql(\"DESCRIBE HISTORY delta_table\") output"
        ]
      }
    ],
    handsOnWarning: "If you have not done these hands-on, your answers will sound theoretical, and senior interviewers detect that instantly."
  },

  scenarioQuestions: {
    title: "0.5 How to answer scenario questions",
    description: "Scenario questions are the highest-signal questions in a senior interview. Use this fixed structure:",
    exampleQuestion: "The Spark job that ran in 20 min now runs for 3 hours — what do you do?",
    steps: [
      {
        stepNumber: 1,
        name: "Clarify",
        action: "Ask 1–2 sharp questions to bound the problem"
      },
      {
        stepNumber: 2,
        name: "Observe",
        action: "Say what you'd look at first (Spark UI, logs, metrics)"
      },
      {
        stepNumber: 3,
        name: "Hypothesize",
        action: "List 2–3 likely root causes, ranked"
      },
      {
        stepNumber: 4,
        name: "Isolate",
        action: "How you'd confirm which one"
      },
      {
        stepNumber: 5,
        name: "Fix",
        action: "The specific change you'd make"
      },
      {
        stepNumber: 6,
        name: "Prevent",
        action: "How you'd stop it from happening again"
      }
    ],
    microAnswerSkeleton: "First I'd check the Spark UI Stages tab to see if one stage dominates, and whether tasks in that stage have skewed durations. My top two hypotheses would be data skew on the join key or a small-file explosion on the source path. If it's skew, I'd confirm via task-level input size, then fix with salting or AQE skew join. To prevent recurrence, I'd add a data-quality check on key distribution and alert on stage duration regression.",
    timingNotice: "That answer signals seniority in ~45 seconds. Practice this structure until it's automatic."
  },

  unknownQuestions: {
    title: "0.6 How to handle \"I don't know\" questions",
    principle: "Never fake it. Senior interviewers give partial credit for structured honesty and zero credit for bluffing. Use this template:",
    template: [
      {
        stepNumber: 1,
        name: "Anchor",
        guidance: "Anchor to the closest thing you do know."
      },
      {
        stepNumber: 2,
        name: "Reason",
        guidance: "Reason from first principles about what the answer likely is."
      },
      {
        stepNumber: 3,
        name: "State the boundary",
        guidance: "Say clearly what you don't know."
      },
      {
        stepNumber: 4,
        name: "Offer",
        guidance: "Offer how you would find out."
      }
    ],
    exampleQuote: "I haven't used Adeptia in production. Based on how it's positioned it looks like a B2B integration / EDI-focused tool — similar in intent to Logic Apps or SnapLogic but stronger on partner-facing flows. If I had to onboard, I'd start with its transformation and error-handling model and compare it to ADF patterns I already know.",
    verdict: "This answer will beat a made-up one every time."
  },

  flagshipSnowflakeExperience: {
    title: "0.7 How to explain your existing Snowflake experience",
    interviewPrompt: "Walk me through a pipeline you built.",
    storyStructure: [
      {
        slot: "Context",
        fillWith: "Domain, data volume, users, SLA",
        promptExample: "Financial transaction pipeline, 50M rows/day, 6 AM daily reporting SLA."
      },
      {
        slot: "Problem",
        fillWith: "The specific business/technical pain",
        promptExample: "Legacy batch load was breaching SLA and causing high Snowflake credit consumption."
      },
      {
        slot: "Architecture",
        fillWith: "Sources → ingestion → transform → serve",
        promptExample: "S3 staging bucket → Snowpipe → Bronze raw table → Dynamic Streams + Tasks → Silver curated → Gold data mart."
      },
      {
        slot: "Your role",
        fillWith: "What you personally designed / built / owned",
        promptExample: "Designed the micro-batch CDC pipeline and warehouse auto-scaling strategy."
      },
      {
        slot: "Key decisions",
        fillWith: "2–3 non-obvious choices (with the alternatives you rejected)",
        promptExample: "Chose Snowflake Streams over continuous scheduled MERGEs to avoid scanning redundant micro-partitions; sized warehouse to X-Small with auto-suspend at 60s."
      },
      {
        slot: "Scale",
        fillWith: "Rows/day, table size, warehouse size, cost",
        promptExample: "50M records/day (~20GB compressed/day), 4TB history table, X-Small multi-cluster warehouse."
      },
      {
        slot: "Failure handling",
        fillWith: "Idempotency, retries, alerting",
        promptExample: "Transaction boundary around stream consumption; automated alert via Snowflake notification integration on task failure."
      },
      {
        slot: "Outcome",
        fillWith: "Measurable result (latency ↓, cost ↓, freshness ↑)",
        promptExample: "Reduced runtime from 45 min to 8 min, cut monthly Snowflake credits by 35%, eliminated SLA breaches."
      }
    ],
    rules: [
      {
        rule: "Numbers make you credible.",
        explanation: "\"Reduced runtime from 45 min to 8 min\" beats \"improved performance.\""
      },
      {
        rule: "Own decisions, not just tasks.",
        explanation: "\"I chose X over Y because…\" is senior signal."
      },
      {
        rule: "Be ready to be pushed.",
        explanation: "They will ask \"why not Streams instead of MERGE?\" — prepare the counter-answer."
      }
    ],
    versions: "You should also prepare a short answer (60s) and a long answer (3–4 min) version of the same story."
  },

  seniorLevelDistinction: {
    title: "0.8 What \"senior-level\" actually sounds like",
    description: "For every topic in this guide, aim for three answer tiers. Only the third one wins a senior loop.",
    tiers: [
      {
        tier: "Basic",
        soundsLike: "\"MERGE upserts data into a target table.\"",
        verdict: "Junior"
      },
      {
        tier: "Strong",
        soundsLike: "\"MERGE handles insert/update/delete in one atomic statement against a target based on a source, and I use it for SCD1 loads.\"",
        verdict: "Mid"
      },
      {
        tier: "Senior",
        soundsLike: "\"I use MERGE for idempotent upserts. The source must be deduplicated on the join key first, otherwise Delta throws a non-deterministic match error. I partition the target on load date so MERGE scans only relevant files, and I run OPTIMIZE ZORDER BY (customer_id) weekly to keep merge times bounded. For very large targets I switch to a partition-overwrite pattern when the change set covers most of a partition.\"",
        verdict: "Senior ✅",
        isTarget: true
      }
    ],
    rule: "Every 🔴 topic will be studied to Tier 3."
  },

  redFlags: {
    title: "0.9 Red flags to eliminate from your answers",
    description: "Senior interviewers downgrade candidates who say any of the following without qualification:",
    flags: [
      {
        phrase: "\"I'd just use collect()\"",
        signal: "Signals no distributed thinking (pulls entire distributed dataset to the single driver node; risks Driver OOM)."
      },
      {
        phrase: "\"I always cache everything\"",
        signal: "Signals no memory-cost awareness (evicts executor memory, consumes heap, triggers unexpected disk spills)."
      },
      {
        phrase: "\"I use UDFs for everything\"",
        signal: "Signals no Catalyst awareness (Python UDF serialization overhead; prevents Catalyst optimizer query predicate pushdown)."
      },
      {
        phrase: "\"Partitions make it faster\"",
        signal: "Signals no understanding of partition cardinality (leads to high-cardinality small-file explosion and metadata strain)."
      },
      {
        phrase: "\"I use count() to check\"",
        signal: "Signals no awareness that count is an action + full scan (forces evaluation of the entire DAG and full cluster scan)."
      },
      {
        phrase: "\"Just increase the cluster size\"",
        signal: "Signals no root-cause reasoning (masks bad join strategies, data skew, and Cartesian products with enterprise cloud spend)."
      }
    ],
    remedy: "If any of these are in your default vocabulary, replace them."
  },

  sevenDayPlan: {
    title: "0.10 How to use this guide over the next 7 days",
    intro: "The final week plan lives in Section 29. But at a high level:",
    days: [
      {
        day: "Day 1",
        focus: "Snowflake + SQL",
        note: "Leverage existing strength"
      },
      {
        day: "Day 2",
        focus: "Python + PySpark",
        note: "Fluency reps"
      },
      {
        day: "Day 3",
        focus: "Spark internals + tuning",
        note: "Highest interview leverage",
        isHighLeverage: true
      },
      {
        day: "Day 4",
        focus: "Databricks + Delta",
        note: "The platform layer"
      },
      {
        day: "Day 5",
        focus: "ADF + ADLS + Incremental + CDC",
        note: "The JD's core",
        isHighLeverage: true
      },
      {
        day: "Day 6",
        focus: "Architecture + system design",
        note: "End-to-end integration & trade-offs"
      },
      {
        day: "Day 7",
        focus: "Mock interviews + cheat sheets + weak spots",
        note: "Spoken verbal interrogation drills"
      }
    ],
    highestRoiNote: "The single highest-ROI section for you is likely Section 6 (Spark Performance Tuning) and Section 12 (Metadata-driven pipelines), because those are the two areas where mid-level engineers plateau and where senior interviewers separate signal from noise."
  },

  groundRules: {
    title: "0.11 Ground rules for the rest of this guide",
    rules: [
      "Every 🔴 topic will be taught to senior tier.",
      "Every code example is meant to be typed and run, not skimmed.",
      "Every architectural claim comes with the trade-off you must be able to defend.",
      "Where Snowflake and Databricks overlap, I will always tell you which one to pick and why.",
      "I will not pad. If a topic needs 200 words, it gets 200 words."
    ]
  },

  quickRevision: {
    title: "0.12 Quick revision — Section 0",
    points: [
      "Answer at 3 levels: what → how it works → why + failure modes.",
      "Practice out loud. Rebuild every concept without looking.",
      "Scenario answer structure: Clarify → Observe → Hypothesize → Isolate → Fix → Prevent.",
      "Have one flagship story with numbers, decisions, and pushback answers.",
      "Never bluff. Anchor → reason → boundary → how you'd find out.",
      "Kill lazy phrases (collect(), \"just cache it\", \"just make the cluster bigger\").",
      "Highest-leverage areas for your profile: Spark tuning, Delta MERGE, metadata-driven ADF, CDC."
    ]
  }
};
