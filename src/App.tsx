import React, { useState, useEffect } from 'react';
import { CURRICULUM_SECTIONS } from './data/curriculumRegistry';
import { SECTION_01_PARTS } from './data/section01Index';
import { CurriculumSection, SearchMatch, StudyMode } from './types';
import {
  loadUserProgress,
  toggleCompletedPart,
  recordQuizScore,
  saveUserProgress,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { CurriculumModal } from './components/CurriculumModal';
import { Section00View } from './components/Section00View';
import { Section01View } from './components/Section01View';
import { UpcomingSectionView } from './components/UpcomingSectionView';

export function App() {
  const [activeSection, setActiveSection] = useState<CurriculumSection>(
    () => CURRICULUM_SECTIONS.find((s) => s.id === 'section-01') || CURRICULUM_SECTIONS[0]
  );
  const [activePartId, setActivePartId] = useState<string>('snowflake-part-01');
  const [studyMode, setStudyMode] = useState<StudyMode>('read');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState(loadUserProgress);

  // Keyboard shortcut '/' opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Scroll to top when switching section or part
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection.id, activePartId, studyMode]);

  const handleSelectSection = (sec: CurriculumSection) => {
    setActiveSection(sec);
    if (sec.id === 'section-01') {
      setActivePartId('snowflake-part-01');
    }
    setIsSidebarOpen(false);
  };

  const handleSelectPart = (partId: string) => {
    setActivePartId(partId);
    if (activeSection.id !== 'section-01') {
      const sec01 = CURRICULUM_SECTIONS.find((s) => s.id === 'section-01')!;
      setActiveSection(sec01);
    }
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
      setActiveSection(targetSec);
    }
    if (match.partId) {
      setActivePartId(match.partId);
    }
    if (match.targetId) {
      setTimeout(() => {
        const el = document.getElementById(match.targetId!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  };

  // Find active part title for breadcrumb
  const currentPart = SECTION_01_PARTS.find((p) => p.id === activePartId);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] flex flex-col font-sans">
      {/* Top Sticky Navigation */}
      <Navbar
        activeSectionTitle={`Section ${activeSection.number}: ${activeSection.title}`}
        activePartTitle={activeSection.id === 'section-01' ? currentPart?.partNumber : undefined}
        studyMode={studyMode}
        onSelectStudyMode={setStudyMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCurriculum={() => setIsCurriculumOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        completedPartsCount={progress.completedParts.length}
        totalPartsCount={6} // Section 00 + 5 parts of Section 01
      />

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Left Editorial Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeSectionId={activeSection.id}
          activePartId={activePartId}
          onSelectSection={handleSelectSection}
          onSelectPart={handleSelectPart}
          completedParts={progress.completedParts}
        />

        {/* Content Canvas */}
        <main className="flex-1 lg:pl-72 w-full transition-all">
          {activeSection.id === 'section-00' ? (
            <Section00View
              isCompleted={progress.completedParts.includes('section-00')}
              onToggleComplete={() => handleTogglePartCompletion('section-00')}
              onNavigateNext={() => {
                const sec01 = CURRICULUM_SECTIONS.find((s) => s.id === 'section-01')!;
                setActiveSection(sec01);
                setActivePartId('snowflake-part-01');
              }}
            />
          ) : activeSection.id === 'section-01' ? (
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
              onNavigateToSection01={() => {
                const sec01 = CURRICULUM_SECTIONS.find((s) => s.id === 'section-01')!;
                setActiveSection(sec01);
                setActivePartId('snowflake-part-01');
              }}
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
        activeSectionId={activeSection.id}
        onSelectSection={handleSelectSection}
      />
    </div>
  );
}
