import React from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumRegistry';
import { SECTION_01_PARTS } from '../data/section01Index';
import { CurriculumSection, StudyMode } from '../types';
import { formatSectionPath, Link } from '../utils/router';
import { BookOpen, CheckCircle2, ChevronRight, X, Compass, Layers, Award } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSectionId?: string;
  activePartId?: string;
  completedParts: string[];
  onSelectSection: (section: CurriculumSection) => void;
  onSelectPart: (partId: string) => void;
  isHome: boolean;
  studyMode?: StudyMode;
  onSelectStudyMode?: (mode: StudyMode) => void;
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
  studyMode = 'read',
  onSelectStudyMode,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#F9F7F2] dark:bg-[#181614] border-r border-[#D9D1C1] dark:border-[#38332B] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#D9D1C1] dark:border-[#38332B] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono-code uppercase font-bold tracking-wider text-[#BF360C] dark:text-[#E05A36]">
              Technical Curriculum
            </div>
            <div className="text-xs text-[#5A5245] dark:text-[#A89F91] mt-0.5">
              Senior DE Interview System
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#E9E4D9] dark:hover:bg-[#28241F] text-[#5A5245] dark:text-[#A89F91] cursor-pointer transition-colors"
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
                  ? 'bg-[#1A1A1A] text-white dark:bg-[#EDE8DF] dark:text-[#1A1A1A] shadow-2xs'
                  : 'text-[#443E37] dark:text-[#C5BCAD] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
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
                  ? 'bg-[#FFFFFF] dark:bg-[#23201D] text-[#BF360C] dark:text-[#E05A36] shadow-2xs border border-[#D9D1C1] dark:border-[#38332B]'
                  : 'text-[#443E37] dark:text-[#C5BCAD] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="font-mono-code font-bold text-[#8C7B65]">00</span>
                <span className="truncate">How to Use This Guide</span>
              </div>
              {completedParts.includes('section-00') && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
                  ? 'bg-[#1A1A1A] text-white dark:bg-[#EDE8DF] dark:text-[#1A1A1A] shadow-2xs'
                  : 'text-[#1A1A1A] dark:text-[#EDE8DF] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
              }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="font-mono-code font-bold text-[#BF360C] dark:text-[#E05A36]">01</span>
                <span className="truncate">Snowflake Deep-Dive</span>
              </div>
              <span className="px-1.5 py-0.2 rounded bg-[#BF360C] text-white text-[9px] font-mono-code uppercase font-bold">
                Live
              </span>
            </Link>

            {/* Study Mode Fast Selector inside Section 01 */}
            {activeSectionId === 'section-01' && onSelectStudyMode && (
              <div className="my-2 p-2 rounded-lg bg-[#E9E4D9]/80 dark:bg-[#24201C] border border-[#D9D1C1] dark:border-[#38332B] space-y-1">
                <div className="text-[10px] uppercase font-mono-code font-bold text-[#8C7B65] dark:text-[#9E8F7A] px-1 mb-1">
                  Study Modes:
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStudyMode('read');
                      onClose();
                    }}
                    className={`py-1 px-1.5 rounded text-[11px] font-medium flex items-center justify-center space-x-1 cursor-pointer transition-colors ${
                      studyMode === 'read'
                        ? 'bg-white dark:bg-[#151311] text-[#1A1A1A] dark:text-[#EDE8DF] shadow-2xs font-bold'
                        : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <BookOpen className="w-3 h-3 text-[#8C7B65]" />
                    <span>Read</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStudyMode('flashcard');
                      onClose();
                    }}
                    className={`py-1 px-1.5 rounded text-[11px] font-medium flex items-center justify-center space-x-1 cursor-pointer transition-colors ${
                      studyMode === 'flashcard'
                        ? 'bg-white dark:bg-[#151311] text-[#BF360C] dark:text-[#E05A36] shadow-2xs font-bold'
                        : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#BF360C]'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-[#BF360C]" />
                    <span>Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStudyMode('quiz');
                      onClose();
                    }}
                    className={`py-1 px-1.5 rounded text-[11px] font-medium flex items-center justify-center space-x-1 cursor-pointer transition-colors ${
                      studyMode === 'quiz'
                        ? 'bg-white dark:bg-[#151311] text-[#1F4B7A] dark:text-[#5B9BD5] shadow-2xs font-bold'
                        : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1F4B7A]'
                    }`}
                  >
                    <Award className="w-3 h-3 text-[#1F4B7A]" />
                    <span>Quiz</span>
                  </button>
                </div>
              </div>
            )}

            {/* Nested Section 01 Parts */}
            {activeSectionId === 'section-01' && (
              <div className="ml-3 pl-3 border-l-2 border-[#D9D1C1] dark:border-[#38332B] space-y-1 pt-1">
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
                          ? 'bg-[#FFFFFF] dark:bg-[#23201D] text-[#BF360C] dark:text-[#E05A36] font-bold shadow-2xs border border-[#D9D1C1] dark:border-[#38332B]'
                          : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#EDE8DF] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="font-mono-code text-[10px] text-[#8C7B65]">
                          {part.partNumber}
                        </span>
                        <span className="truncate">{part.title.replace('Snowflake ', '')}</span>
                      </div>
                      {isDone && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 ml-1" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Remaining Sections 02–30 */}
          <div className="pt-2 border-t border-[#D9D1C1]/60 dark:border-[#38332B]">
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
                        ? 'bg-[#FFFFFF] dark:bg-[#23201D] text-[#BF360C] dark:text-[#E05A36] font-semibold border border-[#D9D1C1] dark:border-[#38332B]'
                        : 'text-[#6B6358] dark:text-[#9E8F7A] hover:text-[#1A1A1A] dark:hover:text-[#EDE8DF] hover:bg-[#E9E4D9] dark:hover:bg-[#28241F]'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-mono-code text-[10px] text-[#8C7B65] w-5">
                        {sec.number.toString().padStart(2, '0')}
                      </span>
                      <span className="truncate">{sec.title}</span>
                    </div>
                    <span className="text-[9px] uppercase font-mono-code text-[#8C7B65] px-1 py-0.2 rounded bg-[#E9E4D9] dark:bg-[#2B2722]">
                      {sec.priority}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 bg-[#E9E4D9] dark:bg-[#23201D] border-t border-[#D9D1C1] dark:border-[#38332B] text-[11px] text-[#5A5245] dark:text-[#A89F91] flex items-center justify-between font-mono-code">
          <span>Target: 5–10 YOE Senior</span>
          <span>v2.0 2026</span>
        </div>
      </aside>
    </>
  );
};
