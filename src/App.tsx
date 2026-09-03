import React, { useState, useEffect, useMemo } from 'react';
import { CURRICULUM_SECTIONS } from './data/curriculumRegistry';
import { SECTION_01_PARTS } from './data/section01Index';
import { CurriculumSection, SearchMatch, StudyMode } from './types';
import {
  loadUserProgress,
  toggleCompletedPart,
  recordQuizScore,
} from './utils/storage';
import { useRouter } from './utils/router';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { CurriculumModal } from './components/CurriculumModal';
import { HomePage } from './components/HomePage';
import { Section00View } from './components/Section00View';
import { Section01View } from './components/Section01View';
import { UpcomingSectionView } from './components/UpcomingSectionView';

export function App() {
  const { location, navigate, navigateToSection, navigateHome } = useRouter();

  // Active section resolution from router
  const activeSection = useMemo<CurriculumSection>(() => {
    if (location.view === 'section') {
      const found = CURRICULUM_SECTIONS.find((s) => s.number === location.sectionNumber);
      if (found) return found;
    }
    // Default fallback
    return CURRICULUM_SECTIONS.find((s) => s.id === 'section-01') || CURRICULUM_SECTIONS[0];
  }, [location.view, location.sectionNumber]);

  // Active part resolution for Section 01
  const activePartId = useMemo<string>(() => {
    if (location.view === 'section' && location.sectionNumber === 1 && location.partId) {
      return location.partId;
    }
    return 'snowflake-part-01';
  }, [location.view, location.sectionNumber, location.partId]);

  // Study mode synced with URL search params if present
  const [studyMode, setStudyMode] = useState<StudyMode>(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'flashcard' || modeParam === 'quiz' || modeParam === 'read') {
      return modeParam as StudyMode;
    }
    return 'read';
  });

  // Keep studyMode updated if URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'flashcard' || modeParam === 'quiz' || modeParam === 'read') {
      setStudyMode(modeParam as StudyMode);
    }
  }, [location.search]);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState(loadUserProgress);

  // Theme state (light / dark)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('de-master-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('de-master-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('de-master-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Keyboard shortcut '/' opens search, 't' toggles theme, 'Esc' closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';

      if (e.key === '/' && !isSearchOpen && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 't' && !e.metaKey && !e.ctrlKey && !isInput) {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsCurriculumOpen(false);
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isDark]);

  // Scroll to top on route change unless hash is present
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.getElementById(location.hash!.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }, 250);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  const handleSelectSection = (sec: CurriculumSection, partId?: string) => {
    navigateToSection(sec.number, sec.number === 1 ? (partId || 'snowflake-part-01') : undefined);
    setIsSidebarOpen(false);
  };

  const handleSelectPart = (partId: string) => {
    navigateToSection(1, partId);
    setIsSidebarOpen(false);
  };

  const handleTogglePartCompletion = (partId: string) => {
    const updated = toggleCompletedPart(partId);
    setProgress(updated);
  };

  const handleRecordQuizScore = (questionId: string, rating: 'nailed' | 'close' | 'missed') => {
    const updated = recordQuizScore(questionId, rating);
    setProgress(updated);
  };

  const handleSelectSearchResult = (match: SearchMatch) => {
    const targetSec = CURRICULUM_SECTIONS.find((s) => s.id === match.sectionId);
    if (targetSec) {
      navigateToSection(targetSec.number, match.partId, match.targetId);
    }
  };

  const isHome = location.view === 'home';
  const currentPart = SECTION_01_PARTS.find((p) => p.id === activePartId);

  return (
    <div className="min-h-screen bg-[#F9F7F2] dark:bg-[#151311] text-[#1A1A1A] dark:text-[#EDE8DF] flex flex-col font-sans transition-colors duration-150">
      {/* Top Sticky Navigation */}
      <Navbar
        isHome={isHome}
        activeSectionTitle={!isHome ? `Section ${activeSection.number.toString().padStart(2, '0')}: ${activeSection.title}` : undefined}
        activePartTitle={!isHome && activeSection.number === 1 ? currentPart?.partNumber : undefined}
        studyMode={studyMode}
        onSelectStudyMode={(mode) => {
          setStudyMode(mode);
          // If we are in section 01, update the query parameter seamlessly
          if (location.view === 'section') {
            const pathWithoutQuery = window.location.pathname;
            const newUrl = mode === 'read' ? pathWithoutQuery : `${pathWithoutQuery}?mode=${mode}`;
            window.history.replaceState(null, '', newUrl);
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCurriculum={() => setIsCurriculumOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        completedPartsCount={progress.completedParts.length}
        totalPartsCount={6} // Section 00 + 5 parts of Section 01
        onNavigateHome={navigateHome}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Left Editorial Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeSectionId={!isHome ? activeSection.id : undefined}
          activePartId={!isHome && activeSection.number === 1 ? activePartId : undefined}
          onSelectSection={handleSelectSection}
          onSelectPart={handleSelectPart}
          completedParts={progress.completedParts}
          isHome={isHome}
        />

        {/* Content Canvas */}
        <main className="flex-1 lg:pl-72 w-full transition-all">
          {isHome ? (
            <HomePage
              progress={progress}
              onNavigateToSection={handleSelectSection}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          ) : activeSection.number === 0 ? (
            <Section00View
              isCompleted={progress.completedParts.includes('section-00')}
              onToggleComplete={() => handleTogglePartCompletion('section-00')}
              onNavigateNext={() => navigateToSection(1, 'snowflake-part-01')}
            />
          ) : activeSection.number === 1 ? (
            <Section01View
              activePartId={activePartId}
              onSelectPart={handleSelectPart}
              completedParts={progress.completedParts}
              onToggleCompletePart={handleTogglePartCompletion}
              studyMode={studyMode}
              quizScores={progress.quizScores}
              onRecordQuizScore={handleRecordQuizScore}
            />
          ) : (
            <UpcomingSectionView
              section={activeSection}
              onNavigateSection={handleSelectSection}
            />
          )}
        </main>
      </div>

      {/* Global Search Dialog */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      {/* Complete 31-Section Curriculum Roadmap Modal */}
      <CurriculumModal
        isOpen={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
        activeSectionId={!isHome ? activeSection.id : ''}
        onSelectSection={handleSelectSection}
      />
    </div>
  );
}
