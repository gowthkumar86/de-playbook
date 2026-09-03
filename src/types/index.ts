export type Priority = 'must-master' | 'interview-ready' | 'awareness';

export interface TermItem {
  term: string;
  definition: string;
  category?: string;
  highlight?: boolean;
}

export interface TieredAnswer {
  basic: string;
  strong: string;
  senior: string;
  interviewerIntent?: string;
  followUps?: string[];
  seniorKeyTakeaways?: string[];
}

export interface InterviewQuestion {
  id: string;
  number: number;
  question: string;
  topic: string;
  subtopic?: string;
  answers: TieredAnswer;
}

export interface CodeSnippet {
  title: string;
  language: 'sql' | 'python' | 'bash' | 'properties' | 'java' | 'json';
  code: string;
  description?: string;
  notes?: string[];
}

export interface ArchitectureFigureItem {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  caption?: string;
  seniorTakeaway?: string;
  sourceNote?: string;
  badge?: string;
  tags?: string[];
}

export interface SectionPart {
  id: string;
  title: string;
  partNumber: string;
  subtitle: string;
  summary: string;
  readTimeMinutes: number;
  terminologies: TermItem[];
  markdownContent?: string;
  sections: {
    heading: string;
    subheading?: string;
    content: string;
    figures?: ArchitectureFigureItem[];
    codeSnippets?: CodeSnippet[];
    callouts?: {
      type: 'senior-line' | 'interview-line' | 'gotcha' | 'warning' | 'tip';
      title?: string;
      text: string;
    }[];
    decisionTrees?: string[];
    mermaidDiagrams?: string[];
  }[];
}

export interface SectionMeta {
  id: string;
  number: number;
  title: string;
  category: 'Foundation' | 'Core Storage & Engine' | 'Distributed Compute' | 'Cloud & Lakehouse' | 'Pipelines & Modeling' | 'Interview & Scenarios';
  status: 'active' | 'upcoming' | 'planned';
  priority: Priority;
  summary: string;
  subPartsCount: number;
  estimatedHours: number;
}

export interface SearchMatch {
  sectionId: string;
  sectionTitle: string;
  partId?: string;
  partTitle?: string;
  title: string;
  snippet: string;
  type: 'concept' | 'term' | 'question' | 'code';
  targetId?: string;
}

export type StudyMode = 'read' | 'flashcard' | 'quiz';

export interface UserProgress {
  completedParts: string[];
  savedBookmarks: {
    id: string;
    title: string;
    sectionId: string;
    partId?: string;
    createdAt: string;
  }[];
  quizScores: Record<string, 'nailed' | 'close' | 'missed'>;
  studyMode: StudyMode;
}

export type CurriculumSection = SectionMeta;
