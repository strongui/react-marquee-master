import React, { useState } from 'react'
import Marquee, { FadeMaskColor, MarqueeDirection } from '../../src/Marquee'
import { ControlPanel } from './ControlPanel'

interface MarqueeItem {
  id: number
  text: string
  color: number
}

interface BasicMarqueeProps {
  items: MarqueeItem[]
}

export const BasicMarquee: React.FC<BasicMarqueeProps> = ({ items }) => {
  const [state, setState] = useState({
    paused: false,
    direction: MarqueeDirection.UP,
    speed: 5,
    pauseOnHover: false,
    pauseOnItemHover: false,
    fadeMask: FadeMaskColor.WHITE,
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
        currentState={state}
        type="basic"
      />
      <div
        className="marquee-demo"
        style={{ height: 200 }}
      >
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
        />
      </div>
      <hr style={{ margin: '20px 0' }} />
    </>
  )
}
