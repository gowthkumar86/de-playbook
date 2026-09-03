import React from 'react';
import { SECTION_00_DATA } from '../data/section00Data';
import { TerminologyGrid } from './TerminologyGrid';
import { CalloutBox } from './CalloutBox';
import { MarkdownContent } from './MarkdownContent';
import { DecisionTreeViewer } from './DecisionTreeViewer';
import { CheckCircle2, Clock, BookOpen, Layers, Award, ArrowRight } from 'lucide-react';

interface Section00ViewProps {
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNavigateNext: () => void;
}

export const Section00View: React.FC<Section00ViewProps> = ({
  isCompleted,
  onToggleComplete,
  onNavigateNext,
}) => {
  return (
    <article className="max-w-4xl mx-auto py-8 px-4 md:px-8">
      {/* Editorial Header */}
      <header className="pb-8 border-b border-[#D9D1C1]">
        <div className="flex items-center space-x-2 text-xs font-mono-code font-bold uppercase text-[#BF360C] tracking-wider mb-2">
          <span>SECTION 00</span>
          <span>•</span>
          <span>ORIENTATION & TAXONOMY</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif-heading font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
          {SECTION_00_DATA.title}
        </h1>
        <p className="text-lg md:text-xl font-serif-heading text-[#5A5245] mt-3 leading-relaxed">
          {SECTION_00_DATA.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[#E9E4D9] text-xs text-[#5A5245]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#8C7B65]" />
              <span>{SECTION_00_DATA.readTimeMinutes} min read</span>
            </span>
            <span className="flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-[#8C7B65]" />
              <span>Foundational Operating System</span>
            </span>
          </div>

          <button
            onClick={onToggleComplete}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer text-xs font-semibold ${
              isCompleted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-[#FFFFFF] border-[#D9D1C1] text-[#1A1A1A] hover:bg-[#E9E4D9]'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-[#8C7B65]'}`} />
            <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
          </button>
        </div>
      </header>

      {/* Summary Box */}
      <div className="my-8 p-5 rounded-xl bg-[#FFFDFB] border border-[#BF360C]/30 text-[#2C2520] text-sm md:text-base leading-relaxed">
        <span className="font-bold text-[#BF360C] font-mono-code uppercase tracking-wider block mb-1 text-xs">
          Executive Overview
        </span>
        {SECTION_00_DATA.summary}
      </div>

      {/* Terminology Primer */}
      <TerminologyGrid
        terms={SECTION_00_DATA.terminologies}
        title="0. Terminology Primer — The 3-Tier Interview Taxonomy"
      />

      {/* Core Sections Content */}
      <div className="space-y-12 my-10">
        {SECTION_00_DATA.sections.map((section, idx) => (
          <section key={idx} className="scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-serif-heading font-bold text-[#1A1A1A] mb-1">
              {section.heading}
            </h2>
            {section.subheading && (
              <h3 className="text-sm font-mono-code text-[#BF360C] uppercase tracking-wider font-semibold mb-4">
                {section.subheading}
              </h3>
            )}

            <MarkdownContent content={section.content} />

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

      {/* Footer Navigation */}
      <div className="mt-14 pt-8 border-t border-[#D9D1C1] flex items-center justify-between">
        <div>
          <span className="text-xs text-[#8C7B65] uppercase font-mono-code font-semibold block">
            Next Module
          </span>
          <span className="text-sm font-serif-heading font-bold text-[#1A1A1A]">
            Section 01: Snowflake Deep-Dive (Parts 01–05)
          </span>
        </div>
        <button
          onClick={onNavigateNext}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#BF360C] hover:bg-[#8C2A2A] text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <span>Begin Snowflake Section</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
