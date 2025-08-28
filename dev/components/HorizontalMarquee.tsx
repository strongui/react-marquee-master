import React, { useState } from 'react';
import { ControlPanel } from './ControlPanel';
import Marquee from '../../src/Marquee';

interface MarqueeItem {
  id: number;
  text: string;
  color: number;
}

interface HorizontalMarqueeProps {
  items: MarqueeItem[];
}

export const HorizontalMarquee: React.FC<HorizontalMarqueeProps> = ({ items }) => {
  const [state, setState] = useState({
    paused: false,
    direction: 'left' as 'left' | 'right',
    speed: 40,
    pauseOnHover: false,
    pauseOnItemHover: false,
    fadeMask: 'white' as 'none' | 'black' | 'white',
  });

  const handlePause = () => {
    setState((prev) => ({ ...prev, paused: true }));
  };

  const handleResume = () => {
    setState((prev) => ({ ...prev, paused: false }));
  };

  const handleDirectionChange = (direction: string) => {
    setState((prev) => ({ ...prev, direction: direction as 'left' | 'right' }));
  };

  const handleSpeedChange = (speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  };

  const handleTogglePauseOnHover = (enabled: boolean) => {
    setState((prev) => ({ ...prev, pauseOnHover: enabled }));
  };

  const handleTogglePauseOnItemHover = (enabled: boolean) => {
    setState((prev) => ({ ...prev, pauseOnItemHover: enabled }));
  };

  const handleFadeMaskChange = (fadeMask: 'none' | 'black' | 'white') => {
    setState((prev) => ({ ...prev, fadeMask }));
  };

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
      <div className="marquee-demo" style={{ height: 80 }}>
        <Marquee
          marqueeItems={items}
          direction={state.direction}
          paused={state.paused}
          delay={state.speed}
          height={80}
          pauseOnHover={state.pauseOnHover}
          pauseOnItemHover={state.pauseOnHover}
          applyFadeMask={state.fadeMask !== 'none'}
          fadeMaskColor={state.fadeMask === 'none' ? 'white' : state.fadeMask}
          onPause={() => console.info('Horizontal marquee paused')}
          onResume={() => console.info('Horizontal marquee resumed')}
          onMarqueeHover={() => console.info('Horizontal marquee hovered')}
          onMarqueeItemHover={(item, index) =>
            console.info(`Horizontal marquee item ${index} hovered:`, item)
          }
        />
      </div>
      <hr style={{ margin: '20px 0' }} />
    </>
  );
};
