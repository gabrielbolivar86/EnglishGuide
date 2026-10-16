import { html, useEffect, useRef } from '../../lib/preact.js';

/** Modal basado en <dialog>. Se muestra mientras `open` sea true. */
export function Modal({ open, title, onClose, children, footer }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return html`
    <dialog ref=${ref} class="modal" onClose=${onClose} onCancel=${onClose}>
      <div class="modal-head">
        <h2>${title}</h2>
        <button class="btn btn-ghost" onClick=${onClose} aria-label="Cerrar">✕</button>
      </div>
      <div class="modal-body">${open ? children : null}</div>
      ${footer ? html`<div class="modal-foot">${footer}</div>` : null}
    </dialog>`;
}
