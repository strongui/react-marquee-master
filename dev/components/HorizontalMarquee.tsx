import React, { useState } from 'react'
import Marquee, { FadeMaskColor, MarqueeDirection, MarqueeItem } from '../../src/Marquee'
import { ControlPanel } from './ControlPanel'

interface HorizontalMarqueeProps {
  items: MarqueeItem[]
}

export const HorizontalMarquee: React.FC<HorizontalMarqueeProps> = ({ items }) => {
  const [state, setState] = useState({
    paused: false,
    direction: MarqueeDirection.RIGHT as MarqueeDirection,
    speed: 40,
    pauseOnHover: false,
    pauseOnItemHover: false,
    fadeMask: FadeMaskColor.WHITE as FadeMaskColor,
    itemClickEnabled: false,
  })

  const handlePause = () => {
    setState(prev => ({ ...prev, paused: true }))
  }

  const handleResume = () => {
    setState(prev => ({ ...prev, paused: false }))
  }

  const handleDirectionChange = (direction: string) => {
    setState(prev => ({ ...prev, direction: direction as MarqueeDirection }))
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
        title="Horizontal Marquee"
        onPause={handlePause}
        onResume={handleResume}
        onDirectionChange={handleDirectionChange}
        onSpeedChange={handleSpeedChange}
        onTogglePauseOnHover={handleTogglePauseOnHover}
        onTogglePauseOnItemHover={handleTogglePauseOnItemHover}
        onFadeMaskChange={handleFadeMaskChange}
        onToggleItemClick={handleToggleItemClick}
        currentState={state}
        type="horizontal"
      />
      <div className="marquee-demo">
        <Marquee
          marqueeItems={items}
          direction={state.direction}
          paused={state.paused}
          delay={state.speed}
          height={80}
          pauseOnHover={state.pauseOnHover}
          pauseOnItemHover={state.pauseOnHover}
          applyFadeMask={state.fadeMask !== FadeMaskColor.NONE}
          fadeMaskColor={state.fadeMask === FadeMaskColor.NONE ? FadeMaskColor.WHITE : state.fadeMask}
          onPause={() => console.info('Horizontal marquee paused')}
          onResume={() => console.info('Horizontal marquee resumed')}
          onMarqueeHover={() => console.info('Horizontal marquee hovered')}
          onMarqueeItemHover={(item, index) => console.info(`Horizontal marquee item ${index} hovered:`, item)}
          onItemClick={state.itemClickEnabled ? handleItemClick : undefined}
        />
      </div>
      <hr style={{ margin: '20px 0' }} />
    </>
  )
}
