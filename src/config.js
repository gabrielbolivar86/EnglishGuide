// ==========================================================
// CONFIGURACIÓN GLOBAL — English Guide
// ==========================================================
// API_URL: Web App de Apps Script (termina en /exec).
// Al publicar con "Administrar implementaciones → Editar → Nueva versión"
// la URL se mantiene igual.
// ==========================================================
export const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycby142yA1JJ5eM7-uGTi6LH91n1P8JA4H7Cgs-YJdfX6VPI5ftBm2KKRRAa2zmJ59odH5w/exec',

  // Carpeta (relativa a la raíz del sitio) donde vive cada estudiante.
  STUDENTS_DIR: 'students',
};

// Bloques de clase. En la hoja Estudiantes, la columna "Bloques" usa el
// formato DIA-BLOQUE separado por comas, ej: "MIE-2,VIE-2".
export const SCHEDULE = {
  dias: [
    { id: 'LUN', corto: 'Lun', largo: 'Lunes' },
    { id: 'MAR', corto: 'Mar', largo: 'Martes' },
    { id: 'MIE', corto: 'Mié', largo: 'Miércoles' },
    { id: 'JUE', corto: 'Jue', largo: 'Jueves' },
    { id: 'VIE', corto: 'Vie', largo: 'Viernes' },
    { id: 'SAB', corto: 'Sáb', largo: 'Sábado' },
  ],
  bloques: [
    { id: 1, inicio: '18:00', fin: '19:30' },
    { id: 2, inicio: '19:30', fin: '21:00' },
    { id: 3, inicio: '21:00', fin: '22:30' },
  ],
};
