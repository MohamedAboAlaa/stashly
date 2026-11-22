# `modal/`

Generic dialog wrapper with caller-provided content.

- `modal.component.ts` — standalone component with `isOpen` and `size` inputs (`sm`, `md`, `lg`, `xl`) and a `close` output. It emits close on backdrop click, close-button click, or Escape while open. It exposes `ModalMode` (`none`, `form`, `delete`) for feature pages to model their own dialog states.
- `modal.component.html` — conditionally renders the dialog, header, scrollable body, and footer. Named content projection uses `[modal-header]` and `[modal-footer]`; clicks inside the dialog do not bubble to the backdrop.
- `modal.component.scss` — modal-scoped styles.
- `modal.component.spec.ts` — component creation spec.
