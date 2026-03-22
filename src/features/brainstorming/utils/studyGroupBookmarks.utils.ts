/**
 * 스터디 그룹 목록(Brain Storming 탭) 즐겨찾기 — 로컬 전용.
 */
const STORAGE_KEY = "lit.studyGroupBookmarks.v1";

function readIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set((arr || []).filter(Boolean));
  } catch {
    return new Set();
  }
}

function writeIds(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function isStudyGroupBookmarked(groupId: string): boolean {
  return readIds().has(groupId);
}

/** @returns 토글 후 즐겨찾기 여부 */
export function toggleStudyGroupBookmark(groupId: string): boolean {
  const set = readIds();
  if (set.has(groupId)) {
    set.delete(groupId);
    writeIds(set);
    return false;
  }
  set.add(groupId);
  writeIds(set);
  return true;
}
