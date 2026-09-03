import React, { useState } from 'react';
import { SECTIONS, SectionMeta } from '../data/curriculum';
import { X, CheckCircle2, Clock, Layers, Filter, ArrowRight } from 'lucide-react';

interface CurriculumRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSectionNumber: number;
  onSelectSection: (sectionNumber: number) => void;
}

export const CurriculumRoadmapModal: React.FC<CurriculumRoadmapModalProps> = ({
  isOpen,
  onClose,
  activeSectionNumber,
  onSelectSection,
}) => {
  const [tierFilter, setTierFilter] = useState<'all' | 1 | 2 | 3>('all');

  if (!isOpen) return null;

  const filteredSections = SECTIONS.filter((sec) => {
    if (tierFilter === 'all') return true;
    return sec.tier === tierFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#F9F7F2] border border-[#D9D1C1] rounded-sm w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-[#1A1A1A]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#D9D1C1] bg-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#BF360C] shrink-0" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                31-Section Master Curriculum Roadmap
              </h2>
            </div>
            <p className="text-xs font-serif italic text-[#5A5245] mt-1">
              Infosys Senior Data Engineer (5–10 Yr Bar) • Section 00 through Section 30.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5A5245] hover:text-[#1A1A1A] rounded-sm hover:bg-[#E9E4D9] transition-all border border-transparent hover:border-[#D9D1C1] min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Close Roadmap"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier Filters */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-[#E9E4D9]/60 border-b border-[#D9D1C1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-[#5A5245]">
            <Filter className="w-3.5 h-3.5 text-[#BF360C]" />
            <span className="font-mono font-bold uppercase text-[10px] tracking-widest text-[#8C7B65]">Filter Priority:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setTierFilter('all')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-sm text-xs font-medium transition-all min-h-[36px] sm:min-h-0 flex items-center cursor-pointer ${
                tierFilter === 'all' ? 'bg-[#1A1A1A] text-white shadow-xs font-bold' : 'bg-white border border-[#D9D1C1] text-[#5A5245] hover:text-[#1A1A1A]'
              }`}
            >
              All (31)
            </button>
            <button
              onClick={() => setTierFilter(1)}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-sm text-xs font-medium transition-all min-h-[36px] sm:min-h-0 flex items-center cursor-pointer ${
                tierFilter === 1 ? 'bg-[#BF360C] text-white shadow-xs font-bold' : 'bg-white border border-[#D9D1C1] text-[#5A5245] hover:text-[#1A1A1A]'
              }`}
            >
              Tier 1: Core (70%)
            </button>
            <button
              onClick={() => setTierFilter(2)}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-sm text-xs font-medium transition-all min-h-[36px] sm:min-h-0 flex items-center cursor-pointer ${
                tierFilter === 2 ? 'bg-[#5A5245] text-white shadow-xs font-bold' : 'bg-white border border-[#D9D1C1] text-[#5A5245] hover:text-[#1A1A1A]'
              }`}
            >
              Tier 2 (25%)
            </button>
            <button
              onClick={() => setTierFilter(3)}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-sm text-xs font-medium transition-all min-h-[36px] sm:min-h-0 flex items-center cursor-pointer ${
                tierFilter === 3 ? 'bg-[#8C7B65] text-white shadow-xs font-bold' : 'bg-white border border-[#D9D1C1] text-[#5A5245] hover:text-[#1A1A1A]'
              }`}
            >
              Tier 3 (5%)
            </button>
          </div>
        </div>

        {/* List of Sections */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-2.5 sm:space-y-3 bg-[#F9F7F2]">
          {filteredSections.map((section) => {
            const isCurrent = activeSectionNumber === section.number;
            const isLoaded = section.status === 'active';
            const isUpcoming = section.status === 'upcoming';

            return (
              <div
                key={section.id}
                onClick={() => {
                  onSelectSection(section.number);
                  onClose();
                }}
                className={`p-4 rounded-sm border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white border-[#1A1A1A] border-l-4 shadow-sm ring-1 ring-[#1A1A1A]'
                    : 'bg-white border-[#D9D1C1] hover:border-[#1A1A1A] hover:bg-[#FAF9F5] shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`w-8 h-8 rounded-sm text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                        isCurrent
                          ? 'bg-[#BF360C] text-white border-[#BF360C]'
                          : isLoaded
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#E9E4D9] text-[#1A1A1A] border-[#D9D1C1]'
                      }`}
                    >
                      {String(section.number).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-serif font-bold text-[#1A1A1A]">
                          Section {String(section.number).padStart(2, '0')}: {section.title}
                        </h4>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                            section.tier === 1
                              ? 'bg-[#FAECE8] text-[#BF360C] border-[#E8B4A6]'
                              : section.tier === 2
                              ? 'bg-[#E9E4D9] text-[#1A1A1A] border-[#D9D1C1]'
                              : 'bg-[#F9F7F2] text-[#8C7B65] border-[#D9D1C1]'
                          }`}
                        >
                          Tier {section.tier}
                        </span>
                      </div>
                      <span className="text-xs font-serif italic text-[#5A5245] block mt-0.5">{section.phase}</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {section.topics.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#F9F7F2] text-[#5A5245] border border-[#D9D1C1]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isLoaded ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-sm bg-[#EFF5EE] text-[#2E5A36] border border-[#BDD6BA]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active (Loaded)
                      </span>
                    ) : isUpcoming ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-sm bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Upcoming
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-sm bg-[#E9E4D9] text-[#8C7B65] border border-[#D9D1C1]">
                        <Clock className="w-3.5 h-3.5" /> Planned
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-[#8C7B65]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
