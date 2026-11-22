# `group-card/`

Reusable group summary displayed by the groups page.

- `group-card.component.ts` — accepts a required `Group` plus total and finished counts; emits open, edit, and delete events. A group titled General (case-insensitive after trimming) is marked as default and hides edit/delete buttons. Card clicks emit a defined group ID; action clicks stop propagation so they do not open the card.
- `group-card.component.html` — renders title/tooltip, truncated description, counts, optional creation date, and action buttons. Uses Angular `DatePipe`, shared `TruncatePipe`, and `TooltipDirective`.
- `group-card.component.scss` — card-specific style entry.
- `group-card.component.spec.ts` — component creation spec.
