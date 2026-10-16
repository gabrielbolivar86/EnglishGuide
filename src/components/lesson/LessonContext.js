import { createContext } from '../../lib/preact.js';
// { slug, lessonId } de la lección abierta (lo usan los bloques que guardan progreso)
export const LessonContext = createContext({ slug: '', lessonId: '' });
