// ==========================================================
// NAVEGACIÓN — router por hash (#/ruta), funciona en GitHub Pages
// sin configuración de servidor.
//
//   const { route, navigate } = useRouter();
//   route.name   → nombre de la ruta que coincidió
//   route.params → parámetros (:id)
//
//   <${Link} to="/leccion/lesson1">Abrir<//>
// ==========================================================
import { html, useEffect, useState } from '../lib/preact.js';

function currentPath() {
  return decodeURI(location.hash.replace(/^#/, '')) || '/';
}

function match(routes, path) {
  for (const [name, pattern] of Object.entries(routes)) {
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:([a-zA-Z]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
    const m = path.match(re);
    if (m) return { name, params: Object.fromEntries(keys.map((k, i) => [k, m[i + 1]])), path };
  }
  return { name: 'notFound', params: {}, path };
}

export function navigate(to) {
  location.hash = to;
}

export function useRouter(routes) {
  const [path, setPath] = useState(currentPath());
  useEffect(() => {
    const onChange = () => { setPath(currentPath()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return { route: match(routes, path), navigate };
}

export function Link({ to, class: cls, children, ...rest }) {
  return html`<a href=${'#' + to} class=${cls} ...${rest}>${children}</a>`;
}
