# `bookmark-card/`

Presentation and action control for one bookmark.

- `bookmark-card.component.ts` — requires a `Bookmark`, computes finished/visited flags, and emits visit, finish-toggle, copy, edit, and delete events. Opening a link marks it visited through the parent and opens it in a new tab using `noopener,noreferrer`. Copy reports the URL and briefly sets a copied indicator.
- `bookmark-card.component.html` — displays link title/domain/date, status and visit state, plus action controls; uses `DatePipe` for creation dates.
- `bookmark-card.component.scss` — card-specific styles.
- `bookmark-card.component.spec.ts` — component creation spec.
