import React from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumRegistry';
import { SECTION_01_PARTS } from '../data/section01Index';
import { CurriculumSection } from '../types';
import { formatSectionPath, Link } from '../utils/router';
import { BookOpen, CheckCircle2, ChevronRight, X, Compass, Layers } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSectionId?: string;
  activePartId?: string;
  completedParts: string[];
  onSelectSection: (section: CurriculumSection) => void;
  onSelectPart: (partId: string) => void;
  isHome: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeSectionId,
  activePartId,
  completedParts,
  onSelectSection,
  onSelectPart,
  isHome,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#F9F7F2] border-r border-[#D9D1C1] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#D9D1C1] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono-code uppercase font-bold tracking-wider text-[#BF360C]">
              Technical Curriculum
            </div>
            <div className="text-xs text-[#5A5245] mt-0.5">
              Senior DE Interview System
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-[#E9E4D9] text-[#5A5245] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Curriculum Tree */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Top Hub Link */}
          <div>
            <Link
              to="/"
              onClick={onClose}
              className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2.5 ${
                isHome
                  ? 'bg-[#1A1A1A] text-white shadow-2xs'
                  : 'text-[#443E37] hover:bg-[#E9E4D9]'
              }`}
            >
              <Compass className={`w-4 h-4 ${isHome ? 'text-[#BF360C]' : 'text-[#8C7B65]'}`} />
              <span>Curriculum Hub (All 31)</span>
            </Link>
          </div>

          {/* Section 00 */}
          <div>
            <Link
              to="/section/00"
              onClick={onClose}
              className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                activeSectionId === 'section-00'
                  ? 'bg-[#FFFFFF] text-[#BF360C] shadow-2xs border border-[#D9D1C1]'
                  : 'text-[#443E37] hover:bg-[#E9E4D9]'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="font-mono-code font-bold text-[#8C7B65]">00</span>
                <span className="truncate">How to Use This Guide</span>
              </div>
              {completedParts.includes('section-00') && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
            </Link>
          </div>

          {/* Section 01: Snowflake Deep-Dive */}
          <div className="space-y-1">
            <Link
              to="/section/01"
              onClick={onClose}
              className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                activeSectionId === 'section-01'
                  ? 'bg-[#1A1A1A] text-white shadow-2xs'
                  : 'text-[#1A1A1A] hover:bg-[#E9E4D9]'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="font-mono-code font-bold text-[#BF360C]">01</span>
                <span className="truncate">Snowflake Deep-Dive</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-[#BF360C] text-white text-[9px] font-mono-code uppercase font-bold">
                Live
              </span>
            </Link>

            {/* Nested Section 01 Parts */}
            {activeSectionId === 'section-01' && (
              <div className="ml-3 pl-3 border-l-2 border-[#D9D1C1] space-y-1 pt-1">
                {SECTION_01_PARTS.map((part) => {
                  const isActive = activePartId === part.id;
                  const isDone = completedParts.includes(part.id);
                  const partRoute = formatSectionPath(1, part.id);

                  return (
                    <Link
                      key={part.id}
                      to={partRoute}
                      onClick={onClose}
                      className={`w-full text-left py-2 px-2.5 rounded-md text-[11.5px] transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-[#FFFFFF] text-[#BF360C] font-bold shadow-2xs border border-[#D9D1C1]'
                          : 'text-[#5A5245] hover:text-[#1A1A1A] hover:bg-[#E9E4D9]'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="font-mono-code text-[10px] text-[#8C7B65]">
                          {part.partNumber}
                        </span>
                        <span className="truncate">{part.title.replace('Snowflake ', '')}</span>
                      </div>
                      {isDone && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Remaining Sections 02–30 */}
          <div className="pt-2 border-t border-[#D9D1C1]/60">
            <div className="px-2 pb-2 text-[10px] uppercase font-mono-code font-bold tracking-wider text-[#8C7B65]">
              Upcoming Syllabus Sections
            </div>
            <div className="space-y-0.5">
              {CURRICULUM_SECTIONS.filter(
                (s) => s.id !== 'section-00' && s.id !== 'section-01'
              ).map((sec) => {
                const secRoute = formatSectionPath(sec.number);
                const isSecActive = activeSectionId === sec.id;

                return (
                  <Link
                    key={sec.id}
                    to={secRoute}
                    onClick={onClose}
                    className={`w-full text-left py-1.5 px-2 rounded text-[11px] transition-colors flex items-center justify-between ${
                      isSecActive
                        ? 'bg-[#FFFFFF] text-[#BF360C] font-semibold border border-[#D9D1C1]'
                        : 'text-[#6B6358] hover:text-[#1A1A1A] hover:bg-[#E9E4D9]'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-mono-code text-[10px] text-[#8C7B65] w-5">
                        {sec.number.toString().padStart(2, '0')}
                      </span>
                      <span className="truncate">{sec.title}</span>
                    </div>
                    <span className="text-[9px] uppercase font-mono-code text-[#8C7B65] px-1 py-0.2 rounded bg-[#E9E4D9]">
                      {sec.priority}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 bg-[#E9E4D9] border-t border-[#D9D1C1] text-[11px] text-[#5A5245] flex items-center justify-between font-mono-code">
          <span>Target: 5–10 YOE Senior</span>
          <span>v2.0 2026</span>
        </div>
      </aside>
    </>
  );
};
