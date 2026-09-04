import React, { useState, useEffect, useCallback } from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumRegistry';
import { SECTION_01_PARTS } from '../data/section01Index';
import { CurriculumSection, StudyMode } from '../types';

export interface RouteState {
  path: string;
  pathname: string;
  search: string;
  hash: string;
  view: 'home' | 'section';
  section: CurriculumSection | null;
  sectionNumber: number | null;
  partId: string | null;
  studyMode: StudyMode;
  searchQuery: string | null;
  trackFilter: string | null;
}

const SECTION_01_PART_ALIASES: Record<string, string> = {
  'architecture': 'snowflake-part-01',
  'part-1': 'snowflake-part-01',
  'part-01': 'snowflake-part-01',
  'part1': 'snowflake-part-01',
  '1': 'snowflake-part-01',
  'snowflake-part-01': 'snowflake-part-01',

  'engineering': 'snowflake-part-02',
  'pipelines': 'snowflake-part-02',
  'part-2': 'snowflake-part-02',
  'part-02': 'snowflake-part-02',
  'part2': 'snowflake-part-02',
  '2': 'snowflake-part-02',
  'snowflake-part-02': 'snowflake-part-02',

  'performance': 'snowflake-part-03',
  'tuning': 'snowflake-part-03',
  'part-3': 'snowflake-part-03',
  'part-03': 'snowflake-part-03',
  'part3': 'snowflake-part-03',
  '3': 'snowflake-part-03',
  'snowflake-part-03': 'snowflake-part-03',

  'governance': 'snowflake-part-04',
  'iceberg': 'snowflake-part-04',
  'horizon': 'snowflake-part-04',
  'part-4': 'snowflake-part-04',
  'part-04': 'snowflake-part-04',
  'part4': 'snowflake-part-04',
  '4': 'snowflake-part-04',
  'snowflake-part-04': 'snowflake-part-04',

  'interview': 'snowflake-part-05',
  'questions': 'snowflake-part-05',
  'qa': 'snowflake-part-05',
  'part-5': 'snowflake-part-05',
  'part-05': 'snowflake-part-05',
  'part5': 'snowflake-part-05',
  '5': 'snowflake-part-05',
  'snowflake-part-05': 'snowflake-part-05',
};

const SECTION_02_PART_ALIASES: Record<string, string> = {
  'foundations': 'sql-part-01',
  'part-1': 'sql-part-01',
  'part-01': 'sql-part-01',
  'part1': 'sql-part-01',
  '1': 'sql-part-01',
  'sql-part-01': 'sql-part-01',

  'window-functions': 'sql-part-02',
  'window': 'sql-part-02',
  'part-2': 'sql-part-02',
  'part-02': 'sql-part-02',
  'part2': 'sql-part-02',
  '2': 'sql-part-02',
  'sql-part-02': 'sql-part-02',

  'interview-patterns': 'sql-part-03',
  'patterns': 'sql-part-03',
  'part-3': 'sql-part-03',
  'part-03': 'sql-part-03',
  'part3': 'sql-part-03',
  '3': 'sql-part-03',
  'sql-part-03': 'sql-part-03',

  'optimization': 'sql-part-04',
  'tuning': 'sql-part-04',
  'part-4': 'sql-part-04',
  'part-04': 'sql-part-04',
  'part4': 'sql-part-04',
  '4': 'sql-part-04',
  'sql-part-04': 'sql-part-04',

  'interview': 'sql-part-05',
  'cheatsheet': 'sql-part-05',
  'qa': 'sql-part-05',
  'part-5': 'sql-part-05',
  'part-05': 'sql-part-05',
  'part5': 'sql-part-05',
  '5': 'sql-part-05',
  'sql-part-05': 'sql-part-05',
};

const SECTION_03_PART_ALIASES: Record<string, string> = {
  'foundations': 'python-part-01',
  'part-1': 'python-part-01',
  'part-01': 'python-part-01',
  'part1': 'python-part-01',
  '1': 'python-part-01',
  'python-part-01': 'python-part-01',

  'io-and-config': 'python-part-02',
  'io': 'python-part-02',
  'config': 'python-part-02',
  'part-2': 'python-part-02',
  'part-02': 'python-part-02',
  'part2': 'python-part-02',
  '2': 'python-part-02',
  'python-part-02': 'python-part-02',

  'etl-patterns': 'python-part-03',
  'etl': 'python-part-03',
  'api': 'python-part-03',
  'part-3': 'python-part-03',
  'part-03': 'python-part-03',
  'part3': 'python-part-03',
  '3': 'python-part-03',
  'python-part-03': 'python-part-03',

  'testing-and-typing': 'python-part-04',
  'testing': 'python-part-04',
  'typing': 'python-part-04',
  'part-4': 'python-part-04',
  'part-04': 'python-part-04',
  'part4': 'python-part-04',
  '4': 'python-part-04',
  'python-part-04': 'python-part-04',

  'interview': 'python-part-05',
  'cheatsheet': 'python-part-05',
  'qa': 'python-part-05',
  'part-5': 'python-part-05',
  'part-05': 'python-part-05',
  'part5': 'python-part-05',
  '5': 'python-part-05',
  'python-part-05': 'python-part-05',
};

export function parseCurrentLocation(): RouteState {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const search = window.location.search;
  const hash = window.location.hash;
  const params = new URLSearchParams(search);

  // Parse study mode query parameter
  const modeParam = params.get('mode');
  const studyMode: StudyMode =
    modeParam === 'flashcard' || modeParam === 'quiz' ? modeParam : 'read';

  const searchQuery = params.get('q');
  const trackFilter = params.get('track');

  // Home route: / or /home or /curriculum
  if (pathname === '/' || pathname === '/home' || pathname === '/curriculum') {
    return {
      path: pathname,
      pathname,
      search,
      hash,
      view: 'home',
      section: null,
      sectionNumber: null,
      partId: null,
      studyMode,
      searchQuery,
      trackFilter,
    };
  }

  // Section routes: /section/:num or /section/:num/:part
  const sectionMatch = pathname.match(/^\/section\/(\d{1,2})(?:\/([^/]+))?/i);
  if (sectionMatch) {
    const sectionNum = parseInt(sectionMatch[1], 10);
    const rawPart = sectionMatch[2];

    const section = CURRICULUM_SECTIONS.find((s) => s.number === sectionNum) || null;

    let partId: string | null = null;
    if (sectionNum === 1) {
      if (rawPart) {
        const lower = rawPart.toLowerCase();
        partId = SECTION_01_PART_ALIASES[lower] || 'snowflake-part-01';
      } else {
        partId = 'snowflake-part-01';
      }
    } else if (sectionNum === 2) {
      if (rawPart) {
        const lower = rawPart.toLowerCase();
        partId = SECTION_02_PART_ALIASES[lower] || 'sql-part-01';
      } else {
        partId = 'sql-part-01';
      }
    } else if (sectionNum === 3) {
      if (rawPart) {
        const lower = rawPart.toLowerCase();
        partId = SECTION_03_PART_ALIASES[lower] || 'python-part-01';
      } else {
        partId = 'python-part-01';
      }
    } else if (rawPart) {
      partId = rawPart;
    }

    return {
      path: pathname,
      pathname,
      search,
      hash,
      view: 'section',
      section,
      sectionNumber: sectionNum,
      partId,
      studyMode,
      searchQuery,
      trackFilter,
    };
  }

  // Fallback to home
  return {
    path: pathname,
    pathname,
    search,
    hash,
    view: 'home',
    section: null,
    sectionNumber: null,
    partId: null,
    studyMode,
    searchQuery,
    trackFilter,
  };
}

export function formatSectionPath(
  sectionNumber: number,
  partId?: string | null,
  studyModeOrHash?: StudyMode | string,
  maybeHash?: string
): string {
  const padded = sectionNumber.toString().padStart(2, '0');
  let path = `/section/${padded}`;

  if ((sectionNumber === 1 || sectionNumber === 2 || sectionNumber === 3) && partId) {
    path += `/${partId}`;
  }

  let studyMode: StudyMode | undefined;
  let hash: string | undefined;

  if (studyModeOrHash === 'read' || studyModeOrHash === 'flashcard' || studyModeOrHash === 'quiz') {
    studyMode = studyModeOrHash;
    hash = maybeHash;
  } else if (typeof studyModeOrHash === 'string') {
    hash = studyModeOrHash;
  }

  if (studyMode && studyMode !== 'read') {
    path += `?mode=${studyMode}`;
  }

  if (hash) {
    path += hash.startsWith('#') ? hash : `#${hash}`;
  }

  return path;
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(parseCurrentLocation);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }
    const newRoute = parseCurrentLocation();
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseCurrentLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToSection = useCallback((sectionNum: number, partId?: string, hash?: string) => {
    navigate(formatSectionPath(sectionNum, partId, hash));
  }, [navigate]);

  const navigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    route,
    location: route,
    navigate,
    navigateToSection,
    navigateHome,
  };
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, ...rest }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Normal left-click without modifier keys should be client-side navigation
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      if (replace) {
        window.history.replaceState(null, '', to);
      } else {
        window.history.pushState(null, '', to);
      }
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
