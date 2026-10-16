// ==========================================================
// APP DOCENTE (Teacher Center) — punto de entrada
// index.html → monta <TeacherApp /> en #app
// ==========================================================
import { html, render, useCallback } from '../lib/preact.js';
import { ToastProvider, Loading, ErrorState, Button } from '../components/ui/index.js';
import { useTeacherSession } from '../hooks/useTeacherSession.js';
import { useAsync } from '../hooks/useAsync.js';
import { useRouter, Link } from '../navigation/router.js';
import { teacherApi } from '../services/api.js';
import { TeacherLoginScreen } from '../screens/teacher/LoginScreen.js';
import { DashboardScreen } from '../screens/teacher/DashboardScreen.js';
import { StudentDetailScreen } from '../screens/teacher/StudentDetailScreen.js';

const ROUTES = {
  dashboard: '/',
  student: '/estudiante/:codigo',
};

function TeacherShell({ session }) {
  const { token, logout, handleAuthError } = session;
  const { route } = useRouter(ROUTES);
  const { data, error, loading, reload, setData } = useAsync(
    () => teacherApi.listar(token).catch((e) => { handleAuthError(e); throw e; }), [token]);

  // Actualiza un estudiante en memoria sin volver a pedir toda la lista
  const patchStudent = useCallback((codigo, patch) => {
    setData({ ...data, estudiantes: data.estudiantes.map((s) => (s.codigo === codigo ? { ...s, ...patch } : s)) });
  }, [data]);

  let screen;
  if (loading && !data) screen = html`<div class="page"><${Loading} text="Cargando estudiantes…" /></div>`;
  else if (error && !data) screen = html`<div class="page"><${ErrorState} error=${error} onRetry=${reload} /></div>`;
  else {
    const props = { token, data, setData: reload, patchStudent, onAuthError: handleAuthError };
    screen = route.name === 'student'
      ? html`<${StudentDetailScreen} ...${props} codigo=${route.params.codigo} />`
      : html`<${DashboardScreen} ...${props} />`;
  }

  return html`
    <header class="topbar">
      <${Link} to="/" class="brand">
        <span class="brand-logo" aria-hidden="true">🎓</span>
        <span class="brand-name">Teacher Center</span>
      <//>
      <div class="topbar-actions">
        <${Button} variant="ghost" onClick=${reload} loading=${loading} title="Actualizar">⟳ <span class="hide-sm">Actualizar</span><//>
        <${Button} variant="ghost" onClick=${logout} title="Cerrar sesión">🔒 <span class="hide-sm">Salir</span><//>
      </div>
    </header>
    <main>${screen}</main>`;
}

function TeacherApp() {
  const session = useTeacherSession();
  return html`
    <${ToastProvider}>
      ${session.token
        ? html`<${TeacherShell} session=${session} />`
        : html`<${TeacherLoginScreen} onLogin=${session.login} />`}
    <//>`;
}

render(html`<${TeacherApp} />`, document.getElementById('app'));
