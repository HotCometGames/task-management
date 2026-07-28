import React from 'react';
import InlineEditableText from './InlineEditableText.jsx';
import GitHubWidget from './GitHubWidget.jsx';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../store.js';

export default function Toolbar({
  board,
  onRenameBoard,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onAddGroup,
  itemCount,
  filteredCount,
  filtersActive,
  viewMode,
  setViewMode,
  kanbanGroupMode,
  setKanbanGroupMode,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-top">
        <InlineEditableText
          value={board.name}
          onCommit={(name) => onRenameBoard(board.id, name)}
          className="board-title"
          inputClassName="board-title-input"
        />
        <span className="item-count-badge">
          {filtersActive ? `${filteredCount} of ${itemCount} items` : `${itemCount} items`}
        </span>
        <span className="toolbar-spacer" />
        <GitHubWidget />
      </div>

      <div className="toolbar-controls">
        <input
          className="search-input"
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>

        <select className="filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All priorities</option>
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>

        {filtersActive && (
          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setPriorityFilter('');
            }}
          >
            Clear filters
          </button>
        )}

        <div className="view-mode-group">
          <button
            className={'view-mode-btn' + (viewMode === 'table' ? ' is-active' : '')}
            title="Table view"
            onClick={() => setViewMode('table')}
          >
            ☰
          </button>
          <button
            className={'view-mode-btn' + (viewMode === 'kanban' ? ' is-active' : '')}
            title="Kanban view"
            onClick={() => setViewMode('kanban')}
          >
            ▦
          </button>
        </div>

        {viewMode === 'kanban' && (
          <div className="kanban-mode-toggle">
            <button
              className={'kanban-mode-btn' + (kanbanGroupMode === 'status' ? ' is-active' : '')}
              onClick={() => setKanbanGroupMode('status')}
            >
              By status
            </button>
            <button
              className={'kanban-mode-btn' + (kanbanGroupMode === 'swimlanes' ? ' is-active' : '')}
              onClick={() => setKanbanGroupMode('swimlanes')}
            >
              Swimlanes
            </button>
          </div>
        )}

        <button className="add-group-btn" onClick={onAddGroup}>
          + Add group
        </button>
      </div>
    </div>
  );
}
