import React, { useState } from 'react'

interface MarqueeItem {
  id: number
  text: string
  color: number
}

interface ItemManagerProps {
  items: MarqueeItem[]
  onItemsChange: (items: MarqueeItem[]) => void
}

const initialItems: MarqueeItem[] = [
  { id: 1, text: '1. Welcome to React Marquee Master! 🎉', color: 1 },
  { id: 2, text: '2. This is a smooth scrolling text component', color: 2 },
  { id: 3, text: '3. Built with TypeScript and React', color: 3 },
  { id: 4, text: '4. Perfect for announcements and news', color: 4 },
  { id: 5, text: '5. Easy to customize and use', color: 1 },
]

export const ItemManager: React.FC<ItemManagerProps> = ({ items, onItemsChange }) => {
  const [newItemText, setNewItemText] = useState('')
  const [newItemColor, setNewItemColor] = useState(1)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: MarqueeItem = {
        id: Date.now(),
        text: newItemText.trim(),
        color: newItemColor,
      }
      onItemsChange([...items, newItem])
      setNewItemText('')
      setNewItemColor(1)
    }
  }

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      onItemsChange(items.filter(item => item.id !== id))
    }
  }

  const handleEditItem = (id: number) => {
    const item = items.find(item => item.id === id)
    if (item) {
      setEditingItem(id)
      setEditText(item.text)
    }
  }

  const handleSaveEdit = (id: number) => {
    if (editText.trim()) {
      onItemsChange(items.map(item => (item.id === id ? { ...item, text: editText.trim() } : item)))
      setEditingItem(null)
      setEditText('')
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditText('')
  }

  const handleColorChange = (id: number, color: number) => {
    onItemsChange(items.map(item => (item.id === id ? { ...item, color } : item)))
  }

  const handleResetToDefault = () => {
    onItemsChange([...initialItems])
  }

  return (
    <div className="demo-section">
      <h3
        style={{
          marginTop: '0',
          marginBottom: '16px',
          color: '#2c3e50',
          fontSize: '20px',
          fontWeight: '600',
        }}
      >
        🎯 Item Manager - Shared Across All Marquees
      </h3>
      <p
        style={{
          color: '#6c757d',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        Add, edit, and manage items here. Changes will affect all marquees below.
      </p>

      <div className="controls">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            value={newItemText}
            onChange={e => setNewItemText(e.target.value)}
            placeholder="Enter new item text..."
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #e1e5e9',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#007bff'
              e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.1)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e1e5e9'
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
            }}
          />
          <select
            value={newItemColor}
            onChange={e => setNewItemColor(Number(e.target.value))}
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #e1e5e9',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#007bff'
              e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.1)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#e1e5e9'
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <option value={1}>Blue-Purple</option>
            <option value={2}>Pink-Red</option>
            <option value={3}>Blue-Cyan</option>
            <option value={4}>Green-Cyan</option>
          </select>
          <button
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,123,255,0.3)',
              opacity: !newItemText.trim() ? 0.6 : 1,
            }}
            onMouseEnter={e => {
              if (newItemText.trim()) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.4)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,123,255,0.3)'
            }}
          >
            ➕ Add Item
          </button>
          <button
            onClick={handleResetToDefault}
            style={{
              padding: '10px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(108,117,125,0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(108,117,125,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(108,117,125,0.3)'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Item List */}
      <div
        style={{
          maxHeight: '250px',
          overflowY: 'auto',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {items.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: editingItem === item.id ? '#e9ecef' : 'transparent',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              marginBottom: '8px',
            }}
          >
            {editingItem === item.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '5px',
                    border: '1px solid #e1e5e9',
                    fontSize: '13px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#007bff'
                    e.target.style.boxShadow = '0 0 0 2px rgba(0,123,255,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e1e5e9'
                    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
                <button
                  onClick={() => handleSaveEdit(item.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(40,167,69,0.3)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(40,167,69,0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(40,167,69,0.3)'
                  }}
                >
                  ✅ Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(108,117,125,0.3)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(108,117,125,0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(108,117,125,0.3)'
                  }}
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <>
                <span style={{ flex: 1, fontWeight: '500' }}>{item.text}</span>
                <select
                  value={item.color}
                  onChange={e => handleColorChange(item.id, Number(e.target.value))}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '5px',
                    border: '1px solid #e1e5e9',
                    fontSize: '13px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#007bff'
                    e.target.style.boxShadow = '0 0 0 2px rgba(0,123,255,0.1)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#e1e5e9'
                    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <option value={1}>Blue-Purple</option>
                  <option value={2}>Pink-Red</option>
                  <option value={3}>Blue-Cyan</option>
                  <option value={4}>Green-Cyan</option>
                </select>
                <button
                  onClick={() => handleEditItem(item.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,123,255,0.3)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,123,255,0.3)'
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={items.length <= 1}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: items.length <= 1 ? '#6c757d' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: items.length <= 1 ? '0 2px 4px rgba(108,117,125,0.3)' : '0 2px 4px rgba(220,53,69,0.3)',
                    opacity: items.length <= 1 ? 0.6 : 1,
                  }}
                  onMouseEnter={e => {
                    if (items.length > 1) {
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(220,53,69,0.4)'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow =
                      items.length <= 1 ? '0 2px 4px rgba(108,117,125,0.3)' : '0 2px 4px rgba(220,53,69,0.3)'
                  }}
                >
                  🗑️ Remove
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '16px',
          fontSize: '14px',
          color: '#6c757d',
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef',
        }}
      >
        <strong style={{ color: '#495057' }}>Total Items:</strong> {items.length} |{' '}
        <strong style={{ color: '#495057' }}>Colors Used:</strong> {new Set(items.map(item => item.color)).size} unique
      </div>
    </div>
  )
}
