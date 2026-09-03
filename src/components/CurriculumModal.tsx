import React, { useState } from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumRegistry';
import { CurriculumSection } from '../types';
import { X, CheckCircle2, Clock, BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react';

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSectionId: string;
  onSelectSection: (section: CurriculumSection) => void;
}

export const CurriculumModal: React.FC<CurriculumModalProps> = ({
  isOpen,
  onClose,
  activeSectionId,
  onSelectSection,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All 31 Sections' },
    { id: 'foundation', label: 'Core Engines' },
    { id: 'streaming', label: 'Streaming & Real-Time' },
    { id: 'storage', label: 'Storage & Lakehouse' },
    { id: 'orchestration', label: 'Orchestration & Modeling' },
    { id: 'system-design', label: 'System Design & Scenarios' },
  ];

  const filtered = CURRICULUM_SECTIONS.filter((s) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'foundation') return [1, 2, 3, 4, 5].includes(s.number);
    if (filterCategory === 'streaming') return [7, 8, 9, 10].includes(s.number);
    if (filterCategory === 'storage') return [6, 11, 12, 13, 14].includes(s.number);
    if (filterCategory === 'orchestration') return [15, 16, 17, 18, 19, 20].includes(s.number);
    if (filterCategory === 'system-design') return s.number >= 21;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/45 backdrop-blur-xs">
      <div className="w-full max-w-4xl bg-[#FFFFFF] rounded-2xl border border-[#D9D1C1] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E9E4D9] bg-[#F9F7F2] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-[#BF360C]/10 text-[#BF360C] font-mono-code text-xs font-bold uppercase">
                Curriculum Registry
              </span>
              <span className="text-xs text-[#8C7B65]">
                Complete 31-Section Master Syllabus
              </span>
            </div>
            <h2 className="text-xl font-serif-heading font-bold text-[#1A1A1A] mt-1">
              Data Engineering Interview Preparation Roadmap
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#E9E4D9] text-[#5A5245] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-6 py-2.5 bg-[#FFFFFF] border-b border-[#E9E4D9] flex items-center space-x-2 overflow-x-auto text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors font-medium ${
                filterCategory === c.id
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-[#F9F7F2] text-[#5A5245] hover:bg-[#E9E4D9]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.map((sec) => {
            const isSelected = sec.id === activeSectionId;
            const isLive = sec.status === 'active';

            return (
              <div
                key={sec.id}
                onClick={() => {
                  onSelectSection(sec);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#BF360C] bg-[#FFFDFB] shadow-xs'
                    : isLive
                    ? 'border-[#D9D1C1] bg-[#FFFFFF] hover:border-[#BF360C]/50 hover:bg-[#FAF8F5]'
                    : 'border-[#E9E4D9] bg-[#FAFAF8] opacity-85 hover:opacity-100 hover:bg-[#FFFFFF]'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono-code font-bold text-sm shrink-0 mt-0.5 ${
                      isLive
                        ? 'bg-[#BF360C] text-white'
                        : 'bg-[#E9E4D9] text-[#5A5245]'
                    }`}
                  >
                    {String(sec.number).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-base text-[#1A1A1A]">
                        {sec.title}
                      </span>
                      {isLive ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Module</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#E9E4D9] text-[#5A5245] text-[10px] font-bold uppercase tracking-wider">
                          Syllabus Mapped
                        </span>
                      )}
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono-code font-semibold uppercase ${
                          sec.priority === 'must-master'
                            ? 'bg-[#BF360C]/10 text-[#BF360C]'
                            : sec.priority === 'interview-ready'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {sec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A5245] line-clamp-2 max-w-2xl">
                      {sec.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0 self-end md:self-center">
                  <div className="text-right text-xs">
                    <div className="flex items-center text-[#8C7B65] space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{sec.estimatedHours}h study</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C7B65] group-hover:text-[#BF360C] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#F4EFE6] border-t border-[#E9E4D9] flex items-center justify-between text-xs text-[#5A5245]">
          <span>Sections 00 & 01 are loaded with complete senior interview depth.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#FFFFFF] border border-[#D9D1C1] rounded text-[#1A1A1A] font-medium hover:bg-[#E9E4D9]"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
