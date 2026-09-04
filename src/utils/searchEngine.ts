import { SearchMatch } from '../types';
import { SECTION_00_DATA } from '../data/section00Data';
import { SECTION_01_PARTS, SNOWFLAKE_INTERVIEW_QUESTIONS } from '../data/section01Index';
import { SECTION_02_PARTS, ALL_SECTION_02_QUESTIONS } from '../data/section02Index';
import { SECTION_03_PARTS, ALL_SECTION_03_QUESTIONS } from '../data/section03Index';
import { CURRICULUM_SECTIONS } from '../data/curriculumRegistry';

export function searchStudyGuide(query: string): SearchMatch[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  const results: SearchMatch[] = [];

  // 1. Search Curriculum Topics
  CURRICULUM_SECTIONS.forEach((sec) => {
    if (sec.title.toLowerCase().includes(cleanQuery) || sec.summary.toLowerCase().includes(cleanQuery)) {
      results.push({
        sectionId: sec.id,
        sectionTitle: `Section ${sec.number}: ${sec.title}`,
        title: sec.title,
        snippet: sec.summary,
        type: 'concept',
      });
    }
  });

  // 2. Search Section 00
  SECTION_00_DATA.terminologies.forEach((term) => {
    if (term.term.toLowerCase().includes(cleanQuery) || term.definition.toLowerCase().includes(cleanQuery)) {
      results.push({
        sectionId: 'section-00',
        sectionTitle: 'Section 00: How to Use This Study Guide',
        title: `Term: ${term.term}`,
        snippet: term.definition,
        type: 'term',
      });
    }
  });

  SECTION_00_DATA.sections.forEach((sec) => {
    if (sec.heading.toLowerCase().includes(cleanQuery) || sec.content.toLowerCase().includes(cleanQuery)) {
      const idx = sec.content.toLowerCase().indexOf(cleanQuery);
      const start = Math.max(0, idx - 40);
      const snippet = sec.content.slice(start, start + 140).replace(/[*#`]/g, '');
      results.push({
        sectionId: 'section-00',
        sectionTitle: 'Section 00: How to Use This Study Guide',
        title: sec.heading,
        snippet: `...${snippet}...`,
        type: 'concept',
      });
    }
  });

  // 3. Search Section 01 (Parts 01 to 05)
  SECTION_01_PARTS.forEach((part) => {
    part.terminologies.forEach((term) => {
      if (term.term.toLowerCase().includes(cleanQuery) || term.definition.toLowerCase().includes(cleanQuery)) {
        results.push({
          sectionId: 'section-01',
          sectionTitle: 'Section 01: Snowflake',
          partId: part.id,
          partTitle: `${part.partNumber}: ${part.title}`,
          title: `Term: ${term.term}`,
          snippet: term.definition,
          type: 'term',
        });
      }
    });

    part.sections.forEach((sec) => {
      if (
        sec.heading.toLowerCase().includes(cleanQuery) ||
        (sec.subheading && sec.subheading.toLowerCase().includes(cleanQuery)) ||
        sec.content.toLowerCase().includes(cleanQuery)
      ) {
        const idx = sec.content.toLowerCase().indexOf(cleanQuery);
        const start = Math.max(0, idx - 40);
        const snippet = sec.content.slice(start, start + 140).replace(/[*#`]/g, '');
        results.push({
          sectionId: 'section-01',
          sectionTitle: 'Section 01: Snowflake',
          partId: part.id,
          partTitle: `${part.partNumber}: ${part.title}`,
          title: sec.heading,
          snippet: `...${snippet}...`,
          type: 'concept',
        });
      }
    });
  });

  // 4. Search Section 01 Tiered Interview Questions
  SNOWFLAKE_INTERVIEW_QUESTIONS.forEach((q) => {
    const questionText = q.question.toLowerCase();
    const seniorAnswer = q.answers.senior.toLowerCase();
    const strongAnswer = q.answers.strong.toLowerCase();

    if (questionText.includes(cleanQuery) || seniorAnswer.includes(cleanQuery) || strongAnswer.includes(cleanQuery)) {
      results.push({
        sectionId: 'section-01',
        sectionTitle: 'Section 01: Snowflake',
        partId: 'snowflake-part-05',
        partTitle: 'Part 05: Interview Bank',
        title: `Q${q.number}: ${q.question}`,
        snippet: `[Senior Tier]: ${q.answers.senior.slice(0, 150)}...`,
        type: 'question',
        targetId: q.id,
      });
    }
  });

  // 5. Search Section 02 (Parts 01 to 05)
  SECTION_02_PARTS.forEach((part) => {
    part.terminologies.forEach((term) => {
      if (term.term.toLowerCase().includes(cleanQuery) || term.definition.toLowerCase().includes(cleanQuery)) {
        results.push({
          sectionId: 'section-02',
          sectionTitle: 'Section 02: Advanced SQL',
          partId: part.id,
          partTitle: `${part.partNumber}: ${part.title}`,
          title: `Term: ${term.term}`,
          snippet: term.definition,
          type: 'term',
        });
      }
    });

    part.sections.forEach((sec) => {
      if (
        sec.heading.toLowerCase().includes(cleanQuery) ||
        (sec.subheading && sec.subheading.toLowerCase().includes(cleanQuery)) ||
        sec.content.toLowerCase().includes(cleanQuery)
      ) {
        const idx = sec.content.toLowerCase().indexOf(cleanQuery);
        const start = Math.max(0, idx - 40);
        const snippet = sec.content.slice(start, start + 140).replace(/[*#`]/g, '');
        results.push({
          sectionId: 'section-02',
          sectionTitle: 'Section 02: Advanced SQL',
          partId: part.id,
          partTitle: `${part.partNumber}: ${part.title}`,
          title: sec.heading,
          snippet: `...${snippet}...`,
          type: 'concept',
        });
      }
    });
  });

  // 6. Search Section 02 Tiered Interview Questions
  ALL_SECTION_02_QUESTIONS.forEach((q) => {
    const questionText = q.question.toLowerCase();
    const seniorAnswer = q.answers.senior.toLowerCase();
    const strongAnswer = q.answers.strong?.toLowerCase() || '';

    if (questionText.includes(cleanQuery) || seniorAnswer.includes(cleanQuery) || strongAnswer.includes(cleanQuery)) {
      results.push({
        sectionId: 'section-02',
        sectionTitle: 'Section 02: Advanced SQL',
        partId: 'sql-part-05',
        partTitle: 'Part 05: Interview & Cheatsheet',
        title: `Q${q.number}: ${q.question}`,
        snippet: `[Senior Tier]: ${q.answers.senior.slice(0, 150)}...`,
        type: 'question',
        targetId: q.id,
      });
    }
  });

  // 7. Search Section 03 (Parts 01 to 05)
  SECTION_03_PARTS.forEach((part) => {
    part.terminologies?.forEach((term) => {
      if (term.term.toLowerCase().includes(cleanQuery) || term.definition.toLowerCase().includes(cleanQuery)) {
        results.push({
          sectionId: 'section-03',
          sectionTitle: 'Section 03: Python for DE',
          partId: part.id,
          partTitle: `${part.partNumber}: ${part.title}`,
          title: `Term: ${term.term}`,
          snippet: term.definition,
          type: 'term',
        });
      }
    });

    part.sections.forEach((sec) => {
      if (
        sec.heading.toLowerCase().includes(cleanQuery) ||
        (sec.subheading && sec.subheading.toLowerCase().includes(cleanQuery)) ||
        sec.content.toLowerCase().includes(cleanQuery)
      ) {
        const idx = sec.content.toLowerCase().indexOf(cleanQuery);
        const start = Math.max(0, idx - 40);
        const snippet = sec.content.slice(start, start + 140).replace(/[*#`]/g, '');
        results.push({
          sectionId: 'section-03',
          sectionTitle: 'Section 03: Python for DE',
          partId: part.id,
          partTitle: `${part.partNumber}: ${part.title}`,
          title: sec.heading,
          snippet: `...${snippet}...`,
          type: 'concept',
        });
      }
    });
  });

  // 8. Search Section 03 Tiered & Rapid-Fire Questions
  ALL_SECTION_03_QUESTIONS.forEach((q) => {
    const questionText = q.question.toLowerCase();
    const seniorAnswer = q.answers.senior.toLowerCase();
    const strongAnswer = q.answers.strong?.toLowerCase() || '';

    if (questionText.includes(cleanQuery) || seniorAnswer.includes(cleanQuery) || strongAnswer.includes(cleanQuery)) {
      results.push({
        sectionId: 'section-03',
        sectionTitle: 'Section 03: Python for DE',
        partId: 'python-part-05',
        partTitle: 'Part 05: Interview Bank & Cheatsheet',
        title: `Q${q.number}: ${q.question}`,
        snippet: `[Standard / Senior]: ${q.answers.senior.slice(0, 150)}...`,
        type: 'question',
        targetId: q.id,
      });
    }
  });

  return results.slice(0, 35);
}
