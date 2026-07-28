# AGENTS.md

## Commands

```bash
npm run dev        # Vite dev server, http://localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
```

No lint, typecheck, or test infrastructure exists yet.

## Architecture

- **Single-component state**: All state lives in `App.jsx` via `useState`. No reducers, contexts, or state libraries.
- **Persistence**: `store.js` reads/writes `localStorage` under key `boardwork-data-v1`. Falls back to hardcoded seed data on first load or parse failure.
- **Data model**: `boards[] → groups[] → items[]`. Items have: `name`, `status`, `priority`, `owner`, `dueDate`. Status/priority options are constants in `store.js`.
- **Drag-and-drop**: Disabled whenever search or filter is active (`filtersActive` in `App.jsx`). Intentional — reordering while filtered produces confusing results.
- **ID generation**: `makeId(prefix)` in `store.js` uses `Date.now().toString(36)` + counter. Not collision-resistant across reloads but fine for single-session use.

## View Modes

- **Table** (default): GroupSection components render groups as collapsible cards with item tables.
- **Kanban**: Two sub-modes controlled by `kanbanGroupMode`:
  - `status`: Items from all groups in 4 status columns. Drag between columns to change status.
  - `swimlanes`: Each group is a row with status columns inside. Items stay within their group.
- **Timeline**: Week view with day columns (not yet implemented).

## Gotchas

- Vite config sets `server.port: 5173` explicitly.
- `package.json` uses `"type": "module"` — all config files are ESM.
- No `.env` files exist. No environment variables are used.
- `index.html` loads Google Fonts (Space Grotesk, Inter) — requires internet.
- `window.confirm()` is used for destructive actions (delete board, delete group). No custom modals.
