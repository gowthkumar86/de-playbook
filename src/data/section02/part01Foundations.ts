import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_01_TERMINOLOGIES: TermItem[] = [
  {
    term: 'Relation / table',
    definition: 'A set of rows with a fixed schema (columns + types). Order of rows is not guaranteed unless you ORDER BY.',
    category: 'Relational Model',
  },
  {
    term: 'Row / tuple',
    definition: 'One record — an ordered set of column values.',
    category: 'Relational Model',
  },
  {
    term: 'Predicate',
    definition: 'Any boolean expression, usually in a WHERE, ON, HAVING, or CASE.',
    category: 'Relational Model',
  },
  {
    term: 'NULL',
    definition: 'The three-valued logic marker for "unknown." NULL = NULL is unknown, not TRUE. NULL <> NULL is also unknown. This is why you use IS NULL / IS NOT NULL.',
    category: 'Relational Model',
    highlight: true,
  },
  {
    term: 'Cardinality',
    definition: 'How many rows a relation has. Also used informally for "how many distinct values" (e.g., "email is high cardinality").',
    category: 'Statistics & Storage',
  },
  {
    term: 'Grain',
    definition: 'The level at which one row represents one thing in your model. sales grain = one row per sale; daily_sales grain = one row per (product, day). Interviewers ask "what\'s the grain of that table?" — it means "what does one row represent?"',
    category: 'Data Modeling',
    highlight: true,
  },
  {
    term: 'Join',
    definition: 'An operation that combines rows from two relations based on a predicate.',
    category: 'Joins',
  },
  {
    term: 'INNER JOIN',
    definition: 'Only rows where the predicate matches on both sides.',
    category: 'Joins',
  },
  {
    term: 'LEFT JOIN (LEFT OUTER JOIN)',
    definition: 'All rows from the left; matched rows from the right; NULL on the right where no match.',
    category: 'Joins',
    highlight: true,
  },
  {
    term: 'RIGHT JOIN',
    definition: 'Mirror of LEFT JOIN. Rare in practice — swap the tables and use LEFT JOIN instead for readability.',
    category: 'Joins',
  },
  {
    term: 'FULL JOIN (FULL OUTER JOIN)',
    definition: 'All rows from both sides; NULL where a side has no match.',
    category: 'Joins',
  },
  {
    term: 'CROSS JOIN',
    definition: 'Cartesian product — every left row × every right row. Usually a mistake unless intentional (e.g., calendar × products).',
    category: 'Joins',
  },
  {
    term: 'Self-join',
    definition: 'A table joined to itself, usually with an alias. Used for hierarchies, adjacent-row comparisons, or matching pairs within one table.',
    category: 'Joins',
  },
  {
    term: 'Semi-join',
    definition: '"Does a matching row exist on the other side?" Snowflake / Postgres express this as EXISTS. Returns left-side rows only, no duplicates from many-to-one relationships.',
    category: 'Joins',
    highlight: true,
  },
  {
    term: 'Anti-join',
    definition: 'The opposite of a semi-join — "no matching row exists on the other side." Expressed as NOT EXISTS or LEFT JOIN ... WHERE right IS NULL.',
    category: 'Joins',
    highlight: true,
  },
  {
    term: 'Aggregation',
    definition: 'Collapsing many rows into one summary row using functions like SUM, COUNT, AVG, MIN, MAX, ARRAY_AGG, STRING_AGG, LISTAGG.',
    category: 'Aggregations',
  },
  {
    term: 'GROUP BY',
    definition: 'Splits the input into groups and produces one row per group. Every column in the SELECT must either be in GROUP BY or inside an aggregate.',
    category: 'Aggregations',
  },
  {
    term: 'HAVING',
    definition: 'Filter applied after aggregation. WHERE filters before aggregation.',
    category: 'Aggregations',
    highlight: true,
  },
  {
    term: 'GROUPING SETS / ROLLUP / CUBE',
    definition: 'Compute multiple grouping levels in one query — subtotals and grand totals in a single pass.',
    category: 'Aggregations',
  },
  {
    term: 'CTE (Common Table Expression)',
    definition: 'A named subquery introduced with WITH. Improves readability. In Snowflake and most engines it\'s usually inlined (recomputed at each reference), so it\'s not a materialization boundary.',
    category: 'Subqueries & CTEs',
    highlight: true,
  },
  {
    term: 'Recursive CTE',
    definition: 'A CTE that references itself. Used for hierarchies, graph traversal, running sequences, and gaps & islands.',
    category: 'Subqueries & CTEs',
  },
  {
    term: 'Subquery',
    definition: 'A query inside a query. Three flavors: scalar (returns one value), row (returns one row), table (returns many rows).',
    category: 'Subqueries & CTEs',
  },
  {
    term: 'Correlated subquery',
    definition: 'A subquery that references columns from the outer query. Conceptually re-evaluated per outer row — the optimizer often rewrites it into a join, but it can be a performance trap when it can\'t.',
    category: 'Subqueries & CTEs',
  },
  {
    term: 'EXISTS / NOT EXISTS',
    definition: 'Semi/anti-join predicates. Short-circuit — as soon as one matching row is found, EXISTS returns TRUE.',
    category: 'Subqueries & CTEs',
    highlight: true,
  },
  {
    term: 'MERGE',
    definition: 'A single statement combining INSERT + UPDATE + DELETE against a target using rules based on matching a source.',
    category: 'DML & Idempotency',
    highlight: true,
  },
  {
    term: 'Upsert',
    definition: 'Insert-or-update. A MERGE with WHEN MATCHED THEN UPDATE + WHEN NOT MATCHED THEN INSERT.',
    category: 'DML & Idempotency',
  },
  {
    term: 'Idempotent',
    definition: 'Running the same statement N times has the same result as running it once. MERGE on a deterministic source is idempotent; naked INSERT INTO ... SELECT is not.',
    category: 'DML & Idempotency',
    highlight: true,
  },
  {
    term: 'DDL / DML / DQL / DCL / TCL',
    definition: 'Data Definition (CREATE, ALTER, DROP) / Data Manipulation (INSERT, UPDATE, DELETE, MERGE) / Data Query (SELECT) / Data Control (GRANT, REVOKE) / Transaction Control (BEGIN, COMMIT, ROLLBACK).',
    category: 'SQL Standards',
  },
  {
    term: 'Logical vs physical query order',
    definition: 'You write SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT, but SQL is logically evaluated in the order FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. This is why you can\'t reference a SELECT alias in WHERE but can in ORDER BY.',
    category: 'Execution Model',
    highlight: true,
  },
];

export const FOUNDATIONS_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'sql-q01',
    number: 1,
    question: "What's the difference between WHERE and HAVING?",
    topic: 'Foundations',
    subtopic: 'Aggregations',
    answers: {
      basic: '"WHERE filters rows; HAVING filters groups."',
      strong: '"WHERE runs before GROUP BY and cannot reference aggregates. HAVING runs after GROUP BY and can reference aggregate results."',
      senior: '"They filter at different logical stages. I use WHERE for anything that doesn\'t depend on aggregation, because it reduces rows before the group-by and is always cheaper. HAVING is only for predicates on aggregates. On modern engines the optimizer will sometimes push a HAVING predicate down into a WHERE if it\'s semantically valid, but I don\'t rely on it — I write it correctly the first time."',
      interviewerIntent: 'Testing if you understand logical execution order and query engine cost mechanics before/after shuffle.',
    },
  },
  {
    id: 'sql-q02',
    number: 2,
    question: 'When does a LEFT JOIN silently become an INNER JOIN?',
    topic: 'Foundations',
    subtopic: 'Joins',
    answers: {
      basic: 'When you put a filter on the right table in the WHERE clause.',
      strong: 'When a predicate on the right table is in WHERE instead of ON, because NULL compared to anything in WHERE evaluates to unknown and drops.',
      senior: '"When a predicate on the right-hand table is in the WHERE clause instead of the ON clause. NULL <op> constant is always unknown, so unmatched left rows get filtered out. Filters on the right table belong in ON; filters on the left table belong in WHERE."',
      interviewerIntent: 'Testing query bug detection and understanding of three-valued logic in outer joins.',
    },
  },
  {
    id: 'sql-q03',
    number: 3,
    question: 'EXISTS vs IN vs JOIN — how do you choose?',
    topic: 'Foundations',
    subtopic: 'Subqueries',
    answers: {
      basic: 'EXISTS is for checking existence, IN is for a list of values, JOIN is for combining tables.',
      strong: 'EXISTS short-circuits on the first match and handles duplicates on the right side. IN works for literal lists or subqueries but has null traps. JOIN is used when you need columns from both sides.',
      senior: '"Choose by intent, not folklore. EXISTS when you\'re asking \'does a match exist\' and don\'t need columns from the other side — it short-circuits and handles duplicates correctly. IN when the source of values is small or static, and always use NOT EXISTS instead of NOT IN if NULL is possible in the inner set. JOIN when I actually need to project columns from the other side. Modern optimizers usually flatten EXISTS and IN (subquery) to a semi-join anyway, so I optimize for readability."',
    },
  },
  {
    id: 'sql-q04',
    number: 4,
    question: 'Are CTEs materialized?',
    topic: 'Foundations',
    subtopic: 'CTEs',
    answers: {
      basic: 'In most modern cloud warehouses, no, they are inlined.',
      strong: 'In Snowflake, BigQuery, and Spark, CTEs are syntactic sugar and usually inlined. In Postgres 12+, you can specify MATERIALIZED.',
      senior: '"Usually not — most engines inline CTEs, so referencing the same CTE twice recomputes it. If profiling shows repeated work, I materialize explicitly with a temporary table, or in Postgres 12+ I use WITH ... AS MATERIALIZED (...). I never assume a CTE is a performance boundary."',
    },
  },
  {
    id: 'sql-q05',
    number: 5,
    question: 'What does MERGE do when two source rows match one target row?',
    topic: 'Foundations',
    subtopic: 'MERGE & DML',
    answers: {
      basic: 'It fails with an error.',
      strong: 'Snowflake raises a non-deterministic merge error because it does not know which incoming row to apply.',
      senior: '"It errors — Snowflake calls it a non-deterministic-match error. MERGE can\'t decide which source row\'s values to apply. The fix is to deduplicate the source first, usually with QUALIFY ROW_NUMBER() OVER (PARTITION BY key ORDER BY updated_ts DESC) = 1. That guarantees at most one source row per key, and the MERGE runs cleanly."',
    },
  },
  {
    id: 'sql-q06',
    number: 6,
    question: 'Why is SELECT COUNT(*) FROM t sometimes instant and sometimes slow?',
    topic: 'Foundations',
    subtopic: 'Aggregations',
    answers: {
      basic: 'Because with no filter it can read metadata, but with a filter it has to scan data.',
      strong: 'In Snowflake and modern columnar systems, table row counts without predicates are stored in metadata. Adding a WHERE clause requires a scan.',
      senior: '"On engines with metadata-tracked row counts (like Snowflake native tables), COUNT(*) with no predicate is answered from metadata — instant, no scan. Add a predicate and it becomes a normal scan, though pruning can still make it fast. On row-store systems like PostgreSQL, COUNT(*) may need a full scan or index scan. And on any engine, COUNT(col) requires reading the column to check for nulls."',
    },
  },
  {
    id: 'sql-q07',
    number: 7,
    question: "What's the difference between COUNT(*) and COUNT(1)?",
    topic: 'Foundations',
    subtopic: 'Aggregations',
    answers: {
      basic: 'There is no difference in modern databases.',
      strong: 'Modern SQL optimizers treat COUNT(*) and COUNT(1) identically. They both count total rows including nulls.',
      senior: '"Nothing in any modern engine. It\'s folklore that COUNT(1) is faster. Both are optimized to the same plan. What actually matters is COUNT(*) vs COUNT(col) — the second one only counts non-null values, which is a different query."',
    },
  },
  {
    id: 'sql-q08',
    number: 8,
    question: 'Why should I avoid NOT IN with a subquery?',
    topic: 'Foundations',
    subtopic: 'Subqueries & Three-Valued Logic',
    answers: {
      basic: 'Because if there is a NULL in the subquery it returns nothing.',
      strong: 'Three-valued logic causes NOT IN to evaluate to UNKNOWN if the subquery returns even a single NULL, resulting in 0 rows.',
      senior: '"If the subquery returns even one NULL, NOT IN becomes unknown for every outer row and the query returns zero rows silently. NOT EXISTS doesn\'t have this problem and is my default. If I do use NOT IN, I explicitly filter WHERE col IS NOT NULL in the subquery."',
    },
  },
  {
    id: 'sql-q09',
    number: 9,
    question: 'Explain the logical order of a SELECT.',
    topic: 'Foundations',
    subtopic: 'Execution Model',
    answers: {
      basic: 'FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.',
      strong: 'The logical evaluation order differs from written order: FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> QUALIFY -> ORDER BY -> LIMIT.',
      senior: '"Written order is SELECT / FROM / WHERE / GROUP BY / HAVING / ORDER BY / LIMIT. Logical order is FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → QUALIFY → ORDER BY → LIMIT. That\'s why you can\'t reference a SELECT alias in WHERE — the alias hasn\'t been computed yet — but you can in ORDER BY. QUALIFY runs after SELECT, which is why it can filter on ROW_NUMBER() computed in the projection."',
    },
  },
];

export const PART_01_FOUNDATIONS_DATA: SectionPart = {
  id: 'sql-part-01',
  title: 'Section 02 Part 01: Foundations',
  partNumber: 'PART 01',
  subtitle: 'Joins, Aggregations, CTEs, Subqueries, MERGE & Logical Execution Order',
  summary: 'The SQL building blocks a senior interviewer expects you to wield fluently — joins, aggregations, CTEs, subqueries, and MERGE. Every concept opens with What is X? / Why does it exist? and has runnable examples.',
  readTimeMinutes: 25,
  terminologies: PART_01_TERMINOLOGIES,
  sections: [
    {
      heading: '1. Joins — Precision Under Pressure',
      subheading: 'Core Join Mechanics, Predicate Scopes & Edge Case Traps',
      content: `### What is a join?
A **join** combines rows from two (or more) relations based on a predicate — usually an equality on a shared key. The join type (\`INNER\` / \`LEFT\` / \`RIGHT\` / \`FULL\` / \`CROSS\`) decides what happens to rows that *don't* have a match on the other side.

### Why it exists / Why it matters
Relational normalization decomposes entities into focused tables to eliminate redundancy. Joins reassemble those entities at query time. In senior technical rounds, join grain correctness separates candidates who understand data modeling from those who introduce silent row duplication.

### The five join types (with what "no match" does)
\`\`\`
INNER:  keeps only matched rows
LEFT:   keeps ALL left rows, NULL-fills the right where no match
RIGHT:  keeps ALL right rows, NULL-fills the left where no match
FULL:   keeps ALL rows from both sides, NULL-fills the missing side
CROSS:  Cartesian product — every left × every right, no predicate
\`\`\`

#### Setup used throughout this section:
\`\`\`sql
CREATE OR REPLACE TABLE customer (
    customer_id  NUMBER,
    name         STRING,
    region       STRING
);

CREATE OR REPLACE TABLE orders (
    order_id     NUMBER,
    customer_id  NUMBER,
    amount_usd   NUMBER(18,2),
    order_date   DATE
);

INSERT INTO customer VALUES
    (1, 'Alice',   'EMEA'),
    (2, 'Bob',     'AMER'),
    (3, 'Carol',   'APAC'),
    (4, 'Dan',     'EMEA');

INSERT INTO orders VALUES
    (100, 1, 250, '2026-08-01'),
    (101, 1, 400, '2026-08-15'),
    (102, 2, 120, '2026-08-20');
    -- Carol and Dan have no orders
\`\`\`

### Worked examples of each

\`\`\`sql
-- INNER — only customers who placed orders
SELECT c.customer_id, c.name, o.order_id, o.amount_usd
FROM   customer c
INNER  JOIN orders o ON o.customer_id = c.customer_id;
-- returns 3 rows: Alice x 2, Bob x 1
\`\`\`

\`\`\`sql
-- LEFT — every customer, orders where they exist
SELECT c.customer_id, c.name, o.order_id, o.amount_usd
FROM   customer c
LEFT   JOIN orders o ON o.customer_id = c.customer_id;
-- returns 5 rows: Alice x 2, Bob x 1, Carol (NULL), Dan (NULL)
\`\`\`

\`\`\`sql
-- FULL — every customer AND every order, even if one side is missing
SELECT c.customer_id, c.name, o.order_id, o.amount_usd
FROM   customer c
FULL   JOIN orders o ON o.customer_id = c.customer_id;
-- customers with no orders keep NULL on order side
-- orphan orders (bad customer_id) would keep NULL on customer side
\`\`\`

\`\`\`sql
-- CROSS — every combination
SELECT c.name, o.order_id
FROM   customer c
CROSS  JOIN orders o;
-- 4 customers × 3 orders = 12 rows. Almost always a bug unless you meant it.
\`\`\`

### ON vs USING
\`\`\`sql
-- ON — explicit predicate. Works with any pair of columns.
FROM orders o JOIN customer c ON o.customer_id = c.customer_id

-- USING — shortcut when the columns have the same name. Produces ONE column, not two.
FROM orders o JOIN customer c USING (customer_id)
\`\`\`
\`USING\` is cleaner when column names align, and the joined column is de-duplicated in the output.

### The WHERE vs ON gotcha on LEFT JOIN
**Interview trap.** These two queries look similar but return very different results.

\`\`\`sql
-- (A) filter in ON — still a LEFT JOIN
SELECT c.name, o.order_id
FROM   customer c
LEFT   JOIN orders o
       ON o.customer_id = c.customer_id
      AND o.amount_usd > 300;
-- Carol and Dan are still present (order_id = NULL)
-- Alice keeps only her $400 order
\`\`\`

\`\`\`sql
-- (B) filter in WHERE — silently becomes an INNER JOIN
SELECT c.name, o.order_id
FROM   customer c
LEFT   JOIN orders o
       ON o.customer_id = c.customer_id
WHERE  o.amount_usd > 300;
-- Carol and Dan disappear because NULL > 300 is unknown
\`\`\`

**Rule:** filters on the right-hand table belong in \`ON\` for \`LEFT JOIN\`. Filters on the left-hand table belong in \`WHERE\`.

### Self-join — adjacent-row comparisons
Find each customer's second-highest order value:
\`\`\`sql
SELECT o1.customer_id,
       MAX(o1.amount_usd) AS second_highest
FROM   orders o1
JOIN   orders o2
       ON  o2.customer_id = o1.customer_id
       AND o2.amount_usd  > o1.amount_usd
GROUP  BY o1.customer_id;
\`\`\`
*(In practice you'd use \`ROW_NUMBER()\` — see the window-functions file.)*

### Semi-join and anti-join
\`\`\`sql
-- Semi-join: customers who placed at least one order (no duplicates)
SELECT c.*
FROM   customer c
WHERE  EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);

-- Anti-join: customers who placed NO orders
SELECT c.*
FROM   customer c
WHERE  NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);
\`\`\`

Equivalent anti-join with \`LEFT JOIN\`:
\`\`\`sql
SELECT c.*
FROM   customer c
LEFT   JOIN orders o ON o.customer_id = c.customer_id
WHERE  o.order_id IS NULL;
\`\`\`
Both work. \`NOT EXISTS\` is clearer and often faster because the optimizer can short-circuit at the first match.

### NULL in joins — three real gotchas
1. **\`NULL = NULL\` is unknown.** Two rows with \`NULL\` in the join key **do not join**. If you need them to, use \`IS NOT DISTINCT FROM\` or a coalesced key:
\`\`\`sql
ON COALESCE(a.col, '__NULL__') = COALESCE(b.col, '__NULL__')
\`\`\`
2. **\`NOT IN\` and \`NULL\`** silently returns *no rows*. If the subquery returns even one \`NULL\`, \`x NOT IN (...)\` becomes unknown for every \`x\`.
\`\`\`sql
-- DANGEROUS if orders.customer_id can be NULL
SELECT * FROM customer WHERE customer_id NOT IN (SELECT customer_id FROM orders);

-- SAFE
SELECT * FROM customer c WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
\`\`\`
3. **\`COUNT(*)\` vs \`COUNT(col)\`** — \`COUNT(*)\` counts rows including nulls; \`COUNT(col)\` counts non-null values of \`col\`. On a \`LEFT JOIN\`, \`COUNT(o.order_id)\` gives you the true "how many orders per customer" (zero for Carol and Dan). \`COUNT(*)\` would give one, because the outer join produced a row.`,
    },
    {
      heading: '2. Aggregations — The Workhorse',
      subheading: 'Grouping Semantics, Conditional Aggregation & Multilevel Rollups',
      content: `### What is aggregation?
**Aggregation** collapses many input rows into one output row per group. The \`GROUP BY\` clause defines the groups; the aggregate functions (\`SUM\`, \`COUNT\`, \`AVG\`, \`MIN\`, \`MAX\`, \`ARRAY_AGG\`, \`STRING_AGG\` / \`LISTAGG\`) compute one summary value per group.

### Why it exists / Why it matters
Analytical queries summarize granular events into business metrics (daily revenue, active user counts, conversion rates). Mastering aggregation boundaries and multidimensional rollups allows producing executive metrics in a single efficient pass over storage.

### The basic shape
\`\`\`sql
SELECT customer_id,
       COUNT(*)              AS order_count,
       SUM(amount_usd)       AS total_usd,
       AVG(amount_usd)       AS avg_usd,
       MAX(amount_usd)       AS largest_order,
       MIN(order_date)       AS first_order_date
FROM   orders
GROUP  BY customer_id;
\`\`\`

**Rule:** every column in \`SELECT\` must be either (a) in \`GROUP BY\` or (b) inside an aggregate. Otherwise the engine has no way to decide what value to show.

### WHERE vs HAVING
\`\`\`sql
-- WHERE filters rows BEFORE aggregation
-- HAVING filters groups AFTER aggregation

SELECT customer_id, SUM(amount_usd) AS total
FROM   orders
WHERE  order_date >= '2026-01-01'   -- filter individual rows
GROUP  BY customer_id
HAVING SUM(amount_usd) > 500;       -- filter grouped rows
\`\`\`

### COUNT variants
| Expression | Counts |
|---|---|
| \`COUNT(*)\` | Every row, including nulls |
| \`COUNT(1)\` | Same as \`COUNT(*)\`. No difference in modern engines despite folklore |
| \`COUNT(col)\` | Non-null values of \`col\` |
| \`COUNT(DISTINCT col)\` | Distinct non-null values of \`col\` |

\`\`\`sql
SELECT COUNT(*)                        AS total_rows,
       COUNT(amount_usd)               AS non_null_amounts,
       COUNT(DISTINCT customer_id)     AS unique_customers
FROM   orders;
\`\`\`

### FILTER — conditional aggregation
The clean way to compute multiple conditional aggregates in one pass:
\`\`\`sql
SELECT customer_id,
       COUNT(*) FILTER (WHERE amount_usd >= 300)         AS big_orders,
       COUNT(*) FILTER (WHERE amount_usd <  300)         AS small_orders,
       SUM(amount_usd) FILTER (WHERE order_date >= '2026-08-01') AS august_total
FROM   orders
GROUP  BY customer_id;
\`\`\`
Supported in Postgres, Snowflake (via \`IFF\` / \`CASE\` traditionally, \`FILTER\` also supported), BigQuery. If your engine lacks it, the fallback is \`SUM(CASE WHEN ... THEN 1 ELSE 0 END)\` / \`SUM(CASE WHEN ... THEN col END)\`.

### GROUPING SETS, ROLLUP, CUBE
Compute multiple levels of totals in one query:
\`\`\`sql
-- Subtotals per region, per customer, and grand total in one query
SELECT region,
       customer_id,
       SUM(amount_usd) AS total
FROM   orders o
JOIN   customer c USING (customer_id)
GROUP  BY GROUPING SETS (
    (region, customer_id),   -- most granular
    (region),                -- per-region subtotal
    ()                       -- grand total
);
\`\`\`
- \`ROLLUP(a, b, c)\` = \`GROUPING SETS ((a,b,c), (a,b), (a), ())\` — hierarchical subtotals.
- \`CUBE(a, b)\` = \`GROUPING SETS ((a,b), (a), (b), ())\` — every combination.

Use **\`GROUPING()\`** to distinguish real \`NULL\` from "subtotal" rows:
\`\`\`sql
SELECT CASE WHEN GROUPING(region) = 1 THEN 'ALL REGIONS' ELSE region END AS region,
       CASE WHEN GROUPING(customer_id) = 1 THEN 'ALL CUSTOMERS' ELSE customer_id::STRING END AS customer,
       SUM(amount_usd)
FROM   orders o JOIN customer c USING (customer_id)
GROUP  BY ROLLUP (region, customer_id);
\`\`\`

### DISTINCT — do you actually need it?
\`SELECT DISTINCT\` is a full sort (or hash) of the output. On big result sets it's expensive.

**Interview red flag:** using \`SELECT DISTINCT\` to paper over a join bug that duplicated rows. The fix is to correct the join grain, not to hide duplicates.`,
    },
    {
      heading: '3. Common Table Expressions (CTEs)',
      subheading: 'Inlining Mechanics, Materialization Boundaries & Recursive Traversal',
      content: `### What is a CTE?
A **CTE** is a named subquery declared with \`WITH\`, usable within the outer query. It doesn't create a table — it's a logical construct that improves readability.

\`\`\`sql
WITH recent_orders AS (
    SELECT *
    FROM   orders
    WHERE  order_date >= DATEADD(day, -30, CURRENT_DATE())
),
big_orders AS (
    SELECT * FROM recent_orders WHERE amount_usd >= 300
)
SELECT customer_id, COUNT(*) AS big_recent_count
FROM   big_orders
GROUP  BY customer_id;
\`\`\`

### Are CTEs materialized?
**Interview trap.** In most modern engines (Snowflake, BigQuery, Spark), a CTE is *usually inlined* — referenced twice → computed twice. It's not a materialization boundary.

If a CTE is expensive and you reference it multiple times:
- **Snowflake:** materialize into a temporary or transient table.
- **Postgres 12+:** \`WITH ... AS MATERIALIZED (...)\` forces materialization.
- **Spark:** \`.cache()\` on the DataFrame.

\`\`\`sql
CREATE OR REPLACE TEMPORARY TABLE t_recent AS
SELECT * FROM orders WHERE order_date >= DATEADD(day, -30, CURRENT_DATE());
-- now t_recent is computed once and can be reused
\`\`\`

**Senior line:** *"CTEs are syntactic sugar for readability. If profiling shows the same subplan repeated, I materialize into a temporary table."*

### Recursive CTEs
For hierarchies, sequences, and graph traversal.

**Hierarchy example — employee reporting chain:**
\`\`\`sql
CREATE OR REPLACE TABLE employee (
    emp_id     NUMBER,
    name       STRING,
    manager_id NUMBER
);

INSERT INTO employee VALUES
    (1, 'CEO',    NULL),
    (2, 'VP-A',   1),
    (3, 'VP-B',   1),
    (4, 'Dir-A1', 2),
    (5, 'Dir-A2', 2),
    (6, 'IC-1',   4);

WITH RECURSIVE org_tree AS (
    SELECT emp_id, name, manager_id, 0 AS depth, name AS path
    FROM   employee
    WHERE  manager_id IS NULL              -- anchor: CEO
    UNION ALL
    SELECT e.emp_id, e.name, e.manager_id, t.depth + 1,
           t.path || ' > ' || e.name
    FROM   employee e
    JOIN   org_tree t ON e.manager_id = t.emp_id   -- recursive step
)
SELECT * FROM org_tree ORDER BY depth, name;
\`\`\`

**Sequence example — generate a date series:**
\`\`\`sql
WITH RECURSIVE dates AS (
    SELECT '2026-01-01'::DATE AS d
    UNION ALL
    SELECT DATEADD(day, 1, d) FROM dates WHERE d < '2026-12-31'
)
SELECT * FROM dates;
\`\`\`
Snowflake also has \`GENERATOR(ROWCOUNT => n)\` and dedicated \`SEQUENCE\` helpers — usually cleaner than recursive CTEs when the engine supports them.`,
    },
    {
      heading: '4. Subqueries',
      subheading: 'Scalar, Row & Table Flavors, Correlated Pitfalls & Null Traps',
      content: `### The three flavors
- **Scalar subquery** — returns exactly one value (one row × one column). Used inline like a constant.
- **Row subquery** — returns exactly one row. Used with \`= (...)\` or \`IN (...)\`.
- **Table subquery** — returns many rows. Used in \`FROM\`, \`IN\`, \`EXISTS\`, or comparisons like \`> ANY (...)\`.

\`\`\`sql
-- Scalar
SELECT o.*,
       (SELECT AVG(amount_usd) FROM orders) AS overall_avg
FROM   orders o;

-- Table (in FROM)
SELECT sub.customer_id, sub.total
FROM (
    SELECT customer_id, SUM(amount_usd) AS total
    FROM orders GROUP BY customer_id
) sub
WHERE sub.total > 500;
\`\`\`

### Correlated subqueries
A **correlated subquery** references a column from the outer query. Conceptually it's re-evaluated per outer row (though the optimizer often rewrites it).

\`\`\`sql
-- Each customer's largest order (correlated)
SELECT c.customer_id, c.name,
       (SELECT MAX(amount_usd) FROM orders o WHERE o.customer_id = c.customer_id) AS max_order
FROM   customer c;
\`\`\`

Same result with \`LEFT JOIN + GROUP BY\`:
\`\`\`sql
SELECT c.customer_id, c.name, MAX(o.amount_usd) AS max_order
FROM   customer c
LEFT   JOIN orders o ON o.customer_id = c.customer_id
GROUP  BY c.customer_id, c.name;
\`\`\`
The join version is usually faster because the engine gets a single pass instead of one lookup per outer row. Prefer joins unless the correlated form is dramatically clearer.

### IN vs EXISTS vs JOIN — decision guide
| Need | Pick |
|---|---|
| "Does at least one match exist?" | \`EXISTS\` (short-circuits, ignores duplicates) |
| "Is the value in this small static list?" | \`IN (a, b, c)\` |
| "Is the value in this result set?" | \`IN (SELECT ...)\` — but watch out for \`NULL\` if using \`NOT IN\` |
| "I need columns from the other side" | \`JOIN\` — semi/anti-joins hide the right side; joins expose it |
| Anti-match | \`NOT EXISTS\` (safest against \`NULL\`) |

### The NOT IN + NULL bomb
If the inner query can produce a \`NULL\`, \`NOT IN\` returns *no rows*, silently.

\`\`\`sql
-- customer_id can be NULL in orders
SELECT * FROM customer
WHERE customer_id NOT IN (SELECT customer_id FROM orders);
-- returns 0 rows if any orders.customer_id is NULL
\`\`\`

Safer:
\`\`\`sql
SELECT * FROM customer c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
\`\`\`
Or filter the nulls out:
\`\`\`sql
... WHERE customer_id NOT IN (SELECT customer_id FROM orders WHERE customer_id IS NOT NULL)
\`\`\`
\`NOT EXISTS\` is the safest habit.`,
    },
    {
      heading: '5. MERGE — Insert / Update / Delete Atomically',
      subheading: 'CDC Application, Deduplication Pre-requisite & Idempotency Rules',
      content: `### What is MERGE?
**\`MERGE\`** is a single statement that combines \`INSERT\`, \`UPDATE\`, and \`DELETE\` against a target table based on how each source row compares to a target row on a matching key. Every branch runs in one atomic transaction.

### Why it exists / Why it matters
Pipelines consuming change-data-capture (CDC) feeds must apply inserts, updates, and deletes in order without race conditions. \`MERGE\` executes this atomically and idempotently.

### The general shape
\`\`\`sql
MERGE INTO target t
USING   source s
ON      t.key = s.key
WHEN MATCHED AND <condition> THEN UPDATE SET ...
WHEN MATCHED AND <condition> THEN DELETE
WHEN NOT MATCHED THEN INSERT (...) VALUES (...);
\`\`\`
- **\`WHEN MATCHED\`** — rows where source and target have the same key.
- **\`WHEN NOT MATCHED\`** — source rows with no target match (candidates to \`INSERT\`).
- **\`WHEN NOT MATCHED BY SOURCE\`** (some dialects) — target rows with no source match (candidates to \`DELETE\`).

### SCD Type 1 upsert
\`\`\`sql
MERGE INTO silver.customer t
USING (
    SELECT customer_id, name, email, is_active
    FROM   raw.customer_incoming
) s
ON t.customer_id = s.customer_id
WHEN MATCHED THEN UPDATE SET
    t.name       = s.name,
    t.email      = s.email,
    t.is_active  = s.is_active,
    t.updated_at = CURRENT_TIMESTAMP()
WHEN NOT MATCHED THEN INSERT (customer_id, name, email, is_active, updated_at)
                      VALUES (s.customer_id, s.name, s.email, s.is_active, CURRENT_TIMESTAMP());
\`\`\`

### The non-deterministic-match error (interview gotcha)
If **two or more source rows** have the same key that matches one target row, \`MERGE\` doesn't know which source row's values to apply. Snowflake throws:
\`\`\`
Duplicate row detected during DML action
\`\`\`

Fix: **deduplicate the source first** so each key appears at most once:
\`\`\`sql
MERGE INTO silver.orders t
USING (
    SELECT *
    FROM   raw.orders_stream
    QUALIFY ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY order_ts DESC) = 1
) s
ON t.order_id = s.order_id
WHEN MATCHED     THEN UPDATE SET t.amount_usd = s.amount_usd
WHEN NOT MATCHED THEN INSERT (order_id, amount_usd) VALUES (s.order_id, s.amount_usd);
\`\`\`

### Full CDC-style MERGE (INSERT + UPDATE + DELETE)
When the source flags which change type each row represents (e.g., from a stream or CDC feed):
\`\`\`sql
MERGE INTO silver.customer t
USING raw.customer_stream s
ON t.customer_id = s.customer_id
WHEN MATCHED AND s.action = 'DELETE'
    THEN DELETE
WHEN MATCHED AND s.action IN ('INSERT', 'UPDATE')
    THEN UPDATE SET t.name = s.name, t.email = s.email, t.updated_at = CURRENT_TIMESTAMP()
WHEN NOT MATCHED AND s.action = 'INSERT'
    THEN INSERT (customer_id, name, email, updated_at)
         VALUES (s.customer_id, s.name, s.email, CURRENT_TIMESTAMP());
\`\`\`

### SCD Type 2 with MERGE — the honest picture
Pure \`MERGE\` for SCD2 (close old version + insert new version + carry unchanged) is awkward because you need to *both* update the old row and insert a new one for the same source row.

Two common patterns:
1. **Two-statement transaction** — one \`UPDATE\` to close old versions, one \`INSERT\` for new ones.
2. **\`MERGE\` where you insert *only* new versions, then a separate \`UPDATE\` to close prior versions.**

Full worked example in Part 03: Interview Patterns.

### Idempotency
A \`MERGE\` on a **deterministic** source is idempotent — running it twice produces the same target state. That's why \`MERGE\` is the standard for CDC pipelines.

Contrast with:
\`\`\`sql
-- NOT idempotent — every retry appends duplicates
INSERT INTO audit.change_log SELECT * FROM raw.customer_stream;
\`\`\`
For non-idempotent DML (audit inserts, side effects), wrap in your own dedup or use \`MERGE INTO audit ... WHEN NOT MATCHED THEN INSERT\` with a unique key.`,
    },
    {
      heading: '6. The Logical Order of a SELECT',
      subheading: 'Written vs Logical Execution Phases & Alias Visibility',
      content: `You write the clauses in one order, but SQL logically evaluates them in another. Knowing the difference explains half the "why doesn't this work?" moments.

\`\`\`
WRITTEN ORDER              LOGICAL ORDER
─────────────              ─────────────
SELECT      ─┐             FROM
FROM         │             JOIN
JOIN         │             WHERE
WHERE        │             GROUP BY
GROUP BY     │             HAVING
HAVING       │             SELECT
QUALIFY      │             DISTINCT
DISTINCT     │             QUALIFY
ORDER BY     │             ORDER BY
LIMIT       ─┘             LIMIT
\`\`\`

### Consequences:
- **\`WHERE\` can't reference \`SELECT\` aliases** (Postgres, Snowflake) — the alias doesn't exist yet at the \`WHERE\` stage. BigQuery is an exception.
- **\`GROUP BY\` can reference the \`SELECT\` alias** in most modern engines. Postgres yes, Snowflake yes, BigQuery yes.
- **\`HAVING\` runs after \`GROUP BY\`**, so it can reference aggregate results.
- **\`ORDER BY\` runs after \`SELECT\`**, so it can reference \`SELECT\` aliases *and* aggregates.
- **\`QUALIFY\`** (Snowflake, BigQuery, Databricks, Teradata) runs after \`SELECT\` — that's why it can filter on \`ROW_NUMBER()\` computed in the \`SELECT\`.`,
    },
    {
      heading: '7. Common Interview Questions — Foundations',
      subheading: '9 Tiered Concept Challenges with Senior Defense Formulations',
      content: `Practice delivering these questions aloud using the Senior tier formulation:
- **Q1:** What's the difference between \`WHERE\` and \`HAVING\`?
- **Q2:** When does a \`LEFT JOIN\` silently become an \`INNER JOIN\`?
- **Q3:** \`EXISTS\` vs \`IN\` vs \`JOIN\` — how do you choose?
- **Q4:** Are CTEs materialized?
- **Q5:** What does \`MERGE\` do when two source rows match one target row?
- **Q6:** Why is \`SELECT COUNT(*) FROM t\` sometimes instant and sometimes slow?
- **Q7:** What's the difference between \`COUNT(*)\` and \`COUNT(1)\`?
- **Q8:** Why should I avoid \`NOT IN\` with a subquery?
- **Q9:** Explain the logical order of a \`SELECT\`.`,
    },
    {
      heading: '8. Quick Revision — Part 01',
      subheading: 'High-Density Takeaways for Rapid Review',
      content: `- **Join types**: \`INNER\` matches only; \`LEFT\` keeps all left; \`FULL\` keeps both; \`CROSS\` is Cartesian; watch \`WHERE\` vs \`ON\` on outer joins.
- **\`NULL\` traps**: \`NULL = NULL\` is unknown; \`NOT IN\` + nulls returns zero rows; \`COUNT(col)\` skips nulls.
- **Aggregation**: \`WHERE\` before, \`HAVING\` after; \`FILTER\` for conditional aggregates; \`GROUPING SETS/ROLLUP/CUBE\` for subtotals in one pass.
- **\`COUNT(*)\`** = all rows; **\`COUNT(col)\`** = non-null values; **\`COUNT(DISTINCT col)\`** = distinct non-null.
- **CTEs** are usually inlined (not materialization boundaries). Materialize with a temporary table if repeated work matters.
- **Recursive CTE** = anchor \`UNION ALL\` recursive step. For hierarchies, series, graph traversal.
- **Correlated subquery** = references the outer row; often rewritten as a join, prefer the join for large sets.
- **\`NOT EXISTS\` > \`NOT IN\`** for safety against nulls.
- **\`MERGE\`** = INSERT + UPDATE + DELETE atomically. Dedup the source first or it will error on non-deterministic matches.
- **Idempotency**: \`MERGE\` on a deterministic source is idempotent; naked \`INSERT\` isn't.
- **Logical order**: \`FROM → WHERE → GROUP → HAVING → SELECT → QUALIFY → ORDER → LIMIT\`. Written order lies.`,
    },
  ],
};
