/**
 * Persistent Storage Service using IndexedDB
 *
 * Stores learning history, vocabulary favorites, SRS data, and user settings.
 * Falls back to localStorage if IndexedDB is unavailable.
 */

const DB_NAME = 'lingualens_db';
const DB_VERSION = 1;

const STORES = {
  LEARNING_HISTORY: 'learning_history',
  VOCABULARY: 'vocabulary',
  SRS_CARDS: 'srs_cards',
  USER_SETTINGS: 'user_settings',
} as const;

export interface LearningHistoryEntry {
  readonly id: string;
  readonly type: 'snap' | 'live' | 'roleplay';
  readonly timestamp: number;
  readonly data: Record<string, unknown>;
}

export interface VocabularyEntry {
  readonly id: string;
  readonly word: string;
  readonly pinyin: string;
  readonly english: string;
  readonly sentence?: string;
  readonly addedAt: number;
  readonly isFavorite: boolean;
}

export interface UserSettings {
  readonly id: string;
  readonly hskLevel: number;
  readonly dailyGoalMinutes: number;
  readonly soundEnabled: boolean;
  readonly theme: 'light' | 'dark';
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.LEARNING_HISTORY)) {
        const historyStore = db.createObjectStore(STORES.LEARNING_HISTORY, { keyPath: 'id' });
        historyStore.createIndex('type', 'type', { unique: false });
        historyStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.VOCABULARY)) {
        const vocabStore = db.createObjectStore(STORES.VOCABULARY, { keyPath: 'id' });
        vocabStore.createIndex('word', 'word', { unique: true });
        vocabStore.createIndex('addedAt', 'addedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.SRS_CARDS)) {
        const srsStore = db.createObjectStore(STORES.SRS_CARDS, { keyPath: 'id' });
        srsStore.createIndex('nextReview', 'nextReview', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.USER_SETTINGS)) {
        db.createObjectStore(STORES.USER_SETTINGS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => {
      db.close();
      reject(request.error);
    };

    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

// ========== Learning History ==========

export async function addLearningHistory(entry: LearningHistoryEntry): Promise<void> {
  try {
    await withStore(STORES.LEARNING_HISTORY, 'readwrite', (store) => store.put(entry));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to save learning history:', error.message);
    }
  }
}

export async function getLearningHistory(type?: string): Promise<LearningHistoryEntry[]> {
  try {
    const all = await getAllFromStore<LearningHistoryEntry>(STORES.LEARNING_HISTORY);
    if (type) {
      return all.filter(entry => entry.type === type);
    }
    return all;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to load learning history:', error.message);
    }
    return [];
  }
}

// ========== Vocabulary ==========

export async function addVocabulary(entry: VocabularyEntry): Promise<void> {
  try {
    await withStore(STORES.VOCABULARY, 'readwrite', (store) => store.put(entry));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to save vocabulary:', error.message);
    }
  }
}

export async function getAllVocabulary(): Promise<VocabularyEntry[]> {
  try {
    return await getAllFromStore<VocabularyEntry>(STORES.VOCABULARY);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to load vocabulary:', error.message);
    }
    return [];
  }
}

export async function toggleFavorite(id: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORES.VOCABULARY, 'readwrite');
    const store = transaction.objectStore(STORES.VOCABULARY);
    const getReq = store.get(id);

    await new Promise<void>((resolve, reject) => {
      getReq.onsuccess = () => {
        const entry = getReq.result as VocabularyEntry | undefined;
        if (entry) {
          const updated: VocabularyEntry = { ...entry, isFavorite: !entry.isFavorite };
          store.put(updated);
        }
        resolve();
      };
      getReq.onerror = () => {
        db.close();
        reject(getReq.error);
      };
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to toggle favorite:', error.message);
    }
  }
}

// ========== User Settings ==========

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  try {
    await withStore(STORES.USER_SETTINGS, 'readwrite', (store) => store.put(settings));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to save user settings:', error.message);
    }
  }
}

export async function getUserSettings(): Promise<UserSettings | null> {
  try {
    const result = await withStore<UserSettings | undefined>(
      STORES.USER_SETTINGS,
      'readonly',
      (store) => store.get('default')
    );
    return result ?? null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to load user settings:', error.message);
    }
    return null;
  }
}
