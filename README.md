# Pathwright — AI Learning Roadmap Generator

A **roadmap planning and study-organization tool** for technical subjects. Tell it
what you want to learn and how you study, and it drafts a dependency-ordered
learning path from your current level to professional level — with realistic time
estimates, a study schedule, revision plan, and interview-focused notes for every
topic.

This is **not** a course platform. There are no videos, quizzes, projects, or
progress tracking. It answers one question well: *what should I learn, in what
order, and how long will it take?*

## Features

- **Personalized generation** based on subject, learning speed, daily study hours,
  current knowledge level, and goal. Higher starting levels skip basics; interview
  goals weight high-yield topics.
- **Dependency-ordered roadmap** grouped into phases (Foundations → Core →
  Intermediate → Advanced → Mastery). Every topic lists its prerequisites,
  subtopics, learning objective, interview concepts, and common mistakes.
- **Honest time estimates** in days, computed from difficulty, effort, your pace,
  and your daily hours. Totals roll up to phase and whole-roadmap durations.
- **Study schedule** — daily, weekly, and monthly plans generated automatically.
- **Revision plan** — daily / weekly / monthly routines plus high-priority
  interview topics.
- **Global search** across topics, subtopics, and interview concepts (press `/`).
- **Bookmarks** and **personal notes** per topic, saved locally on your device.
- **Export** to PDF, Markdown, or printable page.
- **Timeline** and **Tree** views, **light/dark** themes, fully responsive.

## Tech stack

- React 19 + TypeScript
- Vite (build tooling)
- Zustand (state, with `localStorage` persistence)
- jsPDF (client-side PDF export)
- No backend, no external AI API — the generation engine is a deterministic,
  rule-based planner that runs entirely in the browser. Free and open-source
  throughout.

## Architecture

```
src/
  types/roadmap.ts          Domain model (Roadmap, Phase, Topic, Schedule…)
  engine/
    curricula.ts            Data-driven curriculum knowledge base
    generateRoadmap.ts      Pure generation engine (pace math, phases, schedule)
  store/useStore.ts         Zustand store (roadmap, bookmarks, notes, theme)
  utils/exporters.ts        PDF / Markdown / print exporters
  components/               UI (Header, SetupForm, Dashboard, views, search…)
  App.tsx                   App shell and routing between setup ↔ dashboard
```

Business logic (the engine) is fully separated from UI. Adding a new subject is a
pure data change in `curricula.ts` — no engine edits required. Any subject not
matched by a curated curriculum falls back to a comprehensive
programming-language template with the subject name interpolated in.

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Deployment

`npm run build` produces a static `dist/` folder. Deploy it to any static host
(Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, etc.) — no server required.

## Data & privacy

All roadmaps, bookmarks, and notes are stored in your browser's `localStorage`.
Nothing is sent to any server.
