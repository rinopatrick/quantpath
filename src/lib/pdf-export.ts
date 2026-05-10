'use client';

import { jsPDF } from 'jspdf';
import skillsData from '@/data/skills.json';
import resourcesData from '@/data/resources.json';
import projectsData from '@/data/projects.json';
import competitionsData from '@/data/competitions.json';

interface UserProgress {
  resourcesCompleted: string[];
  projectsCompleted: string[];
  competitions: Record<string, string>;
  currentWeek: number;
  skills: Record<string, number>;
}

export function exportToPDF(progress: UserProgress) {
  const doc = new jsPDF();
  let y = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue
  doc.text('QuantPath Progress Report', 20, y);
  y += 15;

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Nuclear Engineering → Quantitative Finance', 20, y);
  y += 10;

  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
  y += 15;

  // Overall Progress
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Overall Progress', 20, y);
  y += 10;

  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Resources Completed: ${progress.resourcesCompleted.length}/${resourcesData.resources.length}`, 20, y);
  y += 7;
  doc.text(`Projects Completed: ${progress.projectsCompleted.length}/${projectsData.projects.length}`, 20, y);
  y += 7;
  doc.text(`Competitions Entered: ${Object.keys(progress.competitions).length}/${competitionsData.competitions.length}`, 20, y);
  y += 7;
  doc.text(`Current Week: ${progress.currentWeek}/24`, 20, y);
  y += 15;

  // Skills
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Skill Assessment', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  skillsData.categories.forEach((category) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(category.name, 20, y);
    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    category.skills.forEach((skill) => {
      const level = progress.skills[skill.id] || 0;
      const status = level >= 80 ? '✓' : level >= 50 ? '◐' : '○';
      doc.text(`${status} ${skill.name}: ${level}%`, 25, y);
      y += 5;
    });
    y += 5;
  });

  // Completed Resources
  if (progress.resourcesCompleted.length > 0) {
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Completed Resources', 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    progress.resourcesCompleted.forEach((id) => {
      const resource = resourcesData.resources.find((r) => r.id === id);
      if (resource) {
        doc.text(`• ${resource.title}`, 25, y);
        y += 5;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      }
    });
  }

  // Completed Projects
  if (progress.projectsCompleted.length > 0) {
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Completed Projects', 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    progress.projectsCompleted.forEach((id) => {
      const project = projectsData.projects.find((p) => p.id === id);
      if (project) {
        doc.text(`• ${project.title}`, 25, y);
        y += 5;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      }
    });
  }

  // Competitions
  if (Object.keys(progress.competitions).length > 0) {
    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Competitions', 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    Object.entries(progress.competitions).forEach(([id, status]) => {
      const competition = competitionsData.competitions.find((c) => c.id === id);
      if (competition) {
        doc.text(`• ${competition.name} (${status})`, 25, y);
        y += 5;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      }
    });
  }

  // Nuclear Engineering Highlights
  y += 10;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Nuclear Engineering → Quant', 20, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const nuclearHighlights = [
    'Monte Carlo methods (radiation transport → options pricing)',
    'Differential equations (reactor kinetics → stochastic calculus)',
    'Numerical methods (CFD → finite difference for derivatives)',
    'Risk assessment (nuclear safety → financial risk)',
    'Optimization (fuel cycle → portfolio optimization)',
  ];
  nuclearHighlights.forEach((highlight) => {
    doc.text(`• ${highlight}`, 25, y);
    y += 5;
  });

  // Save
  doc.save('quantpath-progress.pdf');
}
