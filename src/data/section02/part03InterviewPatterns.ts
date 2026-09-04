import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_03_TERMINOLOGIES: TermItem[] = [
  {
    term: 'Gaps and Islands',
    definition: 'The classic SQL problem of finding consecutive-value runs (islands) separated by discontinuities (gaps). Solved via date - ROW_NUMBER() grouping or LAG gap-flags.',
    category: 'Sequences & Streaks',
    highlight: true,
  },
  {
    term: 'Sessionization',
    definition: 'Grouping rapid-fire event streams into user sessions bounded by an inactivity threshold (e.g. 30 minutes). Modeled as a cumulative sum over gap-flags.',
    category: 'Event Processing',
    highlight: true,
  },
  {
    term: 'SCD Type 2',
    definition: 'Slowly Changing Dimension Type 2, tracking full attribute history via valid_from, valid_to, and is_current flags. Implemented via atomic close-and-insert transactions.',
    category: 'Dimensional Modeling',
    highlight: true,
  },
  {
    term: 'Date-Spine Join',
    definition: 'Joining a dense calendar series table (generated via GENERATOR or GENERATE_SERIES) against sparse transactional data to prevent missing dates in reporting.',
    category: 'Time Series',
  },
  {
    term: 'Range Overlap Predicate',
    definition: 'Two time or numeric ranges [a_start, a_end] and [b_start, b_end] overlap if and only if a_start <= b_end AND b_start <= a_end.',
    category: 'Intervals',
    highlight: true,
  },
  {
    term: 'Deterministic Tiebreaker',
    definition: 'A secondary column in an ORDER BY clause (such as order_id or load_seq) ensuring identical window ranking across multiple pipeline retries.',
    category: 'Idempotency',
  },
  {
    term: 'Cohort Analysis',
    definition: 'Segmenting users by their acquisition or signup period (e.g., first month) and measuring their retention across subsequent time intervals.',
    category: 'Analytics Modeling',
  },
  {
    term: 'PERCENTILE_DISC vs PERCENTILE_CONT',
    definition: 'PERCENTILE_DISC returns an actual observation from the dataset; PERCENTILE_CONT computes an interpolated continuous value between surrounding rows.',
    category: 'Statistics',
  },
];

export const PATTERNS_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'sql-pat-q01',
    number: 1,
    question: 'Give the latest order per customer.',
    topic: 'Patterns',
    subtopic: 'Top-N & Dedup',
    answers: {
      basic: 'ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_ts DESC) = 1.',
      strong: 'Use QUALIFY with ROW_NUMBER() and add a deterministic secondary tiebreaker.',
      senior: '"ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_ts DESC) = 1, filtered with QUALIFY. Add a stable tiebreaker like order_id DESC to ensure idempotency across pipeline retries."',
    },
  },
  {
    id: 'sql-pat-q02',
    number: 2,
    question: 'Give the top 3 orders per customer, including ties.',
    topic: 'Patterns',
    subtopic: 'Ranking Ties',
    answers: {
      basic: 'RANK() OVER (PARTITION BY customer_id ORDER BY amount_usd DESC) <= 3.',
      strong: 'Use RANK() when tied scores at position 3 should widen the result set.',
      senior: '"RANK() OVER (PARTITION BY customer_id ORDER BY amount_usd DESC) <= 3. Note that ties widen the set. If the interviewer wants strictly top 3 distinct amounts without unbounded widening, use DENSE_RANK() <= 3."',
    },
  },
  {
    id: 'sql-pat-q03',
    number: 3,
    question: 'Compute a 7-day rolling average.',
    topic: 'Patterns',
    subtopic: 'Rolling Windows',
    answers: {
      basic: 'AVG(amount) OVER (PARTITION BY customer_id ORDER BY order_date RANGE BETWEEN INTERVAL 6 DAY PRECEDING AND CURRENT ROW).',
      strong: 'Use RANGE INTERVAL rather than ROWS to correctly handle sparse calendar days without activity.',
      senior: '"AVG(amount_usd) OVER (PARTITION BY customer_id ORDER BY order_date RANGE BETWEEN INTERVAL \'6 DAY\' PRECEDING AND CURRENT ROW). RANGE INTERVAL handles sparse days. If days are guaranteed dense with zero gaps, ROWS BETWEEN 6 PRECEDING works, but RANGE INTERVAL is resilient."',
    },
  },
  {
    id: 'sql-pat-q04',
    number: 4,
    question: 'Find users active on consecutive days.',
    topic: 'Patterns',
    subtopic: 'Gaps & Islands',
    answers: {
      basic: 'Use the date minus row number trick.',
      strong: 'Subtract ROW_NUMBER() from activity_date; consecutive dates yield a constant difference group.',
      senior: '"Gaps-and-islands: subtract a ROW_NUMBER() from the date; consecutive days share a constant. Group by that constant to get streaks. Alternatively, flag gaps with LAG > 1 day, cumulative sum the flags to assign streak IDs, then group by streak ID."',
    },
  },
  {
    id: 'sql-pat-q05',
    number: 5,
    question: 'Sessionize events with a 30-minute idle timeout.',
    topic: 'Patterns',
    subtopic: 'Sessionization',
    answers: {
      basic: 'Flag when the gap between events is over 30 minutes, then sum the flags.',
      strong: 'Use LAG to calculate minutes since last event; if > 30 or NULL, flag 1. Cumulative SUM of flags gives session_id.',
      senior: '"Flag every event where the gap from the previous event exceeds 30 min as a session start using LAG. Cumulative sum of flags gives a unique session ID per user. Then group by (user_id, session_id) for session start, end, duration, and event counts."',
    },
  },
  {
    id: 'sql-pat-q06',
    number: 6,
    question: 'Maintain SCD Type 2 for customer.',
    topic: 'Patterns',
    subtopic: 'SCD Type 2',
    answers: {
      basic: 'Update the existing record to set valid_to and insert the new row.',
      strong: 'Execute an atomic two-step transaction: close current records whose tracked attributes changed, then insert new versions for changed and new keys.',
      senior: '"Two statements in one transaction: UPDATE closes the current row where attributes changed (setting valid_to = now(), is_current = FALSE); INSERT writes a new current row for changed and new customers. Use IS DISTINCT FROM for NULL-safe change comparison."',
    },
  },
  {
    id: 'sql-pat-q07',
    number: 7,
    question: 'Find overlapping date ranges.',
    topic: 'Patterns',
    subtopic: 'Range Overlaps',
    answers: {
      basic: 'Join where start_a <= end_b and start_b <= end_a.',
      strong: 'Use the universal range overlap condition a.start <= b.end AND b.start <= a.end with an ID inequality to avoid self-matches.',
      senior: '"Two ranges overlap iff a.start <= b.end AND b.start <= a.end. Add a.id < b.id to avoid duplicate symmetric pairs and self-matches. Calculate overlap window using GREATEST(a.start, b.start) and LEAST(a.end, b.end)."',
    },
  },
  {
    id: 'sql-pat-q08',
    number: 8,
    question: 'Find employees earning more than their manager.',
    topic: 'Patterns',
    subtopic: 'Hierarchical Joins',
    answers: {
      basic: 'Self-join the employee table on manager_id.',
      strong: 'Join employee e to employee m on e.manager_id = m.emp_id and filter WHERE e.salary > m.salary.',
      senior: '"Self-join on emp.manager_id = manager.emp_id, WHERE emp.salary > manager.salary. The optimizer executes this cleanly as a single hash join rather than a correlated subquery."',
    },
  },
  {
    id: 'sql-pat-q09',
    number: 9,
    question: 'Compute median per group.',
    topic: 'Patterns',
    subtopic: 'Statistical Aggregates',
    answers: {
      basic: 'Use MEDIAN(col) or PERCENTILE_CONT(0.5).',
      strong: 'PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY col) for continuous interpolation, or PERCENTILE_DISC(0.5) for discrete value.',
      senior: '"MEDIAN(col) or PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY col) grouped by the group column. In the follow-up, explain that CONT interpolates averages for even sample sizes whereas DISC returns a real observed value from the input."',
    },
  },
  {
    id: 'sql-pat-q10',
    number: 10,
    question: 'Find departments where every employee earns > $100k.',
    topic: 'Patterns',
    subtopic: 'Universal Quantification',
    answers: {
      basic: 'GROUP BY department HAVING MIN(salary) > 100000.',
      strong: 'HAVING MIN(salary) > 100000 ensures the lowest paid employee exceeds the threshold.',
      senior: '"GROUP BY department HAVING MIN(salary) > 100000. An alternative pattern is NOT EXISTS (SELECT 1 FROM employee e2 WHERE e2.department = e.department AND e2.salary <= 100000), meaning no employee earns <= 100k."',
    },
  },
];

export const PART_03_INTERVIEW_PATTERNS_DATA: SectionPart = {
  id: 'sql-part-03',
  title: 'Section 02 Part 03: Interview Patterns',
  partNumber: 'PART 03',
  subtitle: '26 Canonical Production & Interview Query Architectures',
  summary: 'The canonical SQL interview problems. If you\'ve heard "top-N per group" or "gaps and islands" or "sessionize this stream" and hesitated, this file makes them second nature with full worked SQL implementations.',
  readTimeMinutes: 35,
  terminologies: PART_03_TERMINOLOGIES,
  sections: [
    {
      heading: '0. How to Use This File & Setup',
      subheading: 'Reasoning Framework & Base Schema',
      content: `Practice each pattern **out loud** before looking at the SQL. Interviewers value your reasoning path more than your first attempt at code.

For every pattern, be able to say four things:
1. **What signal in the question tells you it's this pattern?**
2. **What's the mental model?**
3. **What's the canonical SQL?**
4. **What could break it or make it slow?**

#### Setup used throughout:
\`\`\`sql
CREATE OR REPLACE TABLE orders (
    order_id     NUMBER,
    customer_id  NUMBER,
    amount_usd   NUMBER(18,2),
    order_date   DATE
);
\`\`\``,
    },
    {
      heading: '1. Top-N Per Group & Deduplication',
      subheading: 'Patterns 1–4: Top-N, CDC Stream Dedup, First/Last & Second Highest',
      content: `### 1. Top-N per group
**Problem:** *"Give me the top 3 orders per customer by amount."*  
**Signal:** "per group" + "top N by X" → \`ROW_NUMBER\` / \`RANK\` / \`DENSE_RANK\`.  
**Approach:** Number rows within each partition, sorted by the ranking column, then filter on the rank.

\`\`\`sql
-- Snowflake / BigQuery / Databricks
SELECT *
FROM   orders
QUALIFY ROW_NUMBER() OVER (
    PARTITION BY customer_id
    ORDER BY amount_usd DESC, order_id DESC       -- stable tiebreaker
) <= 3;
\`\`\`
- **Include ties widening the set:** use \`RANK() <= 3\`.
- **Include ties without widening:** use \`DENSE_RANK() <= 3\`.
- **Postgres (no QUALIFY):** wrap in a subquery: \`SELECT * FROM (... rn ...) WHERE rn <= 3\`.

### 2. Deduplication — keep the latest per key
**Problem:** *"Streams from CDC have duplicate \`order_id\` rows. Keep the most recent version of each."*  
**Signal:** "Duplicates," "keep the latest," "most recent version."

\`\`\`sql
SELECT *
FROM   raw.orders_stream
QUALIFY ROW_NUMBER() OVER (
    PARTITION BY order_id
    ORDER BY event_ts DESC, load_seq DESC         -- deterministic tiebreaker
) = 1;
\`\`\`
**Gotchas:** Without the tiebreaker, retries pick different rows → breaks downstream idempotency.

### 3. First and last event per group
**Problem:** *"For each customer, give me their first and most recent order."*

\`\`\`sql
SELECT DISTINCT
    customer_id,
    FIRST_VALUE(order_id) OVER (PARTITION BY customer_id ORDER BY order_date ASC)  AS first_order,
    FIRST_VALUE(order_id) OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS last_order,
    MIN(order_date) OVER (PARTITION BY customer_id) AS first_date,
    MAX(order_date) OVER (PARTITION BY customer_id) AS last_date
FROM orders;
\`\`\`

**Alternative with ARG_MIN / ARG_MAX (Snowflake / BigQuery):**
\`\`\`sql
SELECT customer_id,
       MIN_BY(order_id, order_date) AS first_order,
       MAX_BY(order_id, order_date) AS last_order
FROM   orders
GROUP  BY customer_id;
\`\`\`

### 4. Second-highest value
**Problem:** *"Give me each customer's second-largest order amount."*

\`\`\`sql
SELECT customer_id, amount_usd AS second_highest
FROM   orders
QUALIFY DENSE_RANK() OVER (
    PARTITION BY customer_id ORDER BY amount_usd DESC
) = 2;
\`\`\`
Use \`DENSE_RANK\`, not \`ROW_NUMBER\`, so ties on the highest amount don't push the "second" to a duplicate highest value.`,
    },
    {
      heading: '2. Running Totals, Moving Averages & YoY Growth',
      subheading: 'Patterns 5–7: Cumulative Sums, Rolling Windows & Calendar Comparisons',
      content: `### 5. Running total (cumulative sum)
**Problem:** *"For each customer, show the running total of \`amount_usd\` in chronological order."*

\`\`\`sql
SELECT customer_id, order_date, amount_usd,
       SUM(amount_usd) OVER (
           PARTITION BY customer_id
           ORDER BY order_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM orders;
\`\`\`
**Gotcha:** **Always** use explicit \`ROWS BETWEEN\`. The default frame with \`ORDER BY\` is \`RANGE\`, which groups peer rows on ties.

### 6. Moving average (rolling window)
**Problem:** *"Show a 7-day rolling average of \`amount_usd\` per customer."*

\`\`\`sql
-- Time-based frame (safer with sparse data)
SELECT customer_id, order_date, amount_usd,
       AVG(amount_usd) OVER (
           PARTITION BY customer_id
           ORDER BY order_date
           RANGE BETWEEN INTERVAL '6 DAY' PRECEDING AND CURRENT ROW
       ) AS rolling_7d_avg
FROM orders;
\`\`\`
If data is guaranteed dense (exactly one row per calendar day):
\`\`\`sql
AVG(amount_usd) OVER (
    PARTITION BY customer_id
    ORDER BY order_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
) AS rolling_7row_avg
\`\`\`

### 7. Year-over-year / month-over-month
**Problem:** *"For each month, show the total revenue and the % change vs the same month last year."*

\`\`\`sql
WITH monthly AS (
    SELECT DATE_TRUNC('month', order_date) AS month,
           SUM(amount_usd) AS revenue
    FROM   orders
    GROUP  BY 1
)
SELECT month,
       revenue,
       LAG(revenue, 12) OVER (ORDER BY month) AS revenue_ly,
       revenue - LAG(revenue, 12) OVER (ORDER BY month) AS yoy_change,
       (revenue - LAG(revenue, 12) OVER (ORDER BY month))
           / NULLIF(LAG(revenue, 12) OVER (ORDER BY month), 0) AS yoy_pct
FROM monthly;
\`\`\`
**Gotchas:** \`LAG(x, 12)\` assumes contiguous months. Join a calendar date-spine to fill missing months first. Use \`NULLIF(..., 0)\` to prevent divide-by-zero.`,
    },
    {
      heading: '3. Gaps & Islands, Sessionization & Cohort Analysis',
      subheading: 'Patterns 8–10: The Difference Trick, Idle Timeouts & User Retention',
      content: `### 8. Gaps and islands
**Problem:** *"For each user, find consecutive-day activity streaks."*

Sample:
\`\`\`
user_id  activity_date
1        2026-08-01
1        2026-08-02
1        2026-08-03
1        2026-08-06
1        2026-08-07
\`\`\`
Expected: two streaks — \`2026-08-01 → 2026-08-03\` and \`2026-08-06 → 2026-08-07\`.

**The classic trick:** Subtract a running row number from the date. Consecutive days give the same difference → group by it:
\`\`\`sql
WITH numbered AS (
    SELECT user_id, activity_date,
           DATEADD(day,
                   -ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY activity_date),
                   activity_date
           ) AS grp
    FROM daily_activity
)
SELECT user_id,
       MIN(activity_date) AS streak_start,
       MAX(activity_date) AS streak_end,
       COUNT(*)           AS streak_length_days
FROM   numbered
GROUP  BY user_id, grp
ORDER  BY user_id, streak_start;
\`\`\`
**Why the trick works:** If dates are consecutive (\`+1 each row\`) and the row number is also \`+1 each row\`, \`date − row_number\` stays *constant* through the run. It only changes when there's a gap.

### 9. Sessionization
**Problem:** *"Group user events into sessions. A session ends after 30 minutes of inactivity."*

\`\`\`sql
WITH gaps AS (
    SELECT user_id, event_ts,
           CASE WHEN DATEDIFF(minute,
                              LAG(event_ts) OVER (PARTITION BY user_id ORDER BY event_ts),
                              event_ts) > 30
                OR LAG(event_ts) OVER (PARTITION BY user_id ORDER BY event_ts) IS NULL
                THEN 1 ELSE 0 END AS is_session_start
    FROM events
),
sessions AS (
    SELECT user_id, event_ts,
           SUM(is_session_start) OVER (
               PARTITION BY user_id
               ORDER BY event_ts
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
           ) AS session_id
    FROM gaps
)
SELECT user_id, session_id,
       MIN(event_ts) AS session_start,
       MAX(event_ts) AS session_end,
       COUNT(*)      AS events_in_session,
       DATEDIFF(second, MIN(event_ts), MAX(event_ts)) AS duration_seconds
FROM sessions
GROUP BY user_id, session_id;
\`\`\`

### 10. Cohort analysis — retention by first-event month
**Problem:** *"Cohort users by their signup month. For each cohort, show retention over the next N months."*

\`\`\`sql
WITH first_activity AS (
    SELECT user_id, DATE_TRUNC('month', MIN(event_ts))::DATE AS cohort_month
    FROM   events
    GROUP  BY user_id
),
activity_by_month AS (
    SELECT DISTINCT user_id, DATE_TRUNC('month', event_ts)::DATE AS active_month
    FROM   events
),
joined AS (
    SELECT f.cohort_month,
           DATEDIFF(month, f.cohort_month, a.active_month) AS months_since_signup,
           a.user_id
    FROM   first_activity f
    JOIN   activity_by_month a USING (user_id)
),
retention AS (
    SELECT cohort_month,
           months_since_signup,
           COUNT(DISTINCT user_id) AS active_users
    FROM   joined
    GROUP  BY cohort_month, months_since_signup
),
cohort_size AS (
    SELECT cohort_month, COUNT(DISTINCT user_id) AS n
    FROM   first_activity
    GROUP  BY cohort_month
)
SELECT r.cohort_month,
       r.months_since_signup,
       r.active_users,
       c.n AS cohort_size,
       r.active_users::FLOAT / NULLIF(c.n, 0) AS retention_rate
FROM   retention r
JOIN   cohort_size c USING (cohort_month)
ORDER  BY r.cohort_month, r.months_since_signup;
\`\`\``,
    },
    {
      heading: '4. Pivots, Unpivots, Self-Joins & Active Days',
      subheading: 'Patterns 11–14: Matrix Reshaping & Threshold Aggregations',
      content: `### 11. Pivot — rows to columns
**Problem:** *"For each customer, show total revenue per quarter as columns Q1 / Q2 / Q3 / Q4."*

\`\`\`sql
-- Portable conditional aggregation
SELECT customer_id,
       SUM(amount_usd) FILTER (WHERE EXTRACT(quarter FROM order_date) = 1) AS q1,
       SUM(amount_usd) FILTER (WHERE EXTRACT(quarter FROM order_date) = 2) AS q2,
       SUM(amount_usd) FILTER (WHERE EXTRACT(quarter FROM order_date) = 3) AS q3,
       SUM(amount_usd) FILTER (WHERE EXTRACT(quarter FROM order_date) = 4) AS q4
FROM orders
GROUP BY customer_id;
\`\`\`

Snowflake \`PIVOT\`:
\`\`\`sql
SELECT *
FROM (
    SELECT customer_id, EXTRACT(quarter FROM order_date) AS q, amount_usd
    FROM   orders
) PIVOT (SUM(amount_usd) FOR q IN (1, 2, 3, 4)) AS p(customer_id, q1, q2, q3, q4);
\`\`\`

### 12. Unpivot — columns to rows
\`\`\`sql
SELECT customer_id, quarter, sales
FROM quarterly_sales
UNPIVOT (sales FOR quarter IN (q1_sales, q2_sales, q3_sales, q4_sales));
\`\`\`

### 13. Employees earning more than their manager
\`\`\`sql
SELECT e.emp_id, e.name, e.salary,
       m.name  AS manager_name,
       m.salary AS manager_salary
FROM   employee e
JOIN   employee m ON m.emp_id = e.manager_id
WHERE  e.salary > m.salary;
\`\`\`

### 14. Users active N of last M days
\`\`\`sql
SELECT user_id
FROM   daily_activity
WHERE  activity_date >= DATEADD(day, -30, CURRENT_DATE())
GROUP  BY user_id
HAVING COUNT(DISTINCT activity_date) >= 5;
\`\`\``,
    },
    {
      heading: '5. Statistical Medians, Range Overlaps & SCD2',
      subheading: 'Patterns 15–18: Interpolated Percentiles, Date Overlaps & Dimension Tracking',
      content: `### 15. Median — with and without a PERCENTILE function
\`\`\`sql
-- Native functions
SELECT customer_id,
       MEDIAN(amount_usd)                                  AS median_amount,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount_usd) AS median_via_percentile
FROM   orders
GROUP  BY customer_id;
\`\`\`

Window-function fallback (when \`MEDIAN\` unavailable):
\`\`\`sql
WITH ranked AS (
    SELECT customer_id, amount_usd,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount_usd) AS rn,
           COUNT(*)     OVER (PARTITION BY customer_id) AS n
    FROM orders
)
SELECT customer_id,
       AVG(amount_usd) AS median_amount
FROM   ranked
WHERE  rn IN (FLOOR((n + 1) / 2.0), CEIL((n + 1) / 2.0))
GROUP  BY customer_id;
\`\`\`

### 16. Date overlap detection
Two ranges \`[a_start, a_end]\` and \`[b_start, b_end]\` overlap **iff**:
\`\`\`
a_start <= b_end  AND  b_start <= a_end
\`\`\`

\`\`\`sql
SELECT s1.customer_id, s1.subscription_id AS sub_a, s2.subscription_id AS sub_b,
       GREATEST(s1.start_date, s2.start_date) AS overlap_start,
       LEAST(s1.end_date,   s2.end_date)      AS overlap_end
FROM   subscription s1
JOIN   subscription s2
       ON  s1.customer_id  =  s2.customer_id
       AND s1.subscription_id < s2.subscription_id             -- avoid duplicate pairs & self-matches
       AND s1.start_date  <= s2.end_date
       AND s2.start_date  <= s1.end_date;
\`\`\`

### 17. SCD Type 2 in pure SQL
\`\`\`sql
BEGIN;

-- 1. Close current versions where anything changed
UPDATE silver.customer_scd2 t
SET    valid_to   = CURRENT_TIMESTAMP(),
       is_current = FALSE
FROM   staging.customer_incoming s
WHERE  t.customer_id = s.customer_id
  AND  t.is_current  = TRUE
  AND  (t.name  <> s.name  OR t.email <> s.email);

-- 2. Insert new current rows for both changed and brand-new customers
INSERT INTO silver.customer_scd2
       (customer_id, name, email, valid_from, valid_to, is_current)
SELECT s.customer_id, s.name, s.email,
       CURRENT_TIMESTAMP(), NULL, TRUE
FROM   staging.customer_incoming s
LEFT   JOIN silver.customer_scd2 t
       ON t.customer_id = s.customer_id AND t.is_current = TRUE
WHERE  t.customer_id IS NULL                       -- new customer
   OR  (t.name <> s.name OR t.email <> s.email);   -- changed customer

COMMIT;
\`\`\`

### 18. PERCENTILE_DISC vs PERCENTILE_CONT
- **\`PERCENTILE_DISC(p)\`** — returns an *actual value from the data set*.
- **\`PERCENTILE_CONT(p)\`** — returns an *interpolated* value between the two surrounding rows.

\`\`\`sql
SELECT
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount_usd) AS median_cont,
    PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY amount_usd) AS median_disc
FROM orders;
\`\`\``,
    },
    {
      heading: '6. Advanced Filtering, Date-Spines & Procedural Decision Rules',
      subheading: 'Patterns 19–26: Conditional Accumulation, Gap Filling & SQL vs Loops',
      content: `### 19. Nth event per user
\`\`\`sql
SELECT *
FROM   orders
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) = 3;
\`\`\`

### 20. Sum with only some rows contributing (windowed conditional sum)
\`\`\`sql
SELECT customer_id, order_date, status, amount_usd,
       SUM(CASE WHEN status = 'COMPLETED' THEN amount_usd END) OVER (
           PARTITION BY customer_id
           ORDER BY order_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_completed_total
FROM orders;
\`\`\`

### 21. Frequency / mode
\`\`\`sql
WITH counted AS (
    SELECT customer_id, amount_usd, COUNT(*) AS cnt
    FROM orders
    GROUP BY customer_id, amount_usd
)
SELECT customer_id, amount_usd AS mode_amount, cnt
FROM   counted
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY cnt DESC, amount_usd DESC) = 1;
\`\`\`

### 22. Departments where every employee earns > X
\`\`\`sql
SELECT department
FROM   employee
GROUP  BY department
HAVING MIN(salary) > 100000;
\`\`\`

### 23. Consecutive events / same-value runs
\`\`\`sql
WITH last3 AS (
    SELECT customer_id, order_date, region
    FROM   orders
    QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) <= 3
)
SELECT customer_id
FROM   last3
GROUP  BY customer_id
HAVING COUNT(*) = 3
   AND COUNT(DISTINCT region) = 1;
\`\`\`

### 24. First transaction of a specific type after signup
\`\`\`sql
SELECT u.user_id, u.signup_ts,
       MIN(o.order_ts) AS first_post_signup_order_ts
FROM   users u
LEFT   JOIN orders o
       ON o.user_id = u.user_id
      AND o.order_ts > u.signup_ts
GROUP  BY u.user_id, u.signup_ts;
\`\`\`

### 25. Fill gaps in a time series (date-spine join)
\`\`\`sql
WITH calendar AS (
    SELECT DATEADD(day, seq, '2026-01-01'::DATE) AS d
    FROM   TABLE(GENERATOR(ROWCOUNT => 365)) v(seq)
)
SELECT c.d, COALESCE(SUM(o.amount_usd), 0) AS revenue
FROM   calendar c
LEFT   JOIN orders o ON DATE(o.order_ts) = c.d
GROUP  BY c.d
ORDER  BY c.d;
\`\`\`

### 26. When to reach for procedural code vs pure SQL
Most data-engineering "loops" are anti-patterns in SQL. Step back and ask:
1. Is this a **top-N-per-group**? → window function.
2. Is this an **adjacent-row comparison**? → \`LAG\` / \`LEAD\`.
3. Is this **conditional aggregation**? → \`FILTER\` or \`CASE WHEN\`.
4. Is this a **hierarchy**? → recursive CTE.
5. Is this a **gap / streak / session**? → gaps-and-islands or sessionization pattern.

If none of those fit, **then** consider a stored proc or scripting language. Not before.`,
    },
    {
      heading: '7. Quick Revision — Part 03',
      subheading: 'High-Speed Synthesis of Patterns 1–26',
      content: `- **Top-N per group** → \`ROW_NUMBER\` / \`RANK\` / \`DENSE_RANK\` + \`QUALIFY\`.
- **Dedup latest** → \`ROW_NUMBER PARTITION BY key ORDER BY ts DESC\` + stable tiebreaker.
- **Running total** → explicit \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`.
- **Moving window** → \`ROWS n PRECEDING\` for row-based; \`RANGE INTERVAL\` for calendar-based.
- **YoY / MoM** → \`LAG(x, 12)\` with a date spine to avoid missing-month traps.
- **Gaps and islands** → \`date − ROW_NUMBER\` trick, or \`LAG\` + cumulative flag.
- **Sessionization** → gap flag + cumulative sum = session ID.
- **Cohorts** → cohort by first-activity month, join to activity, compute \`months_since_signup\`.
- **Pivot** → conditional aggregation with \`FILTER\` or \`CASE\`; or dialect \`PIVOT\`.
- **Unpivot** → dialect \`UNPIVOT\` or \`UNION ALL\`.
- **Second-highest** → \`DENSE_RANK() = 2\` beats \`MAX\` subqueries.
- **Median** → \`MEDIAN()\` or \`PERCENTILE_CONT(0.5) WITHIN GROUP (...)\`; know \`DISC\` vs \`CONT\`.
- **Overlap detection** → \`a.start <= b.end AND b.start <= a.end\`; add \`id <\` for uniqueness.
- **SCD2** → close-then-insert transaction; NULL-safe compare.
- **"Every" queries** → \`HAVING MIN(...)\` or \`NOT EXISTS\`.
- **Nth event** → \`ROW_NUMBER() = N\`.
- **Fill gaps** → date spine + \`LEFT JOIN\` + \`COALESCE(SUM, 0)\`.
- **Conditional running total** → \`SUM(CASE WHEN ... THEN col END) OVER (...)\`.`,
    },
  ],
};
