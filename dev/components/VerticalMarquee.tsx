import React, { useState } from 'react'
import Marquee, { FadeMaskColor, MarqueeDirection, MarqueeItem } from '../../src/Marquee'
import { ControlPanel } from './ControlPanel'

interface VerticalMarqueeProps {
  items: MarqueeItem[]
}

export const VerticalMarquee: React.FC<VerticalMarqueeProps> = ({ items }) => {
  const [state, setState] = useState({
    paused: false,
    direction: MarqueeDirection.DOWN,
    speed: 40,
    pauseOnHover: false,
    pauseOnItemHover: false,
    fadeMask: FadeMaskColor.WHITE,
    reversed: false,
    itemClickEnabled: false,
  })

  const handlePause = () => {
    setState(prev => ({ ...prev, paused: true }))
  }

  const handleResume = () => {
    setState(prev => ({ ...prev, paused: false }))
  }

  const handleDirectionChange = (direction: MarqueeDirection) => {
    setState(prev => ({ ...prev, direction }))
  }

  const handleSpeedChange = (speed: number) => {
    setState(prev => ({ ...prev, speed }))
  }

  const handleTogglePauseOnHover = (enabled: boolean) => {
    setState(prev => ({ ...prev, pauseOnHover: enabled }))
  }

  const handleTogglePauseOnItemHover = (enabled: boolean) => {
    setState(prev => ({ ...prev, pauseOnItemHover: enabled }))
  }

  const handleFadeMaskChange = (fadeMask: FadeMaskColor) => {
    setState(prev => ({ ...prev, fadeMask }))
  }

  const handleToggleItemClick = (enabled: boolean) => {
    setState(prev => ({ ...prev, itemClickEnabled: enabled }))
  }

  const handleItemClick = (item: MarqueeItem, index: number) => {
    const itemText = typeof item === 'object' && item !== null && 'text' in item ? item.text : 'Unknown item'
    alert(`Item clicked: "${itemText}" (index: ${index})`)
  }

  return (
    <>
      <ControlPanel
        title="Vertical Marquee"
        onPause={handlePause}
        onResume={handleResume}
        onDirectionChange={handleDirectionChange}
        onSpeedChange={handleSpeedChange}
        onTogglePauseOnHover={handleTogglePauseOnHover}
        onTogglePauseOnItemHover={handleTogglePauseOnItemHover}
        onFadeMaskChange={handleFadeMaskChange}
        onToggleItemClick={handleToggleItemClick}
        currentState={state}
        type="basic"
      />
      <div className="marquee-demo">
        <Marquee
          marqueeItems={items}
          direction={state.direction}
          paused={state.paused}
          delay={state.speed}
          height={200}
          pauseOnHover={state.pauseOnHover}
          pauseOnItemHover={state.pauseOnItemHover}
          applyFadeMask={state.fadeMask !== FadeMaskColor.NONE}
          fadeMaskColor={state.fadeMask === FadeMaskColor.NONE ? FadeMaskColor.WHITE : state.fadeMask}
          onPause={() => console.info('Basic marquee paused')}
          onResume={() => console.info('Basic marquee resumed')}
          onMarqueeHover={() => console.info('Basic marquee hovered')}
          onMarqueeItemHover={(item, index) => console.info(`Basic marquee item ${index} hovered:`, item)}
          onItemClick={state.itemClickEnabled ? handleItemClick : undefined}
        />
      </div>
      <hr style={{ margin: '20px 0' }} />
    </>
  )
}
