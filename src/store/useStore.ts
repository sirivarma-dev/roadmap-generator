import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Roadmap, RoadmapInput } from '../types/roadmap';
import { generateRoadmap } from '../engine/generateRoadmap';
import { subtopicKey, dayKey } from '../utils/progress';

export type Theme = 'light' | 'dark';
export type View = 'timeline' | 'tree';

/** All data owned by a single local account. */
export interface UserData {
  roadmap: Roadmap | null;
  bookmarks: Record<string, true>; // topicId -> bookmarked
  notes: Record<string, string>; // topicId -> note text
  completedSubtopics: Record<string, number>; // subtopicKey -> completedAt (ms)
  studyMinutes: Record<string, number>; // 'YYYY-MM-DD' -> minutes studied
}

interface Account {
  name: string; // display name as typed
  hash: string; // SHA-256 of the password (demo-grade, local only)
  createdAt: number;
}

function emptyUserData(): UserData {
  return { roadmap: null, bookmarks: {}, notes: {}, completedSubtopics: {}, studyMinutes: {} };
}

/** SHA-256 hash so passwords aren't stored in plain text (local accounts only). */
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`pathwright:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const initialTheme: Theme =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

interface AppState {
  theme: Theme;
  view: View;
  isGenerating: boolean;

  // Auth
  accounts: Record<string, Account>; // key = lowercased username
  currentUser: string | null; // the account key

  // Persisted per-user store
  userData: Record<string, UserData>;

  // Active mirror of userData[currentUser] for convenient component access
  roadmap: Roadmap | null;
  bookmarks: Record<string, true>;
  notes: Record<string, string>;
  completedSubtopics: Record<string, number>;
  studyMinutes: Record<string, number>;

  // Auth actions
  signup: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;

  // App actions
  toggleTheme: () => void;
  setView: (v: View) => void;
  generate: (input: RoadmapInput) => Promise<Roadmap>;
  clearRoadmap: () => void;
  toggleBookmark: (topicId: string) => void;
  setNote: (topicId: string, text: string) => void;
  toggleSubtopic: (topicId: string, subtopic: string) => void;
  setTopicComplete: (topicId: string, subtopics: string[], complete: boolean) => void;
  addStudyMinutes: (mins: number) => void;
}

/** Active-state slice hydrated from a user's saved data (or blanked out). */
function activeFrom(userData: Record<string, UserData>, user: string | null) {
  const d = (user && userData[user]) || emptyUserData();
  return {
    roadmap: d.roadmap,
    bookmarks: d.bookmarks,
    notes: d.notes,
    completedSubtopics: d.completedSubtopics,
    studyMinutes: d.studyMinutes,
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      // Write a patch to the current user's saved data AND the active mirror.
      const writeUser = (patch: Partial<UserData>) => {
        const user = get().currentUser;
        if (!user) return;
        set((s) => {
          const prev = s.userData[user] ?? emptyUserData();
          return {
            ...patch,
            userData: { ...s.userData, [user]: { ...prev, ...patch } },
          } as Partial<AppState>;
        });
      };

      return {
        theme: initialTheme,
        view: 'timeline',
        isGenerating: false,

        accounts: {},
        currentUser: null,
        userData: {},

        roadmap: null,
        bookmarks: {},
        notes: {},
        completedSubtopics: {},
        studyMinutes: {},

        signup: async (username, password) => {
          const name = username.trim();
          if (name.length < 2) throw new Error('Username must be at least 2 characters.');
          if (password.length < 4) throw new Error('Password must be at least 4 characters.');
          const key = name.toLowerCase();
          if (get().accounts[key]) throw new Error('That username is already taken.');
          const hash = await hashPassword(password);
          set((s) => {
            const userData = { ...s.userData, [key]: s.userData[key] ?? emptyUserData() };
            return {
              accounts: { ...s.accounts, [key]: { name, hash, createdAt: Date.now() } },
              currentUser: key,
              userData,
              ...activeFrom(userData, key),
            };
          });
        },

        login: async (username, password) => {
          const key = username.trim().toLowerCase();
          const acct = get().accounts[key];
          if (!acct) throw new Error('No account found with that username.');
          const hash = await hashPassword(password);
          if (hash !== acct.hash) throw new Error('Incorrect password.');
          set((s) => {
            const userData = { ...s.userData, [key]: s.userData[key] ?? emptyUserData() };
            return { currentUser: key, userData, ...activeFrom(userData, key) };
          });
        },

        logout: () =>
          set({ currentUser: null, isGenerating: false, ...activeFrom({}, null) }),

        toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
        setView: (view) => set({ view }),

        generate: async (input) => {
          set({ isGenerating: true });
          // Brief "planning" pass so the loading state is meaningful; generation
          // itself is fully client-side and deterministic.
          await new Promise((r) => setTimeout(r, 650));
          const roadmap = generateRoadmap(input);
          const user = get().currentUser;
          set((s) => {
            if (!user) return { roadmap, isGenerating: false };
            const prev = s.userData[user] ?? emptyUserData();
            return {
              roadmap,
              isGenerating: false,
              userData: { ...s.userData, [user]: { ...prev, roadmap } },
            };
          });
          return roadmap;
        },

        clearRoadmap: () => writeUser({ roadmap: null }),

        toggleBookmark: (topicId) => {
          const next = { ...get().bookmarks };
          if (next[topicId]) delete next[topicId];
          else next[topicId] = true;
          writeUser({ bookmarks: next });
        },

        setNote: (topicId, text) => {
          const next = { ...get().notes };
          if (text.trim() === '') delete next[topicId];
          else next[topicId] = text;
          writeUser({ notes: next });
        },

        toggleSubtopic: (topicId, subtopic) => {
          const key = subtopicKey(topicId, subtopic);
          const next = { ...get().completedSubtopics };
          if (next[key]) delete next[key];
          else next[key] = Date.now();
          writeUser({ completedSubtopics: next });
        },

        setTopicComplete: (topicId, subtopics, complete) => {
          const next = { ...get().completedSubtopics };
          const now = Date.now();
          for (const s of subtopics) {
            const key = subtopicKey(topicId, s);
            if (complete) {
              if (!next[key]) next[key] = now;
            } else {
              delete next[key];
            }
          }
          writeUser({ completedSubtopics: next });
        },

        addStudyMinutes: (mins) => {
          const day = dayKey();
          const next = { ...get().studyMinutes };
          next[day] = Math.max(0, (next[day] ?? 0) + mins);
          writeUser({ studyMinutes: next });
        },
      };
    },
    {
      name: 'roadmap-generator-store',
      version: 2,
      partialize: (s) => ({
        theme: s.theme,
        view: s.view,
        accounts: s.accounts,
        currentUser: s.currentUser,
        userData: s.userData,
      }),
      // After loading from localStorage, hydrate the active mirror from the
      // currently-logged-in user's saved data.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const active = activeFrom(state.userData ?? {}, state.currentUser);
        Object.assign(state, active);
      },
    },
  ),
);

export { generateRoadmap };
