# `shared/directives/`

Standalone attribute directives that add reusable behavior to host elements.

- `tooltip.directive.ts` — `[appTooltip]` accepts a string. On mouse enter with non-empty text it creates a `span.custom-tooltip-box` inside the host; on leave it removes that node. `src/styles.scss` defines its appearance.
- `visited.directive.ts` — `[appVisited]` accepts a boolean input signal and uses an Angular effect plus `Renderer2` to add/remove the `visited-item` class. Global `src/styles.scss` styles that class.
- `*.spec.ts` — lightweight directive instantiation specs.
