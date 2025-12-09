// src/components/UI/Sidebar.tsx
import React from 'react';
import { type Category } from '../../api/categoryApi';

interface SidebarProps {
  categories: Category[];
  onSelect: (id: number | null) => void;
  showAllLabel?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, onSelect, showAllLabel }) => {
  return (
    <aside style={{ width: 220, borderRight: '1px solid #ddd', paddingRight: 12 }}>
      <h3 style={{ marginBottom: 12 }}>Danh mục</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {/* Nút hiển thị tất cả sản phẩm */}
        {showAllLabel && (
          <li>
            <button
              onClick={() => onSelect(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold'
              }}
            >
              {showAllLabel}
            </button>
          </li>
        )}

        {/* Danh sách danh mục */}
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => onSelect(cat.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;