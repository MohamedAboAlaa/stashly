# `shared/pipes/`

Standalone display transforms used by templates.

- `domain.pipe.ts` — `domain` adds an HTTPS scheme when needed, parses the URL, and returns its hostname; empty input becomes an empty string and invalid input is returned as supplied. (The attempted `www.` removal calls `replace` without assigning its result, so `www.` remains.)
- `truncate.pipe.ts` — `truncate` returns empty input unchanged as an empty string, leaves strings at or below the limit intact, and otherwise returns the leading substring plus an ellipsis. Defaults are 50 characters and `...`.
- `*.spec.ts` — pipe instantiation specs.
