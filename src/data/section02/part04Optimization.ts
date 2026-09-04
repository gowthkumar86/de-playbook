import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_04_TERMINOLOGIES: TermItem[] = [
  {
    term: 'Execution plan',
    definition: 'The tree of physical operators (scans, joins, aggregates, sorts) the query engine builds to execute your SQL.',
    category: 'Query Planning',
    highlight: true,
  },
  {
    term: 'Predicate pushdown',
    definition: 'Moving filters (WHERE) as close to the storage layer as possible, so rows are filtered before being transferred over the network.',
    category: 'Optimization Techniques',
    highlight: true,
  },
  {
    term: 'Partition pruning',
    definition: 'Skipping entire files or micro-partitions during a scan because their metadata proves no matching rows can exist.',
    category: 'Pruning & Storage',
    highlight: true,
  },
  {
    term: 'Micro-partition',
    definition: 'Snowflake\'s unit of storage: immutable, columnar, compressed, 50–500 MB uncompressed, automatically created and indexed with min/max statistics.',
    category: 'Pruning & Storage',
  },
  {
    term: 'Spill (local / remote)',
    definition: 'When an operation needs more memory than a node has, it spills to local SSD (first), then to remote object storage (disaster).',
    category: 'Memory & Spilling',
    highlight: true,
  },
  {
    term: 'Join order',
    definition: 'The order in which the engine combines 3+ tables. Good join order filters aggressively early; bad order blows up intermediate row counts.',
    category: 'Join Mechanics',
  },
  {
    term: 'Broadcast join',
    definition: 'One small table is copied to every worker node; the large table stays partitioned. Avoids network shuffle.',
    category: 'Distributed Joins',
    highlight: true,
  },
  {
    term: 'Shuffle / Hash join',
    definition: 'Both tables are repartitioned across worker nodes by hashing the join key over the network. General, robust, network-heavy.',
    category: 'Distributed Joins',
  },
  {
    term: 'Merge join',
    definition: 'Both inputs pre-sorted by join key; walk the inputs in lockstep. Very fast when data is already sorted.',
    category: 'Distributed Joins',
  },
  {
    term: 'Skew (data skew)',
    definition: 'Uneven distribution of data across worker nodes. One worker processes 90% of the rows while the rest sit idle. Manifests as a long tail.',
    category: 'Distributed Bottlenecks',
    highlight: true,
  },
  {
    term: 'Materialized view',
    definition: 'A precomputed query result stored on disk and refreshed automatically as base tables change.',
    category: 'Materialization',
  },
  {
    term: 'Search Optimization Service (SOS)',
    definition: 'Snowflake background service building point-lookup indexes on micro-partitions. Accelerates equality / IN / prefix queries.',
    category: 'Snowflake Pruning',
  },
  {
    term: 'Clustering key',
    definition: 'A column or expression used to physically organize micro-partitions. Restores pruning when natural ingestion order doesn\'t match query filters.',
    category: 'Snowflake Pruning',
  },
  {
    term: 'Cost-Based Optimizer (CBO)',
    definition: 'The engine component that evaluates candidate physical execution plans using table statistics and picks the lowest estimated cost.',
    category: 'Query Planning',
  },
];

export const OPTIMIZATION_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'sql-opt-q01',
    number: 1,
    question: 'A query that used to take 30 seconds now takes 20 minutes. Walk me through your debugging steps.',
    topic: 'Optimization',
    subtopic: 'Debugging Playbook',
    answers: {
      basic: 'Check the query profile, see where the time was spent, check if data volume grew.',
      strong: 'Open the profile, compare bytes scanned, check micro-partition pruning, check for memory spilling, and look for join row explosion.',
      senior: '"Systematic triage: First, open Query Profile and compare today\'s execution with the 30-second run. Check three metrics: 1) Bytes scanned / partitions pruned — did data volume explode or did someone break pruning with a non-sargable predicate? 2) Spilling — is it spilling to local SSD or remote S3/GCS? 3) Join row counts — did a join key become nullable or introduce fan-out? If pruning broke, fix the predicate. If spilling, check skew or right-size the warehouse. If join blew up, inspect grain and cardinality."',
      interviewerIntent: 'Testing structured troubleshooting method vs random guessing under production pressure.',
    },
  },
  {
    id: 'sql-opt-q02',
    number: 2,
    question: 'What is the difference between local spilling and remote spilling?',
    topic: 'Optimization',
    subtopic: 'Memory & Spilling',
    answers: {
      basic: 'Local is to SSD; remote is to cloud storage.',
      strong: 'Local spill writes excess intermediate state to the compute node\'s attached NVMe/SSD. Remote spill writes to object storage (S3/GCS) when SSD runs out, causing 10x–100x performance collapse.',
      senior: '"Local spill means an operator ran out of RAM and wrote to node-local NVMe SSD — painful but manageable. Remote spill means the local SSD filled up and it started writing to remote object storage over the network. That kills throughput by 10x–100x. When I see remote spill, I immediately investigate skew, filter down data, or scale the warehouse size up to get more aggregate RAM."',
    },
  },
  {
    id: 'sql-opt-q03',
    number: 3,
    question: 'What makes a predicate non-sargable, and why does it hurt performance?',
    topic: 'Optimization',
    subtopic: 'Predicate Pushdown',
    answers: {
      basic: 'Wrapping a column in a function prevents index and partition pruning.',
      strong: 'Functions like YEAR(created_at) = 2026 force the engine to evaluate the expression on every row rather than using metadata min/max pruning.',
      senior: '"A non-sargable predicate wraps the column in an expression, like YEAR(created_at) = 2026. The engine cannot use micro-partition min/max metadata because the metadata tracks raw created_at values, not transformed values. It forces a 100% full scan. Rewriting to a range predicate created_at >= \'2026-01-01\' AND created_at < \'2027-01-01\' restores complete partition pruning instantly."',
    },
  },
  {
    id: 'sql-opt-q04',
    number: 4,
    question: 'How do you detect and fix data skew in a distributed join?',
    topic: 'Optimization',
    subtopic: 'Data Skew',
    answers: {
      basic: 'Look for one node running much longer than the others.',
      strong: 'Profile shows 99% of workers finished in seconds while 1 worker runs for 15 minutes. Caused by common keys like NULL or 0.',
      senior: '"In the query profile, look for execution skew where 95% of compute nodes finish in 5 seconds and one node runs for 10 minutes. Check the join key distribution — usually 80% of rows have key NULL, \'N/A\', or user 0. Fix it by salting the skewed key with random integers, splitting the query into skewed and non-skewed branches, or filtering nulls before joining."',
    },
  },
  {
    id: 'sql-opt-q05',
    number: 5,
    question: 'When does a broadcast join make sense vs a hash shuffle join?',
    topic: 'Optimization',
    subtopic: 'Join Strategies',
    answers: {
      basic: 'Broadcast when one table is small.',
      strong: 'Broadcast sends the entire small table to every node, avoiding shuffling the large table. Hash shuffle re-partitions both tables across the network.',
      senior: '"Broadcast join makes sense when one side is small enough to fit comfortably in node memory (typically < 10–50MB). It avoids shuffling the huge fact table across the network. If both sides are massive, you must use a distributed hash shuffle join where rows are hashed on the join key to balance workers."',
    },
  },
  {
    id: 'sql-opt-q06',
    number: 6,
    question: 'How do you choose a clustering key in Snowflake?',
    topic: 'Optimization',
    subtopic: 'Clustering',
    answers: {
      basic: 'Pick columns that are most frequently filtered on.',
      strong: 'Choose low-to-medium cardinality columns that appear in WHERE clauses and are NOT already naturally sorted by ingestion time.',
      senior: '"Follow the checklist: 1) Table is large (multi-terabyte) and query profile shows poor pruning. 2) Natural ingestion order does not already cluster by the filter. 3) Choose 1–3 columns from most-frequently filtered predicates, ordered from lowest cardinality to highest. Never pick ultra-high cardinality UUIDs or timestamps with second precision, as they explode micro-partition count."',
    },
  },
  {
    id: 'sql-opt-q07',
    number: 7,
    question: 'Why did my join produce 100x more rows than the input table?',
    topic: 'Optimization',
    subtopic: 'Join Cardinality',
    answers: {
      basic: 'The join key had duplicates on both sides, creating a Cartesian expansion.',
      strong: 'Many-to-many relationship on the join keys caused a multiplication of rows.',
      senior: '"Fan-out from a many-to-many join relationship. If key 100 appears 1,000 times in table A and 1,000 times in table B, the join outputs 1,000,000 rows. Always verify the uniqueness/grain of the right side before joining, or deduplicate with QUALIFY ROW_NUMBER() = 1 before the join."',
    },
  },
  {
    id: 'sql-opt-q08',
    number: 8,
    question: 'How does COUNT(DISTINCT) behave on billion-row datasets and how do you optimize it?',
    topic: 'Optimization',
    subtopic: 'Aggregations',
    answers: {
      basic: 'It is very slow because it has to keep every unique value in memory.',
      strong: 'Exact COUNT(DISTINCT) forces a global shuffle and memory-heavy hash set. If business permits, use HyperLogLog / APPROX_COUNT_DISTINCT.',
      senior: '"Exact COUNT(DISTINCT) requires shuffling all values to a single grouping or running an expensive two-phase aggregation that easily spills. If 98-99% accuracy is acceptable, switch to APPROX_COUNT_DISTINCT (HyperLogLog), which runs in constant memory and orders of magnitude faster. If exactness is required, pre-aggregate into daily intermediate tables."',
    },
  },
  {
    id: 'sql-opt-q09',
    number: 9,
    question: 'Explain how the Cost-Based Optimizer (CBO) decides the join order.',
    topic: 'Optimization',
    subtopic: 'CBO Mechanics',
    answers: {
      basic: 'It uses table statistics to estimate row counts and picks the cheapest plan.',
      strong: 'The CBO reads histogram and row count metadata to estimate intermediate relation sizes, aiming to reduce cardinality early.',
      senior: '"The CBO generates alternative join trees (left-deep, bushy) and calculates an estimated cost for each using table statistics: row counts, distinct key counts (NDV), and null fractions. It picks the order that filters rows earliest to minimize intermediate network and memory usage. Stale statistics lead to bad cardinality estimates and disastrous join orders."',
    },
  },
  {
    id: 'sql-opt-q10',
    number: 10,
    question: 'Why does SELECT DISTINCT often hide bad engineering?',
    topic: 'Optimization',
    subtopic: 'Code Quality',
    answers: {
      basic: 'Because developers use it when their joins duplicate rows instead of fixing the join.',
      strong: 'It performs an expensive full-dataset sort/hash pass to mask duplicate rows caused by improper join granularity.',
      senior: '"Developers frequently slap SELECT DISTINCT on a query when they notice row counts ballooned, treating the symptom rather than the root cause: an invalid join grain or unhandled 1-to-many relationship. It forces a massive global sort or hash aggregation across the entire dataset, degrading performance and masking data integrity bugs."',
    },
  },
];

export const PART_04_OPTIMIZATION_DATA: SectionPart = {
  id: 'sql-part-04',
  title: 'Section 02 Part 04: Optimization & Internals',
  partNumber: 'PART 04',
  subtitle: 'Execution Plans, Pruning, Spilling, Skew, Join Mechanics & Debugging',
  summary: 'How modern query engines (Snowflake, BigQuery, Spark, Postgres) execute SQL, how to read execution plans, how to diagnose slow queries, and how to fix them under pressure in senior interviews.',
  readTimeMinutes: 30,
  terminologies: PART_04_TERMINOLOGIES,
  sections: [
    {
      heading: '1. Mental Model: How SQL Actually Runs',
      subheading: 'Parsing, AST, Logical Plan, Cost Optimizer & Physical Operators',
      content: `### From text to physical execution
When you submit a SQL query, it moves through 5 distinct compiler stages:

\`\`\`
SQL Text
   │
   ▼
1. Parser & Lexer      ── Validates syntax; produces Abstract Syntax Tree (AST)
   │
   ▼
2. Catalog / Analyzer  ── Resolves table/column names, types, permissions
   │
   ▼
3. Logical Plan        ── Relational algebra tree (Filter -> Project -> Join)
   │
   ▼
4. Cost-Based Optimizer── Evaluates physical plan alternatives using statistics
   │                      (Join order, broadcast vs shuffle, index/pruning strategy)
   ▼
5. Physical Plan       ── Executable graph of physical operators (Scan, HashJoin, Aggregate)
   │
   ▼
Distributed Execution  ── Assigned to workers; data streamed through vector pipelines
\`\`\`

### Logical vs Physical Operators
- **Logical:** Abstract relational operations: \`Filter\`, \`Project\`, \`Join\`, \`Aggregate\`.
- **Physical:** Hardware-aware algorithms: \`TableScan\`, \`HashJoin\`, \`BroadcastNestedLoopJoin\`, \`MergeJoin\`, \`HashAggregate\`.

**Senior takeaway:** Your SQL defines *what* you want (the declarative logical contract). The engine determines *how* to physically execute it based on data statistics and available resources.`,
    },
    {
      heading: '2. Reading an Execution Plan / Query Profile',
      subheading: 'Key Metrics, Bottleneck Identification & Snowflake Profile Anatomy',
      content: `### Essential metrics to inspect immediately:
1. **Total Execution Time Breakdown:** Processing vs Local Disk Spill vs Remote Disk Spill vs Network Transfer vs Synchronization.
2. **Partitions Scanned vs Total Partitions:** Pruning efficiency ratio. Scanning 100,000 of 100,000 partitions is a red flag.
3. **Input vs Output Rows:** Look for explosions. If an operator takes 1M rows and emits 100M rows, you have a join fan-out.
4. **Memory Spilling:** Local spill (spilled to NVMe SSD) vs Remote spill (spilled to S3/GCS object store).

### Snowflake Query Profile Anatomy
\`\`\`
[TableScan: ORDERS]                [TableScan: CUSTOMER]
  Partitions: 42 / 1,200             Partitions: 5 / 5
  Rows: 1.2M                         Rows: 50K
       │                                  │
       ▼                                  ▼
[Filter: amount > 100]             [Filter: region = 'EMEA']
  Rows: 850K                         Rows: 12K
       │                                  │
       └──────────────┬───────────────────┘
                      ▼
               [HashJoin: INNER]
                 Build: CUSTOMER (12K)
                 Probe: ORDERS (850K)
                 Output Rows: 210K
                      │
                      ▼
               [Aggregate: SUM]
                 Output Rows: 12K
\`\`\``,
    },
    {
      heading: '3. Pruning — The #1 Optimization in Cloud Warehouses',
      subheading: 'Micro-Partition Metadata, Non-Sargable Predicates & Clustering Keys',
      content: `### How Pruning Works
In columnar cloud warehouses (Snowflake, BigQuery, Databricks Delta), tables are split into immutable compressed files called **micro-partitions**. 
The metadata store tracks **min/max values** for every column in every micro-partition.

When a query has \`WHERE order_date >= '2026-08-01'\`, the engine checks metadata first:
- If micro-partition 402 has \`min = '2026-01-01', max = '2026-03-31'\`, it is **skipped entirely without reading a single byte from storage**.

### The Disaster of Non-Sargable Predicates
Wrapping a column in a function **destroys pruning**:

\`\`\`sql
-- BAD: Non-sargable (Metadata has created_at, not YEAR(created_at))
-- Engine must scan 100% of micro-partitions
SELECT * FROM events WHERE YEAR(created_at) = 2026;

-- GOOD: Sargable range predicate
-- Engine reads metadata min/max and prunes 95%+ of partitions
SELECT * FROM events 
WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01';
\`\`\`

### Common Non-Sargable Traps:
- \`WHERE DATE(ts) = '2026-08-01'\` → Rewrite to \`ts >= '2026-08-01' AND ts < '2026-08-02'\`
- \`WHERE UPPER(email) = 'ALICE@EXAMPLE.COM'\` → Store lowercase or use collation
- \`WHERE COALESCE(status, 'NEW') = 'NEW'\` → Rewrite to \`(status = 'NEW' OR status IS NULL)\`
- \`WHERE amount_usd * 1.2 > 100\` → Rewrite to \`amount_usd > 100 / 1.2\``,
    },
    {
      heading: '4. Joins Under the Hood',
      subheading: 'Broadcast vs Distributed Hash Shuffle vs Merge Joins',
      content: `### Distributed Join Strategies:

\`\`\`
Broadcast Join (Small + Large)
Worker 1: [Full Small Table in RAM] x [Slice of Large Table]
Worker 2: [Full Small Table in RAM] x [Slice of Large Table]
--> Zero network shuffle for the large table. Very fast.

Hash Shuffle Join (Large + Large)
Table A Rows ──[Hash(join_key) % num_workers]──> Worker N
Table B Rows ──[Hash(join_key) % num_workers]──> Worker N
--> High network traffic as both tables are distributed across cluster.
\`\`\`

### When Each Strategy Wins:
- **Broadcast:** One side fits in memory (< 10–50MB). Best for joining small dimensions to massive fact tables.
- **Distributed Hash Shuffle:** Both tables are large. Required when neither fits in a single node's RAM.
- **Merge Join:** Inputs are already physically sorted on the join key (e.g. Postgres b-tree indexes).`,
    },
    {
      heading: '5. Spilling — Local vs Remote',
      subheading: 'Memory Pressure Hierarchy, Root Causes & Remediation',
      content: `When a hash join or sort exceeds allocated worker memory:

\`\`\`
RAM Limit Exceeded
   │
   ▼
Spill to Local SSD (NVMe)  ── Latency increases 3x–10x
   │
   ▼
Local SSD Limit Exceeded
   │
   ▼
Spill to Remote Storage    ── Latency collapses 10x–100x (Network I/O bottleneck)
(S3 / GCS / Azure Blob)
\`\`\`

### How to Fix Spilling:
1. **Reduce intermediate columns:** Avoid \`SELECT *\`. Only project necessary columns through joins.
2. **Filter before joining:** Push predicates down into subqueries/CTEs if the optimizer misses them.
3. **Right-size compute:** Scale warehouse size up (e.g., M → L) to get more aggregate RAM per worker.
4. **Fix join explosions:** Ensure join keys are unique on at least one side to avoid quadratic row growth.`,
    },
    {
      heading: '6. Skew — The Single Slow Node Problem',
      subheading: 'Symptoms, Hot-Key Detection & Salting Patterns',
      content: `### The Symptom:
A distributed query with 64 worker nodes has 63 nodes finish in 10 seconds, but 1 node runs for 30 minutes.

### Root Cause:
Hashing the join or group key assigns rows to nodes via \`hash(key) % N\`.
If 80% of rows have \`key = NULL\` or \`key = 'UNKNOWN'\`, that single node receives 80% of the entire dataset.

### Remediation:
1. **Filter out nulls or placeholder keys before joining:**
\`\`\`sql
SELECT *
FROM fact f
JOIN dim d ON f.customer_id = d.customer_id
WHERE f.customer_id IS NOT NULL;
\`\`\`
2. **Salting hot keys:** Append a random integer \`1..K\` to the hot key on the left side, and replicate matching dimension rows \`K\` times on the right side to spread rows evenly across nodes.`,
    },
    {
      heading: '7. The Senior Debugging Playbook',
      subheading: '7-Step Algorithmic Protocol for Production Query Failures',
      content: `When summoned to debug a slow query under pressure:

1. **Step 1: Check Query Profile / Explain Plan**  
   Identify the single operator consuming the highest percentage of execution time.
2. **Step 2: Check Pruning Ratio**  
   If partitions scanned ≈ total partitions on a partitioned table, inspect the \`WHERE\` clause for non-sargable functions or data type mismatches.
3. **Step 3: Check for Memory Spilling**  
   Is there local or remote disk spill? If yes, check for wide \`SELECT *\` rows, high-cardinality group-bys, or missing join filters.
4. **Step 4: Check Join Cardinality**  
   Compare input rows to output rows on each join node. If output > input, inspect for missing join keys, duplicate dimension keys, or Cartesian fan-out.
5. **Step 5: Check for Skew**  
   Look at node-level processing distribution. If one worker has disproportionately high execution time, check for hot-key clustering.
6. **Step 7: Optimize Declaratively First, Hardware Second**  
   Never blindly double the warehouse size before verifying that pruning and join grain are mathematically sound.`,
    },
    {
      heading: '8. Common Interview Questions — Optimization',
      subheading: '10 Rigorous Internal Execution Challenges',
      content: `Be prepared to answer these optimization questions:
- **Q1:** A query that used to take 30 seconds now takes 20 minutes. Walk me through your debugging steps.
- **Q2:** What is the difference between local spilling and remote spilling?
- **Q3:** What makes a predicate non-sargable, and why does it hurt performance?
- **Q4:** How do you detect and fix data skew in a distributed join?
- **Q5:** When does a broadcast join make sense vs a hash shuffle join?
- **Q6:** How do you choose a clustering key in Snowflake?
- **Q7:** Why did my join produce 100x more rows than the input table?
- **Q8:** How does \`COUNT(DISTINCT)\` behave on billion-row datasets and how do you optimize it?
- **Q9:** Explain how the Cost-Based Optimizer (CBO) decides join order.
- **Q10:** Why does \`SELECT DISTINCT\` often hide bad engineering?`,
    },
    {
      heading: '9. Quick Revision — Part 04',
      subheading: 'Summary of Query Optimization Laws',
      content: `- **Pruning is king**: Filter on clustering/partition columns using raw sargable predicates.
- **Never wrap columns in functions in WHERE**: It blinds the optimizer to partition metadata min/max.
- **Local spill = SSD; Remote spill = object store (disaster)**.
- **Skew manifests as 1 node running while 63 sit idle**: Salt or isolate hot keys.
- **Broadcast join** avoids shuffle when one table is small (< 50MB).
- **Fan-out**: Always verify uniqueness of the join key on the dimension side before joining.
- **Exact COUNT(DISTINCT)** scales poorly; prefer **APPROX_COUNT_DISTINCT (HLL)** for big data metrics.
- **Fix query logic before scaling warehouse size**: Scale compute only when query is verified optimal.`,
    },
  ],
};
