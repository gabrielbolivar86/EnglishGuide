import { html } from '../../lib/preact.js';
import { AuthCard } from '../../components/ui/index.js';

export function StudentLoginScreen({ onLogin, initialError }) {
  return html`<${AuthCard}
    icon="📘" title="Mi Portal de Inglés"
    subtitle="Ingresa el código que te dio tu profesor."
    placeholder="Ej: A3F9K2" buttonText="Ingresar →"
    initialError=${initialError} onSubmit=${onLogin} />`;
}
