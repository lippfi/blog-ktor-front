const DRAFT_KEY_PREFIX = 'draft:';

export function buildDraftKey(scope: string, identifier: string): string {
  return `${DRAFT_KEY_PREFIX}${scope}:${identifier}`;
}

export function readDraft<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function saveDraft<T>(key: string, payload: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to save draft', error);
  }
}

export function clearDraft(key: string): void {
  localStorage.removeItem(key);
}