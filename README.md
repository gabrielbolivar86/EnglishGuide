# English Guide

Plataforma para mis clases particulares de inglés. Tiene:

- **Teacher Center** (`index.html`): panel docente para estudiantes, horarios, lecciones y perfiles de aprendizaje.
- **Portal del estudiante** (`student/index.html`): el estudiante entra con su código y ve dos pestañas separadas:
  - **Mi Guía**: Meet, meta del mes, semanas y lecciones desbloqueadas.
  - **Perfil de Aprendizaje**: el cuestionario (un solo intento, con autoguardado).
- **Backend** (`backend/`): un solo Google Apps Script que lee y escribe en un Google Sheet.

Frontend hecho con **Preact + htm** (estilo React, sin build). Se publica tal cual en GitHub Pages.

---

## Estructura

```
EnglishGuide/
├─ index.html                     → entrada del Teacher Center
├─ student/index.html             → entrada del portal del estudiante
├─ backend/
│   ├─ Code.gs                    → API única (Apps Script)
│   └─ appsscript.json
├─ students/                      → CONTENIDO: una carpeta por estudiante
│   ├─ _plantilla/                → copiar para un estudiante nuevo
│   └─ keygel-salazar/
│       ├─ plan.json              → meta, semanas y clases
│       └─ lessons/lesson1.js     → cada lección es un componente
└─ src/                           → CÓDIGO de la app
    ├─ config.js                  → URL de la API y bloques horarios
    ├─ lib/preact.js              → Preact + htm (vendorizado, sin CDN)
    ├─ apps/                      → puntos de entrada (teacher.js, student.js)
    ├─ navigation/router.js       → router por hash (#/ruta)
    ├─ screens/                   → pantallas
    │   ├─ teacher/               → Login, Dashboard, StudentDetail
    │   └─ student/               → Login, GuideTab, ProfileTab, LessonScreen
    ├─ components/
    │   ├─ ui/                    → Button, Card, Field, Tabs, Modal, Toast…
    │   ├─ teacher/               → StudentCard, ScheduleGrid, LessonUnlockList…
    │   ├─ student/               → MeetCard, WeekSection, QuestionItem…
    │   └─ lesson/                → bloques para escribir lecciones
    ├─ hooks/                     → useTeacherSession, useStudentSession, useQuestionnaire…
    ├─ services/                  → api.js, plans.js, storage.js
    ├─ data/                      → preguntas del cuestionario, perfiles
    ├─ utils/                     → formato, horarios, rutas
    └─ theme/                     → tokens.css (diseño compartido), teacher.css, student.css, lesson.css
```

**Regla:** `students/` es contenido (lo editas seguido). `src/` es la app (casi nunca hay que tocarla).

---

## Procesos del día a día

### Agregar un estudiante nuevo
1. Teacher Center → **+ Nuevo estudiante**: nombre, horario y link de Meet. Se genera su código.
2. En el repo, copia `students/_plantilla/` como `students/<carpeta>/`. La carpeta aparece en el formulario, por ejemplo `maria-lopez`.
3. Edita su `plan.json` y haz `git push`.
4. Pásale su código. Con ese código entra al portal, ve su guía y llena el cuestionario.

### Escribir una lección (por adelantado)
1. Crea `students/<carpeta>/lessons/lessonN.js`. Puedes copiar una lección existente o la de la plantilla.
2. En `plan.json`, agrega `"leccion": "lessonN"` a la clase que corresponde.
3. Haz `git push`. **El estudiante todavía no la ve.**

### Desbloquear una lección
Teacher Center → estudiante → **Lecciones** → activa el interruptor. Queda visible al instante, sin `git push`.
Con **Vista previa** ves cualquier lección (incluso las ocultas) tal como la verá el estudiante.

### Bloques disponibles para lecciones
Todos se importan desde `src/components/lesson/index.js`:

| Bloque | Uso |
|---|---|
| `LessonHeader` | Título y subtítulo |
| `Section` | Sección numerada con tiempo (`n`, `title`, `minutes`; `tag` + `extra` para práctica individual) |
| `Block` | Tarjeta simple con título |
| `Vocab` | Cuadrícula de vocabulario `[['Wake up','Despertarse'], …]` |
| `ColorLegend`, `Formula`, `Hl` | Código de colores gramatical (`t="connector|subject|verb|complement"`) |
| `Reading`, `Example`, `Exercise` | Texto de lectura, ejemplo, recuadro de ejercicio |
| `WriteLine`, `WriteBox` | Espacios para escribir |
| `WordPicker` | Elegir la palabra correcta, con corrección |
| `Choice` | Opción múltiple con corrección |
| `RadioQuestion` | Opción múltiple sin corrección (para resolver en clase) |
| `Check` | Checkbox de progreso (se recuerda en el dispositivo) |
| `Pause`, `ExtraBanner`, `Goals` | Pausa activa, separador de extras, metas clase/semana/mes |
| `ClassGoal`, `Tip`, `StepsGuide` | Meta destacada al inicio, nota/dato nuevo, guía de pasos |
| `VocabColumns` | Vocabulario en columnas por categoría gramatical |
| `SentenceSlot` | Máquina para combinar oraciones (conjuga el verbo sola) |
| `PartsQuiz` | Identificar Sujeto / Verbo / Predicado de una oración |
| `Timer` | Cronómetro regresivo |
| `WritingCheck` | Escritura con "Revisión Visual" de conectores y verbos |
| `StructuredReading` | Lectura con botón "Ver Estructura" que la colorea |

¿Necesitas un bloque nuevo? Créalo en `src/components/lesson/` y expórtalo en su `index.js`. Queda disponible para todas las lecciones.

---

## Instalación / actualización del backend

Se usa **el mismo Google Sheet y el mismo proyecto de Apps Script** que tenía LearningStyle. Así no se pierden datos y la URL de la API no cambia.

1. Abre el Sheet → Extensiones → Apps Script.
2. Reemplaza todo el contenido de `Code.gs` por `backend/Code.gs`.
3. Ejecuta una vez, en este orden (desde el menú de funciones y ▶️):
   - `configurarHojas`: crea las hojas nuevas (Estudiantes, Archivo, Logs, Bloqueos). **No borra datos.**
   - `migrarDesdeVersionAnterior`: copia los estudiantes de la hoja antigua "Codigos" a "Estudiantes", con el mismo código.
   - `establecerPasswordAdmin`: antes cambia `'MiClaveSegura123'` por tu contraseña. Después de ejecutarla, vuelve a dejar el texto de ejemplo.
4. **Implementar → Administrar implementaciones → ✏️ → Nueva versión → Implementar.** Así la URL de `src/config.js` sigue siendo la misma.
5. En el Teacher Center, abre a cada estudiante migrado y completa su carpeta, horario y Meet.

### Hojas del Sheet
| Hoja | Contenido |
|---|---|
| Estudiantes | Codigo, Nombre, Slug, Bloques, MeetLink, Activo, FechaCreacion, EstadoCuestionario, FechaInicio, FechaFin, TiempoTotalSegundos, Notas, LeccionesDesbloqueadas |
| Respuestas | Codigo, S1_1 … S3_4, UltimaActualizacion |
| Archivo | Igual que Respuestas, más FechaArchivado |
| Logs | Errores reportados desde el navegador |
| Bloqueos | Dia, Bloque, Motivo (horarios no disponibles; también se editan con un clic en el Teacher Center) |

Los horarios usan el formato `DIA-BLOQUE` (`MIE-2,VIE-2`). Los bloques y sus horas se definen en `src/config.js`.

---

## Probar en tu computadora

Como la app usa módulos de JavaScript, **no funciona abriendo el HTML con doble clic** (`file://`). Usa un servidor local:
- VS Code → extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*, o bien
- `npx serve .` en la carpeta del proyecto.

---

## Notas técnicas

- **CORS:** la API se llama con `Content-Type: text/plain` a propósito, porque Apps Script no responde a solicitudes OPTIONS. No lo cambies (`src/services/api.js`).
- **Sesión docente:** la contraseña se comprueba en el backend, que devuelve un token válido por 6 horas. La contraseña ya no aparece en el código del frontend.
- **Privacidad:** el link de Meet y la lista de lecciones desbloqueadas solo llegan después de validar el código. Los archivos de `students/` son públicos en GitHub Pages si alguien conoce la ruta exacta, así que no pongas datos sensibles en ellos.
- **Límites de Apps Script:** las cuotas diarias son por cuenta y quedan muy por encima del uso de una academia particular. Las escrituras usan `LockService` para evitar choques cuando hay usuarios simultáneos.
- **Preact:** `src/lib/preact-htm.standalone.js` viene del paquete npm `htm@3.1.1`. No requiere actualizaciones.
