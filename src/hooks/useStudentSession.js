// Sesión del estudiante: se identifica con su código.
// Modo vista previa: student/index.html?preview=CODIGO (abierto desde el
// Teacher Center). No guarda la sesión y permite ver lecciones bloqueadas.
import { useCallback, useEffect, useState } from '../lib/preact.js';
import { studentApi } from '../services/api.js';
import { local, KEYS } from '../services/storage.js';
import { getTeacherToken } from './useTeacherSession.js';

const previewCode = new URLSearchParams(location.search).get('preview');

export function useStudentSession() {
  const isPreview = !!previewCode && !!getTeacherToken();
  const [state, setState] = useState({ status: 'checking', data: null, error: null });

  const login = useCallback(async (codigo, { remember = true } = {}) => {
    const res = await studentApi.login(String(codigo).trim().toUpperCase());
    if (remember) local.set(KEYS.studentCode, res.estudiante.codigo);
    setState({ status: 'in', data: res, error: null });
    return res;
  }, []);

  const logout = useCallback(() => {
    local.remove(KEYS.studentCode);
    setState({ status: 'out', data: null, error: null });
    if (isPreview) window.close();
  }, [isPreview]);

  // Refresca datos (por ejemplo, después de enviar el cuestionario)
  const refresh = useCallback(() => login(state.data.estudiante.codigo, { remember: !isPreview }), [state.data, isPreview]);

  useEffect(() => {
    const saved = isPreview ? previewCode : local.get(KEYS.studentCode);
    if (!saved) { setState({ status: 'out', data: null, error: null }); return; }
    login(saved, { remember: !isPreview }).catch((error) => {
      if (!isPreview) local.remove(KEYS.studentCode);
      setState({ status: 'out', data: null, error });
    });
  }, []);

  return { ...state, isPreview, login, logout, refresh };
}
