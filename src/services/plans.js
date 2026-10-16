// Carga el plan (guía) de un estudiante desde students/<slug>/plan.json
import { CONFIG } from '../config.js';
import { siteRoot } from '../utils/paths.js';

const cache = new Map();

export async function loadPlan(slug) {
  if (!slug) throw new Error('Este estudiante no tiene carpeta asignada todavía.');
  if (cache.has(slug)) return cache.get(slug);
  const url = `${siteRoot()}${CONFIG.STUDENTS_DIR}/${slug}/plan.json`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`No se encontró ${CONFIG.STUDENTS_DIR}/${slug}/plan.json`);
  const plan = await res.json();
  cache.set(slug, plan);
  return plan;
}

// Todas las clases del plan, en orden, con su semana
export function flattenClasses(plan) {
  return (plan?.semanas || []).flatMap((s, i) =>
    (s.clases || []).map((c) => ({ ...c, semana: i + 1, semanaTitulo: s.titulo })));
}

// Importa dinámicamente el módulo de una lección: students/<slug>/lessons/<id>.js
export function loadLesson(slug, id) {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return Promise.reject(new Error('Lección inválida.'));
  return import(`${siteRoot()}${CONFIG.STUDENTS_DIR}/${slug}/lessons/${id}.js`);
}
