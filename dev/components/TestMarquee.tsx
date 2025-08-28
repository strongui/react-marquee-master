import React from 'react';
import Marquee from '../../src/Marquee';

interface TestMarqueeProps {
  items: Array<{ id: number; text: string; color: number }>;
}

export function TestMarquee({ items }: TestMarqueeProps) {
  // Test case from the scenario:
  // Simple container with red border, 60px height
  // Marquee with single test item 'adfasfadfasdasdf'
  const testItems = [{ id: 1, text: 'adfasfadfasdasdf', color: 1 }];

  return (
    <div className="demo-section">
      <h3>Test Marquee - Simple Case</h3>
      <p>
        This marquee demonstrates the basic test case with a simple container and single text item.
      </p>

      <div
        style={{
          width: '100%',
          border: '1px solid red',
          height: 60,
        }}
      >
        <Marquee
          direction="left"
          height={60}
          marqueeItems={['adfasfadfasdasdf']}
          marqueeContainerClassName="test-marquee-container"
        />
      </div>
    </div>
  );
}
