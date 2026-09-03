import React from 'react';
import { CurriculumSection } from '../types';
import { Clock, Layers, ArrowLeft, Sparkles, BookOpen, CheckCircle } from 'lucide-react';

interface UpcomingSectionViewProps {
  section: CurriculumSection;
  onNavigateToSection01: () => void;
}

export const UpcomingSectionView: React.FC<UpcomingSectionViewProps> = ({
  section,
  onNavigateToSection01,
}) => {
  return (
    <article className="max-w-4xl mx-auto py-12 px-4 md:px-8">
      <header className="pb-8 border-b border-[#D9D1C1]">
        <div className="flex items-center space-x-2 text-xs font-mono-code font-bold uppercase text-[#BF360C] tracking-wider mb-2">
          <span>SECTION {section.number}</span>
          <span>•</span>
          <span>CURRICULUM SYLLABUS MAPPED</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif-heading font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
          {section.title}
        </h1>
        <p className="text-lg md:text-xl font-serif-heading text-[#5A5245] mt-3 leading-relaxed">
          {section.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-[#E9E4D9] text-xs text-[#5A5245]">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-[#8C7B65]" />
            <span>{section.estimatedHours} hours estimated study</span>
          </span>
          <span className="flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-[#8C7B65]" />
            <span className="capitalize">{section.priority} priority in interview loops</span>
          </span>
        </div>
      </header>

      {/* Syllabus Card */}
      <div className="my-8 p-6 rounded-2xl border border-[#D9D1C1] bg-[#FFFFFF] shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-serif-heading font-bold text-[#1A1A1A]">
            Curriculum Specification & Topics Tested
          </h2>
          <p className="text-xs text-[#5A5245] mt-1">
            Senior interview questions and tiered answers for this section follow the exact same 5-part architecture as Section 01 (Snowflake).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#F9F7F2] border border-[#E9E4D9]">
          <h3 className="font-mono-code text-xs uppercase font-bold text-[#BF360C] mb-2">
            Target Senior Mastery Competencies
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-[#2C2520]">
            <li className="flex items-start space-x-2">
              <span className="text-[#BF360C] font-bold">1.</span>
              <span>Physical Storage Layout & Engine Internals (file formats, memory hierarchy, execution plan nodes).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#BF360C] font-bold">2.</span>
              <span>Production Pipeline Architecture (idempotency, schema drift, transaction boundaries, backpressure).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#BF360C] font-bold">3.</span>
              <span>Performance Tuning & Cost FinOps (bottleneck identification, memory spill, scale heuristics).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#BF360C] font-bold">4.</span>
              <span>Enterprise Governance & Security (RBAC, PII masking, token rotation, multi-region failover).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#BF360C] font-bold">5.</span>
              <span>Tiered Senior Interview Bank & Flagship Production Stories (Basic, Strong, Senior responses).</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-[#E9E4D9] flex items-center justify-between">
          <span className="text-xs text-[#8C7B65]">
            Section 00 (How to Use) and Section 01 (Snowflake Parts 01–05) are currently active and interactive.
          </span>
          <button
            onClick={onNavigateToSection01}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#BF360C] hover:bg-[#8C2A2A] text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to Section 01 (Snowflake)</span>
          </button>
        </div>
      </div>
    </article>
  );
};
