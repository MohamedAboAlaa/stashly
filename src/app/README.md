# `src/app/`

The Angular application layer. It uses standalone components rather than an NgModule. The root component provides the persistent navbar, routed page outlet, and shared business-error dialog.

## Root files

- `app.component.ts` — declares `AppComponent`, imports the navbar, router outlet, and modal, sets the app title, and injects `BusinessErrorService`.
- `app.component.html` — composes the navbar and main router outlet, then binds the shared notice modal to the error signal.
- `app.component.scss` — root-component scoped styles (currently a style entry point with no feature logic).
- `app.routes.ts` — client route table. `/` redirects to dashboard; feature routes use lazy `loadComponent`; group URLs reuse the bookmarks page; wildcard loads the 404 page.
- `app.routes.server.ts` — SSR render policy. Dynamic group routes render on the client; the wildcard route is configured for prerendering.
- `app.config.ts` — browser providers for zone change coalescing, router input binding, client hydration/event replay, and fetch-backed `HttpClient`.
- `app.config.server.ts` — adds server rendering and server route providers, then merges them with the browser app configuration.

## Subfolders

- [`core/README.md`](core/README.md) — shared data contracts and HTTP/business-error services.
- [`features/README.md`](features/README.md) — route-level pages and their child components.
- [`shared/README.md`](shared/README.md) — reusable controls, pipes, and directives.

Files ending in `.spec.ts` are Jasmine specs compiled using `tsconfig.spec.json` and executed through the Angular CLI Karma target.
