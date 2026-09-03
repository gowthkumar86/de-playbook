import { SectionPart } from '../../types';

export const PART_02_DATA_ENGINEERING_DATA: SectionPart = {
  id: 'snowflake-part-02',
  title: 'Snowflake Part 02: Data Engineering Pipelines',
  partNumber: 'PART 02',
  subtitle: 'Stages, Ingestion, CDC Streams & Tasks, Adaptive Dynamic Tables, and Recovery',
  summary: 'Complete architectural guide to building production data pipelines in Snowflake. Covers Storage Integrations and External Stages, idempotent COPY INTO batch loading, Snowpipe continuous file ingestion, Snowpipe Streaming row-level CDC, Streams offset mechanics, Task DAG orchestration, Adaptive Dynamic Tables, and zero-data-loss recovery with Time Travel and Zero-Copy Cloning.',
  readTimeMinutes: 25,
  terminologies: [
    {
      term: 'Stage',
      definition: 'A Snowflake object referencing file storage (internal or external cloud bucket). Acts as the bridge between raw files and structured relational tables.',
      category: 'Ingestion'
    },
    {
      term: 'Storage Integration',
      definition: 'A secure cloud identity object binding Snowflake to cloud IAM roles (AWS IAM, Azure Service Principal, GCP Service Account), eliminating embedded credentials in DDL.',
      category: 'Security',
      highlight: true
    },
    {
      term: 'COPY INTO',
      definition: 'The fundamental SQL batch loading command. Idempotent by default because Snowflake retains a 64-day file load history per table.',
      category: 'Ingestion',
      highlight: true
    },
    {
      term: 'Snowpipe',
      definition: 'Serverless continuous file ingestion that automatically executes COPY INTO when cloud storage notifications (SQS/EventGrid) arrive. ~1 minute latency.',
      category: 'Ingestion'
    },
    {
      term: 'Snowpipe Streaming',
      definition: 'Low-latency row-level ingestion SDK/Kafka connector that writes directly into micro-partitions without intermediate file buffering. Seconds latency, exactly-once via offset tokens.',
      category: 'Ingestion',
      highlight: true
    },
    {
      term: 'Stream',
      definition: 'A change cursor on a source table tracking DML deltas (inserts, updates, deletes) since the last commit. Does not store data; points into the source’s Time Travel history.',
      category: 'CDC',
      highlight: true
    },
    {
      term: 'Stream Offset',
      definition: 'The stream’s bookmark pointer. Advances only when the stream is consumed inside an atomic DML transaction (INSERT, UPDATE, DELETE, MERGE).',
      category: 'CDC',
      highlight: true
    },
    {
      term: 'Task',
      definition: 'A scheduled or event-driven SQL runner inside Snowflake. Supports CRON schedules, dependency chaining with AFTER (DAGs), and conditional execution.',
      category: 'Orchestration'
    },
    {
      term: 'Dynamic Table',
      definition: 'A declarative table defined by a SELECT query whose contents are automatically refreshed by Snowflake to satisfy a target data freshness lag (TARGET_LAG).',
      category: 'Transformations',
      highlight: true
    },
    {
      term: 'TARGET_LAG = DOWNSTREAM',
      definition: 'A Dynamic Table setting specifying that the table should only refresh when downstream consumers require fresh data, preventing redundant intermediate refreshes.',
      category: 'Transformations'
    },
    {
      term: 'ADAPTIVE Refresh Mode',
      definition: 'Dynamic Table refresh mode (GA July 2026) that prefers incremental processing but automatically reinitializes with a full rebuild when cost/cardinality makes it cheaper.',
      category: 'Transformations',
      highlight: true
    },
    {
      term: 'OVERLAP_POLICY',
      definition: 'Task-graph concurrency control parameter (NO_OVERLAP, ALLOW_CHILD_OVERLAP, ALLOW_ALL_OVERLAP) replacing the deprecated ALLOW_OVERLAPPING_EXECUTION.',
      category: 'Orchestration'
    },
    {
      term: 'Time Travel',
      definition: 'Querying historical table states up to 90 days in the past using AT/BEFORE clauses (OFFSET, TIMESTAMP, STATEMENT). A user-facing query and recovery feature.',
      category: 'Recovery'
    },
    {
      term: 'Fail-safe',
      definition: 'Non-configurable 7-day disaster recovery period following Time Travel expiration, accessible only by Snowflake Support for permanent tables.',
      category: 'Recovery'
    },
    {
      term: 'Zero-Copy Clone',
      definition: 'Instant snapshot creation of databases, schemas, or tables that references existing micro-partitions without duplicating physical storage until writes diverge.',
      category: 'Recovery',
      highlight: true
    }
  ],
  sections: [
    {
      heading: '1. Stages & Secure Cloud Ingestion',
      subheading: 'Eliminating Cloud Credentials from SQL via Storage Integrations',
      content: `A **stage** is Snowflake's abstraction for file storage. Data is never parsed on the fly into tables; ingestion always follows the controlled pattern: **Cloud Storage → Stage → Table**.

There are four distinct stage types:
1. **User Stage (\`@~\`):** Private to each user; ideal for local file inspection.
2. **Table Stage (\`@%table_name\`):** Dedicated to a single table; cannot be shared.
3. **Named Internal Stage (\`@stage_name\`):** Reusable managed stage inside Snowflake storage.
4. **Named External Stage (\`@stage_name\`):** References customer-owned S3 buckets, Azure Blob/ADLS containers, or GCS buckets. **The enterprise production standard.**

**Production Security Best Practice:** Never embed AWS Access Keys or Azure SAS tokens in stage DDL. Always configure a **Storage Integration** that establishes trust with cloud IAM roles:`,
      codeSnippets: [
        {
          title: 'Storage Integration and External Stage Setup (AWS S3)',
          language: 'sql',
          code: `-- 1. Create Cloud Storage Integration (Requires ACCOUNTADMIN)
CREATE OR REPLACE STORAGE INTEGRATION s3_orders_integration
    TYPE = EXTERNAL_STAGE
    STORAGE_PROVIDER = 'S3'
    ENABLED = TRUE
    STORAGE_AWS_ROLE_ARN = 'arn:aws:iam::123456789012:role/SnowflakeIngestRole'
    STORAGE_ALLOWED_LOCATIONS = ('s3://acme-analytics-production/orders/');

-- 2. Inspect Integration to retrieve AWS IAM User ARN and External ID
DESC INTEGRATION s3_orders_integration;
-- Output yields:
-- STORAGE_AWS_IAM_USER_ARN: arn:aws:iam::987654321098:user/xyz
-- STORAGE_AWS_EXTERNAL_ID:  ACME_1234567
-- Update AWS IAM Role trust policy with these values.

-- 3. Define Reusable File Format
CREATE OR REPLACE FILE FORMAT ff_parquet_orders
    TYPE = PARQUET
    COMPRESSION = AUTO;

-- 4. Create External Stage referencing Storage Integration
CREATE OR REPLACE STAGE stg_orders_external
    URL = 's3://acme-analytics-production/orders/'
    STORAGE_INTEGRATION = s3_orders_integration
    FILE_FORMAT = ff_parquet_orders;

-- 5. Query Stage directly without loading
LIST @stg_orders_external;

SELECT $1:order_id::NUMBER AS order_id,
       $1:customer_id::NUMBER AS customer_id,
       $1:amount::NUMBER(18,2) AS amount
FROM @stg_orders_external/2026/09/03/
LIMIT 10;`
        }
      ],
      callouts: [
        {
          type: 'senior-line',
          title: 'Storage Integration Rule',
          text: 'In enterprise interviews, never mention embedding credentials in Stage DDL. State that you configure cross-account IAM trust using Storage Integrations with External IDs to prevent the Confused Deputy problem.'
        }
      ]
    },
    {
      heading: '2. Batch Ingestion with COPY INTO & Idempotency Guarantees',
      subheading: 'Understanding 64-Day Load History and Why FORCE = TRUE is Dangerous',
      content: `\`COPY INTO\` is the core bulk loading primitive in Snowflake. It reads staged files and appends rows into destination tables.

**Why COPY INTO is Idempotent by Default:**
For every table, Snowflake automatically tracks file load metadata in the Cloud Services catalog for **~64 days**. Every loaded file's full URI, size, and MD5 checksum are recorded.
- If a scheduled pipeline crashes and retries the same \`COPY INTO\` command, Snowflake skips already-loaded files.
- **Zero duplicate rows are generated.**

**The Danger of \`FORCE = TRUE\`:**
Specifying \`FORCE = TRUE\` instructs Snowflake to ignore the 64-day load history and reload files even if previously recorded. In automated scheduled pipelines, \`FORCE = TRUE\` is a critical defect that generates massive data duplication upon transient failure retries.`,
      codeSnippets: [
        {
          title: 'Production COPY INTO with Parquet Column Mapping & Error Handling',
          language: 'sql',
          code: `-- Target Raw Table
CREATE OR REPLACE TABLE raw.orders (
    order_id     NUMBER,
    customer_id  NUMBER,
    order_ts     TIMESTAMP_NTZ,
    amount_usd   NUMBER(18,2),
    _file_name   STRING DEFAULT METADATA$FILENAME,
    _loaded_at   TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Idempotent Bulk Load
COPY INTO raw.orders
FROM @stg_orders_external/2026/09/03/
FILE_FORMAT = (TYPE = PARQUET)
MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE
ON_ERROR = 'ABORT_STATEMENT';

-- Audit File Load History
SELECT file_name, status, row_count, error_count, first_error_message
FROM TABLE(INFORMATION_SCHEMA.COPY_HISTORY(
    TABLE_NAME => 'RAW.ORDERS',
    START_TIME => DATEADD(hour, -24, CURRENT_TIMESTAMP())
))
ORDER BY last_load_time DESC;`
        }
      ],
      callouts: [
        {
          type: 'gotcha',
          title: '64-Day Load History Boundary',
          text: 'The 64-day idempotency window is tracked per [Table + File Path]. If an upstream producer renames a file or moves it to an archive directory, Snowflake treats it as a new file and reloads it.'
        }
      ]
    },
    {
      heading: '3. Continuous Ingestion: Snowpipe & Snowpipe Streaming',
      subheading: 'Comparing File-Based Auto-Ingest (~1 Min) vs. Row-Level SDK (Seconds)',
      content: `Modern ingestion requires choosing the correct ingestion primitive based on latency, source architecture, and cost:

1. **Snowpipe (File-Based Auto-Ingest):**
   - Operates on object storage files (S3, ADLS, GCS).
   - Driven by cloud storage event notifications (S3 SQS, Azure Event Grid) triggering a serverless queue.
   - Typical latency: **~1 minute**.
   - **Crucial 2025/2026 Pricing Update:** Snowpipe pricing was simplified in December 2025 to a **per-GB model** (uncompressed size for text, observed size for Parquet/Avro). The obsolete "per 1,000 files + core-second" model is deprecated.
2. **Snowpipe Streaming (Row-Level Ingestion):**
   - **No stages, no intermediate files.** Ingests records directly via Java SDK or the Snowflake Kafka Connector.
   - Typical latency: **sub-10 seconds**.
   - Channels and offset tokens guarantee **exactly-once delivery** on retry.
3. **Snowflake Openflow:**
   - Managed Apache NiFi runtime for complex SaaS connectors and log-based database CDC replication.`,
      codeSnippets: [
        {
          title: 'Snowpipe Auto-Ingest DDL & Monitoring',
          language: 'sql',
          code: `-- 1. Define Serverless Snowpipe
CREATE OR REPLACE PIPE raw.pipe_orders_ingest
    AUTO_INGEST = TRUE
AS
COPY INTO raw.orders (order_id, customer_id, order_ts, amount_usd)
FROM @stg_orders_external
FILE_FORMAT = (TYPE = PARQUET)
MATCH_BY_COLUMN_NAME = CASE_INSENSITIVE;

-- 2. Retrieve the Cloud Notification SQS ARN
SHOW PIPES LIKE 'pipe_orders_ingest';
-- Copy the value from 'notification_channel' column:
-- arn:aws:sqs:us-east-1:123456789012:sf-snowpipe-XYZ
-- Configure S3 Bucket Event Notification to publish 'ObjectCreated' events to this SQS ARN.

-- 3. Check Real-Time Pipe Health & Pending Files
SELECT SYSTEM$PIPE_STATUS('raw.pipe_orders_ingest');`
        }
      ],
      callouts: [
        {
          type: 'interview-line',
          title: 'Snowpipe vs Snowpipe Streaming Decision',
          text: 'Use Snowpipe for micro-batch file arrivals from ADF or lake exports (~1 min latency). Use Snowpipe Streaming via Kafka Connector for sub-10s streaming event rows directly from event buses.'
        }
      ]
    },
    {
      heading: '4. Change Data Capture (CDC) with Streams',
      subheading: 'Change Cursor Mechanics, Offset Advancement, and Metadata Columns',
      content: `A **Stream** is Snowflake's native CDC primitive. It acts as an **offset cursor** pointing into the source table's Time Travel change history.

**Stream Mechanics:**
- A stream does not duplicate or store data physically.
- When you query a stream, it computes the delta between its current offset and the source table's current version.
- **The Offset Trap:** Running a \`SELECT * FROM my_stream\` **does NOT advance the offset**. The offset advances forward *only when the stream is consumed in an executed DML statement* (\`INSERT\`, \`UPDATE\`, \`DELETE\`, \`MERGE\`).
- If a DML transaction rolls back, the offset stays at its previous position—guaranteeing zero data loss.

**Stream Metadata Columns:**
Every stream appends three essential metadata columns to the source schema:
- \`METADATA$ACTION\`: \`'INSERT'\` or \`'DELETE'\`.
- \`METADATA$ISUPDATE\`: \`TRUE\` or \`FALSE\`.
- \`METADATA$ROW_ID\`: Stable opaque row hash.

*How Updates Are Represented:* An \`UPDATE\` on the source table is recorded as **two rows** in the stream: a \`DELETE\` row followed by an \`INSERT\` row, both flagged with \`METADATA$ISUPDATE = TRUE\`.`,
      codeSnippets: [
        {
          title: 'Standard Stream Creation & Atomic MERGE into Silver',
          language: 'sql',
          code: `-- 1. Create Stream on Raw Ingestion Table
CREATE OR REPLACE STREAM raw.orders_stream
    ON TABLE raw.orders
    APPEND_ONLY = FALSE;

-- 2. Atomic MERGE consuming Stream (Advances Offset Only Upon Success)
MERGE INTO silver.orders t
USING raw.orders_stream s
ON t.order_id = s.order_id
-- Handle Source Deletes
WHEN MATCHED AND s.METADATA$ACTION = 'DELETE' AND s.METADATA$ISUPDATE = FALSE
    THEN DELETE
-- Handle Source Updates
WHEN MATCHED AND s.METADATA$ACTION = 'INSERT' AND s.METADATA$ISUPDATE = TRUE
    THEN UPDATE SET
        t.customer_id = s.customer_id,
        t.amount_usd  = s.amount_usd,
        t.updated_at  = CURRENT_TIMESTAMP()
-- Handle Source Inserts
WHEN NOT MATCHED AND s.METADATA$ACTION = 'INSERT'
    THEN INSERT (order_id, customer_id, amount_usd, updated_at)
         VALUES (s.order_id, s.customer_id, s.amount_usd, CURRENT_TIMESTAMP());

-- Stream offset has now atomically advanced to the commit timestamp.`
        }
      ],
      callouts: [
        {
          type: 'warning',
          title: 'Stale Stream Failure',
          text: 'If a stream is not consumed for longer than the source table’s DATA_RETENTION_TIME_IN_DAYS, the stream goes stale and throws an error. It cannot be recovered and must be recreated.'
        }
      ]
    },
    {
      heading: '5. Advanced MERGE Patterns: SCD1, SCD2 & Source Deduplication',
      subheading: 'Handling Duplicate Source Keys and Maintaining Historical Validity Windows',
      content: `The \`MERGE\` statement is the primary SQL workhorse for CDC replication.

**Non-Deterministic Match Trap:**
If the source stream contains multiple rows with the same primary key in a single batch (e.g. rapid multiple updates to \`order_id = 45\`), Snowflake throws a **non-deterministic match error** because it cannot determine which row should win.
**Solution:** Always deduplicate the source change set using \`QUALIFY ROW_NUMBER() OVER (PARTITION BY key ORDER BY timestamp DESC) = 1\` before merging.

**SCD Type 1 vs SCD Type 2:**
- **SCD Type 1:** Overwrite in place. Keeps current state only.
- **SCD Type 2:** Preserves historical audit trail. Closes previous active record (\`is_current = FALSE\`, \`valid_to = CURRENT_TIMESTAMP()\`) and inserts a new record (\`is_current = TRUE\`, \`valid_from = CURRENT_TIMESTAMP()\`).`,
      codeSnippets: [
        {
          title: 'SCD Type 2 Historical Dimension Load Pattern',
          language: 'sql',
          code: `-- Historical SCD2 Dimension Table
CREATE OR REPLACE TABLE silver.customer_scd2 (
    customer_key NUMBER AUTOINCREMENT,
    customer_id  NUMBER,
    email        STRING,
    status       STRING,
    valid_from   TIMESTAMP_NTZ,
    valid_to     TIMESTAMP_NTZ,
    is_current   BOOLEAN
);

-- Transactional SCD2 Load
BEGIN TRANSACTION;

-- Step A: Expire currently active records that experienced updates
UPDATE silver.customer_scd2 t
SET t.valid_to   = CURRENT_TIMESTAMP(),
    t.is_current = FALSE
FROM (
    SELECT customer_id, email, status
    FROM raw.customer_stream
    WHERE METADATA$ACTION = 'INSERT'
    QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY _loaded_at DESC) = 1
) s
WHERE t.customer_id = s.customer_id
  AND t.is_current = TRUE
  AND (t.email <> s.email OR t.status <> s.status);

-- Step B: Insert new versions as current
INSERT INTO silver.customer_scd2 (customer_id, email, status, valid_from, valid_to, is_current)
SELECT s.customer_id, s.email, s.status, CURRENT_TIMESTAMP(), NULL, TRUE
FROM (
    SELECT customer_id, email, status
    FROM raw.customer_stream
    WHERE METADATA$ACTION = 'INSERT'
    QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY _loaded_at DESC) = 1
) s;

COMMIT;`
        }
      ]
    },
    {
      heading: '6. Task Orchestration & DAGs',
      subheading: 'Automating Pipelines with Serverless Compute and OVERLAP_POLICY',
      content: `A **Task** is a native scheduler in Snowflake executing SQL or stored procedures.

**Task Graphs (DAGs):**
Tasks can be chained into Directed Acyclic Graphs (DAGs) using the \`AFTER\` clause. The root task defines the CRON schedule; child tasks fire automatically upon parent completion.

**Cost Optimization with \`WHEN SYSTEM$STREAM_HAS_DATA()\`:
Evaluating \`WHEN SYSTEM$STREAM_HAS_DATA('raw.orders_stream')\` costs **zero compute credits**. If no new rows exist in the stream, the task execution is skipped entirely without resuming the warehouse!

**Modern Concurrency Model: \`OVERLAP_POLICY\`:**
The legacy parameter \`ALLOW_OVERLAPPING_EXECUTION\` is deprecated. The current standard is \`OVERLAP_POLICY\`:
- \`NO_OVERLAP\`: (Default) If a previous run is still active, new root runs wait.
- \`ALLOW_CHILD_OVERLAP\`: Child task instances can overlap while roots remain serialized.
- \`ALLOW_ALL_OVERLAP\`: Multiple whole-graph runs can execute concurrently.`,
      codeSnippets: [
        {
          title: 'Production Task Graph with Stream Check and Finalizer',
          language: 'sql',
          code: `-- 1. Root Task with CRON Schedule and Zero-Cost Stream Guard
CREATE OR REPLACE TASK task_root_orders_silver
    WAREHOUSE = etl_wh
    SCHEDULE = 'USING CRON */5 * * * * UTC'
    WHEN SYSTEM$STREAM_HAS_DATA('RAW.ORDERS_STREAM')
    OVERLAP_POLICY = NO_OVERLAP
AS
MERGE INTO silver.orders t
USING raw.orders_stream s
ON t.order_id = s.order_id
WHEN MATCHED AND s.METADATA$ACTION = 'INSERT'
    THEN UPDATE SET t.amount_usd = s.amount_usd, t.updated_at = CURRENT_TIMESTAMP()
WHEN NOT MATCHED AND s.METADATA$ACTION = 'INSERT'
    THEN INSERT (order_id, customer_id, amount_usd, updated_at)
         VALUES (s.order_id, s.customer_id, s.amount_usd, CURRENT_TIMESTAMP());

-- 2. Dependent Child Task (Runs AFTER root)
CREATE OR REPLACE TASK task_child_gold_aggregate
    WAREHOUSE = etl_wh
    AFTER task_root_orders_silver
AS
INSERT INTO gold.daily_revenue (order_date, total_revenue)
SELECT TO_DATE(updated_at), SUM(amount_usd)
FROM silver.orders
WHERE updated_at >= DATEADD(hour, -1, CURRENT_TIMESTAMP())
GROUP BY 1;

-- 3. Remember: Tasks are created SUSPENDED!
ALTER TASK task_child_gold_aggregate RESUME;
ALTER TASK task_root_orders_silver RESUME;`
        }
      ]
    },
    {
      heading: '7. Declarative Pipelines: Dynamic Tables',
      subheading: 'Declarative SQL vs Procedural Streams+Tasks & 2026 Adaptive Refresh',
      content: `A **Dynamic Table** is a managed table whose contents are defined by a single \`SELECT\` query and automatically kept fresh by Snowflake's background engine to meet a specified \`TARGET_LAG\`.

**Declarative vs Procedural Paradigm:**
- In Streams & Tasks, you write procedural imperative plumbing: create stream, write MERGE, handle deletes, schedule task, handle DAG failures.
- In Dynamic Tables, you declare **what the output must look like** and **how fresh it needs to be**. Snowflake dynamically calculates the refresh schedule, analyzes query dependency trees, and refreshes incrementally.

**Key Parameters:**
- \`TARGET_LAG\`: The maximum acceptable data staleness (e.g. \`'5 minutes'\`, \`'1 hour'\`). Minimum is 60 seconds. It is a freshness target, not a strict cron timer.
- \`TARGET_LAG = DOWNSTREAM\`: Specified on intermediate transformation tables. Instructs Snowflake to refresh the intermediate table *only when downstream consumer tables require fresh data*, eliminating unnecessary processing.
- **2026 Refresh Modes:**
  - \`ADAPTIVE\` (GA July 2026 - Modern Default): Prefers incremental refresh, but intelligently switches to a full rebuild if a full recompute is cheaper.
  - \`INCREMENTAL\`: Enforces incremental processing (fails if SQL query is not incrementalizable).
  - \`FULL\`: Recomputes the entire table from scratch on every refresh.
  - \`CUSTOM_INCREMENTAL\` (GA July 2026): Allows engineers to supply custom DML expressions (\`MERGE INTO SELF\`).`,
      codeSnippets: [
        {
          title: '3-Layer Chained Dynamic Table Pipeline',
          language: 'sql',
          code: `-- Layer 1: Cleaned Intermediate Table (Downstream Lag)
CREATE OR REPLACE DYNAMIC TABLE dt_orders_clean
    TARGET_LAG = DOWNSTREAM
    WAREHOUSE = transform_wh
    REFRESH_MODE = ADAPTIVE
AS
SELECT order_id, customer_id, amount_usd, TO_DATE(order_ts) AS order_date
FROM raw.orders
WHERE amount_usd > 0 AND customer_id IS NOT NULL;

-- Layer 2: Daily Customer Rollup (Downstream Lag)
CREATE OR REPLACE DYNAMIC TABLE dt_customer_daily_spend
    TARGET_LAG = DOWNSTREAM
    WAREHOUSE = transform_wh
    REFRESH_MODE = ADAPTIVE
AS
SELECT customer_id, order_date, COUNT(*) AS order_count, SUM(amount_usd) AS total_spend
FROM dt_orders_clean
GROUP BY customer_id, order_date;

-- Layer 3: Gold Serving Table (Drives Pipeline with 5-Minute Freshness Target)
CREATE OR REPLACE DYNAMIC TABLE gold.customer_executive_kpi
    TARGET_LAG = '5 minutes'
    WAREHOUSE = transform_wh
    REFRESH_MODE = ADAPTIVE
AS
SELECT c.customer_id, c.customer_name, k.order_date, k.order_count, k.total_spend
FROM dt_customer_daily_spend k
JOIN silver.customers c ON k.customer_id = c.customer_id;`
        }
      ]
    },
    {
      heading: '8. Disaster Recovery & Zero-Data-Loss: Time Travel & Zero-Copy Cloning',
      subheading: 'AT/BEFORE Query Expressions, Retention Boundaries, and Metadata Clones',
      content: `Because Snowflake storage is append-only and micro-partitions are immutable, point-in-time recovery and instant cloning are native metadata operations:

**Time Travel Mechanics:**
Query historical table states using four syntax variations:
1. \`AT (OFFSET => -60*15)\`: 15 minutes in the past.
2. \`AT (TIMESTAMP => '2026-09-03 08:00:00'::TIMESTAMP)\`: Exact historical moment.
3. \`BEFORE (STATEMENT => '01a7c123-abcd-...')\`: Exact state prior to a corrupt query execution.
4. \`UNDROP TABLE / SCHEMA / DATABASE\`: Restores dropped objects instantly within the retention window.

**Time Travel vs Fail-safe:**
- **Time Travel:** 0–1 day (Standard) or 0–90 days (Enterprise+). User-queryable via SQL.
- **Fail-safe:** Non-configurable 7-day window *after* Time Travel expires. Permanent tables only; recoverable exclusively by Snowflake Support.
- Transient and temporary tables have **zero Fail-safe**, providing significant storage cost savings for staging.

**Zero-Copy Cloning (\`CLONE\`):**
Creates a new independent catalog object that shares physical micro-partitions with the source object.
- Completes in seconds regardless of source size (even 100 TB).
- Incurs **zero additional storage cost at creation**. Storage costs accrue only as the clone or source diverge over time.
- Ideal for spinning up ephemeral QA/Dev environments from production and creating pre-deployment safety snapshots.`,
      codeSnippets: [
        {
          title: 'Accidental DELETE Production Recovery & Snapshot Cloning',
          language: 'sql',
          code: `-- Scenario: Bad DELETE wiped out production orders table!
-- 1. Identify the offending query ID from history
SELECT query_id, query_text, start_time
FROM TABLE(INFORMATION_SCHEMA.QUERY_HISTORY_BY_USER())
WHERE query_text ILIKE '%DELETE FROM prod.orders%'
ORDER BY start_time DESC LIMIT 1;

-- 2. Recover table state immediately prior to corruption using Time Travel
CREATE OR REPLACE TABLE prod.orders_rescued AS
SELECT * FROM prod.orders BEFORE (STATEMENT => '01a7c123-abcd-1234-5678');

-- 3. Restore in place via Zero-Copy Clone
CREATE OR REPLACE TABLE prod.orders CLONE prod.orders_rescued;
DROP TABLE prod.orders_rescued;

-- 4. Spin up isolated Dev environment from Production with COPY GRANTS
CREATE OR REPLACE DATABASE dev_analytics
    CLONE prod_analytics
    COPY GRANTS;`
        }
      ]
    },
    {
      heading: '9. End-to-End Reference Architecture: The Retail Pipeline',
      subheading: 'Assembling Ingestion, CDC, Transformations, and Recovery into a Unified Flow',
      content: `The complete production pipeline combines all concepts:
1. **Landing:** S3 JSON/Parquet files ingested continuously via Snowpipe.
2. **CDC:** Standard Stream tracks raw inserts.
3. **Silver Transformation:** Task executes atomic \`MERGE\` with \`WHEN SYSTEM$STREAM_HAS_DATA\` into \`silver.orders\`.
4. **Gold Modeling:** Adaptive Dynamic Table chain maintains executive dashboards with 5-minute \`TARGET_LAG\`.
5. **Safety Net:** 30-day Time Travel and on-demand Zero-Copy Cloning for dev testing.`,
      mermaidDiagrams: [
        `flowchart LR
    S3["S3 Bucket (Raw Orders)"] -->|S3 Event SQS| PIPE["Snowpipe (Auto-Ingest)"]
    STG["Storage Integration + External Stage"] --- PIPE
    PIPE -->|Idempotent COPY INTO| RAW[("raw.orders")]
    RAW --> STR["Stream (raw.orders_stream)"]
    STR -->|WHEN STREAM_HAS_DATA| TSK["Task (MERGE CDC)"]
    TSK --> SIL[("silver.orders")]
    SIL --> DT1["Dynamic Table 1 (Cleaned)"]
    DT1 --> DT2["Dynamic Table 2 (Gold Dashboard)"]
    DT2 --> BI["BI Dashboards (Snowsight/PowerBI)"]`
      ]
    }
  ]
};
