import React, { useState } from 'react'
import { MarqueeItemObject } from '../../src/Marquee'
import { HorizontalMarquee, VerticalMarquee } from './index'

// Helper function to generate unique IDs
let idCounter = 1000
const generateId = (): string => `item-${++idCounter}`

// Available icons for the dropdown
const availableIcons = [
  { value: '🎉', label: '🎉 Party' },
  { value: '📝', label: '📝 Note' },
  { value: '💻', label: '💻 Computer' },
  { value: '📰', label: '📰 News' },
  { value: '🔧', label: '🔧 Tools' },
  { value: '🐱', label: '🐱 Cat' },
  { value: '⭐', label: '⭐ Star' },
  { value: '🚀', label: '🚀 Rocket' },
  { value: '💡', label: '💡 Lightbulb' },
  { value: '🎯', label: '🎯 Target' },
  { value: '🔥', label: '🔥 Fire' },
  { value: '❤️', label: '❤️ Heart' },
  { value: '🎨', label: '🎨 Art' },
  { value: '📱', label: '📱 Phone' },
  { value: '🌍', label: '🌍 World' },
  { value: '🎵', label: '🎵 Music' },
  { value: '🏆', label: '🏆 Trophy' },
  { value: '💰', label: '💰 Money' },
  { value: '🎪', label: '🎪 Circus' },
  { value: '🌈', label: '🌈 Rainbow' },
]

const initialItems: MarqueeItemObject[] = [
  { id: generateId(), text: '1. Welcome to React Marquee Master!', color: 1, icon: '🎉' },
  { id: generateId(), text: '2. This is a smooth scrolling text component', color: 2, icon: '📝' },
  { id: generateId(), text: '3. Built with TypeScript and React', color: 3, icon: '💻' },
  { id: generateId(), text: '4. Perfect for announcements and news', color: 4, icon: '📰' },
  { id: generateId(), text: '5. Easy to customize and use', color: 1, icon: '🔧' },
  {
    id: generateId(),
    text: '6. Debugging marquee animations is like herding cats - they never go where you expect!',
    color: 1,
    icon: '🐱',
  },
]

interface ItemManagerProps {
  renderVerticalMarquee: boolean
  renderHorizontalMarquee: boolean
}

export const ItemManager: React.FC<ItemManagerProps> = ({ renderVerticalMarquee, renderHorizontalMarquee }) => {
  const [items, setItems] = useState(initialItems)
  const [newItemText, setNewItemText] = useState('')
  const [newItemColor, setNewItemColor] = useState(1)
  const [newItemIcon, setNewItemIcon] = useState('🎉')
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editIcon, setEditIcon] = useState('🎉')
  const [itemClickEnabled, setItemClickEnabled] = useState(false)

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: MarqueeItemObject = {
        id: generateId(),
        text: newItemText.trim(),
        color: newItemColor,
        icon: newItemIcon,
      }
      setItems([...items, newItem])
      setNewItemText('')
      setNewItemColor(1)
      setNewItemIcon('🎉')
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
      setEditIcon(item.icon || '🎉')
    }
  }

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      setItems(items.map(item => (item.id === id ? { ...item, text: editText.trim(), icon: editIcon } : item)))
      setEditingItem(null)
      setEditText('')
      setEditIcon('🎉')
    }
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditText('')
    setEditIcon('🎉')
  }

  const handleColorChange = (id: string, color: number) => {
    setItems(items.map(item => (item.id === id ? { ...item, color } : item)))
  }

  const handleResetToDefault = () => {
    setItems([...initialItems])
  }

  const handleToggleItemClick = (enabled: boolean) => {
    setItemClickEnabled(enabled)
  }

  return (
    <div className="item-manager-section">
      <h3 className="item-manager-title">🎯 Item Manager - Shared Across All Marquees</h3>
      <p className="item-manager-description">
        Add, edit, and manage items here. Changes will affect all marquees below.
        <br />
        <strong>💡 Tip:</strong> Use the "Enable Item Click" button to make marquee items clickable, or use the
        individual toggles in each marquee's control panel.
      </p>

      <div className="controls">
        <div className="item-manager-input-group">
          <input
            type="text"
            value={newItemText}
            onChange={e => setNewItemText(e.target.value)}
            placeholder="Enter new item text..."
            className="item-manager-input"
          />
          <select
            value={newItemColor}
            onChange={e => setNewItemColor(Number(e.target.value))}
            className="item-manager-select"
          >
            <option value={1}>Blue-Purple</option>
            <option value={2}>Pink-Red</option>
            <option value={3}>Blue-Cyan</option>
            <option value={4}>Green-Cyan</option>
          </select>
          <select
            value={newItemIcon}
            onChange={e => setNewItemIcon(e.target.value)}
            className="item-manager-select"
          >
            {availableIcons.map(icon => (
              <option
                key={icon.value}
                value={icon.value}
              >
                {icon.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
            className="item-manager-button item-manager-button--primary"
          >
            ➕ Add Item
          </button>
          <button
            onClick={handleResetToDefault}
            className="item-manager-button item-manager-button--secondary"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => handleToggleItemClick(!itemClickEnabled)}
            className={`item-manager-button ${itemClickEnabled ? 'item-manager-button--success' : 'item-manager-button--secondary'}`}
          >
            {itemClickEnabled ? '🖱️ Disable' : '🖱️ Enable'} Item Click
          </button>
        </div>
      </div>

      {/* Item List */}
      <div className="item-manager-item-list">
        {items.map(item => (
          <div
            key={item.id}
            className={`item-manager-item-row ${editingItem === item.id ? 'item-manager-item-row--editing' : ''}`}
          >
            {editingItem === item.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className="item-manager-edit-input"
                />
                <select
                  value={editIcon}
                  onChange={e => setEditIcon(e.target.value)}
                  className="item-manager-color-select"
                >
                  {availableIcons.map(icon => (
                    <option
                      key={icon.value}
                      value={icon.value}
                    >
                      {icon.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleSaveEdit(item.id as string)}
                  className="item-manager-button item-manager-button--small item-manager-button--success"
                >
                  ✅ Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="item-manager-button item-manager-button--small item-manager-button--secondary"
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <>
                <span className="item-manager-item-text">{item.text}</span>
                <select
                  value={item.color}
                  onChange={e => handleColorChange(item.id as string, Number(e.target.value))}
                  className="item-manager-color-select"
                >
                  <option value={1}>Blue-Purple</option>
                  <option value={2}>Pink-Red</option>
                  <option value={3}>Blue-Cyan</option>
                  <option value={4}>Green-Cyan</option>
                </select>
                <button
                  onClick={() => handleEditItem(item.id as string)}
                  className="item-manager-button item-manager-button--small item-manager-button--primary"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleRemoveItem(item.id as string)}
                  disabled={items.length <= 1}
                  className={`item-manager-button item-manager-button--small ${items.length <= 1 ? 'item-manager-button--secondary' : 'item-manager-button--danger'}`}
                >
                  🗑️ Remove
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="item-manager-summary">
        <strong>Total Items:</strong> {items.length} | <strong>Colors Used:</strong>{' '}
        {new Set(items.map(item => item.color)).size} unique
      </div>

      {/* Marquee Components - Now rendered as children */}
      <div className="item-manager-marquee-container">
        {renderVerticalMarquee && (
          <section className="marquee-section">
            <VerticalMarquee items={items} />
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
