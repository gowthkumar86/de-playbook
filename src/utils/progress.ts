// Progress Tracking for Data Engineering Curriculum
// Persisted in localStorage, strictly user-controlled

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'review';

export interface ProgressState {
  sections: Record<number, ProgressStatus>;
  topics: Record<string, ProgressStatus>;
}

const STORAGE_KEY = 'de_curriculum_progress_v1';

export function getProgress(): ProgressState {
  if (typeof window === 'undefined') {
    return { sections: {}, topics: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to read progress from localStorage', err);
  }
  return { sections: { 0: 'in_progress' }, topics: {} };
}

export function saveProgress(progress: ProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save progress to localStorage', err);
  }
}

export function updateSectionProgress(sectionNumber: number, status: ProgressStatus): ProgressState {
  const current = getProgress();
  current.sections[sectionNumber] = status;
  saveProgress(current);
  return { ...current };
}

export function updateTopicProgress(topicKey: string, status: ProgressStatus): ProgressState {
  const current = getProgress();
  current.topics[topicKey] = status;
  saveProgress(current);
  return { ...current };
}
