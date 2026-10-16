import { html } from '../../lib/preact.js';

/**
 * <Button variant="primary|ghost|danger" size="lg" block loading onClick>
 * Con `href` se renderiza como enlace.
 */
export function Button({ variant, size, block, loading, href, class: extra, children, ...rest }) {
  const cls = ['btn', variant && 'btn-' + variant, size && 'btn-' + size, block && 'btn-block', extra]
    .filter(Boolean).join(' ');
  if (href) return html`<a class=${cls} href=${href} ...${rest}>${children}</a>`;
  return html`
    <button class=${cls} disabled=${loading || rest.disabled} ...${rest}>
      ${loading ? html`<span class="spinner" aria-hidden="true"></span>` : null}
      ${children}
    </button>`;
}
