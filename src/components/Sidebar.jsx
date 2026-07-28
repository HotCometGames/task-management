import React from 'react';
import InlineEditableText from './InlineEditableText.jsx';

export default function Sidebar({ boards, activeBoardId, onSelect, onAddBoard, onRenameBoard, onDeleteBoard }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">B</span>
        <span className="sidebar-brand-name">Boardwork</span>
      </div>

      <div className="sidebar-section-label">Boards</div>

      <div className="sidebar-board-list">
        {boards.map((board) => (
          <div
            key={board.id}
            className={'sidebar-board-item' + (board.id === activeBoardId ? ' is-active' : '')}
            onClick={() => onSelect(board.id)}
          >
            <span className="sidebar-board-dot" />
            <InlineEditableText
              value={board.name}
              onCommit={(name) => onRenameBoard(board.id, name)}
              className="sidebar-board-name"
              inputClassName="sidebar-board-name-input"
            />
            {boards.length > 1 && (
              <button
                className="sidebar-board-delete"
                title="Delete board"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBoard(board.id);
                }}
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="sidebar-add-board" onClick={onAddBoard}>
        + New board
      </button>

      <div className="sidebar-footer">Data stays on this device (browser local storage).</div>
    </aside>
  );
}
