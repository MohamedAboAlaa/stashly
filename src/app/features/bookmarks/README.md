# `features/bookmarks/`

Bookmark management route used at `/bookmarks` and `/groups/:groupId/bookmarks`.

- `bookmarks.component.ts` — loads bookmark state and groups, reads `groupId` from route parameters, and maintains group/status/visit/search filters. `sortedBookmarks` orders newest first; `filteredBookmarks` combines active filters and matches search text against title or URL. It handles create/edit/delete dialogs, toggling completion, marking a link visited before opening, clipboard copy, and resetting filters. API failures are routed to the shared business-error modal.
- `bookmarks.component.html` — provides search/filter controls, result/empty states, bookmark cards, and create/edit/delete dialogs. Route filtering is reflected in the group selector; card outputs call the page handlers.
- `bookmarks.component.scss` — page styles.
- `bookmarks.component.spec.ts` — component creation spec.

## Child components

- [`components/bookmark-card/README.md`](components/bookmark-card/README.md) — one bookmark's display and emitted actions.
- [`components/bookmark-form/README.md`](components/bookmark-form/README.md) — create/edit reactive form and validation.
