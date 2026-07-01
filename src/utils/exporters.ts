import { jsPDF } from 'jspdf';
import type { Roadmap } from '../types/roadmap';

// ---------------------------------------------------------------------------
// Markdown export
// ---------------------------------------------------------------------------
export function buildMarkdown(roadmap: Roadmap, notes: Record<string, string>): string {
  const { input } = roadmap;
  const lines: string[] = [];
  lines.push(`# ${roadmap.subjectLabel} — Learning Roadmap`);
  lines.push('');
  lines.push(`> ${roadmap.summary}`);
  lines.push('');
  lines.push('## Overview');
  lines.push('');
  lines.push(`- **Subject:** ${roadmap.subjectLabel}`);
  lines.push(`- **Starting level:** ${input.knowledge}`);
  lines.push(`- **Learning speed:** ${input.speed}`);
  lines.push(`- **Daily study time:** ${input.dailyHours}`);
  lines.push(`- **Goal:** ${input.goal}`);
  lines.push(`- **Total estimated time:** ${roadmap.totalDays} days (~${Math.round(roadmap.totalDays / 5)} weeks)`);
  lines.push(`- **Total topics:** ${roadmap.totalTopics}`);
  lines.push('');

  roadmap.phases.forEach((phase, i) => {
    lines.push(`## Phase ${i + 1}: ${phase.name}`);
    lines.push('');
    lines.push(`*${phase.objective}*`);
    lines.push('');
    lines.push(`**Duration:** ${phase.estimatedDays} days · **Difficulty:** ${phase.difficulty} · **Topics:** ${phase.topics.length}`);
    lines.push('');

    phase.topics.forEach((t) => {
      lines.push(`### ${t.name}`);
      lines.push('');
      lines.push(`- **Estimated time:** ${t.estimatedDays} days`);
      lines.push(`- **Difficulty:** ${t.difficulty}`);
      lines.push(`- **Interview importance:** ${t.interviewImportance}`);
      if (t.prerequisites.length) lines.push(`- **Prerequisites:** ${t.prerequisites.join(', ')}`);
      lines.push('');
      lines.push(`**Objective:** ${t.learningObjective}`);
      lines.push('');
      lines.push('**Subtopics:**');
      t.subtopics.forEach((s) => lines.push(`- ${s}`));
      lines.push('');
      lines.push('**Interview concepts:**');
      t.interviewConcepts.forEach((c) => lines.push(`- ${c}`));
      lines.push('');
      lines.push('**Common mistakes:**');
      t.commonMistakes.forEach((m) => lines.push(`- ${m}`));
      lines.push('');
      const note = notes[t.id];
      if (note) {
        lines.push('**Your notes:**');
        lines.push('');
        lines.push(`> ${note.replace(/\n/g, '\n> ')}`);
        lines.push('');
      }
    });
  });

  lines.push('## Study Schedule');
  lines.push('');
  lines.push(roadmap.schedule.daily);
  lines.push('');
  roadmap.schedule.weeks.forEach((w) => {
    lines.push(`- **Week ${w.weekNumber}** (${w.focus}, ~${w.hours}h): ${w.topics.join(', ')}`);
  });
  lines.push('');

  lines.push('## Revision Plan');
  lines.push('');
  lines.push('**Daily:**');
  roadmap.revision.daily.forEach((r) => lines.push(`- ${r}`));
  lines.push('');
  lines.push('**Weekly:**');
  roadmap.revision.weekly.forEach((r) => lines.push(`- ${r}`));
  lines.push('');
  lines.push('**Monthly:**');
  roadmap.revision.monthly.forEach((r) => lines.push(`- ${r}`));
  lines.push('');
  lines.push('**High-priority topics to revisit:**');
  roadmap.revision.highPriorityTopics.forEach((t) => lines.push(`- ${t}`));
  lines.push('');

  return lines.join('\n');
}

export function downloadMarkdown(roadmap: Roadmap, notes: Record<string, string>) {
  const md = buildMarkdown(roadmap, notes);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, `${slug(roadmap.subjectLabel)}-roadmap.md`);
}

// ---------------------------------------------------------------------------
// PDF export
// ---------------------------------------------------------------------------
export function downloadPDF(roadmap: Roadmap, notes: Record<string, string>) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ACCENT: [number, number, number] = [10, 109, 138];
  const INK: [number, number, number] = [22, 32, 46];
  const SOFT: [number, number, number] = [80, 92, 108];

  function ensure(space: number) {
    if (y + space > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  }

  function text(str: string, opts: { size?: number; color?: [number, number, number]; bold?: boolean; gap?: number; indent?: number } = {}) {
    const { size = 10, color = INK, bold = false, gap = 4, indent = 0 } = opts;
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(str, contentW - indent) as string[];
    lines.forEach((ln) => {
      ensure(size + 2);
      doc.text(ln, margin + indent, y);
      y += size + 2;
    });
    y += gap;
  }

  // Title
  doc.setFillColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.rect(margin, y, 26, 6, 'F');
  y += 22;
  text(`${roadmap.subjectLabel} — Learning Roadmap`, { size: 20, bold: true, gap: 8 });
  text(roadmap.summary, { size: 10, color: SOFT, gap: 12 });

  text('OVERVIEW', { size: 8, bold: true, color: ACCENT, gap: 6 });
  text(`Starting level: ${roadmap.input.knowledge}    Speed: ${roadmap.input.speed}    Daily: ${roadmap.input.dailyHours}    Goal: ${roadmap.input.goal}`, { size: 9, color: SOFT, gap: 4 });
  text(`Total: ${roadmap.totalDays} days (~${Math.round(roadmap.totalDays / 5)} weeks) across ${roadmap.totalTopics} topics.`, { size: 9, color: SOFT, gap: 14 });

  roadmap.phases.forEach((phase, i) => {
    ensure(60);
    doc.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
    doc.setLineWidth(2);
    doc.line(margin, y - 2, margin + contentW, y - 2);
    y += 10;
    text(`PHASE ${i + 1}: ${phase.name.toUpperCase()}`, { size: 13, bold: true, gap: 3 });
    text(`${phase.objective}`, { size: 9, color: SOFT, gap: 3 });
    text(`${phase.estimatedDays} days · ${phase.difficulty} · ${phase.topics.length} topics`, { size: 8, color: ACCENT, gap: 8 });

    phase.topics.forEach((t) => {
      ensure(40);
      text(`${t.name}  (${t.estimatedDays}d · ${t.difficulty} · interview: ${t.interviewImportance})`, { size: 11, bold: true, gap: 3 });
      text(t.learningObjective, { size: 9, color: SOFT, gap: 4 });
      if (t.prerequisites.length) text(`Prerequisites: ${t.prerequisites.join(', ')}`, { size: 8, color: SOFT, gap: 4, indent: 8 });
      text('Subtopics:', { size: 8, bold: true, gap: 2, indent: 8 });
      text(t.subtopics.join('  ·  '), { size: 8, color: SOFT, gap: 4, indent: 8 });
      text('Interview concepts:', { size: 8, bold: true, gap: 2, indent: 8 });
      t.interviewConcepts.forEach((c) => text(`• ${c}`, { size: 8, color: SOFT, gap: 1, indent: 14 }));
      text('Common mistakes:', { size: 8, bold: true, gap: 2, indent: 8 });
      t.commonMistakes.forEach((m) => text(`• ${m}`, { size: 8, color: SOFT, gap: 1, indent: 14 }));
      const note = notes[t.id];
      if (note) {
        text('Your notes:', { size: 8, bold: true, gap: 2, indent: 8 });
        text(note, { size: 8, color: ACCENT, gap: 4, indent: 14 });
      }
      y += 6;
    });
  });

  // Schedule + revision
  ensure(60);
  doc.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  doc.line(margin, y - 2, margin + contentW, y - 2);
  y += 10;
  text('STUDY SCHEDULE', { size: 13, bold: true, gap: 4 });
  text(roadmap.schedule.daily, { size: 9, color: SOFT, gap: 8 });
  roadmap.schedule.weeks.forEach((w) => {
    text(`Week ${w.weekNumber} (${w.focus}): ${w.topics.join(', ')}`, { size: 8, color: SOFT, gap: 2 });
  });
  y += 8;
  ensure(40);
  text('REVISION PLAN', { size: 13, bold: true, gap: 4 });
  text('Daily: ' + roadmap.revision.daily.join(' '), { size: 8, color: SOFT, gap: 3 });
  text('Weekly: ' + roadmap.revision.weekly.join(' '), { size: 8, color: SOFT, gap: 3 });
  text('Monthly: ' + roadmap.revision.monthly.join(' '), { size: 8, color: SOFT, gap: 3 });

  doc.save(`${slug(roadmap.subjectLabel)}-roadmap.pdf`);
}

export function printRoadmap() {
  window.print();
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
