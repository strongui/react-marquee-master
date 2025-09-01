import React from 'react';
import Marquee, { MarqueeDirection } from '../../src/Marquee';

interface TestVerticalMarqueeProps {
  items: Array<{ id: number; text: string; color: number }>;
}

export function TestVerticalMarquee({ items }: TestVerticalMarqueeProps) {
  // Test case for vertical scrolling:
  // Simple container with red border, 200px height
  // Marquee with single test item 'adfasfadfasdasdf'
  const testItems = [
    { id: 1, text: 'adfasfadfasdasdf', color: 1 },
    { id: 2, text: 'sfsdfasdsa asdf as', color: 2 },
  ];

  return (
    <div className="demo-section">
      <h3>Test Vertical Marquee - Simple Case</h3>
      <p>
        This marquee demonstrates the basic test case with a simple container and single text item
        for vertical scrolling.
      </p>

      <div
        style={{
          width: '100%',
          border: '1px solid red',
          height: 200,
        }}
      >
        <Marquee
          direction={MarqueeDirection.DOWN}
          height={200}
          delay={5}
          marqueeItems={['adfasfadfasdasdf', 'asfa faf asdf as']}
          marqueeContainerClassName="test-vertical-marquee-container"
        />
      </div>
    </div>
  );
}
