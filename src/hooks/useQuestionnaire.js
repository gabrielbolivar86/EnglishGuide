// ==========================================================
// Lógica del cuestionario de Perfil de Aprendizaje
//  - Respuestas guardadas al instante en el dispositivo (localStorage)
//  - Y con retraso (debounce) en el Google Sheet
//  - Tiempo acumulado por sesión (deltaSegundos)
//  - Envío final con código de referencia si falla
// ==========================================================
import { useCallback, useEffect, useRef, useState } from '../lib/preact.js';
import { studentApi } from '../services/api.js';
import { local, KEYS } from '../services/storage.js';
import { ALL_QUESTION_IDS } from '../data/questionnaire.js';
import { useDebouncedCallback } from './useDebouncedCallback.js';
import { errorRef } from '../utils/format.js';

export function useQuestionnaire(codigo, serverAnswers, { readOnly = false } = {}) {
  const [respuestas, setRespuestas] = useState(() => ({
    ...(serverAnswers || {}),
    ...(local.get(KEYS.quizDraft(codigo), {}) || {}),
  }));
  const [saveStatus, setSaveStatus] = useState('');   // '', 'saving', 'saved', 'offline'
  const [submitError, setSubmitError] = useState(null); // { ref, message }
  const [submitting, setSubmitting] = useState(false);
  const lastTick = useRef(null);

  const takeDelta = () => {
    const now = Date.now();
    const delta = lastTick.current ? Math.round((now - lastTick.current) / 1000) : 0;
    lastTick.current = now;
    return delta;
  };

  const start = useCallback(() => {
    lastTick.current = Date.now();
    if (!readOnly) studentApi.iniciarCuestionario(codigo).catch(() => {});
  }, [codigo, readOnly]);

  const saveDraft = useDebouncedCallback(async (data) => {
    if (readOnly) return;
    try {
      await studentApi.guardarBorrador(codigo, data, takeDelta());
      setSaveStatus('saved');
    } catch (e) {
      setSaveStatus('offline');
      studentApi.logError(codigo, errorRef('DRAFT'), 'DRAFT', e.message);
    }
  }, 1200);

  const answer = useCallback((id, value) => {
    setRespuestas((prev) => {
      const next = { ...prev, [id]: value };
      local.set(KEYS.quizDraft(codigo), next);
      return next;
    });
    setSaveStatus('saving');
  }, [codigo]);

  // Dispara el guardado remoto cada vez que cambian las respuestas
  useEffect(() => { if (saveStatus === 'saving') saveDraft(respuestas); }, [respuestas]);

  const missing = ALL_QUESTION_IDS.filter((id) => !respuestas[id]);
  const progress = ((ALL_QUESTION_IDS.length - missing.length) / ALL_QUESTION_IDS.length) * 100;

  const submit = useCallback(async () => {
    if (readOnly) return false;
    setSubmitting(true); setSubmitError(null);
    try {
      await studentApi.enviarFinal(codigo, respuestas, takeDelta());
      local.remove(KEYS.quizDraft(codigo));
      return true;
    } catch (e) {
      if (e.code === 'YA_COMPLETADO') { local.remove(KEYS.quizDraft(codigo)); return true; }
      const ref = errorRef('SUBMIT');
      studentApi.logError(codigo, ref, 'SUBMIT', e.message);
      setSubmitError({ ref, message: e.message });
      return false;
    } finally { setSubmitting(false); }
  }, [codigo, respuestas, readOnly]);

  return { respuestas, answer, start, submit, saveStatus, submitError, submitting, missing, progress };
}
