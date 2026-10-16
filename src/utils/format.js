export function formatTime(segundos) {
  segundos = Math.round(Number(segundos) || 0);
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  return h ? `${h} h ${m} min` : `${m} min ${s} s`;
}

export function initials(nombre) {
  return String(nombre || '?').trim().split(/\s+/).slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase()).join('');
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('es-BO', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const errorRef = (contexto) => `ERR-${contexto}-${Date.now().toString(36).toUpperCase()}`;

export function slugify(texto) {
  return String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
