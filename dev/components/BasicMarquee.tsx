import React, { useState } from 'react';
import { ControlPanel } from './ControlPanel';
import Marquee from '../../src/Marquee';

interface MarqueeItem {
  id: number;
  text: string;
  color: number;
}

interface BasicMarqueeProps {
  items: MarqueeItem[];
}

export const BasicMarquee: React.FC<BasicMarqueeProps> = ({ items }) => {
  const [state, setState] = useState({
    paused: false,
    direction: 'down' as 'up' | 'down' | 'left' | 'right',
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

  const handleDirectionChange = (direction: 'up' | 'down' | 'left' | 'right') => {
    setState((prev) => ({ ...prev, direction }));
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
        title="Basic Vertical Marquee"
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
      <div className="marquee-demo" style={{ height: 200 }}>
        <Marquee
          marqueeItems={items}
          direction={state.direction}
          paused={state.paused}
          delay={state.speed}
          height={200}
          pauseOnHover={state.pauseOnHover}
          pauseOnItemHover={state.pauseOnItemHover}
          applyFadeMask={state.fadeMask !== 'none'}
          fadeMaskColor={state.fadeMask === 'none' ? 'white' : state.fadeMask}
          onPause={() => console.info('Basic marquee paused')}
          onResume={() => console.info('Basic marquee resumed')}
          onMarqueeHover={() => console.info('Basic marquee hovered')}
          onMarqueeItemHover={(item, index) =>
            console.info(`Basic marquee item ${index} hovered:`, item)
          }
        />
      </div>
      <hr style={{ margin: '20px 0' }} />
    </>
  );
};
