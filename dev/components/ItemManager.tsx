import React, { useState } from 'react'
import { MarqueeItemObject } from '../../src/Marquee'
import { BasicMarquee, HorizontalMarquee } from './index'

// Helper function to generate unique IDs
let idCounter = 1000
const generateId = (): string => `item-${++idCounter}`

// Extracted styles to prevent re-renders
const styles: Record<string, React.CSSProperties> = {
  title: {
    marginTop: '0',
    marginBottom: '16px',
    color: '#2c3e50',
    fontSize: '20px',
    fontWeight: '600',
  },
  description: {
    color: '#6c757d',
    marginBottom: '20px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #e1e5e9',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  select: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #e1e5e9',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  addButton: {
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
  },
  resetButton: {
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
  },
  itemList: {
    maxHeight: '250px',
    overflowY: 'auto',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    marginBottom: '8px',
  },
  itemText: {
    flex: 1,
    fontWeight: '500',
  },
  editInput: {
    flex: 1,
    padding: '6px 10px',
    borderRadius: '5px',
    border: '1px solid #e1e5e9',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  saveButton: {
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
  },
  cancelButton: {
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
  },
  editButton: {
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
  },
  removeButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(220,53,69,0.3)',
  },
  removeButtonDisabled: {
    padding: '6px 12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'not-allowed',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(108,117,125,0.3)',
    opacity: 0.6,
  },
  summary: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#6c757d',
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
  },
  summaryStrong: {
    color: '#495057',
  },
  marqueeContainer: {
    marginTop: '40px',
    minHeight: '400px',
  },
}

const initialItems: MarqueeItemObject[] = [
  { id: generateId(), text: '1. Welcome to React Marquee Master!', color: 1, icon: '🎉' },
  // { id: generateId(), text: '2. This is a smooth scrolling text component', color: 2, icon: '📝' },
  // { id: generateId(), text: '3. Built with TypeScript and React', color: 3, icon: '💻' },
  // { id: generateId(), text: '4. Perfect for announcements and news', color: 4, icon: '📰' },
  // { id: generateId(), text: '5. Easy to customize and use', color: 1, icon: '🔧' },
]

interface ItemManagerProps {
  renderBasicMarquee: boolean
  renderHorizontalMarquee: boolean
}

export const ItemManager: React.FC<ItemManagerProps> = ({ renderBasicMarquee, renderHorizontalMarquee }) => {
  const [items, setItems] = useState(initialItems)
  const [newItemText, setNewItemText] = useState('')
  const [newItemColor, setNewItemColor] = useState(1)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: MarqueeItemObject = {
        id: generateId(),
        text: newItemText.trim(),
        color: newItemColor,
      }
      setItems([...items, newItem])
      setNewItemText('')
      setNewItemColor(1)
    }
  }

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleEditItem = (id: string) => {
    const item = items.find(item => item.id === id)
    if (item) {
      setEditingItem(id)
      setEditText(item.text)
    }
  }

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      setItems(items.map(item => (item.id === id ? { ...item, text: editText.trim() } : item)))
      setEditingItem(null)
      setEditText('')
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditText('')
  }

  const handleColorChange = (id: string, color: number) => {
    setItems(items.map(item => (item.id === id ? { ...item, color } : item)))
  }

  const handleResetToDefault = () => {
    setItems([...initialItems])
  }

  return (
    <div className="item-manager-section">
      <h3 style={styles.title}>🎯 Item Manager - Shared Across All Marquees</h3>
      <p style={styles.description}>Add, edit, and manage items here. Changes will affect all marquees below.</p>

      <div className="controls">
        <div style={styles.inputGroup}>
          <input
            type="text"
            value={newItemText}
            onChange={e => setNewItemText(e.target.value)}
            placeholder="Enter new item text..."
            style={styles.input}
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
            style={styles.select}
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
              ...styles.addButton,
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
            style={styles.resetButton}
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
      <div style={styles.itemList}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              ...styles.itemRow,
              backgroundColor: editingItem === item.id ? '#e9ecef' : 'transparent',
            }}
          >
            {editingItem === item.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  style={styles.editInput}
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
                  onClick={() => handleSaveEdit(item.id as string)}
                  style={styles.saveButton}
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
                  style={styles.cancelButton}
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
                <span style={styles.itemText}>{item.text}</span>
                <select
                  value={item.color}
                  onChange={e => handleColorChange(item.id as string, Number(e.target.value))}
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
                  onClick={() => handleEditItem(item.id as string)}
                  style={styles.editButton}
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
                  onClick={() => handleRemoveItem(item.id as string)}
                  disabled={items.length <= 1}
                  style={items.length <= 1 ? styles.removeButtonDisabled : styles.removeButton}
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

      <div style={styles.summary}>
        <strong style={styles.summaryStrong}>Total Items:</strong> {items.length} |{' '}
        <strong style={styles.summaryStrong}>Colors Used:</strong> {new Set(items.map(item => item.color)).size} unique
      </div>

      {/* Marquee Components - Now rendered as children */}
      <div style={styles.marqueeContainer}>
        {renderBasicMarquee && (
          <section className="marquee-section">
            <BasicMarquee items={items} />
          </section>
        )}

        {renderHorizontalMarquee && (
          <section className="marquee-section">
            <HorizontalMarquee items={items} />
          </section>
        )}
      </div>
    </div>
  )
}
