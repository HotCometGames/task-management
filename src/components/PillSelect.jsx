import React from 'react';
import { textColorFor } from '../store.js';

export default function PillSelect({ value, options, onChange }) {
  const current = options.find((o) => o.label === value) || options[0];
  return (
    <select
      className="pill-select"
      style={{ backgroundColor: current.color, color: textColorFor(current.color) }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((opt) => (
        <option key={opt.label} value={opt.label} style={{ color: '#1F2430', backgroundColor: '#fff' }}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
