// Sesión del docente: token temporal emitido por el backend (dura 6 h).
import { useCallback, useState } from '../lib/preact.js';
import { teacherApi } from '../services/api.js';
import { local, KEYS } from '../services/storage.js';

export function getTeacherToken() {
  return local.get(KEYS.teacherToken);
}

export function useTeacherSession() {
  const [token, setToken] = useState(getTeacherToken());

  const login = useCallback(async (password) => {
    const res = await teacherApi.login(password);
    local.set(KEYS.teacherToken, res.token);
    setToken(res.token);
  }, []);

  const logout = useCallback(() => {
    if (token) teacherApi.logout(token);
    local.remove(KEYS.teacherToken);
    setToken(null);
  }, [token]);

  // Para usar en catch: si el backend dice que la sesión expiró, cierra sesión.
  const handleAuthError = useCallback((err) => {
    if (err && err.code === 'AUTH') { local.remove(KEYS.teacherToken); setToken(null); return true; }
    return false;
  }, []);

  return { token, login, logout, handleAuthError };
}
