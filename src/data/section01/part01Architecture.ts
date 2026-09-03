import { SectionPart } from '../../types';

export const PART_01_ARCHITECTURE_DATA: SectionPart = {
  id: 'snowflake-part-01',
  title: 'Snowflake Part 01: Architecture & Internals',
  partNumber: 'PART 01',
  subtitle: 'The 3-Layer Decoupled Architecture, Micro-Partitions, Pruning, Caches & Open Lakehouse',
  summary: 'In-depth breakdown of Snowflake\'s shared-data multi-cluster architecture: Cloud Services control plane, MPP Virtual Warehouses and container compute pools, and immutable columnar storage. Covers physical micro-partition layouts, metadata pruning mechanics, the three distinct caching layers, and the 2024–2026 open lakehouse evolution (Iceberg, Open Catalog/Polaris, Cortex Agents).',
  readTimeMinutes: 20,
  terminologies: [
    {
      term: 'MPP (Massively Parallel Processing)',
      definition: 'A compute architecture where a query is decomposed into parallel execution fragments across an independent cluster of nodes. Virtual Warehouses operate as MPP clusters.',
      category: 'Compute'
    },
    {
      term: 'Columnar Storage',
      definition: 'Data physical layout where values belonging to the same column are stored contiguously on disk rather than row-by-row. Minimizes I/O on analytical queries touching few columns.',
      category: 'Storage'
    },
    {
      term: 'Immutable Storage',
      definition: 'Storage files are write-once. Updates or deletes never mutate existing files in place; they write new versions and update catalog pointers. Powers Time Travel and Zero-Copy Cloning.',
      category: 'Storage',
      highlight: true
    },
    {
      term: 'Micro-Partition',
      definition: 'Snowflake\'s atomic unit of native table storage. 50–500 MB uncompressed, compressed columnar (FDN), immutable, containing embedded per-column min/max, null, and distinct counts.',
      category: 'Storage',
      highlight: true
    },
    {
      term: 'Partition Pruning',
      definition: 'The optimizer skipping micro-partitions at query plan time by evaluating the WHERE clause against per-partition min/max metadata. The #1 reason Snowflake queries execute fast.',
      category: 'Performance',
      highlight: true
    },
    {
      term: 'Virtual Warehouse',
      definition: 'A named, on-demand MPP compute cluster (T-shirt sizes XS to 6XL). Stateless compute that borrows storage from the shared storage layer and features local SSD caching.',
      category: 'Compute'
    },
    {
      term: 'Multi-Cluster Warehouse',
      definition: 'An enterprise feature where an identical warehouse dynamically scales out multiple clusters (1 to N) to absorb concurrency spikes without queueing.',
      category: 'Compute'
    },
    {
      term: 'Result Cache',
      definition: 'Account-wide cache residing in Cloud Services holding exact query result sets for 24h (up to 31d). Returns identical queries on unchanged tables with zero compute cost.',
      category: 'Caching',
      highlight: true
    },
    {
      term: 'Warehouse Local Cache',
      definition: 'Local NVMe SSD cache on the virtual warehouse nodes that holds recently scanned micro-partitions. Accelerates repeat reads but is cleared when the warehouse suspends.',
      category: 'Caching'
    },
    {
      term: 'Metadata Cache / Statistics',
      definition: 'Always-on Cloud Services catalog storing per-partition min/max, row counts, and column histograms. Answers metadata-only queries like COUNT(*) on native tables with 0 warehouse compute.',
      category: 'Caching'
    },
    {
      term: 'Snapshot Isolation',
      definition: 'ACID transaction model where each query sees a consistent point-in-time snapshot of the database. Readers never block writers, and writers never block readers.',
      category: 'Architecture'
    },
    {
      term: 'Predicate Pushdown',
      definition: 'Moving filter conditions down into the storage scan phase so micro-partitions and columns are eliminated before data is pulled across the network into compute memory.',
      category: 'Performance'
    },
    {
      term: 'Spill (Local vs Remote)',
      definition: 'When an operator runs out of RAM, it writes intermediate buffers to local NVMe SSD (Local Spill). If SSD fills, it spills to cloud object storage (Remote Spill), causing massive slowdowns.',
      category: 'Performance',
      highlight: true
    },
    {
      term: 'Apache Iceberg Tables',
      definition: 'Open table format backed by customer cloud storage. Supported in Managed mode (Snowflake manages catalog) and Externally-Managed mode (Open Catalog/Polaris, Glue, Unity).',
      category: 'Lakehouse'
    },
    {
      term: 'Open Catalog (Apache Polaris)',
      definition: 'Snowflake\'s open-sourced (donated to ASF 2024) vendor-neutral Iceberg REST catalog enabling Spark, Trino, Flink, and Snowflake to read/write identical Iceberg tables.',
      category: 'Lakehouse',
      highlight: true
    },
    {
      term: 'Horizon Catalog',
      definition: 'Snowflake\'s unified governance plane: centralized object tagging, tag-based masking, row-access policies, data classification, lineage, and data quality metrics.',
      category: 'Governance'
    },
    {
      term: 'Cortex Agents',
      definition: 'Snowflake\'s 2026-preferred multi-step agentic AI interface that orchestrates reasoning and calls Cortex Analyst (text-to-SQL) and Cortex Search (hybrid retrieval) as tools.',
      category: 'AI'
    },
    {
      term: 'Hybrid Tables (Unistore)',
      definition: 'Row-store storage engine inside Snowflake with enforced primary keys, secondary indexes, and row-level locking for low-latency transactional (OLTP) workloads.',
      category: 'Storage'
    }
  ],
  sections: [
    {
      heading: '1. Why the Architecture is the Way It Is',
      subheading: 'Evolution from 2014 Decoupled MPP to 2026 Open Lakehouse & AI Runtime',
      content: `Snowflake was founded in 2014 on a radical architectural premise: **completely decouple storage, compute, and cloud services** to eliminate the rigid hardware sizing bottlenecks of on-premise MPP appliances (Teradata, Netezza).

Over the past decade, that foundational 3-layer skeleton has matured into an open lakehouse and AI runtime:

| Era | Architectural Milestone | Significance in Enterprise Data Engineering |
| :--- | :--- | :--- |
| **2014–2016** | Storage / Compute / Services Separation | Elastic independent scaling; eliminated compute starvation and storage re-indexing. |
| **2019** | Zero-Copy Cloning & Data Sharing | Proved the power of immutable metadata-versioned cloud storage. |
| **2020–2021** | Snowpark & External Tables | Expanded beyond pure SQL into Python/Java/Scala DataFrames and raw data lake querying. |
| **2022–2023** | Unistore (Hybrid Tables) & SPCS | Broke OLAP-only boundaries to support transactional OLTP and containerized workloads. |
| **2024** | Iceberg GA, Polaris Open-Sourced, Dynamic Tables GA | Pivoted from proprietary storage lock-in to open lakehouse interoperability. |
| **2025** | Cortex Analyst / Search / Agents, Mandatory MFA & Key-Pair | Native generative AI text-to-SQL; zero-trust authentication hardening. |
| **2026** | Iceberg-First Architecture, Polaris/Horizon Interop, Adaptive Dynamic Tables | Unified multi-engine data plane where Snowflake, Spark, and Trino share identical tables. |

**Senior Interview Line:**
> *"The 3-layer decoupled architecture is still fundamentally true in 2026, but each layer has expanded dramatically: storage now encompasses open Iceberg and OLTP Hybrid Tables; compute includes containerized GPU pools in SPCS; and Cloud Services hosts Horizon governance, Open Catalog, and Cortex AI agents."*`,
      mermaidDiagrams: [
        `flowchart TB
    subgraph SVC["CLOUD SERVICES (Control Plane - Multi-tenant, Always-On)"]
        AUTH["Authentication - MFA, SAML, Key-Pair, PATs"]
        RBAC["Authorization + Row-Access + Masking Policies"]
        META["Metadata Store - Min/Max, Statistics, History"]
        OPT["Query Optimizer + Cost-Based Planner"]
        TXN["Transaction Coordinator + Snapshot Isolation"]
        CACHE["Persisted Query Result Cache (24h - 31d)"]
        HZN["Horizon Catalog - Lineage, Quality, Classification"]
        ICECAT["Iceberg REST Catalog (Open Catalog / Apache Polaris)"]
        CORTEX["Cortex AI - LLMs, Search, Analyst, Agents"]
    end

    subgraph CMP["COMPUTE (Execution Layer - Stateless MPP Warehouses & Pools)"]
        WH["Standard Virtual Warehouses (XS to 6XL)"]
        SPO["Snowpark-Optimized Warehouses (16x RAM)"]
        SL["Serverless Engine (Tasks, DT Refresh, Auto-Clustering)"]
        SPCS["Snowpark Container Services (CPU / GPU Pools)"]
        QAS["Query Acceleration Service (Burst Compute)"]
        SOS["Search Optimization Service (Secondary Indexing)"]
    end

    subgraph DATA["STORAGE (Data Plane - Immutable Cloud Object Storage)"]
        NAT["Native Tables (FDN Columnar Micro-Partitions)"]
        ICE["Apache Iceberg Tables (Managed / External)"]
        HYB["Hybrid Tables (Row-Store, OLTP Primary Keys)"]
        EXT["External Stages / Tables (S3, ADLS, GCS)"]
        EVT["Event Tables (OpenTelemetry Traces & Logs)"]
    end

    SVC --> CMP
    CMP --> DATA
    HZN --> ICECAT
    ICECAT --> ICE
    CORTEX --> CMP`
      ]
    },
    {
      heading: '2. The Cloud Services Layer (The Control Plane)',
      subheading: 'Metadata Engine, Snapshot Isolation, Cost-Based Optimizer & Governance',
      content: `Cloud Services is a multi-tenant, highly available collection of microservices operated by Snowflake across each region. You do not manage or directly provision it; customers only incur billing if daily Cloud Services credit consumption exceeds **10% of total daily warehouse compute**.

**Core Responsibilities:**
- **Authentication & Security:** Enforces MFA, key-pair JWT verification, SAML SSO, OAuth 2.0, and Programmatic Access Tokens (PATs).
- **Authorization & RBAC:** Evaluates role hierarchies, row-access policies, and column-masking expressions before any query compiles.
- **Metadata Management:** Stores schemas, micro-partition file IDs, and per-column \`min\`, \`max\`, \`null_count\`, and distinct statistics.
- **Transaction Coordination (Snapshot Isolation):** Because storage is immutable, every DML statement writes new micro-partitions and atomically updates the active-partition manifest. Long-running readers never experience lock contention with writers.
- **Query Optimization Pipeline:**
  1. *Parse & Bind:* Validate syntax, resolve object identifiers, inject active row-access/masking policy expressions.
  2. *Rewrite:* Push predicates down, unnest subqueries, expand views, inline CTEs.
  3. *Prune:* Compare query WHERE conditions against metadata min/max to discard non-matching micro-partitions prior to compute dispatch.
  4. *Cost-Based Plan:* Determine join ordering, join algorithm (hash vs broadcast), and intra-query parallelism based on statistics.
  5. *Compile & Dispatch:* Generate the physical plan tree executed by the warehouse.`,
      callouts: [
        {
          type: 'senior-line',
          title: 'Snapshot Isolation & Metadata',
          text: 'Snowflake’s snapshot isolation is built directly upon immutable storage. Time Travel and Zero-Copy Cloning are natural byproducts of metadata-versioned micro-partitions, not complex background replication processes.'
        }
      ]
    },
    {
      heading: '3. The Compute Layer: 2026 Landscape',
      subheading: 'Standard Warehouses, Snowpark-Optimized, SPCS GPU Pools, and Serverless Engines',
      content: `In 2026, Snowflake compute extends far beyond standard SQL virtual warehouses:

1. **Standard Virtual Warehouses (XS → 6XL):**
   - MPP clusters of cloud virtual machines. Each T-shirt size roughly doubles compute resources and credit consumption per hour (XS = 1 credit/hr, S = 2, M = 4, L = 8, ..., 6XL = 512).
   - Features dedicated local NVMe SSD storage used for micro-partition caching.
   - Multi-cluster scaling: Automatically spawns 1 to N identical clusters to handle concurrent query queues.
2. **Snowpark-Optimized Warehouses:**
   - Provides ~16× the RAM per node compared to standard warehouses.
   - Specifically designed for memory-intensive Snowpark workloads (e.g. Pandas transformations, large JSON unnesting, in-memory ML training) to eliminate memory spill.
3. **GPU Compute & Snowpark Container Services (SPCS):**
   - **Crucial interview clarification:** There is no standard "GPU Warehouse" T-shirt size. GPU compute is delivered via **SPCS Compute Pools** (and managed services like Cortex fine-tuning).
   - SPCS executes container images (Docker/OCI) directly inside the Snowflake governance boundary on CPU, High-Memory, or GPU instances.
4. **Query Acceleration Service (QAS):**
   - Serverless burst compute that dynamically offloads expensive table scans and filter operations from warehouse clusters during outlier query surges.
5. **Search Optimization Service (SOS):**
   - Serverless background maintenance that builds and maintains persistent secondary search indexes for high-cardinality point lookups (\`WHERE email = 'user@example.com'\`) and substring searches.
6. **Serverless Tasks & Dynamic Table Refresh:**
   - Executes recurring pipelines on elastic Snowflake-managed compute, billed by the second with zero idle warehouse cost.`
    },
    {
      heading: '4. Storage Layer: Micro-Partitions & Partition Pruning Deep Dive',
      subheading: 'Physical File Data Native (FDN) Layout, Pruning Mechanics, and Degradation Triggers',
      content: `**What is a Micro-Partition?**
A micro-partition is Snowflake's atomic unit of native table storage. Key physical characteristics:
- **Size:** 50 MB to 500 MB uncompressed data per partition.
- **Format:** Proprietary File Data Native (FDN) columnar format with adaptive compression algorithms (run-length, dictionary, delta).
- **Immutability:** Once written and sealed, a micro-partition is never edited. An \`UPDATE\` writes new micro-partitions containing updated rows and marks the old micro-partitions as inactive.
- **Metadata Footprint:** The micro-partition header and Cloud Services catalog track per-column \`min\`, \`max\`, \`null_count\`, and distinct estimates.

**How Does Partition Pruning Work?**
When a query executes (e.g. \`SELECT * FROM orders WHERE order_date = '2026-09-01'\`), the optimizer evaluates the filter condition against the metadata min/max bounds of every micro-partition in the table *before any data is read from storage*.
- If the range \`[min, max]\` does not overlap \`'2026-09-01'\`, the partition is pruned.
- Scanned partitions = 47 out of 12,483. The query executes in 300ms because 99.6% of data I/O was completely eliminated at the metadata layer.

**When Does Pruning Degrade or Fail?**
1. **Function-Wrapped Columns:** Wrapping columns in functions (\`WHERE DATE(order_ts) = '2026-09-01'\`) prevents the optimizer from evaluating the expression directly against raw column min/max bounds.
2. **Implicit/Explicit Type Casting:** \`WHERE order_id::VARCHAR = '10045'\` breaks metadata range comparison on numeric columns.
3. **Overlapping Min/Max Ranges (Poor Physical Clustering):** If rows are inserted in random order across a high-cardinality column, every micro-partition will have overlapping ranges (\`min=1, max=1000000\`), forcing the optimizer to scan 100% of micro-partitions despite a selective WHERE clause.`,
      callouts: [
        {
          type: 'senior-line',
          title: 'Sargable Predicates & Clustering',
          text: 'Pruning depends on two factors: bare sargable predicates in the query, and tight physical clustering on disk. A selective WHERE clause on a column with widely overlapping min/max ranges will still perform a full-table scan.'
        }
      ]
    },
    {
      heading: '5. The Three Caches in Snowflake',
      subheading: 'Distinguishing Persisted Result Cache, Warehouse SSD Cache, and Metadata Cache',
      content: `Interviewers frequently trap candidates who casually say *"Snowflake cached it."* Senior candidates immediately distinguish which of the three caching mechanisms was leveraged:

| Cache Layer | Architectural Location | Lifetime / Invalidation | Operational Function & Cost Impact |
| :--- | :--- | :--- | :--- |
| **Persisted Query Result Cache** | Cloud Services (Account-wide) | 24 hours (extended up to 31 days each time re-queried). Invalidated by underlying table DML or role changes. | Returns identical query results **with zero warehouse compute cost**. The virtual warehouse remains suspended. |
| **Warehouse Local Cache** | Compute (Per Virtual Warehouse NVMe SSD) | Persists as long as the warehouse runs. **Cleared immediately when the warehouse auto-suspends**. | Caches raw micro-partitions locally to avoid repeated cloud storage network reads on warm warehouses. Reduces I/O latency. |
| **Metadata Cache & Statistics** | Cloud Services (Always-on) | Always active; updated synchronously during DML commits. | Powers partition pruning and satisfies metadata-only queries (\`SELECT COUNT(*)\`, \`MAX(col)\` on native tables) with zero data scanning. |

**Practical Diagnostic Rules:**
- Re-running the exact same query text on unchanged data hits the **Result Cache** → query finishes in milliseconds, credits consumed = 0.
- Running a query with a different date filter on a warm warehouse hits the **Warehouse Local SSD Cache** → micro-partitions already on SSD are read locally without cloud storage GET requests.
- Running \`SELECT COUNT(*) FROM large_table\` without a WHERE clause evaluates against the **Metadata Cache** → zero rows scanned, instant response.`,
      callouts: [
        {
          type: 'gotcha',
          title: 'Auto-Suspend Cache Eviction',
          text: 'Setting auto-suspend to 30 seconds on an interactive BI warehouse destroys the Warehouse Local SSD cache between user queries, forcing every subsequent report to incur cold remote storage reads.'
        }
      ]
    },
    {
      heading: '6. End-to-End Query Execution Lifecycle',
      subheading: 'Tracing a Query from Submission to Result Delivery',
      content: `Understanding the end-to-end trace enables senior engineers to isolate performance and failure bottlenecks instantly:

1. **Client Submission:** Application submits SQL query via JDBC/ODBC/Python driver with session context.
2. **Auth & RBAC Evaluation:** Cloud Services verifies authentication, evaluates role hierarchy, and binds applicable row-access and column-masking policies into the AST.
3. **Metadata & Pruning Resolution:** Optimizer fetches per-partition statistics from Cloud Services catalog, evaluates sargable predicates, and prunes non-matching micro-partitions.
4. **Result Cache Check:** Checks if exact query text, underlying data version, and user role match a valid cached result. If hit, returns results immediately with zero compute dispatch.
5. **Compute Dispatch:** If cache miss, resumes the virtual warehouse (if suspended) and dispatches the compiled physical plan and surviving partition list.
6. **Execution & Local SSD Read:** Warehouse checks its local SSD NVMe cache; micro-partitions not cached are fetched from cloud storage (S3/ADLS/GCS).
7. **Vectorized Pipeline:** Operators (Scan → Filter → Hash Join → Aggregate → Sort) execute in parallel across warehouse node threads.
8. **Result Assembly & Cache Population:** Results are returned to the client and persisted into the Cloud Services Result Cache for 24 hours.`,
      mermaidDiagrams: [
        `sequenceDiagram
    participant Client as Client Application
    participant CS as Cloud Services (Control Plane)
    participant Meta as Metadata Catalog
    participant WH as Virtual Warehouse (Compute)
    participant S3 as Cloud Storage (Data Plane)

    Client->>CS: Submit SQL Query
    CS->>CS: Authenticate + Authorize + Apply Masking/Row Policies
    CS->>Meta: Retrieve Micro-Partition Min/Max & Histograms
    CS->>CS: Parse, Rewrite & Prune Micro-Partitions
    CS->>CS: Check Persisted Result Cache
    alt Result Cache Hit
        CS-->>Client: Return Result Set Instantly (0 Compute Credits)
    else Result Cache Miss
        CS->>WH: Resume Warehouse (if idle) & Dispatch Plan
        WH->>WH: Check Local NVMe SSD Cache
        WH->>S3: Fetch Surviving Micro-Partitions (Columnar Bytes)
        S3-->>WH: Compressed Micro-Partition Files
        WH->>WH: Vectorized Execution (Scan -> Join -> Aggregate)
        WH-->>CS: Stream Result Records & Profiling Metrics
        CS->>CS: Populate 24h Result Cache
        CS-->>Client: Transmit Result Set
    end`
      ]
    },
    {
      heading: '7. Modern Open Lakehouse: Apache Iceberg & Open Catalog (Polaris)',
      subheading: 'Snowflake-Managed vs. Externally-Managed Iceberg Tables',
      content: `The single biggest architectural shift in Snowflake between 2024 and 2026 is full first-class support for **Apache Iceberg**:

**A) Snowflake-Managed Iceberg Tables:**
- Snowflake acts as the Iceberg catalog and manages data compaction, snapshot expiration, and ACID commits.
- Parquet data files and Iceberg metadata files reside in **customer-owned cloud storage** via a Snowflake \`EXTERNAL VOLUME\`.
- Supports full Snowflake features: \`MERGE\`, transactions, Time Travel, zero-copy cloning, streams, and Dynamic Tables.
- Ideal when Snowflake is the primary data processing engine, but other engines (Databricks PySpark, AWS Athena, Trino) require direct read access without data egress or duplication.

**B) Externally-Managed Iceberg Tables:**
- An external REST catalog owns the metadata: **Snowflake Open Catalog (Apache Polaris)**, AWS Glue, or Unity Catalog.
- Snowflake reads and queries the table as an external consumer.
- Ideal for heterogeneous multi-engine enterprises where Databricks or Spark is the primary writer and Snowflake is used for governed BI serving.

**Open Catalog / Apache Polaris Clarification:**
- In 2024, Snowflake open-sourced **Apache Polaris** (donated to the Apache Software Foundation).
- **Snowflake Open Catalog** is the hosted managed service implementation of Apache Polaris.
- It provides a vendor-neutral, standards-compliant Iceberg REST catalog interface, preventing proprietary lock-in.`,
      callouts: [
        {
          type: 'interview-line',
          title: 'Horizon vs. Open Catalog',
          text: 'Horizon Catalog is Snowflake’s comprehensive governance surface (tags, masking policies, data quality, lineage). Open Catalog (managed Polaris) is an open Iceberg REST catalog for multi-engine storage interoperability. They work together.'
        }
      ]
    },
    {
      heading: '8. Snowflake vs. Databricks: 2026 Architecture Comparison',
      subheading: 'Objective Platform Trade-offs for the 5–10 YOE Technical Round',
      content: `Enterprise and top-tier tech interviewers expect balanced, mature architectural comparisons rather than fanatical or outdated stereotypes:

| Dimension | Snowflake (2026) | Databricks (2026) |
| :--- | :--- | :--- |
| **Origin & Core DNA** | Managed Cloud Data Warehouse | Distributed Spark Lakehouse |
| **Native Storage Engine** | Proprietary FDN columnar micro-partitions | Delta Lake (Parquet + \`_delta_log/\`) |
| **Open Format Strategy** | First-class Apache Iceberg via Open Catalog (Polaris) | Delta Lake primary; Iceberg via UniForm metadata |
| **Catalog & Governance** | Horizon Catalog + Open Catalog | Unity Catalog (also opened as UC OSS) |
| **Compute Execution** | Virtual Warehouses + SPCS Containers + Serverless | Serverless SQL Warehouses + Photon Engine + Spark Clusters |
| **Operational Profile** | Low-ops, fully managed, zero configuration | Highly customizable compute, tunable JVM/cluster configs |
| **Transactional OLTP** | Hybrid Tables (Unistore with row-level locks) | No native row-store (relies on Lakehouse MERGE) |
| **AI Runtime** | Cortex AI (LLM functions, Cortex Search, Cortex Agents) | Mosaic AI (Model Serving, Vector Search, AI Gateway) |
| **Streaming Paradigm** | Snowpipe Streaming (row-level) + Dynamic Tables | Spark Structured Streaming (micro-batch & continuous) + DLT |

**Senior Interview Summary:**
> *"By 2026, Snowflake and Databricks have largely converged on lakehouse capabilities. The selection criteria is operational: choose Snowflake for governed, low-maintenance SQL, zero-ops pipelines, and unified OLTP+OLAP; choose Databricks for heavy PySpark data engineering, complex distributed ML pipelines, and deep Spark customization. In modern hybrid enterprises, a common architecture uses Databricks for heavy transformation and Snowflake for serving, joined via shared Iceberg storage."*`
    }
  ]
};
