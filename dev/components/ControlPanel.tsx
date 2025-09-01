import React, { useState } from 'react';
import { MarqueeDirection, FadeMaskColor } from '../../src/Marquee';

interface ControlPanelProps {
  title: string;
  onPause: () => void;
  onResume: () => void;
  onDirectionChange?: (direction: MarqueeDirection) => void;
  onSpeedChange?: (speed: number) => void;
  onBothDirectionChange?: (horizontal: string, vertical: string) => void;
  onAddItem?: () => void;
  onRemoveItem?: () => void;
  onToggleReverse?: () => void;
  onTogglePauseOnHover?: (enabled: boolean) => void;
  onTogglePauseOnItemHover?: (enabled: boolean) => void;
  onFadeMaskChange?: (fadeMask: FadeMaskColor) => void;
  currentState: any;
  type: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  title,
  onPause,
  onResume,
  onDirectionChange,
  onSpeedChange,
  onBothDirectionChange,
  onAddItem,
  onRemoveItem,
  onToggleReverse,
  onTogglePauseOnHover,
  onTogglePauseOnItemHover,
  onFadeMaskChange,
  currentState,
  type,
}) => {
  const [paused, setPaused] = useState(false);

  const handlePauseToggle = () => {
    const newPaused = !paused;
    setPaused(newPaused);
    if (newPaused) {
      onPause();
    } else {
      onResume();
    }
  };

  // Determine which direction buttons to show based on type
  const renderDirectionButtons = () => {
    if (!onDirectionChange) return null;

    if (type === 'horizontal') {
      return (
        <>
          <button onClick={() => onDirectionChange(MarqueeDirection.LEFT)}>← Left</button>
          <button onClick={() => onDirectionChange(MarqueeDirection.RIGHT)}>→ Right</button>
        </>
      );
    } else {
      // Default to vertical (up/down) for basic and other types
      return (
        <>
          <button onClick={() => onDirectionChange(MarqueeDirection.UP)}>↑ Up</button>
          <button onClick={() => onDirectionChange(MarqueeDirection.DOWN)}>↓ Down</button>
        </>
      );
    }
  };

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
              onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            />
          </label>
        )}

        {onBothDirectionChange && (
          <>
            <button onClick={() => onBothDirectionChange('left', 'up')}>↖ Left + Up</button>
            <button onClick={() => onBothDirectionChange('right', 'up')}>↗ Right + Up</button>
            <button onClick={() => onBothDirectionChange('left', 'down')}>↙ Left + Down</button>
            <button onClick={() => onBothDirectionChange('right', 'down')}>↘ Right + Down</button>
          </>
        )}

        {onAddItem && <button onClick={onAddItem}>Add Item</button>}

        {onRemoveItem && <button onClick={onRemoveItem}>Remove Item</button>}

        {onToggleReverse && (
          <button onClick={onToggleReverse}>
            {currentState.reversed ? 'Normal Order' : 'Reverse Order'}
          </button>
        )}

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
        Status: {paused ? 'Paused' : 'Running'} |
        {currentState.direction && ` Direction: ${currentState.direction}`} |
        {currentState.speed && ` Speed: ${currentState.speed}ms`}
        {currentState.bothDirection &&
          ` | Both: (${currentState.bothDirection.horizontal}, ${currentState.bothDirection.vertical})`}
        {currentState.items && ` | Items: ${currentState.items.length}`}
        {currentState.reversed !== undefined && ` | Reversed: ${currentState.reversed}`}
        {currentState.fadeMask && ` | Fade Mask: ${currentState.fadeMask}`}
      </div>
    </div>
  );
};
