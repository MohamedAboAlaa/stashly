# `navbar/`

Persistent top navigation rendered by `AppComponent`.

- `navbar.component.ts` — owns signals for mobile-menu visibility and dark-mode state. It toggles/closes the menu and toggles the `dark` class on `document.body`.
- `navbar.component.html` — renders the Stashly mark, active desktop route links, theme button, quick-link button, and collapsible mobile route list. Mobile links close the menu after navigation. The “Add Quick Link” button currently has no click handler.
- `navbar.component.scss` — navbar-scoped styling.
- `navbar.component.spec.ts` — component creation spec.
