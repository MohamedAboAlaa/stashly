# `features/dashboard/`

Dashboard route at `/dashboard`.

- `dashboard.component.ts` — initializes bookmark loading and fetches groups. Signal-computed metrics include total, finished, pending, saved in the last seven days, visited in the last seven days, and total groups. The two weekly metrics use `createdAt`; the visited metric additionally requires `visitStatus === 'VISITED'`. It controls a create form and posts new bookmarks through `BookmarkService`, showing failures through `BusinessErrorService`.
- `dashboard.component.html` — renders the greeting, metric cards, link to all bookmarks, and an inline modal containing `BookmarkFormComponent`. The modal passes fetched groups and handles create/cancel events.
- `dashboard.component.scss` — dashboard-scoped styles.
- `dashboard.component.spec.ts` — component creation spec.
