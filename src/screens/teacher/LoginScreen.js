import { html } from '../../lib/preact.js';
import { AuthCard } from '../../components/ui/index.js';

export function TeacherLoginScreen({ onLogin }) {
  return html`<${AuthCard}
    icon="🎓" title="Teacher Center"
    subtitle="Ingresa tu contraseña para acceder al panel docente."
    type="password" placeholder="Contraseña" buttonText="Ingresar al portal →"
    onSubmit=${onLogin} />`;
}
