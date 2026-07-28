# Boardwork — local monday.com-style MVP

A small work-management board you run on your own machine. Multiple boards,
groups, items with status/priority/owner/due date, drag-and-drop reordering,
search + filter, and an item detail panel. Data is saved to your browser's
local storage, so it's private to your machine and persists between sessions.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (includes `npm`)

## Run it

```bash
cd task-management
npm install
npm run dev
```

Then open the URL it prints (usually **http://localhost:5173**).

To stop the app, press `Ctrl+C` in the terminal.

## Using it

- **Boards** — sidebar on the left. Click `+ New board` to create one, click
  a board name to switch, click again to rename it, and the `×` to delete it.
- **Groups** — click `+ Add group` on a board. Click a group's title to
  rename it, the arrow to collapse it, or `Delete` to remove it.
- **Items** — type into `+ Add item` at the bottom of a group. Click an
  item's name to open the detail panel and edit all its fields, or use the
  inline status/priority dropdowns and the `×` on a row to delete it quickly.
- **Drag and drop** — grab the `::` handle on the left of a row to reorder
  items within a group or drag them into another group. (Reordering is
  disabled while a search or filter is active — clear it first.)
- **Search & filter** — use the search box and the status/priority dropdowns
  in the toolbar to narrow down what's shown.

## Resetting your data

Your boards are stored under the `boardwork-data-v1` key in your browser's
local storage for this page. To start fresh, open your browser's dev tools
(`F12`), go to Application/Storage → Local Storage, and delete that key —
or just run this in the browser console while the app is open:

```js
localStorage.removeItem('boardwork-data-v1');
location.reload();
```

## Project structure

```
monday-mvp/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx            # state + top-level layout
    ├── store.js            # data model, seed data, localStorage persistence
    ├── styles.css
    └── components/
        ├── Sidebar.jsx
        ├── Toolbar.jsx
        ├── GroupSection.jsx
        ├── ItemDetailPanel.jsx
        ├── PillSelect.jsx
        └── InlineEditableText.jsx
```

## Notes on this MVP

This is intentionally scoped small: one item type, no auth, no multi-user
sync, no automations. It's a solid base to extend — e.g. swap
`localStorage` persistence in `store.js` for a small backend (SQLite +
Express, or similar) if you want it accessible from multiple devices.
