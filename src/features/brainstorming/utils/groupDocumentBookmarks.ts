/**
 * 그룹 문서 즐겨찾기 (로컬 전용).
 * 백엔드에 Group 문서 북마크 API가 없어 localStorage로 보관합니다.
 */
const STORAGE_KEY = "lit.groupDocumentBookmarks.v1";

function readKeys(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set((arr || []).filter(Boolean));
  } catch {
    return new Set();
  }
}

function writeKeys(set: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore quota */
  }
}

function key(groupId: string, documentId: string): string {
  return `${groupId}:${documentId}`;
}

export function isGroupDocumentBookmarked(groupId: string, documentId: string): boolean {
  return readKeys().has(key(groupId, documentId));
}

/** @returns 새 즐겨찾기 여부 */
export function toggleGroupDocumentBookmark(groupId: string, documentId: string): boolean {
  const set = readKeys();
  const k = key(groupId, documentId);
  if (set.has(k)) {
    set.delete(k);
    writeKeys(set);
    return false;
  }
  set.add(k);
  writeKeys(set);
  return true;
}
