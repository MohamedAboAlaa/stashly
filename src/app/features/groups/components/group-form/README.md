# `group-form/`

Standalone reactive form used for both group creation and editing.

- `group-form.component.ts` — accepts an optional group and resets/patches its form when the input changes. Title is required, 2–80 characters; description is required, 5–250 characters. On valid submit it trims both fields and emits `save`; invalid submissions mark all fields touched. `cancel` is emitted separately.
- `group-form.component.html` — renders title and description controls, validation feedback, and submit/cancel controls. The form ID is used by the parent modal footer submit button.
- `group-form.component.scss` — form-specific styling.
- `group-form.component.spec.ts` — component creation spec.
