# Stashly

Stashly is a single-page bookmark organizer built with Angular 19. It lets a user save links, group them, track whether they have been visited or finished, and review activity through a dashboard. The client is a standalone-component Angular application with lazy-loaded routes, signal-based UI state, reactive forms, and a small HTTP-backed JSON Server data store. Angular Universal/SSR support is configured through an Express server.

## Contents

- [Capabilities](#capabilities)
- [Technology and architecture](#technology-and-architecture)
- [Requirements and setup](#requirements-and-setup)
- [Run the app](#run-the-app)
- [Routes and user flows](#routes-and-user-flows)
- [Data model and persistence](#data-model-and-persistence)
- [Source map](#source-map)
- [Build and tests](#build-and-tests)
- [Implementation notes](#implementation-notes)

## Capabilities

- Dashboard metrics for total, finished, pending, newly saved, and recently visited bookmarks, plus total groups.
- Create, edit, and delete bookmark groups.
- Create, edit, delete, search, filter, and sort bookmarks.
- Track bookmark completion (`PENDING` / `FINISHED`) independently from visit state (`UNVISITED` / `VISITED`).
- Reassign bookmarks into a `General` group when another group is removed. The `General` group itself is protected from deletion.
- Copy bookmark URLs and open links in a new tab.
- Responsive desktop and mobile navigation, a light/dark theme toggle, reusable dialogs, tooltips, and visited styling.
- A not-found route and server-side rendering integration.

## Technology and architecture

- **Angular 19** standalone components, router, signals, computed values, and lazy route loading.
- **TypeScript 5.7** with strict TypeScript and Angular template checks.
- **RxJS** for HTTP request composition and asynchronous workflows.
- **JSON Server** as a local REST API, backed by `db.json` on port `3001`.
- **Tailwind CSS 4** and **daisyUI 5** for utility styling, themes, and common controls; component templates contain most layout styles.
- **Angular SSR** with an Express request handler. Dynamic group bookmark pages use client rendering; other routes are configured for prerendering.
- **Jasmine/Karma** for unit/component specs.

The root `AppComponent` renders the navbar, the router outlet, and one global business-error modal. Feature components use `GroupService`, `BookmarkService`, and `BusinessErrorService`. Bookmark records are cached in an Angular signal by `BookmarkService`; group records are fetched by feature components through `GroupService`. Both services currently target the hard-coded local JSON Server origin `http://localhost:3001`.

## Requirements and setup

Install a compatible Node.js/npm environment, then install the locked dependencies from the project root:

```bash
npm install
```

The Angular app and JSON Server are separate processes. Start both in separate terminals:

```bash
npm run json-server
npm start
```

Open `http://localhost:4200`. The API is available at `http://localhost:3001`; JSON Server exposes `/groups` and `/bookmarks` based on `db.json`. The database file is the local development seed and JSON Server writes mutations back to it.

## Run the app

| Command | Purpose |
| --- | --- |
| `npm start` | Run Angular's development server. |
| `npm run json-server` | Start the local REST API on port 3001. |
| `npm run build` | Create the configured production browser/server build under `dist/stashly`. |
| `npm run watch` | Rebuild continuously with development settings. |
| `npm test` | Run Angular unit specs in Karma. |
| `npm run serve:ssr:stashly` | Run the built SSR server at port 4000 by default. Set `PORT` to override. |

The SSR command expects a completed build. The application build has production as its default configuration; `ng serve` defaults to development.

## Routes and user flows

| URL | Page | Behavior |
| --- | --- | --- |
| `/` | Redirect | Redirects to `/dashboard`. |
| `/dashboard` | Dashboard | Shows computed totals and a create-bookmark dialog. |
| `/groups` | Groups | Lists groups, their bookmark counts, and create/edit/delete dialogs. |
| `/bookmarks` | Bookmarks | Shows all bookmarks with search, group/status/visit filters, and CRUD actions. |
| `/groups/:groupId` | Redirect | Redirects to `/groups/:groupId/bookmarks`. |
| `/groups/:groupId/bookmarks` | Filtered bookmarks | Reuses the bookmarks page and initializes its group filter from the route parameter. |
| Any other path | Not found | Shows a 404 page linking back to the dashboard. |

Route components are loaded with `loadComponent`, so feature pages are split from the initial route bundle. The shared navbar links to the dashboard, groups, and all bookmarks.

## Data model and persistence

`src/app/core/models/bookmark.model.ts` defines:

- `Group`: optional `id` and `createdAt`, required `title` and `description`.
- `Bookmark`: optional `id` and `createdAt`, required `title`, `url`, `status`, `groupId`, and `visitStatus`.
- `BookmarkStatus`: `FINISHED` or `PENDING`.
- `VisitStatus`: `VISITED` or `UNVISITED`.

`GroupService` uses `GET/POST/PATCH/DELETE /groups` endpoints. `BookmarkService` uses `GET/POST/PATCH/DELETE /bookmarks`; successful mutations update its in-memory signal cache. New records receive an ISO `createdAt` timestamp. A group deletion creates or finds `General`, deletes the target group, and patches matching bookmarks to the fallback group. This sequence is coordinated by `GroupsComponent`.

The included `db.json` is example/development data, not a production database. For another API host, update the service base URLs and configure the server/environment accordingly. No authentication or multi-user isolation is implemented.

## Source map

```text
src/
├── main.ts, main.server.ts, server.ts   Browser bootstrap and SSR entry points
└── app/
    ├── app.component.*                  Root layout and global error dialog
    ├── app.config*.ts, app.routes*.ts   Client/server providers and routing
    ├── core/                             Models and API/error services
    ├── features/                         Dashboard, groups, bookmarks, 404
    └── shared/                           Navbar, modal, directives, pipes
```

Styles are in `src/tailwind.css`, `src/styles.scss`, and component SCSS files. `src/index.html` is the HTML document shell; `public/` contains static assets. The `tsconfig*.json` files define strict app/spec compilation, while `angular.json` configures browser/server builds and Karma.

Each source folder has its own README with a file-by-file guide. Start at [`src/README.md`](src/README.md), then follow its links into `src/app/`.

## Root-level project files

- `package.json` / `package-lock.json` — npm scripts and exact dependency resolution. Key scripts are listed above.
- `angular.json` — Angular CLI application, production/development build, SSR output, asset/style inclusion, and Karma test target.
- `tsconfig.json` — shared strict TypeScript and Angular template compiler settings; `tsconfig.app.json` and `tsconfig.spec.json` define application and spec compilation inputs.
- `.postcssrc.json` — enables the Tailwind CSS PostCSS plugin used by the stylesheet pipeline.
- `db.json` — JSON Server seed and local mutable data for groups/bookmarks.
- `story.md` — product intent and original feature specification. It describes ideas beyond the current implementation, including multiple URLs per topic and dynamic URL inputs; the implemented model stores one URL per bookmark.
- `draft.txt` — working notes for the bookmark page and card; some names and fields are earlier design notes rather than the current component API.
- `stashly.zip` — repository archive artifact; it is not required by the Angular build or runtime.

## Build and tests

```bash
npm run build
npm test
```

Specs live alongside the components and services as `*.spec.ts`. The configured test runner is Angular CLI's Karma builder with Jasmine. The current specs primarily verify that components/services can be created; review individual specs for coverage before relying on them as behavioral guarantees.

## Implementation notes

- Bookmark filters are combined in the page's `filteredBookmarks` computed value and the display list is sorted newest-first using `createdAt`.
- The dashboard's “saved this week” and “visited this week” counts both use bookmark creation time; “visited this week” does not record a separate visit timestamp.
- The navbar's “Add Quick Link” button is currently presentation-only; bookmark creation is implemented on the dashboard and bookmarks page.
- The theme button toggles a `dark` class on `document.body`; the choice is in-memory and is not persisted between reloads.
- The client error modal is driven by a shared signal. API failures are surfaced to the user through that service, while bookmark loading also logs the underlying error to the console.
