import { SectionPart } from '../../types';

export const PART_03_PERFORMANCE_DATA: SectionPart = {
  id: 'snowflake-part-03',
  title: 'Snowflake Part 03: Performance Tuning & Cost Governance',
  partNumber: 'PART 03',
  subtitle: 'Query Profile Diagnostics, Sargable Predicates, Clustering vs SOS vs MV vs QAS, FinOps & Resource Monitors',
  summary: 'A comprehensive senior engineering guide to diagnosing query bottlenecks and controlling cloud expenditure. Covers the 5-step Query Profile inspection routine, resolving local and remote memory spill, writing prune-friendly sargable predicates, deciding between Automatic Clustering, Search Optimization (SOS), Materialized Views, and Query Acceleration (QAS), empirical warehouse sizing, and the Cloud Services 10% billing rule.',
  readTimeMinutes: 25,
  terminologies: [
    {
      term: 'Query Profile',
      definition: 'Snowsight’s execution plan report detailing operator tree hierarchy, per-node timing percentages, bytes scanned, partitions pruned, spill volumes, and queue durations.',
      category: 'Diagnostics',
      highlight: true
    },
    {
      term: 'Pruning Ratio',
      definition: 'Partitions Scanned divided by Partitions Total. A high ratio (~1.0) indicates zero pruning (full table scan); a low ratio (<0.05) indicates effective metadata pruning.',
      category: 'Diagnostics',
      highlight: true
    },
    {
      term: 'Local Spill',
      definition: 'Occurs when an in-memory operator (Join, Aggregate, Sort) exhausts node RAM and writes intermediate data to local NVMe SSD. Causes moderate query latency.',
      category: 'Memory',
      highlight: true
    },
    {
      term: 'Remote Spill',
      definition: 'Critical failure state where local SSD capacity is exhausted and intermediate buffers spill over the network to cloud object storage. Causes 10×–100× severe performance drops.',
      category: 'Memory',
      highlight: true
    },
    {
      term: 'Sargable Predicate',
      definition: 'Search-Argument-Able filter condition where columns are bare (unwrapped by scalar functions or type casts), enabling the optimizer to match against partition min/max bounds.',
      category: 'Optimization',
      highlight: true
    },
    {
      term: 'Automatic Clustering',
      definition: 'Serverless background service that continuously sorts and compacts micro-partitions along specified clustering keys to tighten per-partition min/max ranges for range queries.',
      category: 'Optimization'
    },
    {
      term: 'Search Optimization Service (SOS)',
      definition: 'Serverless background service building persistent secondary inverted search indexes on high-cardinality columns for point lookups and substring predicates.',
      category: 'Optimization'
    },
    {
      term: 'Materialized View (MV)',
      definition: 'A precomputed, automatically maintained result set of a single-table aggregation or filter. The optimizer automatically rewrites incoming queries to leverage it.',
      category: 'Optimization'
    },
    {
      term: 'Query Acceleration Service (QAS)',
      definition: 'Per-warehouse capability that dynamically offloads eligible large scan and filter workloads to serverless burst compute when large queries exceed warehouse capacity.',
      category: 'Compute'
    },
    {
      term: 'Resource Monitor',
      definition: 'A Snowflake governance object enforcing credit consumption caps with configurable threshold triggers: NOTIFY at 75%/90%, SUSPEND at 100%, and SUSPEND_IMMEDIATE at 110%.',
      category: 'Cost Governance',
      highlight: true
    },
    {
      term: 'Cloud Services 10% Adjustment',
      definition: 'Billing rule: Daily Cloud Services usage is free up to 10% of total daily warehouse compute credits. Any consumption above 10% is billed directly.',
      category: 'Cost Governance',
      highlight: true
    }
  ],
  sections: [
    {
      heading: '1. Query Profile: The Five Diagnostic Questions (In Order)',
      subheading: 'Structured Protocol for Diagnosing Any Slow or Expensive Query',
      content: `Whenever a query is reported as slow, expensive, or stalling, **never guess or immediately scale up the warehouse**. Open Query Profile and investigate these five criteria in strict sequence:

1. **Where is the execution time going?**
   Inspect the *Most Expensive Nodes* list. One operator almost always accounts for 60%–90% of overall runtime. Identify whether the bottleneck is a \`TableScan\`, \`Join\`, \`Aggregate\`, or \`Sort\`.
2. **Is the query queueing?**
   Examine the execution timeline. If the query spent 4 minutes in *Queued (Overloaded)* state and only 12 seconds in *Execution*, the query is completely healthy—the virtual warehouse is saturated by concurrent workload.
3. **What is the Pruning Ratio on the primary \`TableScan\`?**
   Calculate \`Partitions Scanned / Partitions Total\`. If the scan reads 11,900 out of 12,000 micro-partitions for a single-day query, pruning has completely failed.
4. **Is there Local or Remote Spill?**
   Check operator metrics for *Bytes Spilled to Local Storage* (NVMe SSD) and *Bytes Spilled to Remote Storage* (Cloud Storage). Remote spill is an emergency diagnostic signal indicating memory exhaustion.
5. **Are rows exploding at any join node?**
   Compare input rows vs output rows on \`Join\` operators. If a join takes 500k rows on the probe side and produces 50 million rows, you have duplicate join keys or a Cartesian product.`,
      callouts: [
        {
          type: 'senior-line',
          title: 'Senior Diagnostic Order',
          text: 'Never jump straight to "make the warehouse bigger." Sizing up a warehouse running an exploding join or an unpruned full-table scan simply burns enterprise credits twice as fast without resolving the architectural defect.'
        }
      ]
    },
    {
      heading: '2. Signals of a Problem Cheat Sheet',
      subheading: 'Instant Pattern Recognition for Query Profile Operators',
      content: `| Query Profile Symptom | Root Cause | Immediate Surgical Remediation |
| :--- | :--- | :--- |
| **Pruning Ratio ≈ 1.0 (e.g. 10k/10k)** | Filter columns wrapped in functions, type cast mismatch, or unclustered high-cardinality data. | Remove scalar functions; make predicates sargable; evaluate clustering or SOS. |
| **Local Storage Spill > 0** | Join, Aggregate, or Window operator exhausted node memory; intermediate buffers written to SSD. | Pre-aggregate data in CTEs; project fewer columns; size up warehouse if queries are compute-heavy. |
| **Remote Storage Spill > 0** | Local SSD filled; data spilled across the network to cloud storage. Severe 10×–100× slowdown. | Critical: Size up warehouse immediately or eliminate massive Cartesian joins. |
| **Join Output Rows ≫ Input Rows** | Many-to-many join caused by duplicate keys in dimension or lookup dataset. | Deduplicate source with \`QUALIFY ROW_NUMBER() = 1\`; fix composite join key predicates. |
| **High "Queued (Overloaded)" Time** | Virtual warehouse concurrency limit reached; queries waiting for execution threads. | Enable multi-cluster auto-scaling or isolate analytical workloads to separate warehouses. |
| **Filter Operator after TableScan** | Optimizer could not push predicate down into the storage scan. | Rewrite subquery or remove non-deterministic function calls (\`RANDOM()\`, \`UUID()\`). |`
    },
    {
      heading: '3. Query Optimization: Sargable Predicates & Idiomatic SQL',
      subheading: 'Writing SQL That Maximizes Metadata Pruning and Minimizes Intermediate Buffering',
      content: `**1. Sargable Predicates (The Pruning Rule):**
A predicate is "sargable" when the column sits completely bare on one side of the operator. Wrapping a column in a function prevents the optimizer from evaluating column min/max bounds:

\`\`\`sql
-- ❌ Non-Sargable (Pruning fails, full table scan):
WHERE DATE(order_ts) = '2026-08-15'
WHERE order_id::VARCHAR = '99999'
WHERE SUBSTRING(customer_code, 1, 3) = 'USA'

-- ✅ Sargable (Pruning succeeds via metadata bounds):
WHERE order_ts >= '2026-08-15'::TIMESTAMP AND order_ts < '2026-08-16'::TIMESTAMP
WHERE order_id = 99999
WHERE customer_code LIKE 'USA%'
\`\`\`

**2. Modern Window Filtering with \`QUALIFY\`:**
Instead of wrapping window functions in bloated nested subqueries, use Snowflake's idiomatic \`QUALIFY\` clause:

\`\`\`sql
-- ✅ Idiomatic Top-N per group deduplication
SELECT order_id, customer_id, order_ts, amount_usd
FROM silver.orders
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_ts DESC) = 1;
\`\`\`

**3. CTE Inlining and Multi-Reference Materialization:**
In Snowflake, Common Table Expressions (CTEs) are treated as inline subqueries. If a complex CTE is referenced three times in a query, Snowflake may compute it three times! If Query Profile reveals duplicated execution subtrees, materialize into a \`TEMPORARY TABLE\` first.`,
      codeSnippets: [
        {
          title: 'Refactoring Anti-Patterns into High-Performance SQL',
          language: 'sql',
          code: `-- ❌ Slow Anti-Pattern: SELECT *, late filtering, function wrap
SELECT *
FROM sales s
JOIN customer c ON s.customer_id = c.customer_id
WHERE DATE(s.sale_timestamp) = '2026-09-01';

-- ✅ Optimized Pattern: Sargable filter, narrow projection, pre-filtered CTE
WITH filtered_sales AS (
    SELECT customer_id, sale_amount, sale_timestamp
    FROM sales
    WHERE sale_timestamp >= '2026-09-01 00:00:00'::TIMESTAMP_NTZ
      AND sale_timestamp <  '2026-09-02 00:00:00'::TIMESTAMP_NTZ
)
SELECT s.customer_id, c.customer_name, s.sale_amount
FROM filtered_sales s
JOIN customer c ON s.customer_id = c.customer_id;`
        }
      ]
    },
    {
      heading: '4. Performance Acceleration: Clustering vs SOS vs MV vs QAS',
      subheading: 'Selecting the Exact Performance Tool for the Specific Access Pattern',
      content: `Snowflake provides four distinct performance acceleration services. Using the wrong tool wastes budget with zero performance gain:

| Feature | Primary Workload Profile | Underlying Mechanism | Cost & Watch Outs |
| :--- | :--- | :--- | :--- |
| **Automatic Clustering** | Large tables (>500 GB) with **range scans or frequent joins** on 1–3 low/medium cardinality columns. | Serverless background service continuously reorders and compacts micro-partitions. | High maintenance credit cost on high-churn tables with constant DML rewrites. |
| **Search Optimization (SOS)** | Massive tables with **selective point lookups** on high-cardinality columns (\`WHERE email = ?\`). | Persistent secondary search access structure (inverted index). | Billed serverless maintenance credits. Avoid enabling on tables with low query frequency. |
| **Materialized View (MV)** | **Repeated expensive aggregations** on a single table; optimizer automatically rewrites matching queries. | Precomputed stored result set automatically refreshed upon underlying table DML. | Single-table restrictions; maintenance credits explode if the base table updates continuously. |
| **Query Acceleration (QAS)** | Warehouses with **occasional bursty scan-heavy queries** that would otherwise require sizing up. | Serverless burst compute dynamically leased for scan/filter phases of the query. | Billed by the second. Cap the scale factor to prevent runaway burst billing. |

**The Senior Rule of Thumb:**
- **Cluster** for range scans (\`BETWEEN\`, date ranges) on 1–3 columns.
- **Search Optimization (SOS)** for selective point lookups (\`WHERE id = ?\`, \`WHERE email = ?\`) on high-cardinality columns.
- **Materialized Views** for repeated single-table rollup summaries.
- **Query Acceleration (QAS)** for handling occasional heavy scan outliers without permanently sizing up.`,
      callouts: [
        {
          type: 'interview-line',
          title: 'Clustering Key Decision Heuristic',
          text: 'Do not cluster small tables (<100 GB). Before applying a clustering key, inspect SYSTEM$CLUSTERING_INFORMATION to verify whether natural ingestion ordering already provides acceptable pruning depth.'
        }
      ],
      figures: [
        {
          src: '/images/snowflake/tables-clustering-ratio.png',
          alt: 'Clustering Depth and Micro-Partition Overlap Comparison',
          title: 'Clustering Depth: Micro-Partition Overlap vs Pruning Efficiency',
          subtitle: 'Comparing Poorly Clustered vs Well Clustered Micro-Partition Depth',
          badge: 'PHYSICAL PRUNING',
          caption: 'Visualizing clustering depth in Snowflake. On the left, unclustered micro-partitions have wide, overlapping key ranges, forcing queries to scan multiple partitions. On the right, clustered partitions have tight, non-overlapping ranges, achieving near-perfect metadata pruning.',
          seniorTakeaway: 'Average clustering depth measures the average number of overlapping micro-partitions at any point. Lower depth equals faster query pruning and fewer partitions scanned.',
          tags: ['Clustering Depth', 'Micro-Partitions', 'Pruning Ratio', 'Automatic Clustering']
        },
        {
          src: '/images/snowflake/query-acceleration-table-scan.png',
          alt: 'Query Acceleration Service Offloaded Table Scan',
          title: 'Query Acceleration Service (QAS): Offloading Massive Scans',
          subtitle: 'Serverless Burst Compute Leased for Scan & Filter Operators',
          badge: 'BURST ACCELERATION',
          caption: 'How Query Acceleration Service (QAS) works: The primary virtual warehouse offloads massive scan and filter workloads to serverless burst compute resources, allowing large scan queries to finish up to 10× faster without permanently resizing the warehouse.',
          seniorTakeaway: 'Use QAS for warehouses with predictable, small interactive baseline queries but occasional bursty scan-heavy outlier queries. Check SYSTEM$ESTIMATE_QUERY_ACCELERATION before enabling.',
          tags: ['QAS', 'Serverless Burst', 'Table Scan', 'Warehouse Sizing']
        }
      ]
    },
    {
      heading: '5. Virtual Warehouse Sizing & Multi-Cluster Scaling',
      subheading: 'Empirical Right-Sizing, Auto-Suspend Discipline, and Scaling Policies',
      content: `**Sizing Up vs Scaling Out:**
- **Size Up (XS → 6XL):** Increases compute resources (CPUs and RAM) per node. Solves **single slow queries** that are compute-bound or memory-bound (spilling).
- **Scale Out (Multi-Cluster 1 → N):** Adds duplicate clusters of the same size. Solves **query concurrency bottlenecks** where queries are waiting in queue.

**Empirical Right-Sizing Methodology:**
Because credit burn doubles with each warehouse size (XS=1, S=2, M=4, L=8), a 2× speedup is cost-neutral.
1. Benchmark representative production workload on **XS**. Record execution seconds and credits consumed.
2. Step up to **S**. If execution time drops by ~50%, the query was compute-bound and cost remains identical.
3. Step up to **M**. If execution time drops by only 10%, you have hit the point of diminishing returns (I/O or network bottleneck). Step back down to **S**.

**Auto-Suspend Hygiene:**
- **ETL / Scheduled Pipelines:** Set \`AUTO_SUSPEND = 60\` (1 minute). Scheduled batch runs are cold; suspending immediately prevents burning credits on idle compute.
- **Interactive BI / User Dashboards:** Set \`AUTO_SUSPEND = 300\` to \`600\` (5–10 minutes). Preserves the **Warehouse Local SSD Cache** so users clicking between dashboard tabs get instant sub-second responses.`,
      codeSnippets: [
        {
          title: 'Configuring Production Multi-Cluster Warehouse with Standard Policy',
          language: 'sql',
          code: `-- Production BI Multi-Cluster Warehouse
CREATE OR REPLACE WAREHOUSE bi_reporting_wh
    WAREHOUSE_SIZE = 'MEDIUM'
    MIN_CLUSTER_COUNT = 1
    MAX_CLUSTER_COUNT = 5
    SCALING_POLICY = 'STANDARD'    -- Immediately spins up clusters on queueing
    AUTO_SUSPEND = 300             -- 5 minutes: preserves local SSD cache
    AUTO_RESUME = TRUE
    INITIALLY_SUSPENDED = TRUE
    COMMENT = 'Dedicated BI warehouse with multi-cluster auto-scaling';`
        }
      ]
    },
    {
      heading: '6. FinOps & Cost Governance: The Cloud Services 10% Rule',
      subheading: 'Resource Monitors, Storage Churn Mitigation, and Cloud Services Quotas',
      content: `**The Cloud Services 10% Adjustment Rule:**
Cloud Services compute (query compilation, authorization, metadata updates, result caching) is provided free up to **10% of total daily warehouse compute credits**.
- If your warehouses consume 100 credits in a day, up to 10 Cloud Services credits are waived.
- If Cloud Services consumes 14 credits, you are billed for the excess 4 credits.
- **What causes Cloud Services overspend?** Runaway high-frequency DDL statements, tiny micro-batch Snowpipe loads with thousands of single-row files, and rapid un-batched metadata polling.

**Enforcing Budget Guardrails with Resource Monitors:**
Always bind every production warehouse to a strict Resource Monitor:`,
      codeSnippets: [
        {
          title: 'Production Resource Monitor Configuration',
          language: 'sql',
          code: `-- Create Account-Level or Warehouse-Level Resource Monitor
CREATE OR REPLACE RESOURCE MONITOR rm_data_engineering_monthly
    WITH CREDIT_QUOTA = 1500
    FREQUENCY = MONTHLY
    START_TIMESTAMP = IMMEDIATELY
    TRIGGERS
        ON 75 PERCENT DO NOTIFY
        ON 90 PERCENT DO NOTIFY
        ON 100 PERCENT DO SUSPEND             -- Suspends new queries; running queries complete
        ON 110 PERCENT DO SUSPEND_IMMEDIATE;  -- Immediately cancels all active queries

-- Attach to ETL Warehouse
ALTER WAREHOUSE etl_wh SET RESOURCE_MONITOR = rm_data_engineering_monthly;`
        }
      ]
    },
    {
      heading: '7. Weekly FinOps Audit: Essential Diagnostic Queries',
      subheading: 'Production SQL for Monitoring Warehouses, Serverless Spends, and Storage Churn',
      content: `Senior data engineers maintain automated weekly cost audit dashboards using \`ACCOUNT_USAGE\` views:`,
      codeSnippets: [
        {
          title: 'Top Credit Burners and Serverless Service Breakdown',
          language: 'sql',
          code: `-- 1. Top 10 Warehouses by Credit Consumption (Last 7 Days)
SELECT warehouse_name,
       ROUND(SUM(credits_used), 2) AS total_credits,
       ROUND(SUM(credits_used_compute), 2) AS compute_credits,
       ROUND(SUM(credits_used_cloud_services), 2) AS cloud_services_credits
FROM SNOWFLAKE.ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY
WHERE start_time >= DATEADD(day, -7, CURRENT_TIMESTAMP())
GROUP BY warehouse_name
ORDER BY total_credits DESC;

-- 2. Audit Serverless Service Spends (Clustering, MVs, SOS, QAS)
SELECT 'Automatic Clustering' AS service_name, SUM(credits_used) AS credits
FROM SNOWFLAKE.ACCOUNT_USAGE.AUTOMATIC_CLUSTERING_HISTORY
WHERE start_time >= DATEADD(day, -7, CURRENT_TIMESTAMP())
UNION ALL
SELECT 'Materialized Views' AS service_name, SUM(credits_used) AS credits
FROM SNOWFLAKE.ACCOUNT_USAGE.MATERIALIZED_VIEW_REFRESH_HISTORY
WHERE start_time >= DATEADD(day, -7, CURRENT_TIMESTAMP())
UNION ALL
SELECT 'Search Optimization' AS service_name, SUM(credits_used) AS credits
FROM SNOWFLAKE.ACCOUNT_USAGE.SEARCH_OPTIMIZATION_HISTORY
WHERE start_time >= DATEADD(day, -7, CURRENT_TIMESTAMP())
UNION ALL
SELECT 'Query Acceleration' AS service_name, SUM(credits_used) AS credits
FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_ACCELERATION_HISTORY
WHERE start_time >= DATEADD(day, -7, CURRENT_TIMESTAMP());

-- 3. Identify Storage Churn Monsters (Tables with High Fail-safe / Time Travel)
SELECT table_catalog || '.' || table_schema || '.' || table_name AS full_table_name,
       ROUND(active_bytes / 1e9, 2) AS active_gb,
       ROUND(time_travel_bytes / 1e9, 2) AS time_travel_gb,
       ROUND(failsafe_bytes / 1e9, 2) AS failsafe_gb
FROM SNOWFLAKE.ACCOUNT_USAGE.TABLE_STORAGE_METRICS
WHERE active_bytes + time_travel_bytes + failsafe_bytes > 1e11 -- >100 GB
ORDER BY failsafe_bytes DESC
LIMIT 15;`
        }
      ]
    },
    {
      heading: '8. Performance & Cost Troubleshooting Trees',
      subheading: 'Fast Diagnostic Flowcharts for Senior Incident Response',
      content: `Use these ASCII diagnostic trees for fast mental triage during live interview scenarios:`,
      decisionTrees: [
        `PERFORMANCE TROUBLESHOOTING DECISION TREE
QUERY IS SLOW
  ├── High Queue Time? (>20% of total)
  │     └── Warehouse Concurrency Bottleneck → Scale out (Multi-Cluster) or isolate workload
  ├── Partitions Scanned ≈ Partitions Total?
  │     └── Pruning Failure
  │           ├── Function on column? → Rewrite as bare sargable predicate
  │           ├── Explicit cast? → Cast literal, not table column
  │           └── High cardinality unclustered? → Evaluate Clustering Key or SOS
  ├── Remote Storage Spill > 0?
  │     └── Critical Memory Exhaustion
  │           ├── Exploding Join? → Fix duplicate keys / Cartesian product
  │           └── Valid Big Data Join? → Size up warehouse (more RAM per node)
  └── Single Node > 70% Execution Time?
        └── Operator Bottleneck → Target that specific operator (Pre-aggregate / Hash join)`,
        `COST SPIKE TROUBLESHOOTING DECISION TREE
SNOWFLAKE BILL SPIKING
  ├── Warehouse Compute Spiking?
  │     ├── Long auto-suspend on idle ETL warehouse? → Reduce to 60s
  │     ├── Oversized warehouse for small queries? → Downsize to XS/S
  │     └── Uncapped multi-cluster warehouse? → Set strict MAX_CLUSTER_COUNT
  ├── Serverless Services Spiking?
  │     ├── Auto-clustering on high-churn table? → Drop clustering key
  │     ├── SOS enabled on low-query table? → Remove Search Optimization
  │     └── Aggressive Dynamic Table TARGET_LAG? → Relax lag to DOWNSTREAM on intermediates
  ├── Storage Costs Growing Rapidly?
  │     ├── Fail-safe on daily overwritten staging tables? → Convert to TRANSIENT
  │     ├── Orphaned Zero-Copy Clones accumulating divergence? → Drop unused dev clones
  │     └── 90-day Time Travel on churny logs? → Reduce retention to 1–7 days
  └── Cloud Services > 10% of Warehouse Credits?
        └── Excessive DDL churn, un-batched Snowpipe, or micro-transactions → Batch queries`
      ]
    }
  ]
};
