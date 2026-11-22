# `src/`

Application source and static web assets. Angular CLI uses `index.html` as the document shell and `main.ts` as the browser bootstrap. SSR is wired through `main.server.ts` and `server.ts`.

## Files

- `index.html` — document metadata, title, favicon reference, base URL, viewport, and the `<app-root>` mount point.
- `main.ts` — starts the browser application by bootstrapping `AppComponent` with `appConfig`; logs bootstrap errors.
- `main.server.ts` — exports the server bootstrap function, passing the SSR context and server configuration to `bootstrapApplication`.
- `server.ts` — creates the Express SSR host, serves built browser assets with long-lived caching, delegates other requests to `AngularNodeAppEngine`, and exports the handler used by Angular tooling/serverless hosts. When run directly, it listens on `PORT` or `4000`.
- `styles.scss` — global browser rules: smooth scrolling, selection color, themed scrollbars, visited-item styling, and tooltip presentation.
- `tailwind.css` — Tailwind/daisyUI entry point, theme tokens, `dark` variant, animation definitions, body defaults, and shared navigation link styles.

## Subfolders

- [`app/README.md`](app/README.md) — application shell, routing, configuration, features, and shared/core code.
- `public/` — static files copied to the build output. `favicon.ico` is referenced by `index.html`.

`server.ts` contains an example REST endpoint comment only; the actual local REST API is run separately by `json-server` against the root `db.json` file.
