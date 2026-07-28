const STORAGE_KEY = 'boardwork-data-v1';

export const STATUS_OPTIONS = [
  { label: 'Not Started', color: '#B7BAC5' },
  { label: 'Working on it', color: '#F5A623' },
  { label: 'Stuck', color: '#E4573D' },
  { label: 'Done', color: '#2FB380' },
];

export const PRIORITY_OPTIONS = [
  { label: 'Low', color: '#8FA6D6' },
  { label: 'Medium', color: '#F2B84B' },
  { label: 'High', color: '#EF7B45' },
  { label: 'Critical', color: '#D64550' },
];

export const GROUP_COLORS = ['#4B4FE0', '#2FB380', '#F5A623', '#E4573D', '#6B7080', '#A13D9E'];

let counter = 0;
export function makeId(prefix = 'id') {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

function seedData() {
  return {
    activeBoardId: 'board_1',
    boards: [
      {
        id: 'board_1',
        name: 'Product Launch',
        groups: [
          {
            id: 'group_1',
            name: 'To Do',
            color: GROUP_COLORS[4],
            collapsed: false,
            items: [
              {
                id: makeId('item'),
                name: 'Draft landing page copy',
                status: 'Not Started',
                priority: 'Medium',
                owner: 'Sam',
                dueDate: '',
              },
              {
                id: makeId('item'),
                name: 'Set up analytics',
                status: 'Not Started',
                priority: 'Low',
                owner: '',
                dueDate: '',
              },
            ],
          },
          {
            id: 'group_2',
            name: 'In Progress',
            color: GROUP_COLORS[2],
            collapsed: false,
            items: [
              {
                id: makeId('item'),
                name: 'Design onboarding flow',
                status: 'Working on it',
                priority: 'High',
                owner: 'Jamie',
                dueDate: '',
              },
            ],
          },
          {
            id: 'group_3',
            name: 'Done',
            color: GROUP_COLORS[1],
            collapsed: false,
            items: [
              {
                id: makeId('item'),
                name: 'Register domain',
                status: 'Done',
                priority: 'Low',
                owner: 'Sam',
                dueDate: '',
              },
            ],
          },
        ],
      },
    ],
  };
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedData();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.boards) || parsed.boards.length === 0) return seedData();
    return parsed;
  } catch (e) {
    console.warn('Could not read saved data, starting fresh.', e);
    return seedData();
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save data.', e);
  }
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY);
}

// Returns '#1F2430' or '#FFFFFF' depending on which reads better on the given hex background.
export function textColorFor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#1F2430' : '#FFFFFF';
}
