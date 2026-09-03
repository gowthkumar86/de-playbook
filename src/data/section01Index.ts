import { SectionPart } from '../types';
import { PART_01_ARCHITECTURE_DATA } from './section01/part01Architecture';
import { PART_02_DATA_ENGINEERING_DATA } from './section01/part02DataEngineering';
import { PART_03_PERFORMANCE_DATA } from './section01/part03Performance';
import { PART_04_SECURITY_GOV_DATA } from './section01/part04SecurityGov';
import { SNOWFLAKE_INTERVIEW_QUESTIONS, ONE_PAGE_CHEATSHEET, FLAGSHIP_STORY_SLOTS } from './section01/part05InterviewBank';

export const SECTION_01_PARTS: SectionPart[] = [
  PART_01_ARCHITECTURE_DATA,
  PART_02_DATA_ENGINEERING_DATA,
  PART_03_PERFORMANCE_DATA,
  PART_04_SECURITY_GOV_DATA,
  {
    id: 'snowflake-part-05',
    title: 'Snowflake Part 05: Interview Bank & Revision Cheat Sheet',
    partNumber: 'PART 05',
    subtitle: '20 Tiered Senior Q&As, Flagship Production Story, One-Page Cheat Sheet & Red Flag Elimination',
    summary: 'The ultimate high-yield preparation module for the 5–10 YOE senior technical interview. Contains 20 full interview questions with Basic, Strong, and Senior tiered responses, the proven 8-slot flagship pipeline story formula, the comprehensive 1-page revision cheat sheet, and 12 red-flag anti-patterns to eliminate from your vocabulary.',
    readTimeMinutes: 30,
    terminologies: [
      {
        term: 'Tier 3 (Senior) Response',
        definition: 'An interview answer that pairs mechanical concepts with physical storage layouts, execution failure boundaries, and empirical scaling alternatives.',
        category: 'Interview Technique',
        highlight: true
      },
      {
        term: 'Flagship Pipeline Narrative',
        definition: 'A 60s/3m production narrative featuring concrete scale metrics (rows/day, GB, warehouse size) and non-obvious engineering decisions.',
        category: 'Interview Technique',
        highlight: true
      },
      {
        term: 'Red Flag Anti-Patterns',
        definition: 'Phrases like "I always cache everything" or "Just size up the warehouse" that immediately signal lack of distributed systems and FinOps maturity.',
        category: 'Interview Technique'
      }
    ],
    sections: [
      {
        heading: '1. Consolidated Question Bank: 20 Tiered Senior Q&As',
        subheading: 'Interactive Practice Engine with Basic, Strong, and Senior Response Tiers',
        content: `Study every topic at the **Senior Tier**. Basic responses recite textbook definitions (Junior). Strong responses explain operations and trade-offs (Mid-level). Senior responses articulate physical storage layouts, non-obvious failure modes, and defensible architectural alternatives.`
      },
      {
        heading: '2. The Flagship Pipeline Story Formula',
        subheading: 'Structuring Your 60-Second and 3-Minute Battle-Tested Project Narrative',
        content: `Use the proven 8-slot formula to answer *"Walk me through a pipeline you built"*. Never omit concrete figures or the alternative options you rejected.`
      },
      {
        heading: '3. One-Page Snowflake High-Yield Cheat Sheet',
        subheading: 'Condensed High-Density Key Facts for Morning-of-Interview Revision',
        content: `Review these condensed architectural facts immediately before stepping into the interview loop.`
      },
      {
        heading: '4. Red Flag Phrases: Words That Disqualify Senior Candidates',
        subheading: 'Eliminate These Anti-Patterns From Your Vocabulary',
        content: `Never say these phrases in a senior technical round without qualification:
- ❌ *"I just use .collect() to check data"* → Driver OOM hazard.
- ❌ *"I always cache every table"* → Memory exhaustion and garbage collection thrashing.
- ❌ *"Partitioning always makes queries faster"* → Partition cardinality explosion.
- ❌ *"Just double the warehouse size"* → Masks root-cause SQL and join defects.
- ❌ *"Dynamic Tables replaced Streams and Tasks"* → False. They coexist.
- ❌ *"Fail-safe is a backup I can query with SQL"* → False. Support-only recovery.
- ❌ *"Zero-copy clones are free forever"* → False. Divergence writes new partitions.`
      }
    ]
  }
];

export { SNOWFLAKE_INTERVIEW_QUESTIONS, ONE_PAGE_CHEATSHEET, FLAGSHIP_STORY_SLOTS };
