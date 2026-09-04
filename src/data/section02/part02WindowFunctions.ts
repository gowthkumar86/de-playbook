import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_02_TERMINOLOGIES: TermItem[] = [
  {
    term: 'Window function',
    definition: 'A function that computes a value across a set of rows related to the current row, without collapsing rows the way GROUP BY does. You get one output row per input row, plus the computed value.',
    category: 'Core Concept',
    highlight: true,
  },
  {
    term: 'OVER (...) clause',
    definition: 'The syntax that turns any aggregate or ranking function into a window function. Everything about the window — partitioning, ordering, frame — lives inside OVER.',
    category: 'Syntax',
    highlight: true,
  },
  {
    term: 'Partition (in OVER)',
    definition: 'The subset of rows the window is computed within. Rows in different partitions can\'t see each other. Like an implicit GROUP BY, but rows aren\'t collapsed.',
    category: 'Window Definition',
  },
  {
    term: 'Ordering (in OVER)',
    definition: 'The sort order used within a partition. Required for ranking functions (ROW_NUMBER, RANK, LAG, LEAD) and for running/moving aggregates.',
    category: 'Window Definition',
  },
  {
    term: 'Frame (ROWS / RANGE)',
    definition: 'The slice of rows within the current partition that the function actually sees. Default is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW when ORDER BY is present.',
    category: 'Frame Specification',
    highlight: true,
  },
  {
    term: 'ROWS BETWEEN',
    definition: 'Frame defined by row count — "3 rows before to current." Position-based, deterministic.',
    category: 'Frame Specification',
    highlight: true,
  },
  {
    term: 'RANGE BETWEEN',
    definition: 'Frame defined by value range — "all rows within 7 days of current." Value-based; ties with the current row are included.',
    category: 'Frame Specification',
    highlight: true,
  },
  {
    term: 'Peer rows',
    definition: 'Rows with the same ORDER BY value in the same partition. Ranking functions treat peers differently: ROW_NUMBER breaks ties arbitrarily; RANK gives peers the same rank; DENSE_RANK gives peers the same rank without gaps.',
    category: 'Ranking & Peers',
  },
  {
    term: 'QUALIFY',
    definition: 'Snowflake / BigQuery / Databricks / Teradata clause that filters on window-function results. Runs after SELECT, so it can reference the window computation. Postgres has no QUALIFY — use a subquery / CTE instead.',
    category: 'Filtering',
    highlight: true,
  },
  {
    term: 'Named window',
    definition: 'A window definition given a name with WINDOW w AS (...), then referenced by name — reduces repetition when many aggregates share the same window.',
    category: 'Optimization',
  },
];

export const WINDOW_FUNCTIONS_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'sql-wf-q01',
    number: 1,
    question: 'Give the latest order per customer.',
    topic: 'Window Functions',
    subtopic: 'Ranking & Dedup',
    answers: {
      basic: 'Use ROW_NUMBER() partitioned by customer and order by date descending, filter where rn = 1.',
      strong: 'Use QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1. In Postgres, use an outer WHERE.',
      senior: '"QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1. On Postgres I\'d wrap it in a subquery and filter WHERE rn = 1. If order_date can tie, I add a stable tiebreaker like load_seq so the pick is deterministic."',
    },
  },
  {
    id: 'sql-wf-q02',
    number: 2,
    question: 'Difference between RANK and DENSE_RANK?',
    topic: 'Window Functions',
    subtopic: 'Ranking Functions',
    answers: {
      basic: 'RANK leaves gaps for ties, DENSE_RANK does not leave gaps.',
      strong: 'When ties occur, RANK skips the next rank number according to the count of duplicates (1, 1, 3), whereas DENSE_RANK always increments sequentially (1, 1, 2).',
      senior: '"Both give ties the same rank. RANK skips the next distinct value by the number of tied rows — 1, 1, 3, 4. DENSE_RANK doesn\'t skip — 1, 1, 2, 3. If someone asks \'top 3 including ties, how many rows do I want?\' RANK() <= 3 may return more than 3 rows if there\'s a tie at rank 3; DENSE_RANK() <= 3 returns all rows in the top 3 distinct values, which can also be more than 3 rows but with a different semantic."',
    },
  },
  {
    id: 'sql-wf-q03',
    number: 3,
    question: 'Give a running total per customer.',
    topic: 'Window Functions',
    subtopic: 'Running Aggregates',
    answers: {
      basic: 'SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date).',
      strong: 'SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) to avoid range peer bugs.',
      senior: '"SUM(amount_usd) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW). I explicitly use ROWS BETWEEN rather than the default frame because the default is RANGE, and RANGE groups peer rows — ties on order_date would collapse into the same running total step, which is usually not what you want."',
    },
  },
  {
    id: 'sql-wf-q04',
    number: 4,
    question: 'How would you compute a 7-day rolling sum per customer?',
    topic: 'Window Functions',
    subtopic: 'Rolling Windows',
    answers: {
      basic: 'Use a window frame of RANGE BETWEEN INTERVAL 7 DAY PRECEDING AND CURRENT ROW.',
      strong: 'Use RANGE INTERVAL to handle days where no orders were placed, whereas ROWS would blindly take the prior 7 records.',
      senior: '"SUM(amount_usd) OVER (PARTITION BY customer_id ORDER BY order_date RANGE BETWEEN INTERVAL \'7 DAY\' PRECEDING AND CURRENT ROW). RANGE with an interval handles missing dates correctly — the engine looks at value distance, not row count. If the data has one row per day, ROWS BETWEEN 6 PRECEDING AND CURRENT ROW also works, but RANGE INTERVAL is safer when data is sparse."',
    },
  },
  {
    id: 'sql-wf-q05',
    number: 5,
    question: 'Why does LAST_VALUE(...) sometimes return the current row instead of the last row of the partition?',
    topic: 'Window Functions',
    subtopic: 'Frames & Navigation',
    answers: {
      basic: 'Because the default window frame stops at the current row.',
      strong: 'The default frame when ORDER BY is present is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, so the last visible value in the frame is the current row.',
      senior: '"Because the default frame with ORDER BY is RANGE UNBOUNDED PRECEDING → CURRENT ROW — the \'last\' value visible is the current row. To get the true partition-last value, extend the frame: ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING. Or use FIRST_VALUE on a DESC ordering."',
    },
  },
  {
    id: 'sql-wf-q06',
    number: 6,
    question: 'How do you dedupe rows keeping the latest by timestamp?',
    topic: 'Window Functions',
    subtopic: 'Deduplication',
    answers: {
      basic: 'QUALIFY ROW_NUMBER() OVER (PARTITION BY natural_key ORDER BY event_ts DESC) = 1.',
      strong: 'Add a secondary tiebreaker like load_seq or id so repeated executions are deterministic.',
      senior: '"QUALIFY ROW_NUMBER() OVER (PARTITION BY natural_key ORDER BY event_ts DESC, load_seq DESC) = 1. The tiebreaker matters — without it the pick is non-deterministic and retries can pick different rows, breaking idempotency downstream."',
    },
  },
  {
    id: 'sql-wf-q07',
    number: 7,
    question: "What's QUALIFY?",
    topic: 'Window Functions',
    subtopic: 'Filtering',
    answers: {
      basic: 'A clause to filter window function results.',
      strong: 'It filters after window functions are calculated in the projection, avoiding an extra subquery wrapper in Snowflake and BigQuery.',
      senior: '"It\'s a filter that runs after SELECT, so it can reference window-function results computed in the projection. Snowflake / BigQuery / Databricks / Teradata support it. Postgres doesn\'t — I use a subquery there. QUALIFY ROW_NUMBER() = 1 is the idiomatic top-1-per-group in engines that support it."',
    },
  },
  {
    id: 'sql-wf-q08',
    number: 8,
    question: "How would you compute each row's contribution as a percentage of its group total?",
    topic: 'Window Functions',
    subtopic: 'Windowed Aggregates',
    answers: {
      basic: 'Divide amount by SUM(amount) OVER (PARTITION BY group_id).',
      strong: 'Use SUM(amount) OVER (PARTITION BY group_id) without an ORDER BY clause so the whole partition is the frame.',
      senior: '"amount_usd / SUM(amount_usd) OVER (PARTITION BY customer_id) AS pct_of_customer_total. No ORDER BY in OVER means the whole partition is the frame. If I want percent of grand total, OVER () with empty parens."',
    },
  },
  {
    id: 'sql-wf-q09',
    number: 9,
    question: 'When is a window function cheaper than a self-join?',
    topic: 'Window Functions',
    subtopic: 'Performance',
    answers: {
      basic: 'Almost always for ranking and previous row lookups.',
      strong: 'A self-join requires scanning the dataset twice and executing an expensive hash/nested-loop join. A window function scans once and sorts within partition.',
      senior: '"Almost always for top-N-per-group and adjacent-row comparisons. A self-join for \'previous order per customer\' does a nested-loop or hash-join and rescans the table. A window function makes one sort per unique PARTITION BY + ORDER BY and one pass. On big tables the difference is often an order of magnitude."',
    },
  },
  {
    id: 'sql-wf-q10',
    number: 10,
    question: 'Can I use COUNT(DISTINCT col) as a window function?',
    topic: 'Window Functions',
    subtopic: 'Limitations & Workarounds',
    answers: {
      basic: 'No, most SQL engines do not allow COUNT(DISTINCT) with an OVER clause.',
      strong: 'Engines like Snowflake and Postgres raise a syntax error. You must precompute distinctness or use APPROX_COUNT_DISTINCT or DENSE_RANK tricks.',
      senior: '"Not on most engines — Snowflake, BigQuery, and Postgres reject it. Workarounds include a subquery precomputing distinctness, APPROX_COUNT_DISTINCT when approximate is acceptable, or a gaps-and-islands trick with DENSE_RANK. In an interview I\'d explain the limitation and pick the workaround that matches the accuracy requirement."',
    },
  },
];

export const PART_02_WINDOW_FUNCTIONS_DATA: SectionPart = {
  id: 'sql-part-02',
  title: 'Section 02 Part 02: Window Functions',
  partNumber: 'PART 02',
  subtitle: 'Frames, Rankings, Running Aggregates, Navigation & QUALIFY',
  summary: 'Master the single highest-yield SQL topic in senior interviews. Every window function you\'ll be asked about — with clear "what/why", frame semantics, worked examples, and interview traps.',
  readTimeMinutes: 30,
  terminologies: PART_02_TERMINOLOGIES,
  sections: [
    {
      heading: '1. What is a Window Function? Why Does It Exist?',
      subheading: 'Core Mental Model, Partitioning & Frame Slices',
      content: `### What is a window function?
A **window function** computes a value for the current row based on a **window of related rows** — usually rows in the same partition and within some range around the current row's position. Unlike \`GROUP BY\`, it does *not* collapse rows. You keep every input row and get one extra column showing the computed value.

### Why it exists / Why it matters
Before window functions, "per-customer running total" and "top order per customer" required either self-joins with clunky correlated subqueries or multi-pass procedural code. Window functions collapse that into a single readable expression:

\`\`\`sql
SUM(amount_usd) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
) AS running_total_per_customer
\`\`\`
One line. One pass through the data. No self-joins. This is why window functions dominate senior SQL interviews — they separate the SQL you *wrote at university* from the SQL you *use in production*.

### Mental model
\`\`\`
                partition boundary                    partition boundary
                        │                                     │
   ┌────────────────────┼─────────────────────────────────────┼─────────────┐
   │ partition = A      │ partition = B                       │ partition = C
   │                    │                                     │
   │ row1  row2  row3   │ row1  row2  row3  row4              │ row1  row2
   │  │     │     │     │  │     │     │     │                │  │     │
   │  ▼     ▼     ▼     │  ▼     ▼     ▼     ▼                │  ▼     ▼
   │ [ window over A ]  │ [ window over B ]                   │ [window C]
   └────────────────────┴─────────────────────────────────────┴─────────────┘

For each row, the window function sees a slice of rows within the
same partition — the slice is called the "frame".
\`\`\`

The window is defined by three things inside \`OVER (...)\`:
1. **\`PARTITION BY\`** — which rows share a window (independent per partition).
2. **\`ORDER BY\`** — how rows are sequenced within the partition.
3. **Frame** (\`ROWS BETWEEN ...\` or \`RANGE BETWEEN ...\`) — which rows within the partition are actually visible to the function.`,
    },
    {
      heading: '2. The Anatomy of OVER (...) & Setup',
      subheading: 'Frame Boundaries, Default Behaviors & Base Dataset',
      content: `\`\`\`sql
<function>(<args>) OVER (
    PARTITION BY <col_or_expr>[, ...]         -- optional
    ORDER BY     <col_or_expr>[, ...]         -- required for ranking / running
    ROWS | RANGE BETWEEN <start> AND <end>    -- optional (defaults kick in)
)
\`\`\`

#### Frame bounds:
\`\`\`
UNBOUNDED PRECEDING       -- from the start of the partition
n PRECEDING               -- n rows / range units before current row
CURRENT ROW               -- the current row
n FOLLOWING               -- n rows / range units after current row
UNBOUNDED FOLLOWING       -- to the end of the partition
\`\`\`

### The three cases you must recognize on sight
| Signal in \`OVER\` | Effective frame | Common use |
|---|---|---|
| No \`ORDER BY\` at all | Whole partition | Partition-total aggregate |
| \`ORDER BY\` present, no frame specified | \`RANGE UNBOUNDED PRECEDING → CURRENT ROW\` | Running totals — **but see the \`RANGE\` peer-inclusion gotcha in §5** |
| Explicit \`ROWS BETWEEN a AND b\` | Exactly that row window | Moving averages, deterministic running sums |

**Interview trap:** many candidates think "no frame = current row only." Wrong. With \`ORDER BY\`, no explicit frame means \`RANGE UNBOUNDED PRECEDING → CURRENT ROW\`, which is a *running* aggregate.

#### Setup used throughout this file:
\`\`\`sql
CREATE OR REPLACE TABLE orders (
    order_id     NUMBER,
    customer_id  NUMBER,
    amount_usd   NUMBER(18,2),
    order_date   DATE
);

INSERT INTO orders VALUES
    (100, 1, 200, '2026-08-01'),
    (101, 1, 400, '2026-08-05'),
    (102, 1, 400, '2026-08-05'),     -- tie with row above
    (103, 1, 350, '2026-08-10'),
    (104, 2, 150, '2026-08-02'),
    (105, 2, 200, '2026-08-08'),
    (106, 2, 500, '2026-08-15'),
    (107, 2, 500, '2026-08-20'),     -- tie with row above by amount
    (108, 3, 100, '2026-08-03');
\`\`\``,
    },
    {
      heading: '3. Ranking Functions — ROW_NUMBER, RANK, DENSE_RANK, NTILE',
      subheading: 'Tie Treatment, Percentile Calculations & Top-1 Idiom',
      content: `\`\`\`sql
SELECT customer_id, order_date, amount_usd,
       ROW_NUMBER()  OVER (PARTITION BY customer_id ORDER BY amount_usd DESC) AS rn,
       RANK()        OVER (PARTITION BY customer_id ORDER BY amount_usd DESC) AS rk,
       DENSE_RANK()  OVER (PARTITION BY customer_id ORDER BY amount_usd DESC) AS drk,
       NTILE(3)      OVER (PARTITION BY customer_id ORDER BY amount_usd DESC) AS bucket
FROM   orders;
\`\`\`

Result for customer 1 (three amounts: 200, 400, 400, 350):
\`\`\`
amount   rn   rk   drk   bucket
------   --   --   ---   ------
 400      1    1    1      1
 400      2    1    1      1
 350      3    3    2      2
 200      4    4    3      3
\`\`\`

Read it carefully:
- **\`ROW_NUMBER\`** — always unique. Ties broken arbitrarily. Use for "give me the top row per group."
- **\`RANK\`** — ties share a rank; the next distinct value **skips**. (1, 1, 3, 4).
- **\`DENSE_RANK\`** — ties share a rank; the next distinct value **does not skip**. (1, 1, 2, 3).
- **\`NTILE(n)\`** — split rows into \`n\` roughly-equal buckets. Buckets fill unevenly by 1 if row count isn't divisible.

### When to use each
| Question | Function |
|---|---|
| "The latest / largest one row per group" | \`ROW_NUMBER() = 1\` |
| "Top 3 including ties" | \`RANK() <= 3\` |
| "Top 3 without ties widening the set" | \`DENSE_RANK() <= 3\` |
| "Percentile bucketing" | \`NTILE(4)\` (quartiles), \`NTILE(10)\` (deciles) |
| "Where does this row fall in the distribution?" | \`PERCENT_RANK()\`, \`CUME_DIST()\` |

### PERCENT_RANK and CUME_DIST
Both return values in \`[0, 1]\`:
- **\`PERCENT_RANK\`** — \`(rank - 1) / (total_rows - 1)\`. The first row is always 0; the last is always 1.
- **\`CUME_DIST\`** — cumulative distribution: fraction of rows with values ≤ the current row.

\`\`\`sql
SELECT customer_id, amount_usd,
       PERCENT_RANK() OVER (PARTITION BY customer_id ORDER BY amount_usd) AS pct_rank,
       CUME_DIST()    OVER (PARTITION BY customer_id ORDER BY amount_usd) AS cume_dist
FROM   orders;
\`\`\`

### The classic top-1-per-group pattern
\`\`\`sql
-- Snowflake / BigQuery / Databricks — the modern idiom
SELECT *
FROM   orders
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1;

-- Postgres — no QUALIFY, use a subquery
SELECT *
FROM (
    SELECT o.*,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
    FROM   orders o
) t
WHERE rn = 1;
\`\`\`

**Interview line:** *"For top-N per group I default to \`ROW_NUMBER\` + \`QUALIFY\`. If the interviewer says 'include ties,' I switch to \`RANK\` or \`DENSE_RANK\` depending on whether they want the total to widen or stay bounded."*`,
    },
    {
      heading: '4. ROWS vs RANGE — The Gotcha Most People Miss',
      subheading: 'Physical Positions vs Logical Values & The Peer Trap',
      content: `### What's the difference?
- **\`ROWS BETWEEN\`** — physical position. "3 rows before to current" means literally the previous 3 rows in the sort order.
- **\`RANGE BETWEEN\`** — logical value. "3 preceding" is interpreted relative to the \`ORDER BY\` value.

For interval-based \`RANGE\` (e.g., "last 7 days"), most engines require exactly one \`ORDER BY\` column, of a numeric or date/time type.

### The peer-inclusion trap
When you have ties in the \`ORDER BY\` column and use \`RANGE\`, **all peer rows are included together** in the frame.

Given customer 2's orders (amounts 150, 200, 500, 500):
\`\`\`sql
SELECT order_id, amount_usd,
       SUM(amount_usd) OVER (PARTITION BY customer_id
                             ORDER BY amount_usd) AS run_range,
       SUM(amount_usd) OVER (PARTITION BY customer_id
                             ORDER BY amount_usd
                             ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS run_rows
FROM   orders
WHERE  customer_id = 2;
\`\`\`

Result:
\`\`\`
amount   run_range   run_rows
------   ---------   --------
 150       150         150
 200       350         350
 500      1350         850     ← RANGE sees BOTH 500s together
 500      1350        1350
\`\`\`

**Why?** With \`ORDER BY amount_usd\` and default \`RANGE\`, both \`500\` rows are peers — they're at the same "position" logically — so the range frame includes both when computing the sum for either one.

**Rule:** if you want per-row deterministic running totals, always use \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. Don't rely on the default frame.

### Time-based RANGE — the good use case
\`RANGE INTERVAL\` shines for "moving windows in time" without needing evenly-spaced data:
\`\`\`sql
-- Sum of amounts within the last 7 days, per customer
SELECT customer_id, order_date, amount_usd,
       SUM(amount_usd) OVER (
           PARTITION BY customer_id
           ORDER BY order_date
           RANGE BETWEEN INTERVAL '7 DAY' PRECEDING AND CURRENT ROW
       ) AS rolling_7d_sum
FROM   orders;
\`\`\``,
    },
    {
      heading: '5. Running, Cumulative & Moving Aggregates',
      subheading: 'Deterministic Sums, High-Water Marks & Centered Moving Windows',
      content: `### Running total with explicit frame
\`\`\`sql
SUM(amount_usd) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
) AS running_total
\`\`\`

### Cumulative distinct count limitation
\`COUNT(DISTINCT)\` as a window function is **not supported** on most engines (Snowflake, BigQuery, Postgres). Workarounds:
- Precompute distinctness in a subquery, then window-count.
- On some engines, use \`APPROX_COUNT_DISTINCT\` in a windowed aggregate (Snowflake/BigQuery).
- For exact rolling distinct counts, gaps-and-islands + array/set tricks.

### Cumulative maximum / minimum (High-water mark)
\`\`\`sql
SELECT customer_id, order_date, amount_usd,
       MAX(amount_usd) OVER (PARTITION BY customer_id
                             ORDER BY order_date
                             ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS best_so_far
FROM orders;
\`\`\`

### Moving / rolling averages
\`\`\`sql
-- Rolling 3-order moving average by date
SELECT customer_id, order_date, amount_usd,
       AVG(amount_usd) OVER (
           PARTITION BY customer_id
           ORDER BY order_date
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS moving_avg_3
FROM orders;

-- Centered moving average (2 before and 2 after)
AVG(amount_usd) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
    ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING
) AS centered_moving_avg
\`\`\``,
    },
    {
      heading: '6. LAG, LEAD, FIRST_VALUE & LAST_VALUE',
      subheading: 'Adjacent Access, Frame Traps & IGNORE NULLS Forward-Fill',
      content: `### LAG and LEAD — adjacent-row access
- **\`LAG(col, n, default)\`** — value from \`n\` rows before the current row.
- **\`LEAD(col, n, default)\`** — value from \`n\` rows after.

\`\`\`sql
-- Day-over-day change
SELECT customer_id, order_date, amount_usd,
       LAG(amount_usd) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_amount,
       amount_usd - LAG(amount_usd) OVER (PARTITION BY customer_id ORDER BY order_date) AS change_vs_prev
FROM orders;

-- Time between events (churn / session gaps)
SELECT customer_id, order_date,
       DATEDIFF(day,
           LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date),
           order_date
       ) AS days_since_prev_order
FROM orders;
\`\`\`

### FIRST_VALUE, LAST_VALUE, NTH_VALUE & The Trap
\`LAST_VALUE\` respects the frame. With \`ORDER BY\` + default frame (\`RANGE UNBOUNDED PRECEDING → CURRENT ROW\`), the "last value" is just the current row.

To get the actual last value in the partition:
\`\`\`sql
SELECT customer_id, order_date, amount_usd,
       FIRST_VALUE(amount_usd) OVER (PARTITION BY customer_id ORDER BY order_date) AS first_amt,
       LAST_VALUE(amount_usd)  OVER (
           PARTITION BY customer_id
           ORDER BY order_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_amt
FROM orders;
\`\`\`

### Forward-fill with IGNORE NULLS
\`\`\`sql
SELECT customer_id, event_ts, status,
       LAST_VALUE(status IGNORE NULLS) OVER (
           PARTITION BY customer_id
           ORDER BY event_ts
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS status_ffill
FROM   events;
\`\`\``,
    },
    {
      heading: '7. Windowed Aggregates, Named Windows & Deduplication',
      subheading: 'Ratio-to-Total, Shared Sort Performance & Deterministic Dedup',
      content: `### Partition total (no ORDER BY) & Ratio-to-total
\`\`\`sql
SELECT order_id, customer_id, amount_usd,
       SUM(amount_usd) OVER (PARTITION BY customer_id) AS customer_total,
       amount_usd / SUM(amount_usd) OVER (PARTITION BY customer_id) AS pct_of_customer_total,
       amount_usd / SUM(amount_usd) OVER () AS pct_of_grand_total
FROM orders;
\`\`\`

### Named windows — share a single sort
\`\`\`sql
SELECT customer_id, order_date, amount_usd,
       SUM(amount_usd) OVER w AS running_sum,
       AVG(amount_usd) OVER w AS running_avg,
       MAX(amount_usd) OVER w AS running_max,
       COUNT(*)        OVER w AS running_count
FROM   orders
WINDOW w AS (
    PARTITION BY customer_id
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
);
\`\`\`

### Deduplication — the interview classic
\`\`\`sql
SELECT *
FROM   raw.orders_stream
QUALIFY ROW_NUMBER() OVER (
    PARTITION BY order_id                -- natural key
    ORDER BY   event_ts DESC, load_seq DESC  -- deterministic tiebreaker
) = 1;
\`\`\`

### Performance & Interview Traps:
1. **Sorts drive cost.** Every distinct \`PARTITION BY + ORDER BY\` causes a sort. Named windows allow sharing sorts.
2. **Default frame is RANGE UNBOUNDED PRECEDING → CURRENT ROW.** Ties collapse into peers. Always use explicit \`ROWS BETWEEN\`.
3. **LAST_VALUE requires UNBOUNDED FOLLOWING** or it just mirrors the current row.
4. **COUNT(DISTINCT) OVER () is rejected** on most engines.
5. **Window functions can\'t appear in WHERE** — use \`QUALIFY\` or a subquery.`,
    },
    {
      heading: '8. Common Interview Questions — Window Functions',
      subheading: '10 Core Scenario Challenges with Senior Technical Answers',
      content: `Master the answers to these 10 high-frequency questions:
- **Q1:** Give the latest order per customer.
- **Q2:** Difference between \`RANK\` and \`DENSE_RANK\`?
- **Q3:** Give a running total per customer.
- **Q4:** How would you compute a 7-day rolling sum per customer?
- **Q5:** Why does \`LAST_VALUE(...)\` sometimes return the current row instead of the last row?
- **Q6:** How do you dedupe rows keeping the latest by timestamp?
- **Q7:** What's \`QUALIFY\`?
- **Q8:** How would you compute each row's contribution as a percentage of group total?
- **Q9:** When is a window function cheaper than a self-join?
- **Q10:** Can I use \`COUNT(DISTINCT col)\` as a window function?`,
    },
    {
      heading: '9. Quick Revision — Part 02',
      subheading: 'Checklist of Window Function Rules',
      content: `- **Window function** = per-row computation over a related set of rows. Doesn't collapse rows like \`GROUP BY\`.
- **\`OVER (PARTITION BY ... ORDER BY ... frame)\`** — the three knobs.
- **Ranking**: \`ROW_NUMBER\` unique / \`RANK\` gaps after ties / \`DENSE_RANK\` no gaps / \`NTILE(n)\` buckets.
- **\`ROWS\` vs \`RANGE\`**: \`ROWS\` = physical positions (deterministic); \`RANGE\` = value ranges (peer inclusion).
- **Default frame with \`ORDER BY\`** is \`RANGE UNBOUNDED PRECEDING → CURRENT ROW\`. Use explicit \`ROWS\` for safe running sums.
- **Running aggregates** — \`SUM/AVG/COUNT/MAX/MIN OVER (... ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\`.
- **Moving aggregates** — \`ROWS BETWEEN n PRECEDING AND CURRENT ROW\` (row-based) or \`RANGE BETWEEN INTERVAL '...' PRECEDING AND CURRENT ROW\` (time-based).
- **\`LAG\` / \`LEAD\`** — previous / next row. Great for day-over-day, session gaps, next-event.
- **\`FIRST_VALUE\` / \`LAST_VALUE\`** — respect the frame. Extend to \`UNBOUNDED FOLLOWING\` for true partition-last.
- **\`IGNORE NULLS\`** — forward-fill / backward-fill for \`LAG\` / \`LEAD\` / \`FIRST_VALUE\` / \`LAST_VALUE\`.
- **Partition-total** — no \`ORDER BY\` in \`OVER\`, entire partition is the frame. Use for ratio-to-total.
- **\`QUALIFY\`** — filter on window results. Snowflake / BigQuery / Databricks / Teradata.
- **Dedup pattern** — \`QUALIFY ROW_NUMBER() OVER (PARTITION BY key ORDER BY ts DESC) = 1\` (with stable tiebreaker).
- **Named windows** — \`WINDOW w AS (...)\` — share one sort across many aggregates.
- **\`COUNT(DISTINCT col)\` as a window** — not supported on most engines.
- **Performance** — sorts drive cost; named windows share sorts; skewed partitions hurt.`,
    },
  ],
};
