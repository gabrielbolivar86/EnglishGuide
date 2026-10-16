// Envoltorio seguro de localStorage / sessionStorage.
// Puede fallar en modo incógnito o con datos de sitio bloqueados.
const area = (name) => { try { return window[name]; } catch { return null; } };

function make(name) {
  return {
    get(key, fallback = null) {
      try { const v = area(name).getItem(key); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, value) { try { area(name).setItem(key, JSON.stringify(value)); } catch {} },
    remove(key) { try { area(name).removeItem(key); } catch {} },
  };
}

export const local = make('localStorage');
export const session = make('sessionStorage');

// Claves usadas en todo el proyecto (un solo lugar para no repetir strings)
export const KEYS = {
  teacherToken: 'eg_teacher_token',
  studentCode: 'eg_student_code',
  quizDraft: (codigo) => 'eg_quiz_draft_' + codigo,
  lessonChecks: (slug, id) => 'eg_checks_' + slug + '_' + id,
};
