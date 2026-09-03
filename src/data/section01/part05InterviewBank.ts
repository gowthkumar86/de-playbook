import { InterviewQuestion } from '../../types';

export const SNOWFLAKE_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'sf-q1',
    number: 1,
    topic: 'Architecture',
    subtopic: '3 Decoupled Layers',
    question: "Explain Snowflake's architecture.",
    answers: {
      basic: "Three layers: storage, compute, cloud services.",
      strong: "Three physically decoupled layers. Storage is immutable columnar micro-partitions on cloud object storage. Compute is one or more virtual warehouses that don't share resources. Cloud Services owns metadata, optimization, and the result cache.",
      senior: "Three layers, but broader than the 2018 mental model. Storage is FDN native + Iceberg (managed or externally-managed via Open Catalog) + Hybrid Tables + external. Compute is standard warehouses + Snowpark-optimized + SPCS compute pools (CPU / high-mem / GPU) + serverless services. Cloud Services now includes Horizon governance and Cortex AI on top of auth, metadata, optimization, and result caching. Decoupling gives you elastic scaling, workload isolation, and — because storage is immutable and metadata-versioned — Time Travel and zero-copy cloning as consequences of the storage design, not features bolted on.",
      interviewerIntent: "Testing whether you understand why Snowflake scales elastically, and whether your mental model reflects 2026 platform additions (Iceberg, SPCS, Horizon, Cortex) or is stuck in 2018.",
      followUps: [
        "What happens when a query executes—which layer does what?",
        "Why can readers never block writers under this architecture?"
      ],
      seniorKeyTakeaways: [
        "Name all storage variants: Native FDN, Apache Iceberg, and Hybrid Tables.",
        "Emphasize that Time Travel and Cloning fall out of immutable versioned storage."
      ]
    }
  },
  {
    id: 'sf-q2',
    number: 2,
    topic: 'Architecture',
    subtopic: 'Micro-partitions & Pruning',
    question: "What are micro-partitions and how does pruning work?",
    answers: {
      basic: "Immutable columnar files. Snowflake uses their min/max metadata to skip files that don't match a query.",
      strong: "Micro-partitions are automatically-created, ~50–500 MB uncompressed, immutable columnar files. Snowflake tracks per-column min/max, null count, and distinct count in its metadata store. At plan time, the optimizer eliminates partitions whose ranges don't overlap the WHERE clause.",
      senior: "Pruning quality depends on how well data is physically ordered on the filter column. High-cardinality columns whose values are scattered across every partition give overlapping min/max ranges, so pruning does nothing even though the predicate looks selective. That's why clustering exists — the automatic clustering service incrementally reorders micro-partitions to tighten those ranges. And pruning is often defeated by function wrapping — WHERE DATE(order_ts) = ... can prevent the optimizer from matching the expression against raw min/max. Fix by keeping the column bare on one side.",
      interviewerIntent: "Evaluating if you understand physical storage layouts and why syntactically valid WHERE clauses often trigger costly full table scans.",
      followUps: [
        "How do you verify pruning quality in Query Profile?",
        "What is the difference between natural ingestion clustering and defining a clustering key?"
      ],
      seniorKeyTakeaways: [
        "Pruning happens at plan time in Cloud Services before compute touches storage.",
        "Function-wrapped columns (DATE(ts), CAST(id)) prevent sargable range evaluation."
      ]
    }
  },
  {
    id: 'sf-q3',
    number: 3,
    topic: 'Architecture',
    subtopic: 'Caching Mechanics',
    question: "What are the three \"caches\" in Snowflake?",
    answers: {
      basic: "Result cache, warehouse cache, metadata cache.",
      strong: "Persisted result cache in Cloud Services — global, 24-hour default, keyed by exact query text + data version + role context. Warehouse local cache — per warehouse's SSD, holds recently-read micro-partitions, cleared on suspend. Metadata / statistics — always available, enables pruning and metadata-only queries like COUNT(*) on native tables.",
      senior: "They're three different mechanisms at three layers, and interviewers often trip candidates who use 'Snowflake cached it' without naming which one. Result cache reuses entire past query outputs — zero compute cost. Local cache reduces repeat remote reads — reduces I/O, not compute. Metadata drives pruning at plan time so we never scan bytes we don't need. Result cache is invalidated by data changes, role changes, or session-context changes; local cache disappears when the warehouse suspends; metadata is always available. On a repeated dashboard query I'd expect the result cache to hit unless the underlying data changed.",
      interviewerIntent: "Catching candidates who casually say 'Snowflake cached it' without naming the physical layer, invalidation condition, or cost consequence.",
      followUps: [
        "What happens to the local warehouse cache when AUTO_SUSPEND fires?",
        "Can a query hit the result cache if the role changes from ANALYST to ADMIN?"
      ],
      seniorKeyTakeaways: [
        "Result Cache = 0 compute credits (warehouse does not resume).",
        "Warehouse Local Cache = local NVMe SSD, cleared on auto-suspend."
      ]
    }
  },
  {
    id: 'sf-q4',
    number: 4,
    topic: 'Architecture',
    subtopic: 'Apache Iceberg & Open Catalog',
    question: "What's Iceberg's significance in Snowflake?",
    answers: {
      basic: "Open table format that Snowflake can read and write.",
      strong: "Open Apache Iceberg tables stored in customer cloud storage. Snowflake supports two modes: Snowflake-managed (Snowflake owns catalog + lifecycle, files live in your storage via external volume) and externally-managed (another catalog like Open Catalog / Glue / Unity owns the table).",
      senior: "It ends the historical lock-in argument. In 2024–2026 Snowflake pushed Iceberg + Open Catalog (which is the managed service based on Apache Polaris, open-sourced 2024). Now the same bytes can be read by Snowflake, Spark, Trino, and Flink through a REST catalog interface. Architecturally, if my data platform is heterogeneous, I use externally-managed Iceberg with Open Catalog; if Snowflake is primary but I want engines like Databricks to read without egress, I use Snowflake-managed Iceberg on my external volume. Governance stays with Horizon regardless.",
      interviewerIntent: "Testing whether you understand modern open lakehouse patterns and the role of Apache Polaris in multi-engine enterprise architectures.",
      followUps: [
        "What is an External Volume in Snowflake Iceberg tables?",
        "How does Horizon governance apply to Iceberg tables?"
      ],
      seniorKeyTakeaways: [
        "Distinguish Snowflake-managed vs Externally-managed Iceberg.",
        "Highlight Apache Polaris as the vendor-neutral Iceberg REST catalog."
      ]
    }
  },
  {
    id: 'sf-q5',
    number: 5,
    topic: 'Architecture',
    subtopic: 'Snowflake vs Databricks',
    question: "Snowflake vs Databricks — 2026 architecture comparison.",
    answers: {
      basic: "Snowflake for BI, Databricks for ETL.",
      strong: "Both are lakehouse platforms with similar capabilities. Snowflake is stronger on managed SQL and governance; Databricks is stronger on PySpark and data science. Both support open Iceberg + open catalogs (Open Catalog / Unity OSS).",
      senior: "In 2026 they've converged on the same pattern — open table format (Iceberg / Delta), open catalog (Open Catalog / Unity OSS), AI runtime on top (Cortex / Mosaic AI). The choice is operational, not capability-driven. Snowflake for governed, low-ops SQL with hybrid OLTP+OLAP through Hybrid Tables. Databricks for heavy PySpark, data science, and customizable compute. A common hybrid pattern is Databricks for transformation and Snowflake for serving, joined via shared Iceberg storage. I'd avoid absolutes like 'Snowflake is BI, Databricks is ETL' — that stopped being true around 2023.",
      interviewerIntent: "Probing for nuanced, mature systems evaluation rather than fanatical or outdated platform bias.",
      followUps: [
        "In a company running both, where would you draw the boundary?",
        "How do you share data between Databricks and Snowflake without duplication?"
      ],
      seniorKeyTakeaways: [
        "Convergence: Both offer open table formats, open catalogs, and AI runtimes.",
        "Distinction: Operational simplicity & governed SQL vs deep distributed compute flexibility."
      ]
    }
  },
  {
    id: 'sf-q6',
    number: 6,
    topic: 'Data Engineering',
    subtopic: 'Batch Ingestion Idempotency',
    question: "How does COPY INTO prevent duplicate loads?",
    answers: {
      basic: "It remembers which files it loaded.",
      strong: "Snowflake maintains per-table file load history for ~64 days. Re-running COPY INTO against files already recorded as loaded is a no-op — the load is idempotent by default.",
      senior: "Idempotency is why my scheduled pipelines can retry safely. The load-history window is ~64 days per table + file path. If a file gets renamed, Snowflake treats it as new. I never use FORCE = TRUE in production because it defeats that guarantee, and I don't confuse the 64-day load-history window with the retention period of the COPY_HISTORY monitoring view — they're different things. For monitoring I query INFORMATION_SCHEMA.COPY_HISTORY or ACCOUNT_USAGE; for correctness I rely on the load metadata.",
      interviewerIntent: "Assessing your understanding of pipeline failure recovery, retry idempotency, and the catastrophic risk of FORCE = TRUE.",
      followUps: [
        "What happens if a source file is modified and re-uploaded with the same name?",
        "How does Snowflake calculate the file identity in load history?"
      ],
      seniorKeyTakeaways: [
        "64-day load history tracks [Table + File URI + MD5/Size].",
        "Never use FORCE = TRUE in automated scheduled production pipelines."
      ]
    }
  },
  {
    id: 'sf-q7',
    number: 7,
    topic: 'Data Engineering',
    subtopic: 'Continuous Ingestion',
    question: "When to use Snowpipe vs Snowpipe Streaming?",
    answers: {
      basic: "Snowpipe for files, Snowpipe Streaming for rows.",
      strong: "Snowpipe watches a stage and auto-runs COPY INTO on file arrival — ~1 minute latency, serverless. Snowpipe Streaming pushes rows directly through an SDK or Kafka Connector — sub-10-second latency, no files.",
      senior: "The mental leap is that Streaming has no stages and no files — it's a real streaming protocol with channels and offset tokens for exactly-once semantics. For batch or micro-batch file arrivals from an ADF pipeline or S3 export, Snowpipe with auto-ingest via cloud events is the right choice. For Kafka, CDC connectors, or any row-level source where buffering into files adds unacceptable latency, I use Snowpipe Streaming through the Kafka Connector. Note the pricing model changed in December 2025 — Snowpipe is now per-GB, not per-1000-files, so the old 'batch small files to save cost' argument is now about operational efficiency (metadata, downstream query shape), not per-file charges.",
      interviewerIntent: "Checking whether you know modern ingestion protocols and whether your knowledge is current with the December 2025 per-GB pricing model.",
      followUps: [
        "How does Snowpipe Streaming enforce exactly-once delivery?",
        "What is an offset token in Snowpipe Streaming channels?"
      ],
      seniorKeyTakeaways: [
        "Snowpipe = file-based, cloud event SQS triggered, ~1 min latency, per-GB pricing (Dec 2025).",
        "Snowpipe Streaming = row-based SDK/Kafka, no files, sub-10s latency, offset token dedup."
      ]
    }
  },
  {
    id: 'sf-q8',
    number: 8,
    topic: 'Data Engineering',
    subtopic: 'CDC Streams',
    question: "What is a stream and what's the offset gotcha?",
    answers: {
      basic: "A stream tracks changes on a table.",
      strong: "A stream is a change cursor on a source. It doesn't store changes — it points into the source's change history. It has three types: standard, append-only, insert-only. The metadata columns are METADATA$ACTION, METADATA$ISUPDATE, and METADATA$ROW_ID. An UPDATE appears as a DELETE + INSERT pair, both flagged ISUPDATE = TRUE.",
      senior: "The offset advances only when the stream is consumed inside a DML statement — a plain SELECT * FROM stream shows the changes but does not advance the offset. So the pattern is to consume the stream inside a MERGE that writes to the target — if the MERGE rolls back, the offset stays put and no changes are lost. Streams also extend the source table's effective retention window, so an unmonitored stream on a churny table can silently grow Time Travel / Fail-safe storage cost. And a stream that isn't consumed for longer than the source's retention window goes stale and must be recreated — the missed changes can't be recovered from a stale stream.",
      interviewerIntent: "Validating whether you have production experience writing robust CDC pipelines and know how offsets advance and fail.",
      followUps: [
        "What happens if an unconsumed stream sits on a table with DATA_RETENTION_TIME_IN_DAYS = 1?",
        "Why are updates represented as two rows in standard streams?"
      ],
      seniorKeyTakeaways: [
        "Offset advances strictly during successful DML execution (INSERT/UPDATE/DELETE/MERGE).",
        "Streams extend source retention and go stale if unconsumed past the retention window."
      ]
    }
  },
  {
    id: 'sf-q9',
    number: 9,
    topic: 'Data Engineering',
    subtopic: 'Dynamic Tables vs Streams+Tasks',
    question: "Dynamic Tables vs Streams + Tasks — how do you choose?",
    answers: {
      basic: "Dynamic Tables are the new way; Streams + Tasks are the old way.",
      strong: "Dynamic Tables are declarative — you write one SELECT plus a TARGET_LAG, and Snowflake handles scheduling and dependency-aware refresh. Streams + Tasks are procedural — you write the MERGE and schedule the task yourself.",
      senior: "In 2026 my default for a new incremental transformation is a Dynamic Table. I write a SELECT, set a TARGET_LAG — remembering it's a freshness target, not a cron interval, minimum 60 seconds — and pick a refresh mode. ADAPTIVE (GA July 2026) is my default because it uses incremental refresh but can reinitialize when a full rebuild is cheaper. For chained pipelines I put TARGET_LAG = DOWNSTREAM on intermediate DTs and the real target on the leaf so upstream refreshes only when needed. I fall back to Streams + Tasks + MERGE when I need procedural control — custom MERGE conditions, side effects like calling stored procs, or refresh logic that Dynamic Tables can't express. And I'd never say Dynamic Tables 'replaced' Streams + Tasks — they coexist.",
      interviewerIntent: "Testing architectural maturity: Can you balance declarative ease against procedural custom control?",
      followUps: [
        "What does TARGET_LAG = DOWNSTREAM do on an intermediate Dynamic Table?",
        "When does ADAPTIVE refresh mode decide to perform a full recompute instead of incremental?"
      ],
      seniorKeyTakeaways: [
        "Default to Dynamic Tables with ADAPTIVE refresh mode in 2026.",
        "Streams + Tasks remain essential for procedural side effects and custom MERGE logic."
      ]
    }
  },
  {
    id: 'sf-q10',
    number: 10,
    topic: 'Data Engineering',
    subtopic: 'Time Travel vs Fail-safe',
    question: "What's Time Travel and how is it different from Fail-safe?",
    answers: {
      basic: "Time Travel lets you query the past; Fail-safe is a longer backup.",
      strong: "Time Travel is user-accessible historical querying — AT / BEFORE clauses using OFFSET, TIMESTAMP, or STATEMENT. Retention is 0–1 day on Standard edition, 0–90 days on Enterprise+. Fail-safe adds 7 more days but is only recoverable by Snowflake Support and applies to permanent tables only.",
      senior: "Time Travel falls out of the storage design — because writes produce new immutable micro-partitions, Snowflake can always answer 'show me the active partition set from N minutes ago.' It's a querying feature, not an audit log — if the interviewer asks 'who changed row X,' the answer is ACCESS_HISTORY or a purpose-built history table, not Time Travel. Fail-safe is a Snowflake-managed disaster recovery window that starts after Time Travel expires; it costs storage but isn't user-queryable. And transient/temporary tables have no Fail-safe — cheaper storage, but no last-resort recovery. I set DATA_RETENTION_TIME_IN_DAYS deliberately per object based on how much recovery I actually need.",
      interviewerIntent: "Evaluating understanding of data recovery mechanisms, compliance boundaries, and storage cost implications.",
      followUps: [
        "How do you recover a table dropped 3 hours ago?",
        "Why do Transient tables save money in staging environments?"
      ],
      seniorKeyTakeaways: [
        "Time Travel = SQL queryable by users (0–90 days).",
        "Fail-safe = 7 days, permanent tables only, recoverable exclusively by Snowflake Support."
      ]
    }
  },
  {
    id: 'sf-q11',
    number: 11,
    topic: 'Data Engineering',
    subtopic: 'Zero-Copy Cloning',
    question: "What is zero-copy cloning and what are its caveats?",
    answers: {
      basic: "A copy that doesn't actually copy the data.",
      strong: "A CLONE creates a new object sharing underlying storage with the source. No bytes copied at creation. Storage grows only as the clone or source diverges.",
      senior: "It's a metadata operation on immutable versioned storage. The clone gets its own metadata but points at the same micro-partitions as the source. That's why cloning a 100 TB database completes in seconds. Storage cost begins to grow when either side changes — the changed side writes new partitions. In production I use cloning for dev environments from prod (fast + free at creation), safety snapshots before risky MERGEs (rollback point), and point-in-time debugging (CLONE ... BEFORE (STATEMENT => ...)). I always drop unused dev clones because divergence quietly accumulates storage. Two important gotchas: clones don't inherit stream offsets by default — the cloned stream starts fresh — and grants aren't copied unless you specify COPY GRANTS.",
      interviewerIntent: "Checking if you know the physical mechanics of cloning, practical production use cases, and silent storage leak traps.",
      followUps: [
        "What happens to stream offsets when a database is cloned?",
        "Why must you specify COPY GRANTS when cloning for dev testing?"
      ],
      seniorKeyTakeaways: [
        "Cloning is instant and free at creation; storage costs grow with data divergence.",
        "Streams on cloned tables reset offsets; permissions require COPY GRANTS."
      ]
    }
  },
  {
    id: 'sf-q12',
    number: 12,
    topic: 'Performance & Cost',
    subtopic: 'Query Profile Diagnostics',
    question: "How do you troubleshoot a slow Snowflake query?",
    answers: {
      basic: "Open Query Profile and see what's slow.",
      strong: "Open Query Profile. Check whether time is in queueing or execution. If execution, look at the pruning ratio on the biggest TableScan, whether any operator has spill, and whether any join is exploding rows out. Fix at the correct layer.",
      senior: "I answer five questions in this order: Where's the time going — one operator usually dominates? Is the query queueing, meaning it's a concurrency problem, not a query problem? What's the pruning ratio on the biggest scan? Is there local or remote spill anywhere — remote spill is a red flag that means SSD is exhausted and I need to size up urgently or rewrite? Are rows exploding at any join, which usually means duplicate keys or a bad predicate? Only after that would I consider resizing the warehouse. The single biggest anti-pattern I see mid-level engineers do is to jump straight to 'make the warehouse bigger' when the actual bug is a non-sargable predicate or a missing join key.",
      interviewerIntent: "Testing whether you possess a structured diagnostic methodology or guess randomly and resize warehouses.",
      followUps: [
        "What is the difference between Local Storage Spill and Remote Storage Spill?",
        "What does it mean when a Join node outputs 10x the rows of its probe side?"
      ],
      seniorKeyTakeaways: [
        "Follow the 5-step diagnostic order: Dominant Node → Queue → Pruning Ratio → Spill → Join Explosion.",
        "Remote spill is an emergency signal of memory exhaustion."
      ]
    }
  },
  {
    id: 'sf-q13',
    number: 13,
    topic: 'Performance & Cost',
    subtopic: 'Warehouse Sizing & Scaling',
    question: "Size up vs multi-cluster — how do you choose?",
    answers: {
      basic: "Size up for slow, multi-cluster for busy.",
      strong: "Size up when a single query is slow — compute or memory bound. Multi-cluster when many queries are queueing at once. Different bottlenecks, don't conflate them.",
      senior: "Size up empirically — run on XS, double to S, keep doubling until runtime no longer halves. Stop one size before diminishing returns because credits per hour double with size, so anything less than 2× speedup makes cost-per-query worse. Multi-cluster is for concurrency, and I pick a scaling policy based on latency needs — STANDARD adds a cluster the moment a query queues (BI/interactive), ECONOMY waits (batch workloads). Auto-suspend I set short (30–60 s) on ETL warehouses because cold cache doesn't matter for scheduled jobs, and longer (5–15 min) on BI because losing cache warmth every time a human clicks around hurts UX. And I isolate workloads on separate warehouses — ETL / BI / ad-hoc — so noisy neighbors can't queue each other.",
      interviewerIntent: "Evaluating cost-performance judgment and architectural separation of concerns.",
      followUps: [
        "Why is auto-suspend set longer on BI warehouses than on ETL warehouses?",
        "What is the difference between STANDARD and ECONOMY multi-cluster scaling policies?"
      ],
      seniorKeyTakeaways: [
        "Size up for single query execution latency; scale out for concurrent query queueing.",
        "Set short auto-suspend (60s) for batch ETL; set longer (5-10m) for BI cache warmth."
      ]
    }
  },
  {
    id: 'sf-q14',
    number: 14,
    topic: 'Performance & Cost',
    subtopic: 'Cost Governance & FinOps',
    question: "How would you cap and govern Snowflake cost?",
    answers: {
      basic: "Use resource monitors and auto-suspend.",
      strong: "Resource monitors per warehouse — NOTIFY at 75/90, SUSPEND at 100. Auto-suspend short on ETL, longer on BI. Right-size empirically. Prefer transient tables for staging. Weekly review of ACCOUNT_USAGE.",
      senior: "I attack in five layers. Warehouse compute is the biggest lever — right-size, auto-suspend, multi-cluster only for concurrency, and a resource monitor on every non-trivial warehouse. Serverless services are the silent killer — Automatic Clustering, MV refresh, SOS, QAS, Snowpipe, Dynamic Table refresh are all per-second billed and easy to leave on; I audit them weekly against measured value. Storage discipline: transient for staging, tight DATA_RETENTION_TIME_IN_DAYS, drop dev clones, watch TABLE_STORAGE_METRICS for churny tables with big Fail-safe. Cortex: batch calls, cache deterministic outputs, use appropriate model sizes. Egress: colocate compute and data, use Data Sharing or replication for cross-region rather than ad-hoc COPY INTO. And I watch the Cloud Services 10% ratio — if my daily Cloud Services credits exceed 10% of warehouse credits, I have metadata churn to hunt down.",
      interviewerIntent: "Testing enterprise FinOps discipline: Can you protect the company from runaway cloud invoices across compute, storage, and serverless?",
      followUps: [
        "Explain the Cloud Services 10% adjustment rule.",
        "What causes storage costs to explode on staging tables?"
      ],
      seniorKeyTakeaways: [
        "Enforce Resource Monitors with NOTIFY (75/90%) and SUSPEND (100%).",
        "Audit serverless consumption weekly; eliminate Fail-safe on staging with Transient tables."
      ]
    }
  },
  {
    id: 'sf-q15',
    number: 15,
    topic: 'Security & Governance',
    subtopic: 'PII Protection & Tag-Based Masking',
    question: "How do you protect PII in Snowflake?",
    answers: {
      basic: "Use masking policies.",
      strong: "Tag PII columns and bind masking policies to the tags. Different roles see different masked values based on CURRENT_ROLE(). Combine with row-access policies to restrict which rows a role sees.",
      senior: "I design the schema with tags first. I create a pii tag and bind a masking policy to it — masking policies use CURRENT_ROLE() to decide whether to return the raw value, a partial mask (a***@gmail.com), or a full mask. Every PII column across every table gets the tag. When a new column is added, tagging it is enough — the policy is inherited automatically. Row-access is a separate concern — it filters which rows a role can see, based on a SQL expression evaluated per row per role. All of this is Horizon-managed so lineage, classification, and access history are unified. And I keep policies attached to tags, not individual columns, because policy-on-tag survives schema refactors that policy-on-column doesn't.",
      interviewerIntent: "Checking if you understand enterprise data governance scalability and tag-based policy inheritance.",
      followUps: [
        "What is the difference between a Dynamic Masking Policy and a Row-Access Policy?",
        "What happens when a new table column is created with a PII tag attached?"
      ],
      seniorKeyTakeaways: [
        "Attach masking policies to Horizon Tags, not individual columns.",
        "Combine row-access (row filtering) and masking policies (column value transformation)."
      ]
    }
  },
  {
    id: 'sf-q16',
    number: 16,
    topic: 'Security & Governance',
    subtopic: 'Horizon vs Open Catalog',
    question: "What's the difference between Horizon Catalog and Open Catalog?",
    answers: {
      basic: "They're both catalogs.",
      strong: "Horizon Catalog is Snowflake's governance surface — tags, masking, lineage, quality, access history. Open Catalog is Snowflake's managed Iceberg REST catalog, built on Apache Polaris. Different jobs.",
      senior: "This is a common conflation. Horizon is the governance umbrella — it covers tags, policies, lineage, data quality monitors, classification, access history, Trust Center. Open Catalog is the managed Iceberg REST catalog based on Apache Polaris — its job is multi-engine catalog interop so Snowflake, Spark, Trino, and Flink can share the same Iceberg tables. They complement each other: Open Catalog handles what the tables are and where they live; Horizon governs who sees what and how. And note that Polaris itself was open-sourced by Snowflake in 2024 and donated to the Apache Software Foundation — the OSS project is Apache Polaris, and Snowflake's managed version is Open Catalog.",
      interviewerIntent: "Assessing platform currency: Do you understand the distinction between internal governance and open lakehouse catalog interoperability?",
      followUps: [
        "Can Horizon governance policies apply to Iceberg tables in Open Catalog?",
        "Why did Snowflake donate Polaris to the Apache Software Foundation?"
      ],
      seniorKeyTakeaways: [
        "Horizon = Centralized governance plane (tags, masking, lineage, quality).",
        "Open Catalog (Apache Polaris) = Vendor-neutral Iceberg REST catalog for multi-engine access."
      ]
    }
  },
  {
    id: 'sf-q17',
    number: 17,
    topic: 'Security & Governance',
    subtopic: 'Cortex AI & Cortex Agents',
    question: "What is Cortex Agents and how has Cortex evolved in 2026?",
    answers: {
      basic: "Cortex is Snowflake's AI. Agents are a newer feature.",
      strong: "Cortex started as LLM SQL functions like COMPLETE, SUMMARIZE, embeddings. Then came Cortex Search (hybrid retrieval), Cortex Analyst (text-to-SQL over a semantic model), and Cortex Agents (multi-step reasoning with tool use).",
      senior: "In 2026 Snowflake is steering new agentic experiences toward Cortex Agents. Agents orchestrate multi-step reasoning, call Cortex Analyst as a structured-data tool, call Cortex Search for retrieval, and maintain conversational context. Standalone Analyst still exists as a callable interface, but new applications should target Agents. Architecturally, Cortex functions run on managed GPU pools that live in the compute layer; the orchestration and semantic-model context live in Cloud Services. From a cost perspective, Cortex calls are per token / per call, generally not result-cached, so I batch calls and cache deterministic outputs at the application layer. From a governance perspective, Horizon lineage tracks Cortex usage the same way it tracks any other SQL.",
      interviewerIntent: "Evaluating whether you know how generative AI is operationalized securely inside the data warehouse boundary.",
      followUps: [
        "How does Cortex Analyst generate verified SQL without hallucinating schema names?",
        "Where do LLM GPU compute pools execute in the 3-layer architecture?"
      ],
      seniorKeyTakeaways: [
        "Cortex Agents = 2026 standard orchestrating Cortex Analyst (SQL) and Cortex Search (hybrid RAG).",
        "Operates within Snowflake's governance and RBAC boundary; billed per token/call."
      ]
    }
  },
  {
    id: 'sf-q18',
    number: 18,
    topic: 'Disaster Recovery',
    subtopic: 'Failover Groups & Client Redirect',
    question: "How do you do multi-region Disaster Recovery in Snowflake?",
    answers: {
      basic: "Replicate the databases.",
      strong: "Database replication + failover groups + client redirect. A failover group bundles databases plus supporting objects (users, roles, warehouses); replication runs to a target account; client redirect updates DNS on failover.",
      senior: "The DR story is architecturally a metadata operation on immutable versioned storage. I bundle everything a workload depends on into a failover group — the databases plus users, roles, warehouses, resource monitors. Replication is scheduled (e.g., every 10 minutes) to a target account, which can be in a different region or a different cloud. Cross-cloud replication has egress cost, which I plan for. On failover, ALTER FAILOVER GROUP fg PRIMARY on the DR account promotes it, and Client Redirect flips the DNS so applications don't need endpoint changes. Data Sharing is separate — it's for live governed zero-copy sharing, not for DR. And I test failover regularly, not just document it.",
      interviewerIntent: "Validating whether you can architect mission-critical business continuity and multi-cloud resilience.",
      followUps: [
        "What is the function of Client Redirect during regional failover?",
        "Why is Data Sharing NOT a disaster recovery mechanism?"
      ],
      seniorKeyTakeaways: [
        "Failover Groups bundle databases, users, roles, warehouses, and resource monitors.",
        "Client Redirect repoints global DNS endpoints seamlessly without client application changes."
      ]
    }
  },
  {
    id: 'sf-q19',
    number: 19,
    topic: 'Architecture Scenarios',
    subtopic: 'Flagship Pipeline Walkthrough',
    question: "Walk me through an end-to-end Snowflake pipeline you built.",
    answers: {
      basic: "I loaded CSV files from S3 using Snowpipe into a staging table, transformed them with SQL, and loaded them into reporting tables.",
      strong: "I built an ingestion pipeline processing 20M orders daily from S3 using Snowpipe into a raw table. A stream tracked incremental changes, and a scheduled task ran a MERGE into a silver table every 10 minutes. Gold aggregations refreshed every hour.",
      senior: "At my previous engagement, I designed and owned an incremental e-commerce data pipeline handling 45 million events daily with a 15-minute freshness SLA. Raw events landed in S3 and ingested via Snowpipe using an IAM Storage Integration. On the raw table, I placed an Append-Only Stream to capture new arrivals. Every 5 minutes, a Task executed an atomic MERGE into a clustered Silver table using WHEN SYSTEM$STREAM_HAS_DATA to avoid compute costs during idle periods. For Gold executive reporting, I migrated legacy cron tasks to chained Dynamic Tables with ADAPTIVE refresh mode and TARGET_LAG = DOWNSTREAM on intermediate rollups, driving a 5-minute leaf SLA. When our daily batch window was stalling due to local SSD spill on an exploding join, I deduplicated the source stream using QUALIFY ROW_NUMBER() = 1 and refactored non-sargable date filters, cutting pipeline runtime from 48 minutes to 9 minutes and reducing monthly credit burn by 32%.",
      interviewerIntent: "The definitive flagship question: Can you articulate business context, scale, non-obvious design trade-offs, and concrete measurable outcomes?",
      followUps: [
        "Why did you choose an Append-Only stream over a standard stream?",
        "What specific metric proved that the join was exploding?"
      ],
      seniorKeyTakeaways: [
        "Quantify scale: 45M events/day, 15-min SLA, 48m down to 9m, 32% cost reduction.",
        "Defend trade-offs: Storage integration, Append-only stream, Dynamic Tables with Adaptive refresh."
      ]
    }
  },
  {
    id: 'sf-q20',
    number: 20,
    topic: 'Architecture Scenarios',
    subtopic: 'Pipeline Idempotency & Re-execution',
    question: "If your Snowflake pipeline runs twice, what happens?",
    answers: {
      basic: "It might create duplicates.",
      strong: "COPY INTO is idempotent because of the 64-day load history — the same file won't reload. If I'm using MERGE with proper join keys, a duplicate run should be a no-op.",
      senior: "The correct answer depends on the layer. COPY INTO is idempotent by default — the 64-day load history skips already-loaded files, so a retried Snowpipe or COPY won't duplicate rows unless someone set FORCE = TRUE. A MERGE INTO ... USING stream is idempotent because the stream advances offset atomically with the MERGE — retrying replays the same delta once. A Dynamic Table is idempotent because Snowflake owns refresh state — running the DAG twice doesn't produce different content. Where I'd worry is procedural code with side effects — a task that calls a stored proc that inserts into an audit table and then does the MERGE — because the audit insert isn't idempotent unless I make it so. So I design for idempotency at every layer: rely on load history for ingest, on stream+merge atomicity for transforms, and add explicit dedup or MERGE INTO audit ... WHEN NOT MATCHED for anything with side effects.",
      interviewerIntent: "Testing architectural precision: Distinguishing engine-level idempotency from un-guarded procedural side effects.",
      followUps: [
        "What happens if an external orchestrator (like ADF or Airflow) retries a stored procedure task?",
        "How do you make an audit log insertion idempotent?"
      ],
      seniorKeyTakeaways: [
        "Distinguish declarative idempotency (COPY history, Stream atomic DML, Dynamic Tables) from procedural side effects.",
        "Always guard audit tables with MERGE or conditional uniqueness."
      ]
    }
  }
];

export const ONE_PAGE_CHEATSHEET = {
  architecture: [
    "3 layers: Storage (native FDN + Iceberg + Hybrid) / Compute (warehouses + SPCS + serverless) / Cloud Services (auth, metadata, optimizer, result cache, Horizon, Open Catalog, Cortex).",
    "Micro-partition: ~50–500 MB uncompressed, immutable columnar. Per-column min/max in metadata catalog drives pruning at query plan time.",
    "3 caches: Result (Services, global, 24h+, 0 compute cost) / Warehouse local (NVMe SSD, per WH, cleared on suspend) / Metadata (always on, powers COUNT(*)).",
    "Snapshot isolation on immutable versioned storage: Readers never block writers; Time Travel and Zero-Copy Cloning fall out naturally."
  ],
  dataEngineering: [
    "4 ingest paths: COPY INTO (batch, idempotent 64-day history) / Snowpipe (~1 min, auto-ingest, per-GB pricing Dec 2025) / Snowpipe Streaming (rows, seconds, Kafka offset tokens) / Openflow (NiFi connectors).",
    "Storage Integration + External Stage: Secure cloud IAM trust without embedded credentials in DDL.",
    "Streams: Change cursor pointing into Time Travel. Offset advances strictly inside DML. 3 types: Standard, Append-Only, Insert-Only.",
    "Tasks: Scheduled SQL DAGs using AFTER. WHEN SYSTEM$STREAM_HAS_DATA() costs 0 credits to evaluate. OVERLAP_POLICY controls concurrency.",
    "Dynamic Tables: Declarative pipelines defined by SELECT. TARGET_LAG = freshness target (min 60s). Use TARGET_LAG = DOWNSTREAM on intermediates. ADAPTIVE refresh mode 2026 default.",
    "Time Travel & Recovery: AT/BEFORE with OFFSET, TIMESTAMP, STATEMENT. Fail-safe = 7-day Support-only for permanent tables. Transient tables have 0 Fail-safe (saves staging cost)."
  ],
  performanceAndCost: [
    "Query Profile diagnostic sequence: Dominant Node → Queue Time → Pruning Ratio on TableScan → Local/Remote Spill → Join Row Explosion.",
    "Sargable predicates: Bare columns only (no functions or type casts on filter columns) to preserve micro-partition pruning.",
    "Spill: Local spill = NVMe SSD; Remote spill = Cloud Storage (10x-100x slowdown, urgent red flag).",
    "Right tool selection: Cluster for range scans on 1-3 cols; SOS for high-cardinality point lookups; MV for repeated single-table aggregates; QAS for burst scans; Dynamic Tables for pipelines.",
    "Warehouse sizing: Size up for slow queries (compute/spill); scale out (multi-cluster) for concurrent query queueing.",
    "Resource monitors: NOTIFY at 75%/90%, SUSPEND at 100%, SUSPEND_IMMEDIATE at 110%.",
    "Cloud Services 10% rule: Cloud Services credits are free up to 10% of daily warehouse credits; billed directly above 10%."
  ],
  securityAndGovernance: [
    "Auth 2026: Mandatory MFA for passwords; Key-Pair RSA JWT for service accounts; PATs for HTTP APIs; SAML SSO for enterprise humans.",
    "RBAC pattern: Access Roles (own object privileges) + Functional Roles (map to job titles). Users receive Functional Roles only.",
    "PII protection: Tag columns with Horizon tags + bind dynamic Masking Policies to tags (survives schema evolution).",
    "Horizon Catalog vs Open Catalog: Horizon = governance (tags, masking, lineage, quality); Open Catalog (Apache Polaris) = open Iceberg REST catalog for multi-engine interop.",
    "Cortex Agents: 2026 preferred agentic interface orchestrating Cortex Analyst (text-to-SQL) and Cortex Search (hybrid RAG).",
    "SPCS: Docker/OCI container compute pools (CPU / High-Memory / GPU) inside Snowflake's security perimeter.",
    "Disaster Recovery: Failover Groups bundle databases, users, roles, and warehouses; Client Redirect flips DNS globally without client reconfiguration."
  ]
};

export const FLAGSHIP_STORY_SLOTS = {
  context: "High-volume retail e-commerce platform processing 45 million customer orders and clickstream events daily with an enterprise reporting SLA of 15 minutes.",
  problem: "Legacy daily batch pipeline suffered from severe warehouse spill, took 48 minutes to execute, and frequently missed executive morning dashboards while ballooning monthly cloud spend.",
  architecture: "Sources (S3 Parquet via Kafka exports) → Ingestion (Snowpipe with IAM Storage Integration) → Bronze Raw Table → Change Data Capture (Append-Only Stream) → Silver Transformation (Task executing atomic MERGE every 5 minutes with WHEN SYSTEM$STREAM_HAS_DATA) → Gold Analytics (Chained Adaptive Dynamic Tables with TARGET_LAG = DOWNSTREAM and 5-min leaf lag).",
  yourRole: "Lead Data Engineer: Architected end-to-end Snowflake data plane, authored DDL, configured IAM Storage Integrations, wrote MERGE CDC logic, and implemented Horizon tag-based PII masking.",
  keyDecisions: [
    "Chose Dynamic Tables with ADAPTIVE refresh over procedural Streams+Tasks for Gold layer to eliminate brittle task-chaining race conditions.",
    "Replaced legacy function-wrapped predicates with bare sargable timestamp ranges and clustered Silver on (order_date, region).",
    "Configured Storage Integration with AWS IAM External ID to eliminate cloud credentials from SQL DDL."
  ],
  scale: "45 million events/day (~180 GB/day uncompressed), 12,000 micro-partitions pruned down to 48 on daily queries, Medium virtual warehouse.",
  failureHandling: "Ensured end-to-end idempotency via Snowpipe 64-day load history, atomic stream offset advancement on MERGE commits, and 30-day Time Travel for instant rollback.",
  outcome: "Reduced pipeline execution latency from 48 minutes down to 9 minutes, eliminated all remote spill, and slashed monthly Snowflake compute credit consumption by 32%."
};
