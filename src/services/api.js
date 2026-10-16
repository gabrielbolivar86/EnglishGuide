// ==========================================================
// CLIENTE DE LA API (Apps Script)
// Todas las llamadas usan POST + Content-Type: text/plain para evitar el
// preflight CORS, que Apps Script no soporta. No cambies ese header.
// ==========================================================
import { CONFIG } from '../config.js';

export class ApiError extends Error {
  constructor(message, code) { super(message); this.code = code; }
}

async function call(action, payload = {}) {
  let res;
  try {
    res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...payload, action }),
    });
  } catch (e) {
    throw new ApiError('Sin conexión con el servidor.', 'NETWORK');
  }
  if (!res.ok) throw new ApiError('Error de red: ' + res.status, 'NETWORK');
  const data = await res.json();
  if (!data.ok) throw new ApiError(data.error || 'Error desconocido.', data.code);
  return data;
}

// ---------- Estudiante ----------
export const studentApi = {
  login: (codigo) => call('login', { codigo }),
  iniciarCuestionario: (codigo) => call('iniciarCuestionario', { codigo }),
  guardarBorrador: (codigo, respuestas, deltaSegundos) => call('guardarBorrador', { codigo, respuestas, deltaSegundos }),
  enviarFinal: (codigo, respuestas, deltaSegundos) => call('enviarRespuestasFinal', { codigo, respuestas, deltaSegundos }),
  // Best effort: nunca lanza error
  logError: (codigo, errorCode, contexto, mensaje) =>
    call('logError', { codigo, errorCode, contexto, mensaje }).catch(() => {}),
};

// ---------- Docente (requiere token) ----------
export const teacherApi = {
  login: (password) => call('adminLogin', { password }),
  logout: (token) => call('adminLogout', { token }).catch(() => {}),
  listar: (token) => call('listarEstudiantes', { token }),
  crear: (token, datos) => call('crearEstudiante', { token, datos }),
  actualizar: (token, codigo, datos) => call('actualizarEstudiante', { token, codigo, datos }),
  perfil: (token, codigo) => call('obtenerPerfil', { token, codigo }),
  archivar: (token, codigo) => call('archivarIntento', { token, codigo }),
  borrar: (token, codigo) => call('borrarEstudiante', { token, codigo }),
  toggleBloqueo: (token, dia, bloque, motivo) => call('toggleBloqueo', { token, dia, bloque, motivo }),
  setLeccion: (token, codigo, leccion, desbloqueada) => call('setLeccion', { token, codigo, leccion, desbloqueada }),
};
