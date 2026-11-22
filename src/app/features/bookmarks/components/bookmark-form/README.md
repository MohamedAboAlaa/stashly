# `bookmark-form/`

Reactive bookmark editor shared by the dashboard and bookmarks page.

- `bookmark-form.component.ts` — accepts an optional bookmark and available groups. An effect resets the form when either input changes, defaults new bookmarks to the first group, PENDING, and UNVISITED. Title is required and at most 120 characters; URL is required and must begin with HTTP or HTTPS; group, completion status, and visit status are required. Valid values are trimmed and emitted through `saveCreate` or `saveEdit`. Invalid forms mark all controls touched; `cancel` is a separate output.
- `bookmark-form.component.html` — renders the title, URL, group, status, and visit-status controls, validation feedback, and action buttons.
- `bookmark-form.component.scss` — form-specific styles.
- `bookmark-form.component.spec.ts` — component creation spec.
