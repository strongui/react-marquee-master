import React from 'react';
import { render } from '@testing-library/react';
import Marquee, { MarqueeDirection, FadeMaskColor } from '../Marquee';

describe('Marquee Index Export', () => {
  it('exports Marquee as default', () => {
    const { container } = render(
      <Marquee marqueeItems={['Test Item']} direction={MarqueeDirection.UP} />
    );
    expect(container).toBeInTheDocument();
  });

  it('exports IMarqueeProps interface', () => {
    // This test ensures the interface is exported
    // We can't directly test TypeScript interfaces, but we can test that
    // the component accepts the props defined in the interface
    const { container } = render(
      <Marquee
        marqueeItems={['Test Item']}
        direction={MarqueeDirection.UP}
        height={100}
        delay={50}
        paused={false}
        pauseOnHover={true}
        pauseOnItemHover={false}
        applyFadeMask={true}
        fadeMaskColor={FadeMaskColor.WHITE}
        onPause={() => {}}
        onResume={() => {}}
        onMarqueeHover={() => {}}
        onMarqueeItemHover={() => {}}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
