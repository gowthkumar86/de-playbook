import React, { useState, useMemo } from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumRegistry';
import { SECTION_01_PARTS } from '../data/section01Index';
import { CurriculumSection, UserProgress } from '../types';
import { formatSectionPath, Link } from '../utils/router';
import {
  BookOpen,
  Database,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react';

interface HomePageProps {
  progress: UserProgress;
  onNavigateToSection: (section: CurriculumSection, partId?: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  progress,
  onNavigateToSection,
  onOpenSearch,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active'>('all');

  const tracks = [
    { id: 'all', label: 'All Tracks', count: 31 },
    { id: 'foundations', label: 'Foundations & Mindset', count: 3 },
    { id: 'storage', label: 'Storage & Lakehouse', count: 5 },
    { id: 'compute', label: 'Distributed Compute (Spark)', count: 4 },
    { id: 'streaming', label: 'Streaming & Real-Time', count: 4 },
    { id: 'modeling', label: 'Modeling & Orchestration', count: 7 },
    { id: 'system-design', label: 'System Design & Scenarios', count: 8 },
  ];

  const filteredSections = useMemo(() => {
    return CURRICULUM_SECTIONS.filter((sec) => {
      // Status filter
      if (statusFilter === 'active' && sec.status !== 'active') {
        return false;
      }

      // Track filter
      let matchesTrack = true;
      if (selectedTrack === 'foundations') {
        matchesTrack = [0, 2, 3].includes(sec.number);
      } else if (selectedTrack === 'storage') {
        matchesTrack = [1, 7, 8, 9, 18].includes(sec.number);
      } else if (selectedTrack === 'compute') {
        matchesTrack = [4, 5, 6, 17].includes(sec.number);
      } else if (selectedTrack === 'streaming') {
        matchesTrack = [7, 8, 10, 17].includes(sec.number);
      } else if (selectedTrack === 'modeling') {
        matchesTrack = [10, 11, 12, 13, 14, 15, 16, 21, 24].includes(sec.number);
      } else if (selectedTrack === 'system-design') {
        matchesTrack = [19, 20, 22, 23, 25, 26, 27, 28, 29, 30].includes(sec.number);
      }

      if (!matchesTrack) return false;

      // Search text filter
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        sec.title.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.category.toLowerCase().includes(q) ||
        `section ${sec.number}`.includes(q) ||
        `sec ${sec.number}`.includes(q)
      );
    });
  }, [selectedTrack, searchFilter, statusFilter]);

  const completedCount = progress.completedParts.length;
  const totalActiveModules = 6; // Section 00 + 5 parts of Section 01
  const percentComplete = Math.round((completedCount / totalActiveModules) * 100);

  return (
    <div id="home-page-container" className="w-full min-h-screen bg-[#F9F7F2] dark:bg-[#151413] text-[#1A1A1A] dark:text-[#EDE8DF] pb-24">
      {/* Clean Masthead Header */}
      <header className="border-b border-[#D9D1C1] dark:border-[#332E27] bg-[#FFFDFB] dark:bg-[#1E1C1A] px-6 md:px-10 lg:px-12 pt-10 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono-code text-[#BF360C] dark:text-[#E05A36] uppercase tracking-wider font-semibold">
                <span>CURRICULUM DIRECTORY</span>
                <span className="text-[#8C7B65] dark:text-[#7A7062]">•</span>
                <span className="text-[#5A5245] dark:text-[#A89F91]">SENIOR &amp; LEAD DATA ENGINEERING</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif-heading font-extrabold text-[#1A1A1A] dark:text-[#EDE8DF] mt-1.5 tracking-tight">
                Data Engineering Interview Curriculum
              </h1>
              <p className="text-sm md:text-base font-serif-heading text-[#5A5245] dark:text-[#A89F91] mt-2 max-w-2xl leading-relaxed">
                A structured 31-section curriculum covering storage mechanics, distributed query engines, streaming architectures, and interview defense for 5–10 YOE candidates.
              </p>
            </div>

            {/* Quick Readiness Tracker */}
            <div className="shrink-0 flex items-center gap-3 p-3.5 rounded-xl border border-[#D9D1C1] dark:border-[#38332B] bg-[#F4EFE6] dark:bg-[#25221F]">
              <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] dark:bg-[#1A1816] border border-[#D9D1C1] dark:border-[#38332B] flex items-center justify-center font-mono-code text-sm font-bold text-[#BF360C] dark:text-[#E05A36]">
                {percentComplete}%
              </div>
              <div className="text-xs">
                <div className="font-semibold text-[#1A1A1A] dark:text-[#EDE8DF]">
                  Study Progress
                </div>
                <div className="text-[#5A5245] dark:text-[#A89F91] font-mono-code text-[11px]">
                  {completedCount} of {totalActiveModules} live modules
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12 mt-8 space-y-10">
        {/* Available Now Section (Clear, Actionable, No Redundancy) */}
        <section id="active-modules-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono-code uppercase font-bold tracking-wider text-[#BF360C] dark:text-[#E05A36] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>Available Now to Study</span>
            </h2>
            <span className="text-xs text-[#8C7B65] dark:text-[#7A7062] font-mono-code">
              2 Active Sections • 6 Parts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Section 00 Card */}
            <div className="p-5 rounded-xl border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1E1C1A] shadow-xs flex flex-col justify-between hover:border-[#BF360C]/50 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#BF360C]/10 text-[#BF360C] dark:text-[#E05A36] font-mono-code text-xs font-bold">
                    SECTION 00
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-[#8C7B65] dark:text-[#7A7062] font-mono-code">
                    <Clock className="w-3.5 h-3.5" />
                    <span>2 Hours</span>
                  </div>
                </div>

                <h3 className="text-lg font-serif-heading font-bold text-[#1A1A1A] dark:text-[#EDE8DF] mt-2.5">
                  How to Use This Study Guide
                </h3>
                <p className="text-xs font-serif-heading text-[#5A5245] dark:text-[#A89F91] mt-1.5 leading-relaxed">
                  The senior mindset shift: mechanical sympathy, trade-off defense, the 5-step loop, scenario answering frameworks, and flagship production story formula.
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#F4EFE6] dark:bg-[#25221F] text-[#5A5245] dark:text-[#A89F91]">
                    Mindset Shift
                  </span>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#F4EFE6] dark:bg-[#25221F] text-[#5A5245] dark:text-[#A89F91]">
                    5-Step Loop
                  </span>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#F4EFE6] dark:bg-[#25221F] text-[#5A5245] dark:text-[#A89F91]">
                    Story Matrix
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E9E4D9] dark:border-[#2C2823] flex items-center justify-between">
                <span className="text-xs text-[#8C7B65] dark:text-[#7A7062]">
                  {progress.completedParts.includes('section-00') ? (
                    <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400 font-medium">
                      <Check className="w-3.5 h-3.5 mr-1" /> Completed
                    </span>
                  ) : (
                    'Ready to start'
                  )}
                </span>
                <Link
                  to="/section/00"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#BF360C] hover:bg-[#8C2A2A] text-white text-xs font-semibold transition-colors"
                >
                  <span>Open Section 00</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Section 01 Card */}
            <div className="p-5 rounded-xl border border-[#D9D1C1] dark:border-[#38332B] bg-[#FFFFFF] dark:bg-[#1E1C1A] shadow-xs flex flex-col justify-between hover:border-[#BF360C]/50 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-[#BF360C] text-white font-mono-code text-xs font-bold">
                      SECTION 01
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono-code text-[10px] font-bold uppercase">
                      5 Parts Live
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-[#8C7B65] dark:text-[#7A7062] font-mono-code">
                    <Clock className="w-3.5 h-3.5" />
                    <span>12 Hours</span>
                  </div>
                </div>

                <h3 className="text-lg font-serif-heading font-bold text-[#1A1A1A] dark:text-[#EDE8DF] mt-2.5">
                  Snowflake: Architecture, Engineering &amp; Performance
                </h3>
                <p className="text-xs font-serif-heading text-[#5A5245] dark:text-[#A89F91] mt-1.5 leading-relaxed">
                  Decoupled 3-layer architecture, micro-partition pruning, CDC Streams &amp; Tasks, Dynamic Tables, query profiler diagnostics, Horizon, and 20 tiered Q&amp;As.
                </p>

                {/* Subparts Chips */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {SECTION_01_PARTS.map((part) => {
                    const isDone = progress.completedParts.includes(part.id);
                    return (
                      <Link
                        key={part.id}
                        to={formatSectionPath(1, part.id)}
                        className={`px-2 py-1 rounded text-[11px] font-mono-code border transition-colors flex items-center justify-between ${
                          isDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                            : 'bg-[#F4EFE6] dark:bg-[#25221F] border-[#E9E4D9] dark:border-[#38332B] text-[#5A5245] dark:text-[#A89F91] hover:border-[#BF360C]'
                        }`}
                      >
                        <span className="truncate">{part.partNumber}</span>
                        {isDone && <Check className="w-3 h-3 ml-1 text-emerald-600 shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E9E4D9] dark:border-[#2C2823] flex items-center justify-between">
                <span className="text-xs text-[#8C7B65] dark:text-[#7A7062]">
                  {SECTION_01_PARTS.filter((p) => progress.completedParts.includes(p.id)).length} of 5 parts completed
                </span>
                <Link
                  to="/section/01"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] dark:bg-[#2E2A25] hover:bg-[#333333] text-white text-xs font-semibold transition-colors"
                >
                  <span>Open Section 01</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#BF360C]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Master Curriculum Index */}
        <section id="curriculum-index-section" className="pt-2">
          {/* Header with Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9D1C1] dark:border-[#38332B]">
            <div>
              <h2 className="text-xl font-serif-heading font-bold text-[#1A1A1A] dark:text-[#EDE8DF]">
                Full Curriculum Index
              </h2>
              <p className="text-xs font-serif-heading text-[#5A5245] dark:text-[#A89F91] mt-0.5">
                31 technical sections organized by architectural domains
              </p>
            </div>

            {/* In-page Filter Input */}
            <div className="flex items-center space-x-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#8C7B65] dark:text-[#7A7062] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter sections (e.g. Spark, Kafka)..."
                  className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#1E1C1A] border border-[#D9D1C1] dark:border-[#38332B] text-xs text-[#1A1A1A] dark:text-[#EDE8DF] placeholder-[#8C7B65] focus:outline-none focus:border-[#BF360C]"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8C7B65] hover:text-[#1A1A1A] cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center rounded-lg border border-[#D9D1C1] dark:border-[#38332B] p-0.5 bg-[#FFFFFF] dark:bg-[#1E1C1A] shrink-0 text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-[#1A1A1A] dark:bg-[#332E27] text-white font-medium'
                      : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A]'
                  }`}
                >
                  All (31)
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === 'active'
                      ? 'bg-[#BF360C] text-white font-medium'
                      : 'text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A]'
                  }`}
                >
                  Live (2)
                </button>
              </div>
            </div>
          </div>

          {/* Track Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 scrollbar-none">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedTrack === track.id
                    ? 'bg-[#1A1A1A] dark:bg-[#EDE8DF] text-white dark:text-[#1A1A1A]'
                    : 'bg-[#FFFFFF] dark:bg-[#1E1C1A] border border-[#D9D1C1] dark:border-[#38332B] text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] dark:hover:text-white'
                }`}
              >
                <span>{track.label}</span>
                <span className="ml-1 opacity-60 text-[10px] font-mono-code">({track.count})</span>
              </button>
            ))}
          </div>

          {/* Section Items List */}
          <div className="divide-y divide-[#E9E4D9] dark:divide-[#2C2823] border border-[#D9D1C1] dark:border-[#38332B] rounded-xl bg-[#FFFFFF] dark:bg-[#1E1C1A] overflow-hidden mt-2">
            {filteredSections.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8C7B65] dark:text-[#7A7062]">
                No sections match the current filter.
              </div>
            ) : (
              filteredSections.map((sec) => {
                const isLive = sec.status === 'active';
                const paddedNum = sec.number.toString().padStart(2, '0');
                const routePath = formatSectionPath(sec.number);

                return (
                  <div
                    key={sec.id}
                    className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                      isLive
                        ? 'hover:bg-[#FFFDFB] dark:hover:bg-[#23201D]'
                        : 'hover:bg-[#F9F7F2] dark:hover:bg-[#1A1816]'
                    }`}
                  >
                    {/* Left Details */}
                    <div className="flex items-start space-x-3.5 min-w-0">
                      <span
                        className={`px-2 py-1 rounded font-mono-code text-xs font-bold shrink-0 mt-0.5 ${
                          isLive
                            ? 'bg-[#BF360C] text-white'
                            : 'bg-[#E9E4D9] dark:bg-[#2A2622] text-[#5A5245] dark:text-[#A89F91]'
                        }`}
                      >
                        {paddedNum}
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Link
                            to={routePath}
                            className="font-serif-heading font-bold text-base text-[#1A1A1A] dark:text-[#EDE8DF] hover:text-[#BF360C] dark:hover:text-[#E05A36] transition-colors"
                          >
                            {sec.title}
                          </Link>

                          <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-[#F4EFE6] dark:bg-[#25221F] text-[#8C7B65] dark:text-[#7A7062]">
                            {sec.category}
                          </span>

                          <span
                            className={`text-[10px] font-mono-code font-semibold px-1.5 py-0.5 rounded ${
                              isLive
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                : 'bg-[#E9E4D9] dark:bg-[#2A2622] text-[#8C7B65] dark:text-[#7A7062]'
                            }`}
                          >
                            {isLive ? 'Live' : 'Upcoming'}
                          </span>
                        </div>

                        <p className="text-xs font-serif-heading text-[#5A5245] dark:text-[#A89F91] leading-relaxed line-clamp-2 md:line-clamp-1">
                          {sec.summary}
                        </p>
                      </div>
                    </div>

                    {/* Right Metadata & Action */}
                    <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E9E4D9] dark:border-[#2C2823]">
                      <div className="flex items-center space-x-2 text-[11px] font-mono-code text-[#8C7B65] dark:text-[#7A7062]">
                        <span>{sec.estimatedHours}h</span>
                        <span>•</span>
                        <span className="uppercase">{sec.priority.replace('-', ' ')}</span>
                      </div>

                      <Link
                        to={routePath}
                        className={`text-xs font-semibold inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                          isLive
                            ? 'bg-[#BF360C] hover:bg-[#8C2A2A] text-white'
                            : 'border border-[#D9D1C1] dark:border-[#38332B] text-[#5A5245] dark:text-[#A89F91] hover:text-[#1A1A1A] hover:bg-[#F4EFE6] dark:hover:bg-[#25221F]'
                        }`}
                      >
                        <span>{isLive ? 'Study' : 'Syllabus'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
