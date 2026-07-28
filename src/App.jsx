import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Toolbar from './components/Toolbar.jsx';
import GroupSection from './components/GroupSection.jsx';
import KanbanView from './components/KanbanView.jsx';
import ItemDetailPanel from './components/ItemDetailPanel.jsx';
import { loadData, saveData, makeId, GROUP_COLORS } from './store.js';

export default function App() {
  const [data, setData] = useState(loadData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [dragInfo, setDragInfo] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [kanbanGroupMode, setKanbanGroupMode] = useState('status');

  useEffect(() => {
    saveData(data);
  }, [data]);

  const activeBoard = data.boards.find((b) => b.id === data.activeBoardId) || data.boards[0];
  const filtersActive = Boolean(search.trim() || statusFilter || priorityFilter);

  const itemCount = useMemo(
    () => activeBoard.groups.reduce((sum, g) => sum + g.items.length, 0),
    [activeBoard]
  );

  function itemMatchesFilters(item) {
    const term = search.trim().toLowerCase();
    if (term && !item.name.toLowerCase().includes(term)) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    if (priorityFilter && item.priority !== priorityFilter) return false;
    return true;
  }

  const filteredCount = useMemo(() => {
    let n = 0;
    activeBoard.groups.forEach((g) => g.items.forEach((it) => { if (itemMatchesFilters(it)) n += 1; }));
    return n;
  }, [activeBoard, search, statusFilter, priorityFilter]);

  function updateActiveBoard(mutator) {
    setData((prev) => ({
      ...prev,
      boards: prev.boards.map((b) => (b.id === prev.activeBoardId ? mutator(b) : b)),
    }));
  }

  // ---- Board actions ----
  function addBoard() {
    const id = makeId('board');
    setData((prev) => ({
      ...prev,
      activeBoardId: id,
      boards: [
        ...prev.boards,
        {
          id,
          name: 'New Board',
          groups: [{ id: makeId('group'), name: 'Group 1', color: GROUP_COLORS[0], collapsed: false, items: [] }],
        },
      ],
    }));
  }

  function selectBoard(boardId) {
    setData((prev) => ({ ...prev, activeBoardId: boardId }));
    setSelectedItemId(null);
  }

  function renameBoard(boardId, name) {
    setData((prev) => ({
      ...prev,
      boards: prev.boards.map((b) => (b.id === boardId ? { ...b, name } : b)),
    }));
  }

  function deleteBoard(boardId) {
    if (!window.confirm('Delete this board and everything on it?')) return;
    setData((prev) => {
      const boards = prev.boards.filter((b) => b.id !== boardId);
      const activeBoardId = prev.activeBoardId === boardId ? boards[0]?.id : prev.activeBoardId;
      return { ...prev, boards, activeBoardId };
    });
  }

  // ---- Group actions ----
  function addGroup() {
    updateActiveBoard((b) => ({
      ...b,
      groups: [
        ...b.groups,
        {
          id: makeId('group'),
          name: 'New Group',
          color: GROUP_COLORS[b.groups.length % GROUP_COLORS.length],
          collapsed: false,
          items: [],
        },
      ],
    }));
  }

  function renameGroup(groupId, name) {
    updateActiveBoard((b) => ({
      ...b,
      groups: b.groups.map((g) => (g.id === groupId ? { ...g, name } : g)),
    }));
  }

  function toggleGroupCollapsed(groupId) {
    updateActiveBoard((b) => ({
      ...b,
      groups: b.groups.map((g) => (g.id === groupId ? { ...g, collapsed: !g.collapsed } : g)),
    }));
  }

  function deleteGroup(groupId) {
    if (!window.confirm('Delete this group and its items?')) return;
    updateActiveBoard((b) => ({ ...b, groups: b.groups.filter((g) => g.id !== groupId) }));
  }

  // ---- Item actions ----
  function addItem(groupId, name) {
    updateActiveBoard((b) => ({
      ...b,
      groups: b.groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              items: [
                ...g.items,
                { id: makeId('item'), name, status: 'Not Started', priority: 'Medium', owner: '', dueDate: '' },
              ],
            }
          : g
      ),
    }));
  }

  function updateItemField(itemId, groupId, field, value) {
    updateActiveBoard((b) => ({
      ...b,
      groups: b.groups.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)) }
          : g
      ),
    }));
  }

  function deleteItem(itemId, groupId) {
    updateActiveBoard((b) => ({
      ...b,
      groups: b.groups.map((g) => (g.id === groupId ? { ...g, items: g.items.filter((it) => it.id !== itemId) } : g)),
    }));
    if (selectedItemId === itemId) setSelectedItemId(null);
  }

  function moveItem(itemId, fromGroupId, toGroupId, toIndex) {
    updateActiveBoard((b) => {
      let movedItem = null;
      const stripped = b.groups.map((g) => {
        if (g.id !== fromGroupId) return g;
        const items = g.items.filter((it) => {
          if (it.id === itemId) {
            movedItem = it;
            return false;
          }
          return true;
        });
        return { ...g, items };
      });
      if (!movedItem) return b;
      const inserted = stripped.map((g) => {
        if (g.id !== toGroupId) return g;
        const items = [...g.items];
        const idx = Math.min(Math.max(toIndex, 0), items.length);
        items.splice(idx, 0, movedItem);
        return { ...g, items };
      });
      return { ...b, groups: inserted };
    });
  }

  // ---- Selected item lookup for the detail panel ----
  let selectedItem = null;
  let selectedItemGroup = null;
  if (selectedItemId) {
    for (const g of activeBoard.groups) {
      const found = g.items.find((it) => it.id === selectedItemId);
      if (found) {
        selectedItem = found;
        selectedItemGroup = g;
        break;
      }
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        boards={data.boards}
        activeBoardId={activeBoard.id}
        onSelect={selectBoard}
        onAddBoard={addBoard}
        onRenameBoard={renameBoard}
        onDeleteBoard={deleteBoard}
      />

      <main className="main-area">
        <Toolbar
          board={activeBoard}
          onRenameBoard={renameBoard}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          onAddGroup={addGroup}
          itemCount={itemCount}
          filteredCount={filteredCount}
          filtersActive={filtersActive}
          viewMode={viewMode}
          setViewMode={setViewMode}
          kanbanGroupMode={kanbanGroupMode}
          setKanbanGroupMode={setKanbanGroupMode}
        />

        {viewMode === 'table' && (
          <div className="group-list">
            {activeBoard.groups.map((group) => (
              <GroupSection
                key={group.id}
                group={group}
                visibleItems={group.items.filter(itemMatchesFilters)}
                dndEnabled={!filtersActive}
                onToggleCollapse={toggleGroupCollapsed}
                onRenameGroup={renameGroup}
                onDeleteGroup={deleteGroup}
                onAddItem={addItem}
                onSelectItem={setSelectedItemId}
                onUpdateItemField={updateItemField}
                onDeleteItem={deleteItem}
                onDropItem={moveItem}
                dragInfo={dragInfo}
                setDragInfo={setDragInfo}
              />
            ))}

            {activeBoard.groups.length === 0 && (
              <div className="empty-state">
                <p>No groups yet.</p>
                <button className="add-group-btn" onClick={addGroup}>
                  + Add a group
                </button>
              </div>
            )}
          </div>
        )}

        {viewMode === 'kanban' && (
          <KanbanView
            board={activeBoard}
            groups={activeBoard.groups}
            kanbanGroupMode={kanbanGroupMode}
            itemMatchesFilters={itemMatchesFilters}
            dndEnabled={!filtersActive}
            onSelectItem={setSelectedItemId}
            onUpdateItemField={updateItemField}
            onDeleteItem={deleteItem}
            dragInfo={dragInfo}
            setDragInfo={setDragInfo}
          />
        )}
      </main>

      {selectedItem && (
        <ItemDetailPanel
          item={selectedItem}
          groupName={selectedItemGroup.name}
          onClose={() => setSelectedItemId(null)}
          onChange={(field, value) => updateItemField(selectedItem.id, selectedItemGroup.id, field, value)}
          onDelete={() => deleteItem(selectedItem.id, selectedItemGroup.id)}
        />
      )}
    </div>
  );
}
