import { SectionPart, TermItem, InterviewQuestion } from '../../types';

export const PART_05_TERMINOLOGIES: TermItem[] = [
  {
    term: 'Live coding',
    definition: 'Interactive coding session where the interviewer evaluates problem-solving rhythm, edge-case vocalization, and dialect fluency under time limits.',
    category: 'Interview Format',
    highlight: true,
  },
  {
    term: 'Take-home assignment',
    definition: 'Asynchronous project evaluated on production-grade standards: modular CTEs, idempotent DML, clear documentation, and error boundaries.',
    category: 'Interview Format',
  },
  {
    term: 'System design SQL',
    definition: 'Architectural rounds where SQL is evaluated for scalability: partitioning strategy, clustering keys, micro-partition pruning, and concurrency.',
    category: 'Interview Format',
    highlight: true,
  },
  {
    term: 'Dry run / trace',
    definition: 'Manually walking through query execution with 3–4 toy sample rows to prove logic correctness before writing complex window clauses.',
    category: 'Problem Solving',
    highlight: true,
  },
  {
    term: 'Idempotency test',
    definition: 'Verifying that running a DML statement twice on the same input dataset produces identical final state without duplicate records.',
    category: 'Production Standards',
    highlight: true,
  },
  {
    term: 'Dialect trap',
    definition: 'Subtle behavioral differences between database engines (e.g. QUALIFY support, zero-division behavior, string concatenation).',
    category: 'SQL Standards',
  },
  {
    term: 'Corner case',
    definition: 'Boundary conditions: NULL values, empty tables, ties in ranking, missing calendar dates, duplicate join keys.',
    category: 'Testing & Robustness',
    highlight: true,
  },
];

export const CHEATSHEET_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'sql-cs-q01',
    number: 1,
    question: 'How do you get the latest row per key?',
    topic: 'Cheatsheet',
    subtopic: 'Top-N',
    answers: {
      basic: 'ROW_NUMBER() OVER (PARTITION BY key ORDER BY ts DESC) = 1.',
      strong: 'Use QUALIFY with ROW_NUMBER() and a secondary tiebreaker.',
      senior: '"QUALIFY ROW_NUMBER() OVER (PARTITION BY key ORDER BY ts DESC, id DESC) = 1. Always include the secondary tiebreaker for idempotency."',
    },
  },
  {
    id: 'sql-cs-q02',
    number: 2,
    question: 'When does a LEFT JOIN drop rows?',
    topic: 'Cheatsheet',
    subtopic: 'Joins',
    answers: {
      basic: 'When you put a filter on the right table in the WHERE clause.',
      strong: 'A filter on the right table in WHERE evaluates NULL as unknown and drops unmatched left rows.',
      senior: '"When a predicate on the right table is placed in the WHERE clause instead of the ON clause. NULL compared to any value evaluates to UNKNOWN and gets discarded."',
    },
  },
  {
    id: 'sql-cs-q03',
    number: 3,
    question: 'What is the default frame of a window function with ORDER BY?',
    topic: 'Cheatsheet',
    subtopic: 'Window Functions',
    answers: {
      basic: 'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.',
      strong: 'RANGE UNBOUNDED PRECEDING to CURRENT ROW, which groups peer values together.',
      senior: '"RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. The critical catch is RANGE: tied rows are treated as peers and lumped into the same frame slice. Always use explicit ROWS BETWEEN for row-by-row math."',
    },
  },
  {
    id: 'sql-cs-q04',
    number: 4,
    question: 'How do you find consecutive active day streaks?',
    topic: 'Cheatsheet',
    subtopic: 'Gaps & Islands',
    answers: {
      basic: 'Subtract a row number from the date.',
      strong: 'Subtract ROW_NUMBER() from activity_date; the difference is constant for consecutive days.',
      senior: '"Gaps and islands: date - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date). Consecutive days produce an identical date offset, creating a group ID for GROUP BY."',
    },
  },
  {
    id: 'sql-cs-q05',
    number: 5,
    question: 'Why avoid NOT IN with a subquery?',
    topic: 'Cheatsheet',
    subtopic: 'Three-Valued Logic',
    answers: {
      basic: 'If there is a NULL, it returns 0 rows.',
      strong: 'A single NULL in the subquery causes the expression to evaluate to UNKNOWN for every row, returning an empty set.',
      senior: '"Three-valued logic: if the subquery returns even one NULL, NOT IN evaluates to UNKNOWN for all rows and returns zero rows silently. Use NOT EXISTS instead."',
    },
  },
  {
    id: 'sql-cs-q06',
    number: 6,
    question: 'What is the difference between RANK and DENSE_RANK?',
    topic: 'Cheatsheet',
    subtopic: 'Ranking',
    answers: {
      basic: 'RANK skips numbers after ties; DENSE_RANK does not skip.',
      strong: 'RANK leaves gaps (1, 1, 3); DENSE_RANK has contiguous numbers (1, 1, 2).',
      senior: '"Both assign identical rank to ties. RANK leaves gaps equal to the count of duplicates (1, 1, 3); DENSE_RANK increments consecutively without gaps (1, 1, 2)."',
    },
  },
  {
    id: 'sql-cs-q07',
    number: 7,
    question: 'How do you calculate a safe percentage without divide-by-zero errors?',
    topic: 'Cheatsheet',
    subtopic: 'Defensive SQL',
    answers: {
      basic: 'Use NULLIF(denominator, 0).',
      strong: 'Wrap the denominator in NULLIF(denominator, 0) so it returns NULL instead of throwing an error.',
      senior: '"numerator / NULLIF(denominator, 0). If denominator is 0, NULLIF turns it to NULL, and the division returns NULL instead of crashing the pipeline."',
    },
  },
  {
    id: 'sql-cs-q08',
    number: 8,
    question: 'Why does LAST_VALUE() often return the current row instead of the partition-last?',
    topic: 'Cheatsheet',
    subtopic: 'Window Frames',
    answers: {
      basic: 'Because the default window stops at the current row.',
      strong: 'The default frame stops at CURRENT ROW, so the last visible value is the current row itself.',
      senior: '"Because the default frame with ORDER BY stops at CURRENT ROW. You must explicitly specify ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING to see the true end of the partition."',
    },
  },
  {
    id: 'sql-cs-q09',
    number: 9,
    question: 'What causes non-deterministic merge errors in Snowflake?',
    topic: 'Cheatsheet',
    subtopic: 'MERGE',
    answers: {
      basic: 'Multiple source rows matching a single target row.',
      strong: 'When more than one source row has the same join key matching a target row, the engine cannot decide which update to apply.',
      senior: '"Duplicate keys in the source dataset. If two incoming rows match the same target key, MERGE throws a duplicate row / non-deterministic update error. Always deduplicate source feeds first."',
    },
  },
  {
    id: 'sql-cs-q10',
    number: 10,
    question: 'How do you detect date overlaps between intervals?',
    topic: 'Cheatsheet',
    subtopic: 'Interval Logic',
    answers: {
      basic: 'start_a <= end_b AND start_b <= end_a.',
      strong: 'Two intervals overlap iff start_a <= end_b AND start_b <= end_a.',
      senior: '"The universal interval overlap formula: a.start <= b.end AND b.start <= a.end. Add a.id < b.id to prevent symmetric duplicate pairs and self-comparisons."',
    },
  },
];

export const PART_05_INTERVIEW_CHEATSHEET_DATA: SectionPart = {
  id: 'sql-part-05',
  title: 'Section 02 Part 05: Interview & Cheatsheet',
  partNumber: 'PART 05',
  subtitle: 'Interview Playbook, Master Syntax Cheatsheet & Dialect Matrix',
  summary: 'Everything you need in the final 48 hours before an interview: the 5 question archetypes, step-by-step whiteboard playbook, one-liner cheatsheets, and cross-dialect comparison matrix.',
  readTimeMinutes: 25,
  terminologies: PART_05_TERMINOLOGIES,
  sections: [
    {
      heading: '1. The 5 Archetypes of SQL Interview Questions',
      subheading: 'Categorization Framework to Instantly Recognize Problems',
      content: `Every senior SQL interview question maps to one of five archetypes:

### Archetype 1: Aggregation & Rollup
- **Prompts:** "Revenue per region", "Active users per month", "Subtotals and grand totals".
- **Toolbox:** \`GROUP BY\`, \`HAVING\`, \`FILTER (WHERE ...)\`, \`GROUPING SETS\`, \`ROLLUP\`.

### Archetype 2: Top-N & Ranking
- **Prompts:** "Top 3 per customer", "Latest transaction", "Second highest salary".
- **Toolbox:** \`ROW_NUMBER()\`, \`RANK()\`, \`DENSE_RANK()\`, \`QUALIFY\`, \`NTILE()\`.

### Archetype 3: Gaps, Islands & Sequences
- **Prompts:** "Consecutive login streaks", "User sessionization (30 min timeout)", "Downtime periods".
- **Toolbox:** \`LAG()\`, \`LEAD()\`, \`date - ROW_NUMBER()\`, cumulative sum of gap flags.

### Archetype 4: Hierarchical & Relational Comparison
- **Prompts:** "Employees earning more than manager", "Org tree reporting depth", "Mutual friendships".
- **Toolbox:** Self-joins, \`EXISTS\`, \`RECURSIVE CTE\`.

### Archetype 5: DML, Upsert & Pipeline Correctness
- **Prompts:** "Design an idempotent CDC ingestion job", "Maintain SCD Type 2 dimension".
- **Toolbox:** \`MERGE\`, two-statement transactions, deterministic deduplication.`,
    },
    {
      heading: '2. The Senior SQL Interview Playbook',
      subheading: '6-Step Communication & Delivery Protocol',
      content: `Follow this sequence during live whiteboard or screen-share rounds:

\`\`\`
1. Clarify Grain & Schema   ── "What does one row represent? Can keys be null? Are there ties?"
          │
          ▼
2. State Edge Cases Early   ── "I will account for nulls, ties on amount, and duplicate events."
          │
          ▼
3. Propose Strategy Aloud   ── "I'll use a window function with QUALIFY rather than a self-join."
          │
          ▼
4. Write Clean, Modular CTEs── Clear CTE names, formatted indentation, explicit column lists.
          │
          ▼
5. Dry-Run With Toy Sample  ── Trace 2–3 rows through your query to verify edge-case behavior.
          │
          ▼
6. Discuss Cost & Scale     ── "At 1B rows, this sort causes memory pressure; here is how we cluster."
\`\`\``,
    },
    {
      heading: '3. Master Syntax Cheatsheet',
      subheading: 'One-Liner Templates for Production Tasks',
      content: `\`\`\`sql
-- 1. Deduplicate latest version:
QUALIFY ROW_NUMBER() OVER (PARTITION BY key ORDER BY ts DESC, id DESC) = 1

-- 2. Running total (safe frame):
SUM(amt) OVER (PARTITION BY key ORDER BY ts ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

-- 3. Day-over-day difference:
amt - LAG(amt) OVER (PARTITION BY key ORDER BY ts)

-- 4. Sessionization (30-min idle):
SUM(CASE WHEN DATEDIFF('minute', LAG(ts) OVER (PARTITION BY uid ORDER BY ts), ts) > 30 
         OR LAG(ts) OVER (PARTITION BY uid ORDER BY ts) IS NULL THEN 1 ELSE 0 END) 
OVER (PARTITION BY uid ORDER BY ts ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

-- 5. Safe division:
numerator / NULLIF(denominator, 0)

-- 6. Range overlap:
WHERE a.start_date <= b.end_date AND b.start_date <= a.end_date AND a.id < b.id

-- 7. Percent of group total:
amt / SUM(amt) OVER (PARTITION BY group_id)
\`\`\``,
    },
    {
      heading: '4. Dialect Comparison Matrix',
      subheading: 'Snowflake vs BigQuery vs Databricks vs PostgreSQL',
      content: `| Feature | Snowflake | BigQuery | Databricks (Spark SQL) | PostgreSQL |
|---|---|---|---|---|
| **QUALIFY clause** | ✅ Supported | ✅ Supported | ✅ Supported | ❌ Subquery wrapper needed |
| **Window FILTER clause** | ❌ (Use CASE/IFF) | ❌ (Use CASE) | ❌ (Use CASE) | ✅ Supported |
| **Median Function** | \`MEDIAN(col)\` | \`APPROX_QUANTILES\` | \`MEDIAN(col)\` | \`PERCENTILE_CONT(0.5)\` |
| **Date Add Syntax** | \`DATEADD('day', 1, d)\` | \`DATE_ADD(d, INTERVAL 1 DAY)\` | \`date_add(d, 1)\` | \`d + INTERVAL '1 day'\` |
| **Time Travel Syntax** | \`AT (TIMESTAMP => ...)\` | \`FOR SYSTEM_TIME AS OF\` | \`TIMESTAMP AS OF\` | ❌ (Custom audit tables) |
| **Pivot / Unpivot** | ✅ Built-in keywords | ✅ Built-in keywords | ✅ Built-in keywords | Extension (\`tablefunc\`) |
| **Zero Division** | Throws error (use NULLIF) | Returns NULL by default (safe) | Configurable | Throws error (use NULLIF) |`,
    },
    {
      heading: '5. The 10 Rules of Production SQL',
      subheading: 'Senior Engineering Standards for Pipeline Code',
      content: `1. **Never use \`SELECT *\` in production pipelines**: Always list explicit columns.
2. **Always define explicit window frames**: Default \`RANGE\` invites subtle peer bugs.
3. **Always use deterministic tiebreakers**: \`ROW_NUMBER\` without secondary key breaks idempotency.
4. **Guard every division with \`NULLIF(..., 0)\`**: Zero division will fail pipelines at 3 AM.
5. **Use \`NOT EXISTS\` instead of \`NOT IN\`**: Prevent three-valued logic null traps.
6. **Prefer Sargable predicates**: Never wrap indexed or partitioned columns in functions in \`WHERE\`.
7. **Verify join grain before joining**: Do not use \`SELECT DISTINCT\` to hide join fan-out.
8. **Deduplicate sources before \`MERGE\`**: Prevent non-deterministic update crashes.
9. **Break complex transformations into named CTEs**: One conceptual step per CTE.
10. **Test with nulls, duplicates, and empty sets**: Every robust query survives empty inputs.`,
    },
  ],
};
