# `features/groups/`

Groups route at `/groups`. The page owns group data, derives counts from the bookmark cache, and coordinates create/edit/delete workflows.

- `groups.component.ts` — loads groups and bookmark cache on initialization; exposes loading state, alphabetically sorted groups, and per-group total/finished bookmark counts. It manages a selected group and modal mode (`none`, `form`, `delete`), then delegates persistence to services. Before deletion it prevents removing General, ensures a General group exists, deletes the group, and patches affected bookmarks to General. Errors use `BusinessErrorService`; successful bookmark patches are synchronized to `BookmarkService`'s cache.
- `groups.component.html` — displays loading, empty, or card-grid states and composes `GroupCardComponent`, `GroupFormComponent`, and the shared `ModalComponent`. Delete confirmation explains reassignment to General.
- `groups.component.scss` — groups-page styles.
- `groups.component.spec.ts` — component creation spec.

## Child components

- [`components/group-card/README.md`](components/group-card/README.md) — group summary card and emitted actions.
- [`components/group-form/README.md`](components/group-form/README.md) — reactive create/edit form.
