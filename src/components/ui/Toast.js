// Notificaciones. Envuelve la app con <ToastProvider> y usa:
//   const toast = useToast();  toast('Guardado');  toast('Falló', 'error');
import { html, createContext, useCallback, useContext, useRef, useState } from '../../lib/preact.js';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [t, setT] = useState(null);
  const timer = useRef(null);
  const show = useCallback((msg, tone) => {
    setT({ msg, tone });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setT(null), 3200);
  }, []);
  return html`
    <${ToastContext.Provider} value=${show}>
      ${children}
      <div class=${'toast' + (t ? ' show' : '') + (t?.tone ? ' toast-' + t.tone : '')} role="status">${t?.msg}</div>
    <//>`;
}

export const useToast = () => useContext(ToastContext);
