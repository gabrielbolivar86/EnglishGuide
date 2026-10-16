/**
 * =========================================================
 *  ENGLISH GUIDE — BACKEND UNIFICADO (Google Apps Script)
 * =========================================================
 *  Una sola API para:
 *    - Teacher Center (panel docente)
 *    - Portal del estudiante (Guía + Perfil de Aprendizaje)
 *
 *  Hojas del Google Sheet:
 *    Estudiantes  → registro único de cada alumno (su código = su acceso)
 *    Respuestas   → respuestas del cuestionario de Perfil de Aprendizaje
 *    Archivo      → intentos archivados del cuestionario
 *    Logs         → errores reportados desde el navegador
 *    Bloqueos     → horarios NO disponibles del docente (otras actividades)
 *
 *  Lecciones: el contenido vive en el repo (students/<slug>/lessons/*.js) y la
 *  columna Estudiantes.LeccionesDesbloqueadas (ej: "lesson1,lesson2") decide
 *  cuáles puede ver el estudiante. Se controla desde el Teacher Center.
 *
 *  Todas las llamadas llegan por POST con Content-Type: text/plain
 *  y un body JSON { action: '...', ...params } (evita el preflight CORS).
 *
 *  Funciones para ejecutar a mano desde el editor:
 *    configurarHojas()           → crea/actualiza hojas y encabezados (NO borra datos)
 *    migrarDesdeVersionAnterior()→ copia la hoja "Codigos" antigua a "Estudiantes"
 *    establecerPasswordAdmin()   → guarda la contraseña del docente
 * =========================================================
 */

var SHEETS = {
  EST: 'Estudiantes',
  RESP: 'Respuestas',
  ARCH: 'Archivo',
  LOGS: 'Logs',
  BLOQ: 'Bloqueos'
};

var COLS = {};
COLS[SHEETS.EST] = ['Codigo', 'Nombre', 'Slug', 'Bloques', 'MeetLink', 'Activo', 'FechaCreacion',
                    'EstadoCuestionario', 'FechaInicio', 'FechaFin', 'TiempoTotalSegundos', 'Notas',
                    'LeccionesDesbloqueadas'];
COLS[SHEETS.RESP] = ['Codigo', 'S1_1', 'S1_2', 'S1_3', 'S2_1', 'S2_2', 'S2_3', 'S2_4', 'S2_5',
                     'S3_1', 'S3_2', 'S3_3', 'S3_4', 'UltimaActualizacion'];
COLS[SHEETS.ARCH] = COLS[SHEETS.RESP].concat(['FechaArchivado']);
COLS[SHEETS.LOGS] = ['Timestamp', 'Codigo', 'ErrorCode', 'Contexto', 'Mensaje'];
COLS[SHEETS.BLOQ] = ['Dia', 'Bloque', 'Motivo'];

var PREGUNTAS = COLS[SHEETS.RESP].filter(function (c) { return /^S\d_\d$/.test(c); });
var DIAS_VALIDOS = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
var ESTADO = { PENDIENTE: 'Pendiente', PROGRESO: 'En Progreso', COMPLETADO: 'Completado' };
var TOKEN_TTL_SEG = 6 * 60 * 60; // la sesión docente dura 6 horas

// =======================================================
// CONFIGURACIÓN (ejecutar a mano desde el editor)
// =======================================================

/** Crea las hojas que falten y escribe encabezados. Es seguro ejecutarla varias veces. */
function configurarHojas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(COLS).forEach(function (nombre) {
    var sheet = ss.getSheetByName(nombre) || ss.insertSheet(nombre);
    var headers = COLS[nombre];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else {
      // Agrega columnas nuevas al final si faltan (no toca las existentes)
      var actuales = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      headers.forEach(function (h) {
        if (actuales.indexOf(h) === -1) {
          sheet.getRange(1, sheet.getLastColumn() + 1).setValue(h);
          actuales.push(h);
        }
      });
    }
    sheet.setFrozenRows(1);
  });

  // Bloqueos iniciales (solo si la hoja está vacía): English Connect los martes
  var bloq = ss.getSheetByName(SHEETS.BLOQ);
  if (bloq.getLastRow() === 1) {
    bloq.appendRow(['MAR', 1, 'English Connect']);
    bloq.appendRow(['MAR', 2, 'English Connect']);
    bloq.appendRow(['MAR', 3, 'Ocupado']);
  }
  Logger.log('Hojas listas.');
}

/**
 * Copia los registros de la hoja antigua "Codigos" (proyecto LearningStyle)
 * a "Estudiantes", conservando el mismo código. No borra la hoja antigua.
 */
function migrarDesdeVersionAnterior() {
  configurarHojas();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var viejo = ss.getSheetByName('Codigos');
  if (!viejo) { Logger.log('No existe la hoja "Codigos": nada que migrar.'); return; }

  var registros = leerTabla_(viejo).filas;
  var est = getSheet_(SHEETS.EST);
  var migrados = 0;
  registros.forEach(function (r) {
    if (!r.Codigo) return;
    if (buscarFila_(est, 'Codigo', r.Codigo)) return; // ya existe
    agregarFila_(est, {
      Codigo: String(r.Codigo).toUpperCase(),
      Nombre: r.Nombre,
      Slug: '',
      Bloques: '',
      MeetLink: '',
      Activo: true,
      FechaCreacion: r.FechaCreacion || new Date(),
      EstadoCuestionario: r.Estado || ESTADO.PENDIENTE,
      FechaInicio: r.FechaInicio || '',
      FechaFin: r.FechaFin || '',
      TiempoTotalSegundos: r.TiempoTotalSegundos || 0,
      Notas: 'Migrado desde Codigos'
    });
    migrados++;
  });
  Logger.log('Migrados: ' + migrados + '. Revisa la hoja "Estudiantes" y completa Slug/Bloques/MeetLink desde el Teacher Center.');
}

/** Cambia 'MiClaveSegura123' por tu contraseña, ejecuta una vez y vuelve a poner el texto de ejemplo. */
function establecerPasswordAdmin() {
  PropertiesService.getScriptProperties().setProperty('ADMIN_PASSWORD', 'MiClaveSegura123');
  Logger.log('Contraseña guardada en Propiedades del Script.');
}

// =======================================================
// ENRUTAMIENTO
// =======================================================

var ACCIONES_PUBLICAS = {
  login: function (b) { return loginEstudiante_(b.codigo); },
  iniciarCuestionario: function (b) { return iniciarCuestionario_(b.codigo); },
  guardarBorrador: function (b) { return guardarRespuestas_(b.codigo, b.respuestas, b.deltaSegundos, false); },
  enviarRespuestasFinal: function (b) { return guardarRespuestas_(b.codigo, b.respuestas, b.deltaSegundos, true); },
  logError: function (b) { return registrarLog_(b); },
  adminLogin: function (b) { return adminLogin_(b.password); }
};

var ACCIONES_ADMIN = {
  adminLogout: function (b) { CacheService.getScriptCache().remove('adm_' + b.token); return { ok: true }; },
  listarEstudiantes: function () { return listarEstudiantes_(); },
  crearEstudiante: function (b) { return crearEstudiante_(b.datos || {}); },
  actualizarEstudiante: function (b) { return actualizarEstudiante_(b.codigo, b.datos || {}); },
  obtenerPerfil: function (b) { return { ok: true, perfil: obtenerPerfil_(b.codigo) }; },
  archivarIntento: function (b) { return archivarIntento_(b.codigo); },
  borrarEstudiante: function (b) { return borrarEstudiante_(b.codigo); },
  toggleBloqueo: function (b) { return toggleBloqueo_(b.dia, b.bloque, b.motivo); },
  setLeccion: function (b) { return setLeccion_(b.codigo, b.leccion, b.desbloqueada); }
};

function doPost(e) {
  var respuesta;
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    if (ACCIONES_PUBLICAS[action]) {
      respuesta = ACCIONES_PUBLICAS[action](body);
    } else if (ACCIONES_ADMIN[action]) {
      if (!tokenValido_(body.token)) {
        respuesta = { ok: false, code: 'AUTH', error: 'Tu sesión expiró. Vuelve a ingresar.' };
      } else {
        respuesta = ACCIONES_ADMIN[action](body);
      }
    } else {
      respuesta = { ok: false, error: 'Acción no reconocida: ' + action };
    }
  } catch (err) {
    respuesta = { ok: false, error: err.message };
  }
  return ContentService.createTextOutput(JSON.stringify(respuesta)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, mensaje: 'API English Guide activa.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// =======================================================
// UTILIDADES DE HOJA (todo por nombre de columna, no por posición)
// =======================================================

function getSheet_(nombre) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
  if (!sheet) throw new Error('No existe la hoja "' + nombre + '". Ejecuta configurarHojas() primero.');
  return sheet;
}

function leerTabla_(sheet) {
  var values = sheet.getDataRange().getValues();
  var headers = values.shift() || [];
  var filas = values.map(function (row, i) {
    var obj = { _fila: i + 2 };
    headers.forEach(function (h, j) { obj[h] = row[j]; });
    return obj;
  });
  return { headers: headers, filas: filas };
}

function normCodigo_(c) { return String(c || '').trim().toUpperCase(); }

function buscarFila_(sheet, columna, valor) {
  var t = leerTabla_(sheet);
  var objetivo = normCodigo_(valor);
  for (var i = 0; i < t.filas.length; i++) {
    if (normCodigo_(t.filas[i][columna]) === objetivo) {
      t.filas[i]._headers = t.headers;
      return t.filas[i];
    }
  }
  return null;
}

function agregarFila_(sheet, obj) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map(function (h) { return obj[h] !== undefined ? obj[h] : ''; }));
}

function actualizarCampos_(sheet, fila, cambios) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  Object.keys(cambios).forEach(function (k) {
    var col = headers.indexOf(k);
    if (col !== -1) sheet.getRange(fila, col + 1).setValue(cambios[k]);
  });
}

function conLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function fechaIso_(d) {
  if (!d) return '';
  var f = (d instanceof Date) ? d : new Date(d);
  return isNaN(f.getTime()) ? '' : f.toISOString();
}

function esActivo_(v) {
  return !(v === false || String(v).toUpperCase() === 'FALSE' || v === 0 || v === '0');
}

// =======================================================
// AUTENTICACIÓN DOCENTE (token temporal en caché)
// =======================================================

function adminLogin_(password) {
  var real = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (!real) return { ok: false, error: 'Falta configurar la contraseña (ejecuta establecerPasswordAdmin).' };
  if (password !== real) {
    Utilities.sleep(800); // frena intentos por fuerza bruta
    return { ok: false, error: 'Contraseña incorrecta.' };
  }
  var token = Utilities.getUuid();
  CacheService.getScriptCache().put('adm_' + token, '1', TOKEN_TTL_SEG);
  return { ok: true, token: token };
}

function tokenValido_(token) {
  if (!token) return false;
  return CacheService.getScriptCache().get('adm_' + token) === '1';
}

// =======================================================
// ESTUDIANTE: LOGIN Y CUESTIONARIO
// =======================================================

function datosPublicosEstudiante_(r) {
  return {
    codigo: normCodigo_(r.Codigo),
    nombre: r.Nombre,
    slug: r.Slug || '',
    bloques: r.Bloques || '',
    meetLink: r.MeetLink || '',
    lecciones: listaLecciones_(r.LeccionesDesbloqueadas)
  };
}

function listaLecciones_(str) {
  return String(str || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
}

function leerRespuestas_(codigo) {
  var r = buscarFila_(getSheet_(SHEETS.RESP), 'Codigo', codigo);
  var out = {};
  if (!r) return out;
  PREGUNTAS.forEach(function (p) { if (r[p] !== '' && r[p] !== undefined) out[p] = r[p]; });
  return out;
}

function loginEstudiante_(codigo) {
  codigo = normCodigo_(codigo);
  if (!codigo) return { ok: false, error: 'Ingresa tu código.' };
  var r = buscarFila_(getSheet_(SHEETS.EST), 'Codigo', codigo);
  if (!r) {
    Utilities.sleep(600);
    return { ok: false, error: 'Código no encontrado. Verifica que esté bien escrito.' };
  }
  if (!esActivo_(r.Activo)) return { ok: false, error: 'Tu acceso está desactivado. Consulta con tu profesor.' };

  var estado = r.EstadoCuestionario || ESTADO.PENDIENTE;
  return {
    ok: true,
    estudiante: datosPublicosEstudiante_(r),
    cuestionario: {
      estado: estado,
      respuestas: estado === ESTADO.COMPLETADO ? {} : leerRespuestas_(codigo),
      tiempoAcumulado: r.TiempoTotalSegundos || 0
    }
  };
}

function iniciarCuestionario_(codigo) {
  return conLock_(function () {
    var sheet = getSheet_(SHEETS.EST);
    var r = buscarFila_(sheet, 'Codigo', codigo);
    if (!r) throw new Error('Código no encontrado.');
    if (r.EstadoCuestionario === ESTADO.COMPLETADO) return { ok: false, code: 'YA_COMPLETADO', error: 'El cuestionario ya fue enviado.' };
    if (!r.EstadoCuestionario || r.EstadoCuestionario === ESTADO.PENDIENTE) {
      actualizarCampos_(sheet, r._fila, { EstadoCuestionario: ESTADO.PROGRESO, FechaInicio: new Date() });
    }
    return { ok: true };
  });
}

function guardarRespuestas_(codigo, respuestas, deltaSegundos, esFinal) {
  codigo = normCodigo_(codigo);
  respuestas = respuestas || {};
  return conLock_(function () {
    var sheetEst = getSheet_(SHEETS.EST);
    var est = buscarFila_(sheetEst, 'Codigo', codigo);
    if (!est) throw new Error('Código no encontrado.');
    if (est.EstadoCuestionario === ESTADO.COMPLETADO) {
      return { ok: false, code: 'YA_COMPLETADO', error: 'Este cuestionario ya fue enviado.' };
    }
    if (esFinal) {
      var faltan = PREGUNTAS.filter(function (p) { return !respuestas[p]; });
      if (faltan.length) return { ok: false, error: 'Faltan ' + faltan.length + ' respuesta(s).' };
    }

    var sheetResp = getSheet_(SHEETS.RESP);
    var fila = { Codigo: codigo, UltimaActualizacion: new Date() };
    PREGUNTAS.forEach(function (p) { fila[p] = respuestas[p] !== undefined ? String(respuestas[p]).slice(0, 5000) : ''; });
    var existente = buscarFila_(sheetResp, 'Codigo', codigo);
    if (existente) actualizarCampos_(sheetResp, existente._fila, fila);
    else agregarFila_(sheetResp, fila);

    var delta = Math.max(0, Math.min(Number(deltaSegundos) || 0, 4 * 60 * 60));
    var cambios = { TiempoTotalSegundos: (Number(est.TiempoTotalSegundos) || 0) + delta };
    if (!est.EstadoCuestionario || est.EstadoCuestionario === ESTADO.PENDIENTE) {
      cambios.EstadoCuestionario = ESTADO.PROGRESO;
      cambios.FechaInicio = new Date();
    }
    if (esFinal) {
      cambios.EstadoCuestionario = ESTADO.COMPLETADO;
      cambios.FechaFin = new Date();
    }
    actualizarCampos_(sheetEst, est._fila, cambios);
    return { ok: true };
  });
}

function registrarLog_(b) {
  try {
    agregarFila_(getSheet_(SHEETS.LOGS), {
      Timestamp: new Date(),
      Codigo: normCodigo_(b.codigo),
      ErrorCode: String(b.errorCode || '').slice(0, 80),
      Contexto: String(b.contexto || '').slice(0, 80),
      Mensaje: String(b.mensaje || '').slice(0, 500)
    });
  } catch (e) { /* best effort */ }
  return { ok: true };
}

// =======================================================
// DOCENTE: GESTIÓN DE ESTUDIANTES
// =======================================================

function generarCodigoAleatorio_() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I
  var code = '';
  for (var i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

function slugify_(texto) {
  return String(texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function normalizarBloques_(bloques) {
  // Acepta "MIE-2, VIE-2" o ["MIE-2","VIE-2"] → "MIE-2,VIE-2"
  var lista = Array.isArray(bloques) ? bloques : String(bloques || '').split(',');
  return lista.map(function (b) { return String(b).trim().toUpperCase(); })
    .filter(function (b) {
      var p = b.split('-');
      return p.length === 2 && DIAS_VALIDOS.indexOf(p[0]) !== -1 && /^\d+$/.test(p[1]);
    }).join(',');
}

function listarEstudiantes_() {
  var est = leerTabla_(getSheet_(SHEETS.EST)).filas;
  var resp = leerTabla_(getSheet_(SHEETS.RESP)).filas;
  var respPorCodigo = {};
  resp.forEach(function (r) { respPorCodigo[normCodigo_(r.Codigo)] = r; });

  var estudiantes = est.filter(function (r) { return r.Codigo; }).map(function (r) {
    var codigo = normCodigo_(r.Codigo);
    var estado = r.EstadoCuestionario || ESTADO.PENDIENTE;
    var dominante = null;
    if (estado === ESTADO.COMPLETADO && respPorCodigo[codigo]) {
      dominante = calcularConteo_(respPorCodigo[codigo]).dominante;
    }
    return {
      codigo: codigo,
      nombre: r.Nombre,
      slug: r.Slug || '',
      bloques: r.Bloques || '',
      meetLink: r.MeetLink || '',
      lecciones: listaLecciones_(r.LeccionesDesbloqueadas),
      activo: esActivo_(r.Activo),
      notas: r.Notas || '',
      fechaCreacion: fechaIso_(r.FechaCreacion),
      estadoCuestionario: estado,
      tiempoTotalSegundos: Number(r.TiempoTotalSegundos) || 0,
      perfilDominante: dominante
    };
  }).sort(function (a, b) { return String(a.nombre).localeCompare(String(b.nombre)); });

  var bloqueos = leerTabla_(getSheet_(SHEETS.BLOQ)).filas.filter(function (b) { return b.Dia; }).map(function (b) {
    return { dia: String(b.Dia).toUpperCase(), bloque: Number(b.Bloque), motivo: b.Motivo || '' };
  });

  return { ok: true, estudiantes: estudiantes, bloqueos: bloqueos };
}

function crearEstudiante_(datos) {
  var nombre = String(datos.nombre || '').trim();
  if (!nombre) throw new Error('El nombre no puede estar vacío.');
  return conLock_(function () {
    var sheet = getSheet_(SHEETS.EST);
    var code;
    do { code = generarCodigoAleatorio_(); } while (buscarFila_(sheet, 'Codigo', code));
    agregarFila_(sheet, {
      Codigo: code,
      Nombre: nombre,
      Slug: slugify_(datos.slug || nombre),
      Bloques: normalizarBloques_(datos.bloques),
      MeetLink: String(datos.meetLink || '').trim(),
      Activo: true,
      FechaCreacion: new Date(),
      EstadoCuestionario: ESTADO.PENDIENTE,
      FechaInicio: '', FechaFin: '', TiempoTotalSegundos: 0,
      Notas: String(datos.notas || ''),
      LeccionesDesbloqueadas: ''
    });
    return { ok: true, codigo: code };
  });
}

function actualizarEstudiante_(codigo, datos) {
  return conLock_(function () {
    var sheet = getSheet_(SHEETS.EST);
    var r = buscarFila_(sheet, 'Codigo', codigo);
    if (!r) throw new Error('Estudiante no encontrado.');
    var cambios = {};
    if (datos.nombre !== undefined) {
      if (!String(datos.nombre).trim()) throw new Error('El nombre no puede estar vacío.');
      cambios.Nombre = String(datos.nombre).trim();
    }
    if (datos.slug !== undefined) cambios.Slug = slugify_(datos.slug);
    if (datos.bloques !== undefined) cambios.Bloques = normalizarBloques_(datos.bloques);
    if (datos.meetLink !== undefined) cambios.MeetLink = String(datos.meetLink).trim();
    if (datos.activo !== undefined) cambios.Activo = !!datos.activo;
    if (datos.notas !== undefined) cambios.Notas = String(datos.notas);
    actualizarCampos_(sheet, r._fila, cambios);
    return { ok: true };
  });
}

function archivarIntento_(codigo) {
  return conLock_(function () {
    var sheetResp = getSheet_(SHEETS.RESP);
    var r = buscarFila_(sheetResp, 'Codigo', codigo);
    if (r) {
      var copia = {};
      COLS[SHEETS.RESP].forEach(function (c) { copia[c] = r[c]; });
      copia.FechaArchivado = new Date();
      agregarFila_(getSheet_(SHEETS.ARCH), copia);
      sheetResp.deleteRow(r._fila);
    }
    var sheetEst = getSheet_(SHEETS.EST);
    var e = buscarFila_(sheetEst, 'Codigo', codigo);
    if (!e) throw new Error('Estudiante no encontrado.');
    actualizarCampos_(sheetEst, e._fila, {
      EstadoCuestionario: ESTADO.PENDIENTE, FechaInicio: '', FechaFin: '', TiempoTotalSegundos: 0
    });
    return { ok: true };
  });
}

function borrarEstudiante_(codigo) {
  return conLock_(function () {
    var sheetResp = getSheet_(SHEETS.RESP);
    var r = buscarFila_(sheetResp, 'Codigo', codigo);
    if (r) sheetResp.deleteRow(r._fila);
    var sheetEst = getSheet_(SHEETS.EST);
    var e = buscarFila_(sheetEst, 'Codigo', codigo);
    if (e) sheetEst.deleteRow(e._fila);
    return { ok: true };
  });
}

function setLeccion_(codigo, leccion, desbloqueada) {
  leccion = String(leccion || '').trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(leccion)) throw new Error('Identificador de lección inválido.');
  return conLock_(function () {
    var sheet = getSheet_(SHEETS.EST);
    var r = buscarFila_(sheet, 'Codigo', codigo);
    if (!r) throw new Error('Estudiante no encontrado.');
    var lista = listaLecciones_(r.LeccionesDesbloqueadas).filter(function (l) { return l !== leccion; });
    if (desbloqueada) lista.push(leccion);
    actualizarCampos_(sheet, r._fila, { LeccionesDesbloqueadas: lista.join(',') });
    return { ok: true, lecciones: lista };
  });
}

function toggleBloqueo_(dia, bloque, motivo) {
  dia = String(dia || '').toUpperCase();
  bloque = Number(bloque);
  if (DIAS_VALIDOS.indexOf(dia) === -1 || !bloque) throw new Error('Día o bloque inválido.');
  return conLock_(function () {
    var sheet = getSheet_(SHEETS.BLOQ);
    var filas = leerTabla_(sheet).filas;
    for (var i = 0; i < filas.length; i++) {
      if (String(filas[i].Dia).toUpperCase() === dia && Number(filas[i].Bloque) === bloque) {
        sheet.deleteRow(filas[i]._fila);
        return { ok: true, bloqueado: false };
      }
    }
    sheet.appendRow([dia, bloque, String(motivo || 'Ocupado')]);
    return { ok: true, bloqueado: true };
  });
}

// =======================================================
// RÚBRICA Y PERFIL DE APRENDIZAJE
// =======================================================

var CLAVE_SECCION2 = {
  S2_1: { a: 'P', b: 'A', c: 'V' },
  S2_2: { a: 'V', b: 'A', c: 'P' },
  S2_3: { a: 'V', b: 'P', c: 'A' },
  S2_4: { a: 'V', b: 'P', c: 'A' },
  S2_5: { a: 'A', b: 'P', c: 'V' }
};

var PERFIL_INFO = {
  V: { nombre: 'Visual-Sintético',
       descripcion: 'Procesa la información de lo general a lo particular. Requiere esquemas, mapas mentales, código de colores e infografías de una sola página.' },
  P: { nombre: 'Práctico-Contextual',
       descripcion: 'Procesa desde la acción. Requiere resolver casos, ejemplos reales y simulaciones antes de recibir teoría abstracta.' },
  A: { nombre: 'Analítico-Estructurado',
       descripcion: 'Procesa de forma secuencial. Requiere listas de pasos, tablas comparativas, reglas claras y un temario predecible.' }
};

var CLAVE_SECCION3 = {
  S3_1: {
    a: { titulo: 'Filtro Afectivo Alto', detalle: 'Requiere tiempo de procesamiento individual. No exponer en público sin aviso; dar espacio para escribir respuestas antes de hablar.' },
    b: { titulo: 'Andamiaje Colaborativo', detalle: 'Tolera la presión si se resuelve en equipo. Necesita apoyo guiado paso a paso (I Do, We Do).' },
    c: { titulo: 'Alta Tolerancia al Error', detalle: 'Filtro afectivo bajo. Se beneficia de retroalimentación directa en tiempo real e imprevistos.' }
  },
  S3_2: {
    a: { titulo: 'Motivación de Desempeño / Pragmática', detalle: 'Busca utilidad inmediata. Las clases deben enfocarse en resolver problemas puntuales y casos de uso rápido.' },
    b: { titulo: 'Motivación de Maestría / Conceptual', detalle: 'Busca comprensión profunda. Necesita explicaciones sobre el "porqué" de las cosas antes de pasar a la ejecución.' }
  },
  S3_3: {
    a: { titulo: 'Verificación Práctica', detalle: 'Su criterio de éxito es la ejecución independiente. Usar cuestionarios de evocación y ejercicios sin apuntes.' },
    b: { titulo: 'Verificación Explicativa', detalle: 'Su criterio de éxito es la elaboración. Pedirle que enseñe o sintetice el tema con sus palabras al final de la sesión.' },
    c: { titulo: 'Verificación Intuitiva', detalle: 'Corre el riesgo de caer en la ilusión de saber. Requiere pruebas breves objetivas para validar que la comprensión sea real y no solo una percepción.' }
  },
  S3_4: {
    a: { titulo: 'Mañana', detalle: 'Agendar las sesiones exigentes o los conceptos teóricos nuevos en el bloque de mañana.' },
    b: { titulo: 'Tarde', detalle: 'Agendar las sesiones exigentes o los conceptos teóricos nuevos en el bloque de tarde.' },
    c: { titulo: 'Noche', detalle: 'Agendar las sesiones exigentes o los conceptos teóricos nuevos en el bloque de noche.' }
  }
};

function calcularConteo_(respuestas) {
  var conteo = { V: 0, P: 0, A: 0 };
  Object.keys(CLAVE_SECCION2).forEach(function (q) {
    var letra = CLAVE_SECCION2[q][String(respuestas[q] || '').toLowerCase()];
    if (letra) conteo[letra]++;
  });
  var dominante = Object.keys(conteo).reduce(function (a, b) { return conteo[a] >= conteo[b] ? a : b; });
  return { conteo: conteo, dominante: dominante };
}

function obtenerPerfil_(codigo) {
  var est = buscarFila_(getSheet_(SHEETS.EST), 'Codigo', codigo);
  if (!est) throw new Error('Estudiante no encontrado.');
  var resp = buscarFila_(getSheet_(SHEETS.RESP), 'Codigo', codigo);
  if (!resp) throw new Error('Este estudiante todavía no tiene respuestas registradas.');

  var c = calcularConteo_(resp);
  var seccion3 = {};
  ['S3_1', 'S3_2', 'S3_3', 'S3_4'].forEach(function (q) {
    seccion3[q] = CLAVE_SECCION3[q][String(resp[q] || '').toLowerCase()] || null;
  });

  return {
    nombre: est.Nombre,
    codigo: normCodigo_(codigo),
    estado: est.EstadoCuestionario || ESTADO.PENDIENTE,
    tiempoTotalSegundos: Number(est.TiempoTotalSegundos) || 0,
    respuestasAbiertas: { S1_1: resp.S1_1, S1_2: resp.S1_2, S1_3: resp.S1_3 },
    conteo: c.conteo,
    perfilDominante: { letra: c.dominante, info: PERFIL_INFO[c.dominante] },
    seccion3: seccion3
  };
}
