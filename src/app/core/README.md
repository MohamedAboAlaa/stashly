# `core/`

Singleton application services and domain contracts. This layer has no UI templates and is imported by route-level features.

## `models/`

- [`models/README.md`](models/README.md) — documents bookmark and group types.

## `services/`

- [`services/README.md`](services/README.md) — documents API methods, client cache behavior, and global business-error state.

The HTTP services currently use `http://localhost:3001` and expect the JSON Server resource names `groups` and `bookmarks`.
