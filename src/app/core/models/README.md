# `core/models/`

Shared TypeScript data shapes used by service responses, form payloads, and feature components.

- `bookmark.model.ts` — declares `BookmarkStatus` (`FINISHED | PENDING`) and `VisitStatus` (`VISITED | UNVISITED`). `Group` has optional string-or-number `id` and optional ISO `createdAt`, plus required `title` and `description`. `Bookmark` has optional `id`/`createdAt`, required `title`/`url`, both status fields, and a string-or-number `groupId`. The model is compile-time typing only; it does not validate API JSON at runtime.
