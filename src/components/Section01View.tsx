import React from 'react';
import { SECTION_01_PARTS, SNOWFLAKE_INTERVIEW_QUESTIONS, ONE_PAGE_CHEATSHEET, FLAGSHIP_STORY_SLOTS } from '../data/section01Index';
import { SectionPart, StudyMode } from '../types';
import { TerminologyGrid } from './TerminologyGrid';
import { CalloutBox } from './CalloutBox';
import { CodeBlock } from './CodeBlock';
import { MermaidDiagram } from './MermaidDiagram';
import { SnowflakeArchitectureDiagram } from './SnowflakeArchitectureDiagram';
import { ArchitectureFigure } from './ArchitectureFigure';
import { DecisionTreeViewer } from './DecisionTreeViewer';
import { MarkdownContent } from './MarkdownContent';
import { TieredQACard } from './TieredQACard';
import { FlashcardMode } from './FlashcardMode';
import { QuizMode } from './QuizMode';
import { CheckCircle2, Clock, BookOpen, Layers, ArrowRight, ArrowLeft, Award, Sparkles, FileText, ShieldAlert } from 'lucide-react';

interface Section01ViewProps {
  activePartId: string;
  onSelectPart: (partId: string) => void;
  completedParts: string[];
  onToggleCompletePart: (partId: string) => void;
  studyMode: StudyMode;
  quizScores: Record<string, 'nailed' | 'close' | 'missed'>;
  onRecordQuizScore: (questionId: string, rating: 'nailed' | 'close' | 'missed') => void;
}

export const Section01View: React.FC<Section01ViewProps> = ({
  activePartId,
  onSelectPart,
  completedParts,
  onToggleCompletePart,
  studyMode,
  quizScores,
  onRecordQuizScore,
}) => {
  const currentPart = SECTION_01_PARTS.find((p) => p.id === activePartId) || SECTION_01_PARTS[0];
  const isPartCompleted = completedParts.includes(currentPart.id);

  const currentPartIndex = SECTION_01_PARTS.findIndex((p) => p.id === currentPart.id);
  const prevPart = currentPartIndex > 0 ? SECTION_01_PARTS[currentPartIndex - 1] : null;
  const nextPart = currentPartIndex < SECTION_01_PARTS.length - 1 ? SECTION_01_PARTS[currentPartIndex + 1] : null;

  // Render Flashcard mode if selected
  if (studyMode === 'flashcard') {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-8">
        <div className="mb-6 text-center">
          <span className="px-3 py-1 rounded-full bg-[#BF360C]/10 text-[#BF360C] font-mono-code text-xs font-bold uppercase">
            Active Study Mode: Flashcard Drill
          </span>
          <h1 className="text-2xl md:text-3xl font-serif-heading font-bold text-[#1A1A1A] mt-2">
            Snowflake 20 Tiered Q&A Flashcard Deck
          </h1>
          <p className="text-xs text-[#5A5245] mt-1">
            Rehearse your answers aloud. Reveal the Senior standard to refine nuance.
          </p>
        </div>
        <FlashcardMode questions={SNOWFLAKE_INTERVIEW_QUESTIONS} />
      </div>
    );
  }

  // Render Quiz mode if selected
  if (studyMode === 'quiz') {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-8">
        <div className="mb-6 text-center">
          <span className="px-3 py-1 rounded-full bg-[#1F4B7A]/10 text-[#1F4B7A] font-mono-code text-xs font-bold uppercase">
            Active Study Mode: Self-Assessment
          </span>
          <h1 className="text-2xl md:text-3xl font-serif-heading font-bold text-[#1A1A1A] mt-2">
            Snowflake Senior Readiness Exam
          </h1>
          <p className="text-xs text-[#5A5245] mt-1">
            Rate yourself honestly on all 20 questions to uncover blind spots before your interview.
          </p>
        </div>
        <QuizMode
          questions={SNOWFLAKE_INTERVIEW_QUESTIONS}
          scores={quizScores}
          onRecordScore={onRecordQuizScore}
        />
      </div>
    );
  }

  return (
    <article className="max-w-4xl xl:max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* Parts Navigation Tabs */}
      <div className="mb-8 border-b border-[#D9D1C1] overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max pb-1">
          {SECTION_01_PARTS.map((part) => {
            const isActive = part.id === currentPart.id;
            const isDone = completedParts.includes(part.id);

            return (
              <button
                key={part.id}
                onClick={() => onSelectPart(part.id)}
                className={`px-3.5 py-2 rounded-t-lg text-xs font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#FFFFFF] border-t-2 border-t-[#BF360C] border-x border-[#D9D1C1] text-[#BF360C] font-bold shadow-2xs'
                    : 'text-[#5A5245] hover:text-[#1A1A1A] hover:bg-[#E9E4D9]'
                }`}
              >
                <span className="font-mono-code text-[10px] text-[#8C7B65]">
                  {part.partNumber}
                </span>
                <span>{part.title.split(':')[1]?.trim() || part.title}</span>
                {isDone && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Breadcrumb strip */}
      <div className="flex items-center space-x-2 text-xs font-mono-code text-[#8C7B65] mb-4">
        <a href="/" onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#BF360C] transition-colors cursor-pointer">
          Curriculum Hub
        </a>
        <span>/</span>
        <a href="/section/01" onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', '/section/01'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-[#BF360C] transition-colors cursor-pointer">
          Section 01
        </a>
        <span>/</span>
        <span className="text-[#BF360C] font-semibold">{currentPart.partNumber}</span>
      </div>

      {/* Part Editorial Header */}
      <header className="pb-8 border-b border-[#D9D1C1]">
        <div className="flex items-center space-x-2 text-xs font-mono-code font-bold uppercase text-[#BF360C] tracking-wider mb-2">
          <span>SECTION 01</span>
          <span>•</span>
          <span>{currentPart.partNumber}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-serif-heading font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
          {currentPart.title}
        </h1>
        {currentPart.subtitle && (
          <p className="text-base md:text-lg font-serif-heading text-[#5A5245] mt-2 leading-relaxed">
            {currentPart.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[#E9E4D9] text-xs text-[#5A5245]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#8C7B65]" />
              <span>{currentPart.readTimeMinutes} min deep read</span>
            </span>
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-[#8C7B65]" />
              <span>5–10 YOE Technical Depth</span>
            </span>
          </div>

          <button
            onClick={() => onToggleCompletePart(currentPart.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-semibold ${
              isPartCompleted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-[#FFFFFF] border-[#D9D1C1] text-[#1A1A1A] hover:bg-[#E9E4D9]'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isPartCompleted ? 'text-emerald-600' : 'text-[#8C7B65]'}`} />
            <span>{isPartCompleted ? 'Completed' : 'Mark Part Complete'}</span>
          </button>
        </div>
      </header>

      {/* Part Summary Box */}
      <div className="my-8 p-5 rounded-xl bg-[#FFFDFB] border border-[#BF360C]/30 text-[#2C2520] text-sm md:text-base leading-relaxed">
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

      {/* Part 05 Special Modules: Question Bank, Flagship Story, Cheatsheet */}
      {currentPart.id === 'snowflake-part-05' && (
        <div className="space-y-12 my-10">
          {/* Question Bank */}
          <section id="interview-question-bank">
            <div className="pb-4 border-b border-[#D9D1C1] mb-6">
              <span className="text-xs font-mono-code font-bold uppercase text-[#BF360C]">
                MODULE 01
              </span>
              <h2 className="text-2xl md:text-3xl font-serif-heading font-bold text-[#1A1A1A] mt-1">
                20 Tiered Senior Interview Questions
              </h2>
              <p className="text-xs text-[#5A5245] mt-1">
                Each question features Basic (Junior), Strong (Mid), and Senior (5-10 YOE) responses with interviewer intent and follow-up defenses.
              </p>
            </div>

            <div className="space-y-6">
              {SNOWFLAKE_INTERVIEW_QUESTIONS.map((q) => (
                <TieredQACard
                  key={q.id}
                  question={q}
                  score={quizScores[q.id]}
                  onScore={(rating) => onRecordQuizScore(q.id, rating)}
                />
              ))}
            </div>
          </section>

          {/* Flagship Production Story */}
          <section id="flagship-pipeline-story" className="p-6 md:p-8 rounded-2xl border border-[#D9D1C1] bg-[#FFFFFF] shadow-sm">
            <div className="pb-4 border-b border-[#E9E4D9] mb-6">
              <span className="text-xs font-mono-code font-bold uppercase text-[#BF360C]">
                MODULE 02
              </span>
              <h2 className="text-2xl font-serif-heading font-bold text-[#1A1A1A] mt-1">
                The Flagship Pipeline Story (8-Slot Battle-Tested Formula)
              </h2>
              <p className="text-xs text-[#5A5245] mt-1">
                Your structured narrative for *"Walk me through a pipeline you built"*. Never omit concrete figures or the alternative options you rejected.
              </p>
            </div>

            <div className="space-y-4 text-xs md:text-sm">
              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <span className="font-bold font-mono-code text-[#BF360C] uppercase block mb-1">
                  1. Business Context & Freshness SLA
                </span>
                <p className="text-[#2C2520]">{FLAGSHIP_STORY_SLOTS.context}</p>
              </div>

              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <span className="font-bold font-mono-code text-[#BF360C] uppercase block mb-1">
                  2. Architectural Problem & Bottleneck
                </span>
                <p className="text-[#2C2520]">{FLAGSHIP_STORY_SLOTS.problem}</p>
              </div>

              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <span className="font-bold font-mono-code text-[#BF360C] uppercase block mb-1">
                  3. End-to-End Architecture
                </span>
                <p className="text-[#2C2520]">{FLAGSHIP_STORY_SLOTS.architecture}</p>
              </div>

              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <span className="font-bold font-mono-code text-[#BF360C] uppercase block mb-1">
                  4. Your Personal Engineering Ownership
                </span>
                <p className="text-[#2C2520]">{FLAGSHIP_STORY_SLOTS.yourRole}</p>
              </div>

              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <span className="font-bold font-mono-code text-[#BF360C] uppercase block mb-1">
                  5. Non-Obvious Engineering Decisions Defended
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#2C2520] mt-1">
                  {FLAGSHIP_STORY_SLOTS.keyDecisions.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <span className="font-bold font-mono-code text-[#BF360C] uppercase block mb-1">
                  6. Concrete Scale & Sizing Numbers
                </span>
                <p className="text-[#2C2520] font-mono-code">{FLAGSHIP_STORY_SLOTS.scale}</p>
              </div>

              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <span className="font-bold font-mono-code text-[#BF360C] uppercase block mb-1">
                  7. Idempotency & Failure Recovery
                </span>
                <p className="text-[#2C2520]">{FLAGSHIP_STORY_SLOTS.failureHandling}</p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-bold font-mono-code text-emerald-800 uppercase block mb-1">
                  8. Measurable Business Outcome
                </span>
                <p className="text-emerald-950 font-semibold">{FLAGSHIP_STORY_SLOTS.outcome}</p>
              </div>
            </div>
          </section>

          {/* One-Page Cheatsheet */}
          <section id="one-page-cheatsheet" className="p-6 md:p-8 rounded-2xl border border-[#D9D1C1] bg-[#FFFFFF] shadow-sm">
            <div className="pb-4 border-b border-[#E9E4D9] mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono-code font-bold uppercase text-[#BF360C]">
                  MODULE 03
                </span>
                <h2 className="text-2xl font-serif-heading font-bold text-[#1A1A1A] mt-1">
                  One-Page Snowflake Revision Cheatsheet
                </h2>
                <p className="text-xs text-[#5A5245] mt-1">
                  Condensed high-yield facts for morning-of-interview review.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <h3 className="font-bold font-mono-code text-[#BF360C] uppercase mb-2">
                  Architecture & Storage
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-[#333333]">
                  {ONE_PAGE_CHEATSHEET.architecture.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <h3 className="font-bold font-mono-code text-[#1F4B7A] uppercase mb-2">
                  Data Engineering & Pipelines
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-[#333333]">
                  {ONE_PAGE_CHEATSHEET.dataEngineering.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <h3 className="font-bold font-mono-code text-[#A65D00] uppercase mb-2">
                  Performance & Cost FinOps
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-[#333333]">
                  {ONE_PAGE_CHEATSHEET.performanceAndCost.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-[#F9F7F2] border border-[#E9E4D9]">
                <h3 className="font-bold font-mono-code text-[#2A6E3F] uppercase mb-2">
                  Security, Governance & Modern Platform
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-[#333333]">
                  {ONE_PAGE_CHEATSHEET.securityAndGovernance.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Standard Sections Content */}
      <div className="space-y-12 my-10">
        {currentPart.sections.map((section, idx) => (
          <section key={idx} className="scroll-mt-20">
            <h2 className="text-xl md:text-2xl font-serif-heading font-bold text-[#1A1A1A] mb-1">
              {section.heading}
            </h2>
            {section.subheading && (
              <h3 className="text-xs font-mono-code text-[#BF360C] uppercase tracking-wider font-semibold mb-4">
                {section.subheading}
              </h3>
            )}

            <MarkdownContent content={section.content} />

            {/* Official Architecture Figures */}
            {section.figures &&
              section.figures.map((fig, fIdx) => (
                <ArchitectureFigure
                  key={fIdx}
                  src={fig.src}
                  alt={fig.alt}
                  title={fig.title}
                  subtitle={fig.subtitle}
                  caption={fig.caption}
                  seniorTakeaway={fig.seniorTakeaway}
                  sourceNote={fig.sourceNote}
                  badge={fig.badge}
                  tags={fig.tags}
                />
              ))}

            {/* Architectural Diagrams */}
            {section.mermaidDiagrams &&
              section.mermaidDiagrams.map((chart, mIdx) => {
                const isSnowflake3LayerArch =
                  (chart.includes('CLOUD SERVICES') &&
                    chart.includes('COMPUTE') &&
                    chart.includes('STORAGE')) ||
                  section.heading.includes('Why the Architecture is the Way It Is');

                if (isSnowflake3LayerArch) {
                  return <SnowflakeArchitectureDiagram key={mIdx} />;
                }

                return (
                  <MermaidDiagram key={mIdx} chart={chart} title={section.heading} />
                );
              })}

            {/* Code Snippets */}
            {section.codeSnippets &&
              section.codeSnippets.map((snippet, sIdx) => (
                <CodeBlock
                  key={sIdx}
                  code={snippet.code}
                  language={snippet.language}
                  title={snippet.title}
                  notes={snippet.notes}
                />
              ))}

            {/* Decision Trees */}
            {section.decisionTrees &&
              section.decisionTrees.map((tree, tIdx) => (
                <DecisionTreeViewer key={tIdx} treeText={tree} />
              ))}

            {/* Callouts */}
            {section.callouts &&
              section.callouts.map((callout, cIdx) => (
                <CalloutBox
                  key={cIdx}
                  type={callout.type}
                  title={callout.title}
                  text={callout.text}
                />
              ))}
          </section>
        ))}
      </div>

      {/* Part Navigation Footer */}
      <div className="mt-14 pt-8 border-t border-[#D9D1C1] flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevPart ? (
          <button
            onClick={() => onSelectPart(prevPart.id)}
            className="w-full sm:w-auto flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-[#D9D1C1] bg-[#FFFFFF] hover:bg-[#E9E4D9] text-xs font-semibold text-[#1A1A1A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#8C7B65]" />
            <span>Previous: {prevPart.partNumber}</span>
          </button>
        ) : (
          <div />
        )}

        {nextPart ? (
          <button
            onClick={() => onSelectPart(nextPart.id)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-[#BF360C] hover:bg-[#8C2A2A] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Next: {nextPart.partNumber}</span>
            <ArrowRight className="w-4 h-4" />
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
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-[#BF360C] hover:bg-[#8C2A2A] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Next: Section 02 (SQL Patterns)</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
};
