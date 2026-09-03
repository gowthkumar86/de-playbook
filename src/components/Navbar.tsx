import React from 'react';
import { BookOpen, Search, Map, Layers, CheckCircle2, Menu, Compass, Sun, Moon } from 'lucide-react';
import { StudyMode } from '../types';
import { Link } from '../utils/router';

interface NavbarProps {
  isHome: boolean;
  activeSectionTitle?: string;
  activePartTitle?: string;
  studyMode: StudyMode;
  onSelectStudyMode: (mode: StudyMode) => void;
  onOpenSearch: () => void;
  onOpenCurriculum: () => void;
  onToggleSidebar: () => void;
  completedPartsCount: number;
  totalPartsCount: number;
  onNavigateHome: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isHome,
  activeSectionTitle,
  activePartTitle,
  studyMode,
  onSelectStudyMode,
  onOpenSearch,
  onOpenCurriculum,
  onToggleSidebar,
  completedPartsCount,
  totalPartsCount,
  onNavigateHome,
  isDark = false,
  onToggleTheme,
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 h-14 bg-[#F9F7F2]/95 dark:bg-[#151311]/95 backdrop-blur-md border-b border-[#D9D1C1] dark:border-[#2E2923] px-3 sm:px-4 md:px-6 flex items-center justify-between shadow-2xs transition-colors">
        {/* Left: Mobile Menu & Brand / Breadcrumb */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1E1B17] hover:bg-[#E9E4D9] dark:hover:bg-[#2B2722] text-[#1A1A1A] dark:text-[#EDE8DF] transition-colors cursor-pointer"
            title="Toggle Navigation Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 truncate">
            <Link
              to="/"
              className="font-serif-heading font-bold text-sm sm:text-base md:text-lg text-[#1A1A1A] dark:text-[#EDE8DF] tracking-tight shrink-0 hover:text-[#BF360C] dark:hover:text-[#E05A36] transition-colors flex items-center space-x-1.5"
            >
              <Compass className="w-4 h-4 text-[#BF360C] dark:text-[#E05A36]" />
              <span className="truncate">DE Master Guide</span>
            </Link>

            {!isHome && activeSectionTitle && (
              <>
                <span className="text-[#8C7B65] hidden md:inline">/</span>
                <span className="text-xs md:text-sm font-medium text-[#5A5245] dark:text-[#A89F91] truncate hidden md:inline">
                  {activeSectionTitle}
                </span>
              </>
            )}

            {!isHome && activePartTitle && (
              <>
                <span className="text-[#8C7B65] hidden lg:inline">/</span>
                <span className="text-xs font-mono-code text-[#BF360C] dark:text-[#E05A36] font-semibold truncate hidden lg:inline">
                  {activePartTitle}
                </span>
              </>
            )}

            {isHome && (
              <>
                <span className="text-[#8C7B65] hidden md:inline">/</span>
                <span className="text-xs md:text-sm font-medium text-[#8C7B65] hidden md:inline">
                  Curriculum Hub (31 Sections)
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center/Right: Study Mode + Search + Roadmap */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
          {/* Desktop & Tablet Study Mode Selector */}
          {!isHome && (
            <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-[#E9E4D9] dark:bg-[#24201C] border border-[#D9D1C1] dark:border-[#38332B] text-xs">
              <button
                onClick={() => onSelectStudyMode('read')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                  studyMode === 'read'
                    ? 'bg-[#FFFFFF] dark:bg-[#151311] text-[#1A1A1A] dark:text-[#EDE8DF] shadow-2xs font-semibold'
                    : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
                }`}
              >
                Editorial
              </button>
              <button
                onClick={() => onSelectStudyMode('flashcard')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                  studyMode === 'flashcard'
                    ? 'bg-[#FFFFFF] dark:bg-[#151311] text-[#BF360C] dark:text-[#E05A36] shadow-2xs font-semibold'
                    : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
                }`}
              >
                Flashcards
              </button>
              <button
                onClick={() => onSelectStudyMode('quiz')}
                className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                  studyMode === 'quiz'
                    ? 'bg-[#FFFFFF] dark:bg-[#151311] text-[#1F4B7A] dark:text-[#5B9BD5] shadow-2xs font-semibold'
                    : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF]'
                }`}
              >
                Quiz Assessment
              </button>
            </div>
          )}

          {/* Global Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1E1B17] hover:bg-[#F4EFE6] dark:hover:bg-[#2B2722] text-xs text-[#5A5245] dark:text-[#A89F91] transition-colors cursor-pointer"
            title="Search Curriculum [/]"
          >
            <Search className="w-3.5 h-3.5 text-[#BF360C] dark:text-[#E05A36]" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden md:inline px-1.5 py-0.2 bg-[#F9F7F2] dark:bg-[#151311] rounded border border-[#D9D1C1] dark:border-[#38332B] font-mono-code text-[10px] text-[#8C7B65]">
              /
            </kbd>
          </button>

          {/* Roadmap Modal Button */}
          <button
            onClick={onOpenCurriculum}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1E1B17] hover:bg-[#F4EFE6] dark:hover:bg-[#2B2722] text-xs font-medium text-[#1A1A1A] dark:text-[#EDE8DF] transition-colors cursor-pointer"
            title="View 31-Section Roadmap"
          >
            <Map className="w-3.5 h-3.5 text-[#1F4B7A] dark:text-[#5B9BD5]" />
            <span className="hidden sm:inline">31 Sections</span>
          </button>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1E1B17] hover:bg-[#F4EFE6] dark:hover:bg-[#2B2722] text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] transition-colors cursor-pointer"
              title={`Toggle Theme [t] (current: ${isDark ? 'Dark' : 'Light'})`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-[#8C7B65]" />
              )}
            </button>
          )}

          {/* Progress Pill */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#E9E4D9] dark:bg-[#24201C] text-xs font-mono-code text-[#443E37] dark:text-[#C5BCAD]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {completedPartsCount}/{totalPartsCount} Done
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Study Mode Sub-Bar (Visible exclusively on mobile < sm when inside a section) */}
      {!isHome && (
        <div className="sm:hidden sticky top-14 z-30 bg-[#F4EFE6]/95 dark:bg-[#1A1816]/95 backdrop-blur-md border-b border-[#D9D1C1] dark:border-[#2E2923] px-2 py-1.5 flex items-center justify-between gap-1 shadow-2xs">
          <div className="grid grid-cols-3 w-full gap-1 p-0.5 rounded-lg bg-[#E9E4D9] dark:bg-[#24201C] border border-[#D9D1C1] dark:border-[#38332B] text-xs">
            <button
              type="button"
              onClick={() => onSelectStudyMode('read')}
              className={`py-1.5 px-2 rounded-md transition-all font-medium flex items-center justify-center space-x-1 cursor-pointer ${
                studyMode === 'read'
                  ? 'bg-[#FFFFFF] dark:bg-[#151311] text-[#1A1A1A] dark:text-[#EDE8DF] shadow-2xs font-bold'
                  : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A]'
              }`}
            >
              <BookOpen className="w-3 h-3 text-[#8C7B65]" />
              <span className="text-[11px]">Editorial</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectStudyMode('flashcard')}
              className={`py-1.5 px-2 rounded-md transition-all font-medium flex items-center justify-center space-x-1 cursor-pointer ${
                studyMode === 'flashcard'
                  ? 'bg-[#FFFFFF] dark:bg-[#151311] text-[#BF360C] dark:text-[#E05A36] shadow-2xs font-bold'
                  : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A]'
              }`}
            >
              <Layers className="w-3 h-3 text-[#BF360C] dark:text-[#E05A36]" />
              <span className="text-[11px]">Flashcards</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectStudyMode('quiz')}
              className={`py-1.5 px-2 rounded-md transition-all font-medium flex items-center justify-center space-x-1 cursor-pointer ${
                studyMode === 'quiz'
                  ? 'bg-[#FFFFFF] dark:bg-[#151311] text-[#1F4B7A] dark:text-[#5B9BD5] shadow-2xs font-bold'
                  : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-[#1F4B7A] dark:text-[#5B9BD5]" />
              <span className="text-[11px]">Assessment</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
