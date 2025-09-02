import React, { useState } from 'react'
import { FadeMaskColor, MarqueeDirection } from '../../src/Marquee'

interface ControlPanelProps {
  title: string
  onPause: () => void
  onResume: () => void
  onDirectionChange?: (direction: MarqueeDirection) => void
  onSpeedChange?: (speed: number) => void
  onAddItem?: () => void
  onRemoveItem?: () => void
  onTogglePauseOnHover?: (enabled: boolean) => void
  onTogglePauseOnItemHover?: (enabled: boolean) => void
  onFadeMaskChange?: (fadeMask: FadeMaskColor) => void
  onToggleItemClick?: (enabled: boolean) => void
  currentState: {
    paused: boolean
    direction: MarqueeDirection
    speed: number
    pauseOnHover: boolean
    pauseOnItemHover: boolean
    fadeMask: FadeMaskColor
    itemClickEnabled: boolean
  }
  type: string
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  title,
  onPause,
  onResume,
  onDirectionChange,
  onSpeedChange,
  onAddItem,
  onRemoveItem,
  onTogglePauseOnHover,
  onTogglePauseOnItemHover,
  onFadeMaskChange,
  onToggleItemClick,
  currentState,
  type,
}) => {
  const [paused, setPaused] = useState(false)

  const handlePauseToggle = () => {
    const newPaused = !paused
    setPaused(newPaused)
    if (newPaused) {
      onPause()
    } else {
      onResume()
    }
  }

  // Determine which direction buttons to show based on type
  const renderDirectionButtons = () => {
    if (!onDirectionChange) return null

    if (type === 'horizontal') {
      return (
        <>
          <button
            className={currentState.direction === MarqueeDirection.LEFT ? 'active' : ''}
            onClick={() => onDirectionChange(MarqueeDirection.LEFT)}
          >
            ← Left
          </button>
          <button
            className={currentState.direction === MarqueeDirection.RIGHT ? 'active' : ''}
            onClick={() => onDirectionChange(MarqueeDirection.RIGHT)}
          >
            → Right
          </button>
        </>
      )
    } else {
      // Default to vertical (up/down) for basic and other types
      return (
        <>
          <button
            className={currentState.direction === MarqueeDirection.UP ? 'active' : ''}
            onClick={() => onDirectionChange(MarqueeDirection.UP)}
          >
            ↑ Up
          </button>
          <button
            className={currentState.direction === MarqueeDirection.DOWN ? 'active' : ''}
            onClick={() => onDirectionChange(MarqueeDirection.DOWN)}
          >
            ↓ Down
          </button>
        </>
      )
    }
  }

  return (
    <div className="demo-section">
      <h2>{title}</h2>
      <div className="controls">
        <button onClick={handlePauseToggle}>{paused ? 'Resume' : 'Pause'}</button>

        {renderDirectionButtons()}

        {onSpeedChange && (
          <label>
            Speed:
            <input
              type="range"
              min="5"
              max="100"
              value={currentState.speed || 40}
              onChange={e => onSpeedChange(parseInt(e.target.value))}
            />
          </label>
        )}

        {onAddItem && <button onClick={onAddItem}>Add Item</button>}

        {onRemoveItem && <button onClick={onRemoveItem}>Remove Item</button>}

        {onTogglePauseOnHover && (
          <button
            onClick={() => onTogglePauseOnHover(!currentState.pauseOnHover)}
            className={currentState.pauseOnHover ? 'active' : ''}
          >
            {currentState.pauseOnHover ? 'Disable' : 'Enable'} Pause on Hover
          </button>
        )}

        {onTogglePauseOnItemHover && (
          <button
            onClick={() => onTogglePauseOnItemHover(!currentState.pauseOnItemHover)}
            className={currentState.pauseOnItemHover ? 'active' : ''}
          >
            {currentState.pauseOnItemHover ? 'Disable' : 'Enable'} Pause on Item Hover
          </button>
        )}

        {onToggleItemClick && (
          <button
            onClick={() => onToggleItemClick(!currentState.itemClickEnabled)}
            className={currentState.itemClickEnabled ? 'active' : ''}
          >
            {currentState.itemClickEnabled ? 'Disable' : 'Enable'} Item Click
          </button>
        )}

        {onFadeMaskChange && (
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', marginRight: '8px' }}>Fade Mask:</span>
            <button
              onClick={() => onFadeMaskChange(FadeMaskColor.NONE)}
              className={currentState.fadeMask === FadeMaskColor.NONE ? 'active' : ''}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              None
            </button>
            <button
              onClick={() => onFadeMaskChange(FadeMaskColor.BLACK)}
              className={currentState.fadeMask === FadeMaskColor.BLACK ? 'active' : ''}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Black
            </button>
            <button
              onClick={() => onFadeMaskChange(FadeMaskColor.WHITE)}
              className={currentState.fadeMask === FadeMaskColor.WHITE ? 'active' : ''}
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              White
            </button>
          </div>
        )}
      </div>

      <div className="status">
        Status: {paused ? 'Paused' : 'Running'} |{currentState.direction && ` Direction: ${currentState.direction}`} |
        {currentState.speed && ` Speed: ${currentState.speed}ms`}
        {currentState.fadeMask && ` | Fade Mask: ${currentState.fadeMask}`}
      </div>
    </div>
  )
}
