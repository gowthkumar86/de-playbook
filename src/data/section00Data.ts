import { SectionPart } from '../types';

export const SECTION_00_DATA: SectionPart = {
  id: 'section-00',
  title: 'How to Use This Study Guide',
  partNumber: 'SECTION 0',
  subtitle: 'The 5–10 YOE Senior Data Engineer Mindset Shift & Execution Framework',
  summary: 'A strategic blueprint for converting existing Snowflake and data engineering knowledge into interview-ready senior answers. Covers the 3-lens evaluation rubric, the 5-step study loop, scenario answering frameworks, flagship story formulation, and red flag elimination.',
  readTimeMinutes: 15,
  terminologies: [
    {
      term: 'Depth',
      definition: 'Explaining what happens internally at the storage, memory, and compiler level when your code executes, rather than reciting API signatures.',
      category: 'Mindset',
      highlight: true
    },
    {
      term: 'Judgment',
      definition: 'Defending architectural and technical trade-offs—explaining why you chose one specific approach over viable alternatives under real constraints.',
      category: 'Mindset',
      highlight: true
    },
    {
      term: 'Failure Reasoning',
      definition: 'Anticipating what breaks first at 10× scale, and articulating concrete observability, diagnostic isolation, and self-healing recovery paths.',
      category: 'Mindset',
      highlight: true
    },
    {
      term: 'The 5-Step Loop',
      definition: 'Read (20%) → Rebuild out loud (15%) → Code & break (30%) → Interrogate aloud (25%) → Compress into cheat sheet (10%).',
      category: 'Study Methodology'
    },
    {
      term: 'Flagship Story',
      definition: 'A battle-tested 60-second or 3-minute production pipeline narrative featuring concrete metrics, non-obvious trade-offs, and failure recoveries.',
      category: 'Interview Strategy',
      highlight: true
    },
    {
      term: 'Tier 3 (Senior) Answer',
      definition: 'An answer that pairs the mechanical concept with internal engine semantics, operational guardrails, performance boundaries, and scaling alternatives.',
      category: 'Evaluation'
    }
  ],
  sections: [
    {
      heading: '0.1 The Mindset Shift You Need Before Anything Else',
      subheading: 'Transitioning from Junior/Mid Definition Recitation to Senior Technical Authority',
      content: `At the 5–10 YOE band, interviewers do not test whether you know textbook definitions. They test three core competencies:

1. **Depth** — Can you explain what happens *internally* when your code runs? (e.g. storage partition layouts, buffer spill mechanics, shuffle boundaries, Catalyst DAG physical planning).
2. **Judgment** — Can you defend *why* you chose an approach over the alternatives? (e.g. Dynamic Tables vs Streams & Tasks; Salting vs AQE skew joins; Broadcast vs Sort-Merge joins).
3. **Failure Reasoning** — Can you describe what breaks first at 10× scale, and how you would detect, isolate, and fix it?

Every topic in this guide must be studied through these three lenses. If you can only recite a definition, you are not ready for that topic yet.

> **The 2-Minute Litmus Test:**
> "If the interviewer asks me *how* this works, *why* I'd use it, and *what fails* at 10× the data — can I answer all three in under two minutes without hand-waving?" If the answer is no, revisit that topic immediately.`,
      callouts: [
        {
          type: 'senior-line',
          title: 'Senior Mindset Standard',
          text: 'Never stop at what a command does. Immediately explain what physical partitions are created, what locks are acquired, and what fails when data volume increases tenfold.'
        }
      ]
    },
    {
      heading: '0.2 How to Study Each Section (The 5-Step Loop)',
      subheading: 'Deliberate Practice Framework for Technical Interviews',
      content: `Use this 5-step loop for every 🔴 MUST MASTER topic:

| Step | What to do | Time budget |
| :--- | :--- | :--- |
| **1. Read** | Read the section end-to-end once, without note-taking. | ~20% |
| **2. Rebuild** | Close the guide. Explain the topic out loud as if teaching a junior engineer. | ~15% |
| **3. Code** | Type (never copy-paste) the code examples. Break them intentionally, then fix them. | ~30% |
| **4. Interrogate** | Answer the interview + follow-up questions *out loud*. | ~25% |
| **5. Compress** | Write 5–10 high-density bullet points into your personal cheat sheet. | ~10% |

Skipping step 2 or 4 is the single most common reason strong engineers underperform in live technical interviews. **You must practice speaking the answer aloud**, not just reading silently in your mind.

- For 🟠 **INTERVIEW READY** topics: Use steps 1, 4, 5 only.
- For 🟡 **AWARENESS** topics: Use steps 1 and 5 only — do not sink deep study hours here.`,
      callouts: [
        {
          type: 'warning',
          title: 'The Silent Reading Trap',
          text: 'Reading without speaking aloud gives a false sense of fluency. In an interview room under stress, verbal retrieval breaks down unless you have vocalized the technical explanation beforehand.'
        }
      ]
    },
    {
      heading: '0.3 What to Learn Deeply vs. Memorize vs. Just Recognize',
      subheading: 'High-ROI Triage for Senior Data Engineering Preparation',
      content: `**Learn deeply (Must be able to derive and sketch on a whiteboard on the spot):**
- **Spark execution model:** Job → Stage → Task, shuffle exchange boundaries, narrow vs wide dependencies, DAG creation.
- **Delta Lake transaction log:** \`_delta_log/\` JSON commits, CRC checkpoints, MVCC, and MERGE isolation semantics.
- **Window functions & data modeling:** Top-N per group with \`QUALIFY\`, deduplication, and SCD2 merge patterns.
- **Incremental load:** Watermark progression, high-watermark delta queries, and end-to-end idempotency logic.
- **Partition pruning:** Snowflake micro-partitions (min/max metadata pushdown) AND Spark/Delta physical partitioning.
- **Diagnostics:** Root causes of data skew, OOM (driver vs executor), small-file problems, and remote spill.
- **ADF:** Metadata-driven parameterized pipeline design and control tables.

**Memorize (Interviewers expect instant, zero-hesitation recall):**
- Narrow vs wide transformations (3 concrete examples each).
- Broadcast join threshold default (\`10MB\` in Spark) and configuration parameter (\`spark.sql.autoBroadcastJoinThreshold\`).
- Essential Delta commands: \`OPTIMIZE\`, \`VACUUM\`, \`ZORDER BY\`, \`MERGE\`, \`RESTORE\`.
- Snowflake object hierarchy: \`Account → Database → Schema → Table / View / Warehouse / Stage\`.
- Core ADF activity types and execution rules: \`Lookup\`, \`Get Metadata\`, \`ForEach\`, \`Copy Data\`, \`Execute Pipeline\`.
- SCD Type 1 vs Type 2 mechanics and surrogate key handling.
- Bronze / Silver / Gold medallion responsibilities and SLA boundaries.

**Just recognize (Do not waste study hours here):**
- Adeptia and SnapLogic details beyond high-level B2B/EDI positioning.
- Exact syntax of obscure, rarely-used ADF JSON expressions.
- The hundreds of niche Spark internal configuration flags (focus strictly on the ~10 that impact production tuning).`
    },
    {
      heading: '0.4 How to Practice — The Non-Negotiables',
      subheading: 'Mandatory Hands-on Drills Before Stepping into the Interview',
      content: `You will not clear a senior DE loop by reading alone. Practice these queries and operations on real engines:

**SQL — Execute on a live engine (Snowflake trial or local PostgreSQL):**
1. Top-N-per-group using \`ROW_NUMBER()\` with \`QUALIFY\` (or subquery filter).
2. Deduplication keeping the latest record by audit timestamp.
3. Running totals and moving averages with frame specifications (\`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\`).
4. Gaps and islands (identifying consecutive active user streaks).
5. SCD2 historical dimensional update with \`MERGE\`.
6. Incremental watermarked load maintaining pipeline idempotency.

**PySpark — Run locally or on Databricks Community Edition:**
1. Read CSV/JSON/Parquet with an explicit \`StructType\` schema (never allow schema inference in production).
2. Window function on a DataFrame (\`Window.partitionBy().orderBy()\`) for deduplication.
3. Broadcast join and physical plan inspection using \`.explain(True)\`.
4. Nested JSON parsing with \`explode()\` and struct field extraction (\`col.field\`).
5. Structured Streaming from a file stream with explicit checkpoint directory.
6. Atomic \`MERGE\` into a Delta Lake table.

**Databricks:**
1. Spin up a notebook, attach to a single-node cluster, run an upsert with \`MERGE\`.
2. Create a Databricks Workflow Job with dynamic widget parameters and task graph dependencies.
3. Inspect version history using \`DESCRIBE HISTORY delta_table\` and perform Time Travel queries.`,
      callouts: [
        {
          type: 'gotcha',
          title: 'Hands-on Authenticity',
          text: 'Senior interviewers detect purely theoretical answers in seconds when candidates stumble on real runtime quirks, such as schema inference cost on thousands of JSON files or broadcast timeout exceptions.'
        }
      ]
    },
    {
      heading: '0.5 How to Answer Scenario Questions',
      subheading: 'The 6-Step Incident Response Structure',
      content: `Scenario questions (e.g. *"The Spark job that normally runs in 20 minutes suddenly ran for 3 hours and failed with an OOM error — how do you troubleshoot?"*) carry the highest evaluation weight in senior loops. Use this structured methodology:

\`\`\`
1. Clarify     — Ask 1–2 sharp, bounding questions to scope the failure.
2. Observe     — State the exact diagnostic telemetry you inspect first (Spark UI, Query Profile, Ganglia, logs).
3. Hypothesize — Articulate 2–3 prioritized root causes based on symptoms.
4. Isolate     — Describe how you confirm which hypothesis is true.
5. Fix         — Provide the immediate surgical code or configuration remediation.
6. Prevent     — Establish long-term guardrails (data quality checks, alerting, auto-tuning).
\`\`\`

**Senior Micro-Answer Blueprint (Delivered in ~45 seconds):**
> *"First, I would clarify whether data volume spiked or if the failure coincided with a schema change. Next, I'd check the Spark UI Stages tab to isolate whether execution time is concentrated in a single stage, and check the task duration distribution. My top two hypotheses would be data skew on the join key (where 99% of tasks finish in seconds and one straggler runs for hours) or an explosion of small files on the source path. If task input sizes confirm skew, I'd remediate immediately with salting or Spark 3 AQE skew join optimizations. To prevent recurrence, I would add a source data profile check and alert on stage duration variance."*`,
      decisionTrees: [
        `SCENARIO INCIDENT RESPONSE TREE
├── Step 1: CLARIFY (Scope boundaries, volume spikes, release regressions)
├── Step 2: OBSERVE (Metrics first: Spark UI / Snowflake Query Profile / CloudWatch)
│     ├── Time spent in Queue? → Concurrency / Warehouse resource bottleneck
│     ├── Time spent in Spill? → Memory pressure (Local SSD vs Remote Cloud Storage)
│     └── One task lagging behind 99 others? → Data Skew / Cardinality imbalance
├── Step 3: HYPOTHESIZE (Rank top 2-3 engineering root causes)
├── Step 4: ISOLATE (Check task-level byte metrics, key distribution, physical plan)
├── Step 5: FIX (Surgical code rewrite: Salting, Pruning, Broadcast, AQE)
└── Step 6: PREVENT (Alerting, Data Quality gates, automated resource monitors)`
      ]
    },
    {
      heading: '0.6 How to Handle "I Don\'t Know" Questions',
      subheading: 'Demonstrating Senior Intellectual Honesty & First-Principles Reasoning',
      content: `Never attempt to bluff or fabricate answers. Senior interview panels give zero credit for bluffing and high marks for disciplined first-principles reasoning.

**Use this 4-step template:**
1. **Anchor** to the closest foundational technology you know deeply.
2. **Reason** from first principles about what the engineering trade-offs must be.
3. **State the boundary** — transparently declare what you have not used in production.
4. **Offer** how you would verify and validate in an enterprise environment.

**Example Answer (e.g. When asked about an unfamiliar enterprise tool like Adeptia):**
> *"I haven't deployed Adeptia in my production pipelines. Based on its enterprise positioning, it appears to be a specialized B2B EDI and partner integration platform—similar in intent to Azure Logic Apps or SnapLogic, but optimized for partner onboarding and EDI X12 message schemas. If I needed to evaluate or onboard it, I'd start by inspecting its state management, transactional error handling, and whether it supports CI/CD version control, comparing it against the metadata-driven ADF patterns I already own."*`
    },
    {
      heading: '0.7 How to Explain Your Existing Experience (Flagship Story Formula)',
      subheading: 'Structuring Your High-Impact Production Pipeline Narrative',
      content: `When the interviewer asks *"Walk me through an end-to-end pipeline you built"*, structure your story using these precise slots:

| Slot | What to deliver |
| :--- | :--- |
| **Context** | Business domain, data volume (e.g. 50M records/day, 4TB table), user personas, freshness SLA. |
| **Problem** | The concrete business or performance bottleneck (e.g. 45-minute batch window exceeding SLA). |
| **Architecture** | Ingestion source → Landing/Raw → Cleansing/Silver → Aggregation/Gold → Consumption. |
| **Your Role** | What *you personally* designed, coded, optimized, and owned. |
| **Key Decisions** | 2–3 non-obvious choices, explicitly defending the alternatives you rejected. |
| **Scale** | Exact numbers: rows/day, compressed storage size, warehouse sizes, credit/compute cost. |
| **Failure Handling** | Idempotency guarantees, retry logic, dead-letter queues, alerting. |
| **Outcome** | Measurable impact: *e.g. "Reduced pipeline runtime from 48 minutes to 9 minutes while lowering compute credits by 34%."* |

**Key Tactical Rules:**
- **Numbers build credibility:** Concrete figures (*"45 min down to 9 min"*, *"12,000 micro-partitions pruned to 48"*) distinguish genuine practitioners from theoretical candidates.
- **Own decisions, not just tasks:** *"I chose Dynamic Tables with ADAPTIVE refresh over custom Streams+Tasks because declarative freshness eliminated task chaining race conditions."*
- **Prepare for pushback:** When asked *"Why didn't you use Spark instead of Snowflake for that transformation?"*, be ready with cost, data locality, and governance counter-arguments.
- Have both a **60-second elevator summary** and an **expanded 3–4 minute deep dive** prepared.`
    },
    {
      heading: '0.8 What "Senior-Level" Actually Sounds Like',
      subheading: 'Comparing Basic vs Strong vs Senior Technical Articulation',
      content: `For every concept in this guide, there are three distinct answer tiers. Only the Senior tier wins an interview loop at the 5–10 YOE level:

| Tier | Example Response (\`MERGE\` in Data Engineering) | Verdict |
| :--- | :--- | :--- |
| **Basic** | *"MERGE upserts data into a target table."* | Junior ❌ |
| **Strong** | *"MERGE handles insert, update, and delete in one atomic statement against a target table based on a source, commonly used for SCD1 loads."* | Mid ⚠️ |
| **Senior** | *"I use \`MERGE\` for idempotent upserts. The source dataset must be strictly deduplicated on the join key first; otherwise, Delta Lake and Snowflake throw a non-deterministic match runtime error. I align the target table's clustering or partitioning with the join key so the optimizer prunes irrelevant files during the scan. For high-churn dimensions, I evaluate whether a partition-overwrite pattern is more cost-effective when change sets exceed 30% of target partition volume."* | **Senior ✅** |

Notice that the senior answer articulates:
1. Operational prerequisites (source deduplication).
2. Failure conditions (non-deterministic match error).
3. Physical engine mechanics (partition pruning on the target scan).
4. Concrete performance trade-offs (MERGE vs partition overwrite at high change ratios).`
    },
    {
      heading: '0.9 Red Flags to Eliminate From Your Answers',
      subheading: 'Phrases and Habits That Instantly Signal Inexperience',
      content: `Senior interviewers immediately penalize candidates who use these phrases without qualification:

- ❌ *"I'd just use \`.collect()\` to inspect the data"* → Signals zero distributed computing awareness; collects millions of rows into driver RAM and triggers driver OOM.
- ❌ *"I always cache every DataFrame"* → Signals disregard for memory footprints and garbage collection overhead; unneeded caching evicts active shuffle memory.
- ❌ *"I use Python UDFs for everything"* → Signals ignorance of the Catalyst optimizer; Python UDFs force row-by-row serialization across JVM-Python IPC boundaries.
- ❌ *"Partitioning always makes queries faster"* → Demonstrates lack of understanding regarding partition cardinality; creating too many small partitions degrades metadata performance.
- ❌ *"I run \`.count()\` after every transformation to check progress"* → Signals lack of awareness that \`.count()\` is an eager action requiring a full scan.
- ❌ *"If it's slow, just increase the cluster/warehouse size"* → Demonstrates lack of root-cause diagnostic discipline; doubling compute for an exploding Cartesian join or unpruned full scan merely burns budget without fixing the architectural defect.`
    },
    {
      heading: '0.10 How to Use This Guide Over the Next 7 Days',
      subheading: 'High-Impact Preparation Sprint Schedule',
      content: `The 7-day preparation roadmap is structured to maximize retention and interview leverage:

\`\`\`
Day 1 → Snowflake Architecture & Performance (Leverage existing strengths: micro-partitions, pruning, Query Profile)
Day 2 → Advanced SQL & PySpark Fluency (Window functions, deduplication,StructType, DataFrame transforms)
Day 3 → Spark Internals & Performance Tuning (Highest interview leverage: Shuffle, Skew salting, OOM, AQE)
Day 4 → Databricks & Delta Lake (The lakehouse platform layer: Transaction log, MERGE, OPTIMIZE, Z-ORDER, Unity Catalog)
Day 5 → ADF, ADLS, Incremental Loading & CDC (The enterprise pipeline core: Metadata-driven orchestration, watermarks)
Day 6 → Big Data Architecture & End-to-End System Design (Medallion architectures, high-throughput ingestion, DR)
Day 7 → Live Mock Interviews, Flashcard Drills, & Flagship Story Polish
\`\`\`

**Highest ROI Target for Your Profile:**
Because your background is strong in Snowflake and core workflows, your single highest-leverage sections are **Section 6 (Spark Tuning)** and **Section 12 (Metadata-Driven ADF Pipelines)**, which is where senior interview panels separate senior leaders from mid-level practitioners.`,
      callouts: [
        {
          type: 'interview-line',
          title: 'Strategic Ground Rule',
          text: 'Master Snowflake, Spark internals, and metadata-driven orchestration to Senior tier first. That tri-platform mastery positions you above 95% of candidates in the 5–10 YOE bracket.'
        }
      ]
    }
  ]
};
