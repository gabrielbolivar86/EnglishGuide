import { SCHEDULE } from '../config.js';

export const parseBloques = (str) =>
  String(str || '').split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);

// "MIE-2,VIE-2" → "Mié y Vie (19:30 - 21:00)"
export function describeSchedule(str, { largo = false } = {}) {
  const items = parseBloques(str);
  if (!items.length) return 'Sin horario asignado';
  const porBloque = {};
  items.forEach((it) => { const [d, b] = it.split('-'); (porBloque[b] ||= []).push(d); });
  return Object.keys(porBloque).map((b) => {
    const bloque = SCHEDULE.bloques.find((x) => String(x.id) === b);
    const dias = SCHEDULE.dias.filter((d) => porBloque[b].includes(d.id)).map((d) => (largo ? d.largo : d.corto));
    const txt = dias.length > 1 ? dias.slice(0, -1).join(', ') + ' y ' + dias.at(-1) : dias[0];
    return txt + (bloque ? ` (${bloque.inicio} - ${bloque.fin})` : '');
  }).join(' · ');
}
