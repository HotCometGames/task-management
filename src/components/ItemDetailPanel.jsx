import React from 'react';
import PillSelect from './PillSelect.jsx';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../store.js';

export default function ItemDetailPanel({ item, groupName, onClose, onChange, onDelete }) {
  if (!item) return null;

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="item-panel">
        <div className="item-panel-header">
          <span className="item-panel-eyebrow">{groupName}</span>
          <button className="item-panel-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <input
          className="item-panel-title"
          value={item.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Item name"
        />

        <div className="item-panel-field">
          <label>Status</label>
          <PillSelect value={item.status} options={STATUS_OPTIONS} onChange={(v) => onChange('status', v)} />
        </div>

        <div className="item-panel-field">
          <label>Priority</label>
          <PillSelect value={item.priority} options={PRIORITY_OPTIONS} onChange={(v) => onChange('priority', v)} />
        </div>

        <div className="item-panel-field">
          <label>Owner</label>
          <input
            className="item-panel-input"
            value={item.owner}
            onChange={(e) => onChange('owner', e.target.value)}
            placeholder="Unassigned"
          />
        </div>

        <div className="item-panel-field">
          <label>Due date</label>
          <input
            type="date"
            className="item-panel-input"
            value={item.dueDate}
            onChange={(e) => onChange('dueDate', e.target.value)}
          />
        </div>

        <button className="item-panel-delete" onClick={onDelete}>
          Delete item
        </button>
      </aside>
    </>
  );
}
