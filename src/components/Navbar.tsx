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
    <header className="sticky top-0 z-40 h-14 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#D9D1C1] px-4 md:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Menu & Brand / Breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg border border-[#D9D1C1] bg-[#FFFFFF] hover:bg-[#E9E4D9] text-[#1A1A1A] transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 truncate">
          <Link
            to="/"
            className="font-serif-heading font-bold text-base md:text-lg text-[#1A1A1A] tracking-tight shrink-0 hover:text-[#BF360C] transition-colors flex items-center space-x-1.5"
          >
            <Compass className="w-4 h-4 text-[#BF360C]" />
            <span>DE Master Guide</span>
          </Link>

          {!isHome && activeSectionTitle && (
            <>
              <span className="text-[#8C7B65] hidden md:inline">/</span>
              <span className="text-xs md:text-sm font-medium text-[#5A5245] truncate hidden md:inline">
                {activeSectionTitle}
              </span>
            </>
          )}

          {!isHome && activePartTitle && (
            <>
              <span className="text-[#8C7B65] hidden lg:inline">/</span>
              <span className="text-xs font-mono-code text-[#BF360C] font-semibold truncate hidden lg:inline">
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
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Study Mode Selector (shown when reading a section) */}
        {!isHome && (
          <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-[#E9E4D9] border border-[#D9D1C1] text-xs">
            <button
              onClick={() => onSelectStudyMode('read')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                studyMode === 'read'
                  ? 'bg-[#FFFFFF] text-[#1A1A1A] shadow-2xs font-semibold'
                  : 'text-[#5A5245] hover:text-[#1A1A1A]'
              }`}
            >
              Editorial
            </button>
            <button
              onClick={() => onSelectStudyMode('flashcard')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                studyMode === 'flashcard'
                  ? 'bg-[#FFFFFF] text-[#1A1A1A] shadow-2xs font-semibold'
                  : 'text-[#5A5245] hover:text-[#1A1A1A]'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => onSelectStudyMode('quiz')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium cursor-pointer ${
                studyMode === 'quiz'
                  ? 'bg-[#FFFFFF] text-[#1A1A1A] shadow-2xs font-semibold'
                  : 'text-[#5A5245] hover:text-[#1A1A1A]'
              }`}
            >
              Quiz Assessment
            </button>
          </div>
        )}

        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-[#D9D1C1] bg-[#FFFFFF] hover:bg-[#F4EFE6] text-xs text-[#5A5245] transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#BF360C]" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline px-1.5 py-0.2 bg-[#F9F7F2] rounded border border-[#D9D1C1] font-mono-code text-[10px] text-[#8C7B65]">
            /
          </kbd>
        </button>

        {/* Roadmap Modal Button */}
        <button
          onClick={onOpenCurriculum}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#D9D1C1] bg-[#FFFFFF] hover:bg-[#F4EFE6] text-xs font-medium text-[#1A1A1A] transition-colors cursor-pointer"
          title="View 31-Section Roadmap"
        >
          <Map className="w-3.5 h-3.5 text-[#1F4B7A]" />
          <span className="hidden sm:inline">31 Sections</span>
        </button>

        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg border border-[#D9D1C1] bg-[#FFFFFF] hover:bg-[#F4EFE6] text-[#5A5245] hover:text-[#1A1A1A] transition-colors cursor-pointer"
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
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#E9E4D9] text-xs font-mono-code text-[#443E37]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {completedPartsCount}/{totalPartsCount} Done
          </span>
        </div>
      </div>
    </header>
  );
};
