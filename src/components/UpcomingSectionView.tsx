import React from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumRegistry';
import { CurriculumSection } from '../types';
import { formatSectionPath, Link } from '../utils/router';
import { Clock, Layers, ArrowLeft, ArrowRight, BookOpen, Compass, CheckCircle } from 'lucide-react';

interface UpcomingSectionViewProps {
  section: CurriculumSection;
  onNavigateSection?: (section: CurriculumSection) => void;
}

export const UpcomingSectionView: React.FC<UpcomingSectionViewProps> = ({
  section,
}) => {
  const currentIndex = CURRICULUM_SECTIONS.findIndex((s) => s.id === section.id);
  const prevSection = currentIndex > 0 ? CURRICULUM_SECTIONS[currentIndex - 1] : null;
  const nextSection = currentIndex < CURRICULUM_SECTIONS.length - 1 ? CURRICULUM_SECTIONS[currentIndex + 1] : null;

  return (
    <article className="max-w-4xl mx-auto py-12 px-4 md:px-8">
      {/* Breadcrumb strip */}
      <div className="flex items-center space-x-2 text-xs font-mono-code text-[#8C7B65] mb-4">
        <Link to="/" className="hover:text-[#BF360C] transition-colors">
          Curriculum Hub
        </Link>
        <span>/</span>
        <span className="text-[#BF360C] font-semibold">Section {section.number.toString().padStart(2, '0')}</span>
      </div>

      <header className="pb-8 border-b border-[#D9D1C1]">
        <div className="flex items-center space-x-2 text-xs font-mono-code font-bold uppercase text-[#BF360C] tracking-wider mb-2">
          <span>SECTION {section.number.toString().padStart(2, '0')}</span>
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
          <span className="px-2 py-0.5 rounded bg-amber-100/70 text-amber-800 font-mono-code text-[11px] font-semibold uppercase">
            Curriculum Specification Ready
          </span>
        </div>
      </header>

      {/* Syllabus Card */}
      <div className="my-8 p-6 rounded-2xl border border-[#D9D1C1] bg-[#FFFFFF] shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-serif-heading font-bold text-[#1A1A1A]">
            Curriculum Specification &amp; Topics Tested
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
              <span>Physical Storage Layout &amp; Engine Internals (file formats, memory hierarchy, execution plan nodes).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#BF360C] font-bold">2.</span>
              <span>Production Pipeline Architecture (idempotency, schema drift, transaction boundaries, backpressure).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#BF360C] font-bold">3.</span>
              <span>Performance Tuning &amp; Cost FinOps (bottleneck identification, memory spill, scale heuristics).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#BF360C] font-bold">4.</span>
              <span>Enterprise Governance &amp; Security (RBAC, PII masking, token rotation, multi-region failover).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#BF360C] font-bold">5.</span>
              <span>Tiered Senior Interview Bank &amp; Flagship Production Stories (Basic, Strong, Senior responses).</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-[#E9E4D9] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#8C7B65]">
            Section 00 (Interview Mindset) and Section 01 (Snowflake Parts 01–05) are currently active and interactive.
          </span>
          <Link
            to="/section/01"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#BF360C] hover:bg-[#8C2A2A] text-white font-semibold text-xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Go to Section 01 (Snowflake)</span>
          </Link>
        </div>
      </div>

      {/* Section Bottom Navigation: Prev / Hub / Next */}
      <div className="mt-12 pt-6 border-t border-[#D9D1C1] flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevSection ? (
          <Link
            to={formatSectionPath(prevSection.number)}
            className="w-full sm:w-auto flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-[#D9D1C1] bg-[#FFFFFF] hover:bg-[#E9E4D9] text-xs font-semibold text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#8C7B65]" />
            <span>Prev: Section {prevSection.number.toString().padStart(2, '0')}</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          to="/"
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-[#D9D1C1] bg-[#FFFFFF] hover:bg-[#F4EFE6] text-xs font-semibold text-[#5A5245] transition-colors"
        >
          <Compass className="w-4 h-4 text-[#BF360C]" />
          <span>Curriculum Hub</span>
        </Link>

        {nextSection ? (
          <Link
            to={formatSectionPath(nextSection.number)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold transition-colors"
          >
            <span>Next: Section {nextSection.number.toString().padStart(2, '0')}</span>
            <ArrowRight className="w-4 h-4 text-[#8C7B65]" />
          </Link>
        ) : (
          <div className="text-xs text-[#8C7B65] font-mono-code font-semibold">
            Final Section
          </div>
        )}
      </div>
    </article>
  );
};
