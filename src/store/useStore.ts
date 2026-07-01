import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Roadmap, RoadmapInput } from '../types/roadmap';
import { generateRoadmap } from '../engine/generateRoadmap';

export type Theme = 'light' | 'dark';
export type View = 'timeline' | 'tree';

interface AppState {
  theme: Theme;
  roadmap: Roadmap | null;
  bookmarks: Record<string, true>; // topicId -> bookmarked
  notes: Record<string, string>; // topicId -> note text
  view: View;
  isGenerating: boolean;

  toggleTheme: () => void;
  setView: (v: View) => void;
  generate: (input: RoadmapInput) => Promise<Roadmap>;
  clearRoadmap: () => void;
  toggleBookmark: (topicId: string) => void;
  setNote: (topicId: string, text: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: (typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light') as Theme,
      roadmap: null,
      bookmarks: {},
      notes: {},
      view: 'timeline',
      isGenerating: false,

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      setView: (view) => set({ view }),

      generate: async (input) => {
        set({ isGenerating: true });
        // Simulate a brief "planning" pass so the loading state is meaningful,
        // while keeping generation fully client-side and deterministic.
        await new Promise((r) => setTimeout(r, 650));
        const roadmap = generateRoadmap(input);
        set({ roadmap, isGenerating: false });
        return roadmap;
      },

      clearRoadmap: () => set({ roadmap: null }),

      toggleBookmark: (topicId) =>
        set((s) => {
          const next = { ...s.bookmarks };
          if (next[topicId]) delete next[topicId];
          else next[topicId] = true;
          return { bookmarks: next };
        }),

      setNote: (topicId, text) =>
        set((s) => {
          const next = { ...s.notes };
          if (text.trim() === '') delete next[topicId];
          else next[topicId] = text;
          return { notes: next };
        }),
    }),
    {
      name: 'roadmap-generator-store',
      partialize: (s) => ({
        theme: s.theme,
        roadmap: s.roadmap,
        bookmarks: s.bookmarks,
        notes: s.notes,
        view: s.view,
      }),
    },
  ),
);

export { generateRoadmap };
