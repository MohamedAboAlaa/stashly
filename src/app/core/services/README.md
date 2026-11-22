# `core/services/`

Root-provided services that centralize REST access, bookmark client state, and user-facing business errors.

- `bookmark.service.ts` — injects `HttpClient` and targets `/bookmarks`. `getBookmarks(forceRefresh)` fetches once into a writable signal and exposes readonly `bookmarks` and `isLoaded` signals; a forced call bypasses the loaded guard. `addBookmark` supplies `createdAt`, posts, and appends the response. `removeBookmark` deletes and removes the matching cached item. `updateBookmark` patches and replaces the matching cache record. `syncUpdatedBookmarks` merges a batch of API results into the cache by string-normalized ID. The initial GET is subscribed to internally, so callers observe state rather than an observable result.
- `group.service.ts` — injects `HttpClient` and targets `/groups`. It exposes observable methods to list, retrieve one, create (adding an ISO timestamp), patch, and delete a group. It does not maintain a group cache.
- `business-error.service.ts` — exposes a signal containing a nullable message. `show(message)` opens the app-level notice; `close()` clears it. `AppComponent` renders the signal through `ModalComponent`.
- `*.spec.ts` — service creation smoke specs; they do not mock or verify REST behavior.
