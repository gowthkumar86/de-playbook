import React from 'react';
import {
  SECTION_03_PARTS,
  ALL_SECTION_03_QUESTIONS,
  FOUNDATIONS_INTERVIEW_QUESTIONS,
  IO_CONFIG_INTERVIEW_QUESTIONS,
  ETL_PATTERNS_INTERVIEW_QUESTIONS,
  TESTING_TYPING_INTERVIEW_QUESTIONS,
  RAPID_FIRE_QUESTIONS,
} from '../data/section03Index';
import { StudyMode, InterviewQuestion } from '../types';
import { TerminologyGrid } from './TerminologyGrid';
import { MarkdownContent } from './MarkdownContent';
import { TieredQACard } from './TieredQACard';
import { FlashcardMode } from './FlashcardMode';
import { QuizMode } from './QuizMode';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  ArrowRight,
  ArrowLeft,
  Award,
  Code,
} from 'lucide-react';

interface Section03ViewProps {
  activePartId: string;
  onSelectPart: (partId: string) => void;
  completedParts: string[];
  onToggleCompletePart: (partId: string) => void;
  studyMode: StudyMode;
  onSelectStudyMode?: (mode: StudyMode) => void;
  quizScores: Record<string, 'nailed' | 'close' | 'missed'>;
  onRecordQuizScore: (questionId: string, rating: 'nailed' | 'close' | 'missed') => void;
}

export const Section03View: React.FC<Section03ViewProps> = ({
  activePartId,
  onSelectPart,
  completedParts,
  onToggleCompletePart,
  studyMode,
  onSelectStudyMode,
  quizScores,
  onRecordQuizScore,
}) => {
  const currentPart =
    SECTION_03_PARTS.find((p) => p.id === activePartId) || SECTION_03_PARTS[0];
  const isPartCompleted = completedParts.includes(currentPart.id);

  const currentPartIndex = SECTION_03_PARTS.findIndex((p) => p.id === currentPart.id);
  const prevPart = currentPartIndex > 0 ? SECTION_03_PARTS[currentPartIndex - 1] : null;
  const nextPart =
    currentPartIndex < SECTION_03_PARTS.length - 1
      ? SECTION_03_PARTS[currentPartIndex + 1]
      : null;

  // Module filter state for Flashcard and Quiz study modes
  const [selectedModuleFilter, setSelectedModuleFilter] = React.useState<string>(activePartId || 'all');

  React.useEffect(() => {
    if (activePartId) {
      setSelectedModuleFilter(activePartId);
    }
  }, [activePartId]);

  // Questions for current part in editorial view
  const getPartQuestions = (partId: string): InterviewQuestion[] => {
    switch (partId) {
      case 'python-part-01':
        return FOUNDATIONS_INTERVIEW_QUESTIONS;
      case 'python-part-02':
        return IO_CONFIG_INTERVIEW_QUESTIONS;
      case 'python-part-03':
        return ETL_PATTERNS_INTERVIEW_QUESTIONS;
      case 'python-part-04':
        return TESTING_TYPING_INTERVIEW_QUESTIONS;
      case 'python-part-05':
        return RAPID_FIRE_QUESTIONS;
      default:
        return ALL_SECTION_03_QUESTIONS;
    }
  };

  const currentQuestions = getPartQuestions(currentPart.id);

  // Active questions for Flashcard / Quiz based on selected filter
  const activeDeckQuestions = React.useMemo(() => {
    switch (selectedModuleFilter) {
      case 'python-part-01':
        return FOUNDATIONS_INTERVIEW_QUESTIONS;
      case 'python-part-02':
        return IO_CONFIG_INTERVIEW_QUESTIONS;
      case 'python-part-03':
        return ETL_PATTERNS_INTERVIEW_QUESTIONS;
      case 'python-part-04':
        return TESTING_TYPING_INTERVIEW_QUESTIONS;
      case 'python-part-05':
        return RAPID_FIRE_QUESTIONS;
      default:
        return ALL_SECTION_03_QUESTIONS;
    }
  }, [selectedModuleFilter]);

  // Render Flashcard mode if selected
  if (studyMode === 'flashcard') {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-8">
        {/* Study Mode Switcher Bar */}
        <div className="mb-6 p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1B17] border border-[#D9D1C1] dark:border-[#38332B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-[#BF360C]/10 dark:bg-[#BF360C]/20 text-[#BF360C] dark:text-[#E05A36] font-mono-code text-xs font-bold uppercase">
              Flashcard Drill
            </span>
            <span className="text-xs text-[#5A5245] dark:text-[#A89F91]">
              {activeDeckQuestions.length} Questions in Deck
            </span>
          </div>
          {onSelectStudyMode && (
            <div className="flex items-center space-x-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onSelectStudyMode('read')}
                className="px-3 py-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#28241F] hover:bg-[#E9E4D9] dark:hover:bg-[#332E27] text-xs font-medium text-[#1A1A1A] dark:text-[#EDE8DF] flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#8C7B65]" />
                <span>Editorial View</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectStudyMode('quiz')}
                className="px-3 py-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#28241F] hover:bg-[#E9E4D9] dark:hover:bg-[#332E27] text-xs font-medium text-[#1F4B7A] dark:text-[#5B9BD5] flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Quiz Assessment</span>
              </button>
            </div>
          )}
        </div>

        {/* Module Scope Tabs */}
        <div className="mb-6 p-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1B17] border border-[#D9D1C1] dark:border-[#38332B] flex flex-wrap items-center gap-1.5 justify-center">
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'all'
                ? 'bg-[#1A1A1A] text-white dark:bg-[#EDE8DF] dark:text-[#1A1A1A] font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            All Questions (46)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-05')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-05'
                ? 'bg-[#BF360C] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 05: Rapid-Fire (25)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-01')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-01'
                ? 'bg-[#1F4B7A] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 01: Foundations (6)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-02')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-02'
                ? 'bg-[#1F4B7A] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 02: I/O & Config (5)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-03')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-03'
                ? 'bg-[#1F4B7A] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 03: ETL Patterns (5)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-04')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-04'
                ? 'bg-[#1F4B7A] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 04: Testing & Types (5)
          </button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-serif-heading font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
            {selectedModuleFilter === 'python-part-05'
              ? 'Part 05: Rapid-Fire Screening 25 Q&A Flashcard Deck'
              : selectedModuleFilter === 'all'
              ? 'Python for Data Engineering 46 Q&A Flashcard Deck'
              : `Python for DE — ${activeDeckQuestions[0]?.topic || 'Module'} Flashcard Deck`}
          </h1>
          <p className="text-xs text-[#5A5245] dark:text-[#A89F91] mt-1">
            Rehearse your answers aloud. Reveal the Senior standard to master memory management, GIL, typing, and production ETL patterns.
          </p>
        </div>
        <FlashcardMode questions={activeDeckQuestions} />
      </div>
    );
  }

  // Render Quiz mode if selected
  if (studyMode === 'quiz') {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-8">
        {/* Study Mode Switcher Bar */}
        <div className="mb-6 p-2 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1B17] border border-[#D9D1C1] dark:border-[#38332B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full bg-[#1F4B7A]/10 dark:bg-[#1F4B7A]/20 text-[#1F4B7A] dark:text-[#5B9BD5] font-mono-code text-xs font-bold uppercase">
              Self-Assessment Exam
            </span>
            <span className="text-xs text-[#5A5245] dark:text-[#A89F91]">
              {selectedModuleFilter === 'python-part-05'
                ? 'Part 05 Rapid-Fire Screening Assessment (25 Questions)'
                : selectedModuleFilter === 'all'
                ? 'Full Section 03 Assessment (All 46 Questions)'
                : `Module Assessment (${activeDeckQuestions.length} Questions)`}
            </span>
          </div>
          {onSelectStudyMode && (
            <div className="flex items-center space-x-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onSelectStudyMode('read')}
                className="px-3 py-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#28241F] hover:bg-[#E9E4D9] dark:hover:bg-[#332E27] text-xs font-medium text-[#1A1A1A] dark:text-[#EDE8DF] flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#8C7B65]" />
                <span>Editorial View</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectStudyMode('flashcard')}
                className="px-3 py-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#28241F] hover:bg-[#E9E4D9] dark:hover:bg-[#332E27] text-xs font-medium text-[#BF360C] dark:text-[#E05A36] flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Flashcards</span>
              </button>
            </div>
          )}
        </div>

        {/* Module Scope Tabs */}
        <div className="mb-6 p-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1B17] border border-[#D9D1C1] dark:border-[#38332B] flex flex-wrap items-center gap-1.5 justify-center">
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'all'
                ? 'bg-[#1A1A1A] text-white dark:bg-[#EDE8DF] dark:text-[#1A1A1A] font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            All Section 03 (46)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-05')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-05'
                ? 'bg-[#BF360C] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 05: Rapid-Fire (25)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-01')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-01'
                ? 'bg-[#1F4B7A] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 01: Foundations (6)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-02')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-02'
                ? 'bg-[#1F4B7A] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 02: I/O & Config (5)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-03')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-03'
                ? 'bg-[#1F4B7A] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 03: ETL Patterns (5)
          </button>
          <button
            type="button"
            onClick={() => setSelectedModuleFilter('python-part-04')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedModuleFilter === 'python-part-04'
                ? 'bg-[#1F4B7A] text-white font-bold shadow-2xs'
                : 'text-[#5A5245] dark:text-[#A89F91] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
            }`}
          >
            Part 04: Testing & Types (5)
          </button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-serif-heading font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
            {selectedModuleFilter === 'python-part-05'
              ? 'Part 05: Rapid-Fire Screening Assessment (25 Questions)'
              : selectedModuleFilter === 'all'
              ? 'Python for Data Engineering Senior Readiness Exam (46 Questions)'
              : `Python for DE — ${activeDeckQuestions[0]?.topic || 'Module'} Assessment (${activeDeckQuestions.length} Questions)`}
          </h1>
          <p className="text-xs text-[#5A5245] dark:text-[#A89F91] mt-1">
            Rate yourself honestly across the questions to uncover knowledge gaps before your senior technical interviews.
          </p>
        </div>
        <QuizMode
          questions={activeDeckQuestions}
          scores={quizScores}
          onRecordScore={onRecordQuizScore}
        />
      </div>
    );
  }

  return (
    <article className="max-w-4xl xl:max-w-7xl mx-auto py-6 sm:py-8 px-3 sm:px-4 md:px-8">
      {/* Editorial Mode Header Banner with Direct Mode Switchers */}
      <div className="mb-6 p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1B17] border border-[#D9D1C1] dark:border-[#38332B] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-[#BF360C] text-white">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono-code font-bold uppercase text-[#BF360C] dark:text-[#E05A36] tracking-wider block">
              Curriculum Study Modes
            </span>
            <span className="text-xs font-semibold text-[#1A1A1A] dark:text-[#EDE8DF]">
              Select learning format for Section 03
            </span>
          </div>
        </div>

        {onSelectStudyMode && (
          <div className="flex items-center p-0.5 rounded-lg bg-[#E9E4D9] dark:bg-[#2B2722] border border-[#D9D1C1] dark:border-[#3E382E] text-xs">
            <button
              type="button"
              onClick={() => onSelectStudyMode('read')}
              className="px-3 py-1.5 rounded-md bg-[#FFFFFF] dark:bg-[#151311] text-[#1A1A1A] dark:text-[#EDE8DF] font-bold shadow-2xs flex items-center space-x-1.5 cursor-pointer"
            >
              <BookOpen className="w-3 h-3 text-[#8C7B65]" />
              <span>Editorial</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectStudyMode('flashcard')}
              className="px-3 py-1.5 rounded-md text-[#5A5245] dark:text-[#A89F91] hover:text-[#BF360C] dark:hover:text-[#E05A36] font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3 h-3 text-[#BF360C]" />
              <span>Flashcards (46)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectStudyMode('quiz')}
              className="px-3 py-1.5 rounded-md text-[#5A5245] dark:text-[#A89F91] hover:text-[#1F4B7A] dark:hover:text-[#5B9BD5] font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3 text-[#1F4B7A]" />
              <span>Assessment</span>
            </button>
          </div>
        )}
      </div>

      {/* Parts Navigation Tabs */}
      <div className="mb-8 border-b border-[#D9D1C1] dark:border-[#38332B] overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max pb-1">
          {SECTION_03_PARTS.map((part) => {
            const isActive = part.id === currentPart.id;
            const isDone = completedParts.includes(part.id);

            return (
              <button
                key={part.id}
                onClick={() => onSelectPart(part.id)}
                className={`px-3.5 py-2 rounded-t-lg text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#FFFFFF] dark:bg-[#1E1B17] border-t-2 border-t-[#BF360C] border-x border-[#D9D1C1] dark:border-[#38332B] text-[#BF360C] dark:text-[#E05A36] font-bold shadow-2xs'
                    : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#EDE8DF] hover:bg-[#E9E4D9] dark:hover:bg-[#2B2722]'
                }`}
              >
                <span className="font-mono-code text-[10px] text-[#8C7B65]">
                  {part.partNumber.split(':')[0]}
                </span>
                <span>{part.title.split(':')[1]?.trim() || part.title}</span>
                {isDone && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Breadcrumb strip */}
      <div className="flex items-center space-x-2 text-xs font-mono-code text-[#8C7B65] mb-4">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hover:text-[#BF360C] transition-colors cursor-pointer"
        >
          Curriculum Hub
        </a>
        <span>/</span>
        <a
          href="/section/03"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/section/03');
            window.dispatchEvent(new PopStateEvent('popstate'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hover:text-[#BF360C] transition-colors cursor-pointer"
        >
          Section 03: Python for DE
        </a>
        <span>/</span>
        <span className="text-[#BF360C] font-semibold">{currentPart.partNumber}</span>
      </div>

      {/* Part Editorial Header */}
      <header className="pb-8 border-b border-[#D9D1C1] dark:border-[#38332B]">
        <div className="flex items-center space-x-2 text-xs font-mono-code font-bold uppercase text-[#BF360C] tracking-wider mb-2">
          <span>SECTION 03</span>
          <span>•</span>
          <span>{currentPart.partNumber}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-serif-heading font-extrabold text-[#1A1A1A] dark:text-[#EDE8DF] tracking-tight leading-tight">
          {currentPart.title}
        </h1>
        {currentPart.subtitle && (
          <p className="text-base md:text-lg font-serif-heading text-[#5A5245] dark:text-[#A89F91] mt-2 leading-relaxed">
            {currentPart.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[#E9E4D9] dark:border-[#38332B] text-xs text-[#5A5245] dark:text-[#A89F91]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#8C7B65]" />
              <span>{currentPart.readTimeMinutes} min deep read</span>
            </span>
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-[#8C7B65]" />
              <span>5–10 YOE Senior Technical Depth</span>
            </span>
            <span className="flex items-center space-x-1">
              <Code className="w-3.5 h-3.5 text-[#8C7B65]" />
              <span>Production Python Patterns</span>
            </span>
          </div>

          <button
            onClick={() => onToggleCompletePart(currentPart.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-semibold ${
              isPartCompleted
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                : 'bg-[#FFFFFF] dark:bg-[#1E1B17] border-[#D9D1C1] dark:border-[#38332B] text-[#1A1A1A] dark:text-[#EDE8DF] hover:bg-[#E9E4D9] dark:hover:bg-[#2B2722]'
            }`}
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                isPartCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#8C7B65]'
              }`}
            />
            <span>{isPartCompleted ? 'Completed' : 'Mark Part Complete'}</span>
          </button>
        </div>
      </header>

      {/* Part Summary Box */}
      <div className="my-8 p-5 rounded-xl bg-[#FFFDFB] dark:bg-[#1E1B17] border border-[#BF360C]/30 text-[#2C2520] dark:text-[#EDE8DF] text-sm md:text-base leading-relaxed shadow-2xs">
        <span className="font-bold text-[#BF360C] font-mono-code uppercase tracking-wider block mb-1 text-xs">
          Module Summary
        </span>
        {currentPart.summary}
      </div>

      {/* Terminology Primer */}
      {currentPart.terminologies && currentPart.terminologies.length > 0 && (
        <TerminologyGrid
          terms={currentPart.terminologies}
          title={`0. Terminology Primer — ${currentPart.partNumber}`}
        />
      )}

      {/* Main Sections Content */}
      <div className="space-y-12 my-10">
        {currentPart.sections.map((section, idx) => {
          const isInterviewSection =
            section.heading.toLowerCase().includes('interview question') ||
            section.heading.toLowerCase().includes('tiered') ||
            section.heading.toLowerCase().includes('rapid-fire');

          return (
            <section
              key={idx}
              id={`section-node-${idx}`}
              className="scroll-mt-24 p-5 sm:p-7 rounded-2xl bg-[#FFFFFF] dark:bg-[#1A1815] border border-[#D9D1C1] dark:border-[#38332B] shadow-2xs"
            >
              <div className="pb-4 border-b border-[#E9E4D9] dark:border-[#2D2821] mb-6">
                <span className="text-[11px] font-mono-code font-bold uppercase text-[#BF360C] tracking-wider block mb-1">
                  TOPIC {idx + 1} OF {currentPart.sections.length}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif-heading font-bold text-[#1A1A1A] dark:text-[#EDE8DF] tracking-tight">
                  {section.heading}
                </h2>
                {section.subheading && (
                  <p className="text-sm font-sans text-[#5A5245] dark:text-[#A89F91] mt-1.5 leading-relaxed">
                    {section.subheading}
                  </p>
                )}
              </div>

              {/* Render Markdown with code blocks, tables, and callouts */}
              <div className="text-sm leading-relaxed text-[#2C2520] dark:text-[#EDE8DF]">
                <MarkdownContent content={section.content} />
              </div>

              {/* Special interactive launcher banner for Part 05 Question Bank overview */}
              {currentPart.id === 'python-part-05' && idx === 0 && onSelectStudyMode && (
                <div className="mt-6 p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#1E1B17] border border-[#D9D1C1] dark:border-[#38332B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-[#EDE8DF] flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#BF360C]" />
                      <span>Ready to Test Your Python for DE Readiness?</span>
                    </h4>
                    <p className="text-xs text-[#5A5245] dark:text-[#A89F91] mt-0.5">
                      Launch self-assessment mode for the 25 rapid-fire questions in this module or the full 46 questions across all five parts.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModuleFilter('python-part-05');
                        onSelectStudyMode('quiz');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#BF360C] text-white text-xs font-semibold hover:bg-[#8C2A2A] transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Part 05 Quiz (25 Qs)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModuleFilter('all');
                        onSelectStudyMode('quiz');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1F4B7A] text-white text-xs font-semibold hover:bg-[#153457] transition-colors cursor-pointer"
                    >
                      <span>Full Exam (46 Qs)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If this is the interview questions section for this part, embed the TieredQACards */}
              {isInterviewSection && currentQuestions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#E9E4D9] dark:border-[#2D2821] space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-code font-bold uppercase text-[#BF360C]">
                      {currentQuestions.length} Interactive Interview Question Cards
                    </span>
                    <span className="text-[11px] text-[#8C7B65]">
                      Click tabs to examine Basic / Strong / Senior nuances
                    </span>
                  </div>
                  {currentQuestions.map((q) => (
                    <TieredQACard
                      key={q.id}
                      question={q}
                      score={quizScores[q.id]}
                      onScore={(rating) => onRecordQuizScore(q.id, rating)}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Navigation Footer (Prev Part / Next Part / Prev Section / Next Section) */}
      <footer className="mt-14 pt-8 border-t border-[#D9D1C1] dark:border-[#38332B]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Previous Button */}
          {prevPart ? (
            <button
              onClick={() => onSelectPart(prevPart.id)}
              className="p-4 rounded-xl border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1A1815] hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] transition-colors text-left flex items-start space-x-3 cursor-pointer group"
            >
              <ArrowLeft className="w-5 h-5 text-[#8C7B65] group-hover:text-[#BF360C] transition-colors shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono-code uppercase text-[#8C7B65] block">
                  Previous Part ({prevPart.partNumber.split(':')[0]})
                </span>
                <span className="text-sm font-semibold text-[#1A1A1A] dark:text-[#EDE8DF] group-hover:text-[#BF360C] transition-colors">
                  {prevPart.title}
                </span>
              </div>
            </button>
          ) : (
            <a
              href="/section/02"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', '/section/02');
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-4 rounded-xl border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1A1815] hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] transition-colors text-left flex items-start space-x-3 cursor-pointer group"
            >
              <ArrowLeft className="w-5 h-5 text-[#8C7B65] group-hover:text-[#BF360C] transition-colors shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono-code uppercase text-[#8C7B65] block">
                  Previous Module
                </span>
                <span className="text-sm font-semibold text-[#1A1A1A] dark:text-[#EDE8DF] group-hover:text-[#BF360C] transition-colors">
                  ← Section 02: Advanced SQL
                </span>
              </div>
            </a>
          )}

          {/* Next Button */}
          {nextPart ? (
            <button
              onClick={() => onSelectPart(nextPart.id)}
              className="p-4 rounded-xl border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1A1815] hover:bg-[#FAF7F2] dark:hover:bg-[#25201A] transition-colors text-right flex items-start justify-end space-x-3 cursor-pointer group sm:col-start-2"
            >
              <div>
                <span className="text-[10px] font-mono-code uppercase text-[#8C7B65] block">
                  Next Part ({nextPart.partNumber.split(':')[0]})
                </span>
                <span className="text-sm font-semibold text-[#1A1A1A] dark:text-[#EDE8DF] group-hover:text-[#BF360C] transition-colors">
                  {nextPart.title}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-[#8C7B65] group-hover:text-[#BF360C] transition-colors shrink-0 mt-0.5" />
            </button>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-[#D9D1C1] dark:border-[#38332B] bg-[#FAF7F2]/50 dark:bg-[#1E1B17]/50 text-right flex items-start justify-end space-x-3 sm:col-start-2">
              <div>
                <span className="text-[10px] font-mono-code uppercase text-[#8C7B65] block">
                  Next Section
                </span>
                <span className="text-sm font-semibold text-[#5A5245] dark:text-[#A89F91]">
                  Section 04: PySpark Fundamentals & Execution Model · Planned
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-[#8C7B65] shrink-0 mt-0.5 opacity-50" />
            </div>
          )}
        </div>
      </footer>
    </article>
  );
};
