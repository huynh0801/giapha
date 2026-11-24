/**
 * Ultra-fast native IndexedDB persistent cache for Vietnamese Genealogy Data.
 *
 * Provides instantaneous (< 5ms) offline-first retrieval of person lists,
 * relationships, and tree nodes directly from client storage, avoiding
 * redundant database network trips across tab switches or reloads.
 */

export interface CachedGenealogyData {
  familyId: string;
  treeId: string;
  persons: any[];
  relationships?: any[];
  cachedAt: number;
  dataVersion?: number | string;
}

const DB_NAME = "giapha_client_cache";
const DB_VERSION = 1;
const STORE_NAME = "tree_cache";

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function makeCacheKey(familyId: string, treeId: string): string {
  return `${familyId}:${treeId}`;
}

/**
 * Save genealogy persons and relationships into persistent IndexedDB.
 */
export async function saveFamilyTreeCache(
  familyId: string,
  treeId: string,
  data: {
    persons: any[];
    relationships?: any[];
    dataVersion?: number | string;
  }
): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  const key = makeCacheKey(familyId, treeId);
  const record = {
    key,
    familyId,
    treeId,
    persons: data.persons,
    relationships: data.relationships || [],
    dataVersion: data.dataVersion || Date.now(),
    cachedAt: Date.now(),
  };

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Retrieve cached genealogy data instantly from IndexedDB (0ms network cost).
 */
export async function getFamilyTreeCache(
  familyId: string,
  treeId: string
): Promise<CachedGenealogyData | null> {
  const db = await openDatabase();
  if (!db) return null;

  const key = makeCacheKey(familyId, treeId);

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        const res = req.result;
        if (!res) {
          resolve(null);
          return;
        }
        resolve({
          familyId: res.familyId,
          treeId: res.treeId,
          persons: res.persons || [],
          relationships: res.relationships || [],
          cachedAt: res.cachedAt || 0,
          dataVersion: res.dataVersion,
        });
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Clear cached data for a specific family/tree or all entries.
 */
export async function clearFamilyTreeCache(
  familyId?: string,
  treeId?: string
): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      if (familyId && treeId) {
        const req = store.delete(makeCacheKey(familyId, treeId));
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } else {
        const req = store.clear();
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      }
    } catch {
      resolve(false);
    }
  });
}

/**
 * Helper to check if a cache record is fresh (defaults to 4 hours, matching family-tree-v3).
 */
export function isCacheFresh(
  cachedAt: number,
  maxAgeMs = 1000 * 60 * 60 * 4
): boolean {
  if (!cachedAt) return false;
  return Date.now() - cachedAt < maxAgeMs;
}
