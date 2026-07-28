import React, { useState } from 'react';
import InlineEditableText from './InlineEditableText.jsx';
import PillSelect from './PillSelect.jsx';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../store.js';

export default function GroupSection({
  group,
  visibleItems,
  dndEnabled,
  onToggleCollapse,
  onRenameGroup,
  onDeleteGroup,
  onAddItem,
  onSelectItem,
  onUpdateItemField,
  onDeleteItem,
  onDropItem,
  dragInfo,
  setDragInfo,
}) {
  const [newItemName, setNewItemName] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState(null);

  function submitNewItem() {
    const trimmed = newItemName.trim();
    if (!trimmed) return;
    onAddItem(group.id, trimmed);
    setNewItemName('');
  }

  function handleRowDrop(e, index) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(null);
    if (!dragInfo) return;
    onDropItem(dragInfo.itemId, dragInfo.fromGroupId, group.id, index);
    setDragInfo(null);
  }

  return (
    <section className="group-section">
      <div className="group-header" style={{ borderLeftColor: group.color }}>
        <button className="group-collapse-btn" onClick={() => onToggleCollapse(group.id)}>
          {group.collapsed ? '\u25B8' : '\u25BE'}
        </button>
        <InlineEditableText
          value={group.name}
          onCommit={(name) => onRenameGroup(group.id, name)}
          className="group-title"
          inputClassName="group-title-input"
        />
        <span className="group-item-count">{visibleItems.length}</span>
        <button className="group-delete-btn" title="Delete group" onClick={() => onDeleteGroup(group.id)}>
          Delete
        </button>
      </div>

      {!group.collapsed && (
        <div className="group-body">
          <div className="item-table-head">
            <span className="col-name">Item</span>
            <span className="col-status">Status</span>
            <span className="col-priority">Priority</span>
            <span className="col-owner">Owner</span>
            <span className="col-date">Due date</span>
            <span className="col-actions" />
          </div>

          <div
            className="item-list"
            onDragOver={(e) => dndEnabled && e.preventDefault()}
            onDrop={(e) => dndEnabled && handleRowDrop(e, visibleItems.length)}
          >
            {visibleItems.map((item, index) => (
              <div
                key={item.id}
                className={
                  'item-row' +
                  (dragOverIndex === index ? ' is-drag-over' : '') +
                  (!dndEnabled ? ' is-static' : '')
                }
                draggable={dndEnabled}
                onDragStart={(e) => {
                  if (!dndEnabled) return;
                  setDragInfo({ itemId: item.id, fromGroupId: group.id });
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragEnd={() => setDragInfo(null)}
                onDragOver={(e) => {
                  if (!dndEnabled) return;
                  e.preventDefault();
                  setDragOverIndex(index);
                }}
                onDrop={(e) => dndEnabled && handleRowDrop(e, index)}
              >
                {dndEnabled && <span className="drag-handle">::</span>}
                <button className="col-name item-name-btn" onClick={() => onSelectItem(item.id)}>
                  {item.name}
                </button>
                <span className="col-status">
                  <PillSelect
                    value={item.status}
                    options={STATUS_OPTIONS}
                    onChange={(val) => onUpdateItemField(item.id, group.id, 'status', val)}
                  />
                </span>
                <span className="col-priority">
                  <PillSelect
                    value={item.priority}
                    options={PRIORITY_OPTIONS}
                    onChange={(val) => onUpdateItemField(item.id, group.id, 'priority', val)}
                  />
                </span>
                <span className="col-owner">{item.owner || '\u2014'}</span>
                <span className="col-date">{item.dueDate || '\u2014'}</span>
                <span className="col-actions">
                  <button className="row-delete-btn" title="Delete item" onClick={() => onDeleteItem(item.id, group.id)}>
                    &times;
                  </button>
                </span>
              </div>
            ))}

            {!dndEnabled && visibleItems.length > 0 && (
              <div className="dnd-disabled-hint">Clear filters to drag and reorder items.</div>
            )}
          </div>

          <div className="add-item-row">
            <input
              className="add-item-input"
              placeholder="+ Add item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitNewItem();
              }}
            />
            <button className="add-item-btn" onClick={submitNewItem}>
              Add
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
