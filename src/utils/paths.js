// URL absoluta de la raíz del sitio, calculada desde la ubicación de este
// archivo (src/utils/paths.js). Funciona en user-site y project-site de
// GitHub Pages, y en un servidor local.
const ROOT = new URL('../../', import.meta.url).href;
export const siteRoot = () => ROOT;
