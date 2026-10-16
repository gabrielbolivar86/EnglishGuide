// ==========================================================
// APP DEL ESTUDIANTE — punto de entrada
// student/index.html → monta <StudentApp /> en #app
// Rutas:  #/          → Mi Guía
//         #/perfil    → Perfil de Aprendizaje
//         #/leccion/X → Lección X
// ==========================================================
import { html, render, useCallback } from '../lib/preact.js';
import { ToastProvider, Loading, Tabs, Button } from '../components/ui/index.js';
import { useStudentSession } from '../hooks/useStudentSession.js';
import { useRouter, navigate } from '../navigation/router.js';
import { StudentLoginScreen } from '../screens/student/LoginScreen.js';
import { GuideTab } from '../screens/student/GuideTab.js';
import { ProfileTab } from '../screens/student/ProfileTab.js';
import { LessonScreen } from '../screens/student/LessonScreen.js';

const ROUTES = {
  guide: '/',
  profile: '/perfil',
  lesson: '/leccion/:id',
};

function StudentShell({ session }) {
  const { route } = useRouter(ROUTES);
  const { estudiante, cuestionario } = session.data;
  const isUnlocked = useCallback(
    (id) => session.isPreview || estudiante.lecciones.includes(id), [estudiante, session.isPreview]);

  if (route.name === 'lesson') {
    return html`<${LessonScreen} estudiante=${estudiante} lessonId=${route.params.id}
      isUnlocked=${isUnlocked} isPreview=${session.isPreview} />`;
  }

  const tab = route.name === 'profile' ? 'profile' : 'guide';
  const pendiente = cuestionario.estado !== 'Completado';

  return html`
    <div class="student-page">
      ${session.isPreview ? html`<div class="preview-bar">👁️ Vista previa del profesor — así ve el portal ${estudiante.nombre}</div>` : null}
      <header class="hero">
        <div>
          <span class="eyebrow">Mi portal de inglés</span>
          <h1>Hola, ${estudiante.nombre.split(' ')[0]} 👋</h1>
        </div>
        <${Button} variant="ghost" onClick=${session.logout}>Salir<//>
      </header>
      <${Tabs} value=${tab} onChange=${(id) => navigate(id === 'profile' ? '/perfil' : '/')}
        items=${[
          { id: 'guide', label: 'Mi Guía', icon: '📘' },
          { id: 'profile', label: 'Perfil de Aprendizaje' + (pendiente ? ' •' : ''), icon: '🧭' },
        ]} />
      <div class="tab-body">
        ${tab === 'guide'
          ? html`<${GuideTab} estudiante=${estudiante} isUnlocked=${isUnlocked} />`
          : html`<${ProfileTab} codigo=${estudiante.codigo} nombre=${estudiante.nombre}
              cuestionario=${cuestionario} isPreview=${session.isPreview} onCompleted=${session.refresh} />`}
      </div>
    </div>`;
}

function StudentApp() {
  const session = useStudentSession();
  return html`
    <${ToastProvider}>
      ${session.status === 'checking' ? html`<div class="auth-wrap"><${Loading} /></div>`
        : session.status === 'in' ? html`<${StudentShell} session=${session} />`
        : html`<${StudentLoginScreen} onLogin=${(c) => session.login(c)} initialError=${session.error?.message} />`}
    <//>`;
}

render(html`<${StudentApp} />`, document.getElementById('app'));
