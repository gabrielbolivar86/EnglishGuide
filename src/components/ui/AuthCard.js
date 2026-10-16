// Tarjeta de acceso compartida por el login docente y el del estudiante.
import { html, useState } from '../../lib/preact.js';
import { Button } from './Button.js';

export function AuthCard({ icon, title, subtitle, placeholder, type = 'text', buttonText, onSubmit, initialError }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(initialError || '');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true); setError('');
    try {
      await onSubmit(value.trim());
    } catch (err) {
      setError(err.message);
      setShake(true); setTimeout(() => setShake(false), 450);
    } finally {
      setLoading(false);
    }
  }

  return html`
    <div class="auth-wrap">
      <form class=${'card auth-card' + (shake ? ' shake' : '')} onSubmit=${submit}>
        <div class="auth-logo" aria-hidden="true">${icon}</div>
        <h1 class="auth-title">${title}</h1>
        <p class="muted">${subtitle}</p>
        <input class="input" type=${type} placeholder=${placeholder} value=${value}
          autocomplete="off" autofocus aria-label=${placeholder}
          onInput=${(e) => setValue(e.currentTarget.value)} />
        <div class="error-text">${error}</div>
        <${Button} variant="primary" size="lg" block loading=${loading} type="submit">${buttonText}<//>
      </form>
    </div>`;
}
