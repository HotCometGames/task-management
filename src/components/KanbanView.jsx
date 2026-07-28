import React, { useState } from 'react';
import { STATUS_OPTIONS, textColorFor } from '../store.js';

function KanbanCard({ item, groupId, dndEnabled, onSelectItem, onUpdateItemField, onDeleteItem, setDragInfo }) {
  const statusOpt = STATUS_OPTIONS.find((o) => o.label === item.status) || STATUS_OPTIONS[0];

  return (
    <div
      className={'kanban-card' + (!dndEnabled ? ' is-static' : '')}
      draggable={dndEnabled}
      onDragStart={(e) => {
        if (!dndEnabled) return;
        setDragInfo({ itemId: item.id, fromGroupId: groupId, fromStatus: item.status });
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={() => setDragInfo(null)}
    >
      <div className="kanban-card-top">
        <button className="kanban-card-name" onClick={() => onSelectItem(item.id)}>
          {item.name}
        </button>
        <button className="kanban-card-delete" title="Delete item" onClick={() => onDeleteItem(item.id, groupId)}>
          &times;
        </button>
      </div>
      <div className="kanban-card-meta">
        <span
          className="kanban-card-status"
          style={{ backgroundColor: statusOpt.color, color: textColorFor(statusOpt.color) }}
        >
          {item.status}
        </span>
        {item.owner && <span className="kanban-card-owner">{item.owner}</span>}
        {item.dueDate && <span className="kanban-card-date">{item.dueDate}</span>}
      </div>
    </div>
  );
}

function KanbanColumn({ status, items, groupId, dndEnabled, onDrop, onSelectItem, onDeleteItem, setDragInfo }) {
  const [dragOver, setDragOver] = useState(false);
  const opt = STATUS_OPTIONS.find((o) => o.label === status) || STATUS_OPTIONS[0];

  return (
    <div
      className={'kanban-column' + (dragOver ? ' is-drag-over' : '')}
      onDragOver={(e) => {
        if (!dndEnabled) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onDrop(status);
      }}
    >
      <div className="kanban-column-header" style={{ borderBottomColor: opt.color }}>
        <span className="kanban-column-title">{status}</span>
        <span className="kanban-column-count">{items.length}</span>
      </div>
      <div className="kanban-column-cards">
        {items.map((item) => (
          <KanbanCard
            key={item.id}
            item={item}
            groupId={groupId}
            dndEnabled={dndEnabled}
            onSelectItem={onSelectItem}
            onDeleteItem={onDeleteItem}
            setDragInfo={setDragInfo}
          />
        ))}
      </div>
    </div>
  );
}

function SwimlaneRow({ group, dndEnabled, onSelectItem, onUpdateItemField, onDeleteItem, dragInfo, setDragInfo }) {
  const [collapsed, setCollapsed] = useState(false);

  function itemsByStatus(status) {
    return group.items.filter((it) => it.status === status);
  }

  function handleDrop(status, itemId) {
    const item = group.items.find((it) => it.id === itemId);
    if (!item || item.status === status) return;
    onUpdateItemField(itemId, group.id, 'status', status);
  }

  return (
    <div className="swimlane-row">
      <div className="swimlane-header" style={{ borderLeftColor: group.color }}>
        <button className="swimlane-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '\u25B8' : '\u25BE'}
        </button>
        <span className="swimlane-title">{group.name}</span>
        <span className="swimlane-count">{group.items.length}</span>
      </div>
      {!collapsed && (
        <div className="swimlane-body">
          {STATUS_OPTIONS.map((opt) => (
            <KanbanColumn
              key={opt.label}
              status={opt.label}
              items={itemsByStatus(opt.label)}
              groupId={group.id}
              dndEnabled={dndEnabled}
              onDrop={(status) => {
                if (dragInfo) handleDrop(status, dragInfo.itemId);
              }}
              onSelectItem={onSelectItem}
              onDeleteItem={onDeleteItem}
              setDragInfo={setDragInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function KanbanView({
  board,
  groups,
  kanbanGroupMode,
  itemMatchesFilters,
  dndEnabled,
  onSelectItem,
  onUpdateItemField,
  onDeleteItem,
  dragInfo,
  setDragInfo,
}) {
  const allItems = groups.flatMap((g) => g.items.filter(itemMatchesFilters));

  function itemsByStatus(status) {
    return allItems.filter((it) => it.status === status);
  }

  function findItemGroup(itemId) {
    for (const g of groups) {
      if (g.items.some((it) => it.id === itemId)) return g;
    }
    return null;
  }

  function handleStatusDrop(status, itemId) {
    const fromGroup = findItemGroup(itemId);
    if (!fromGroup) return;
    const item = fromGroup.items.find((it) => it.id === itemId);
    if (!item || item.status === status) return;
    onUpdateItemField(itemId, fromGroup.id, 'status', status);
  }

  if (kanbanGroupMode === 'swimlanes') {
    return (
      <div className="kanban-swimlanes">
        {groups.map((group) => (
          <SwimlaneRow
            key={group.id}
            group={group}
            dndEnabled={dndEnabled}
            onSelectItem={onSelectItem}
            onUpdateItemField={onUpdateItemField}
            onDeleteItem={onDeleteItem}
            dragInfo={dragInfo}
            setDragInfo={setDragInfo}
          />
        ))}
        {groups.length === 0 && (
          <div className="empty-state">
            <p>No groups yet.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="kanban-board">
      {STATUS_OPTIONS.map((opt) => (
        <KanbanColumn
          key={opt.label}
          status={opt.label}
          items={itemsByStatus(opt.label)}
          groupId={null}
          dndEnabled={dndEnabled}
          onDrop={(status) => {
            if (dragInfo) handleStatusDrop(status, dragInfo.itemId);
          }}
          onSelectItem={onSelectItem}
          onDeleteItem={onDeleteItem}
          setDragInfo={setDragInfo}
        />
      ))}
      {allItems.length === 0 && (
        <div className="empty-state">
          <p>No items match the current filters.</p>
        </div>
      )}
    </div>
  );
}
