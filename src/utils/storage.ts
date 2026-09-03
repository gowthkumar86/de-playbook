import { UserProgress } from '../types';

const STORAGE_KEY = 'de_interview_study_progress_v2';

const DEFAULT_PROGRESS: UserProgress = {
  completedParts: [],
  savedBookmarks: [],
  quizScores: {},
  studyMode: 'read',
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}

export function toggleCompletedPart(partId: string): UserProgress {
  const current = loadUserProgress();
  const exists = current.completedParts.includes(partId);
  const updated: UserProgress = {
    ...current,
    completedParts: exists
      ? current.completedParts.filter((id) => id !== partId)
      : [...current.completedParts, partId],
  };
  saveUserProgress(updated);
  return updated;
}

export function toggleBookmark(bookmark: { id: string; title: string; sectionId: string; partId?: string }): UserProgress {
  const current = loadUserProgress();
  const exists = current.savedBookmarks.some((b) => b.id === bookmark.id);
  const updated: UserProgress = {
    ...current,
    savedBookmarks: exists
      ? current.savedBookmarks.filter((b) => b.id !== bookmark.id)
      : [
          ...current.savedBookmarks,
          {
            ...bookmark,
            createdAt: new Date().toISOString(),
          },
        ],
  };
  saveUserProgress(updated);
  return updated;
}

export function recordQuizScore(questionId: string, rating: 'nailed' | 'close' | 'missed'): UserProgress {
  const current = loadUserProgress();
  const updated: UserProgress = {
    ...current,
    quizScores: {
      ...current.quizScores,
      [questionId]: rating,
    },
  };
  saveUserProgress(updated);
  return updated;
}
