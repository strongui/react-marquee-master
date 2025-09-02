import React, { useState } from 'react'
import Marquee, { FadeMaskColor, MarqueeDirection, MarqueeItem } from '../../src/Marquee'
import { ControlPanel } from './ControlPanel'

interface HorizontalMarqueeProps {
  items: MarqueeItem[]
}

export const HorizontalMarquee: React.FC<HorizontalMarqueeProps> = ({ items }) => {
  const [state, setState] = useState({
    paused: false,
    direction: MarqueeDirection.LEFT as MarqueeDirection,
    speed: 10,
    pauseOnHover: false,
    pauseOnItemHover: false,
    fadeMask: FadeMaskColor.WHITE as FadeMaskColor,
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
        />
      </div>
      <hr style={{ margin: '20px 0' }} />
    </>
  )
}
