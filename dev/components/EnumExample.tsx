import React from 'react';
import Marquee, { MarqueeDirection, FadeMaskColor } from '../../src/Marquee';

export function EnumExample() {
  return (
    <div className="demo-section">
      <h3>Enum Usage Examples</h3>
      <p>
        This example demonstrates how to use the new enums for better type safety and developer
        experience.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <h4>Direction Enum Examples:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h5>Horizontal Scrolling</h5>
            <div style={{ border: '1px solid #ccc', height: 60, marginBottom: '10px' }}>
              <Marquee
                direction={MarqueeDirection.LEFT}
                height={60}
                marqueeItems={['Scrolling left with enum', 'Type-safe direction!']}
              />
            </div>
            <div style={{ border: '1px solid #ccc', height: 60 }}>
              <Marquee
                direction={MarqueeDirection.RIGHT}
                height={60}
                marqueeItems={['Scrolling right with enum', 'No more typos!']}
              />
            </div>
          </div>

          <div>
            <h5>Vertical Scrolling</h5>
            <div style={{ border: '1px solid #ccc', height: 100, marginBottom: '10px' }}>
              <Marquee
                direction={MarqueeDirection.UP}
                height={100}
                marqueeItems={['Scrolling up with enum', 'IntelliSense support!']}
              />
            </div>
            <div style={{ border: '1px solid #ccc', height: 100 }}>
              <Marquee
                direction={MarqueeDirection.DOWN}
                height={100}
                marqueeItems={['Scrolling down with enum', 'Better DX!']}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4>FadeMaskColor Enum Examples:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <h5>No Fade Mask</h5>
            <div style={{ border: '1px solid #ccc', height: 60 }}>
              <Marquee
                direction={MarqueeDirection.LEFT}
                height={60}
                applyFadeMask={false}
                marqueeItems={['No fade mask', 'Clean edges']}
              />
            </div>
          </div>

          <div>
            <h5>White Fade Mask</h5>
            <div style={{ border: '1px solid #ccc', height: 60, background: 'white' }}>
              <Marquee
                direction={MarqueeDirection.LEFT}
                height={60}
                applyFadeMask={true}
                fadeMaskColor={FadeMaskColor.WHITE}
                marqueeItems={['White fade mask', 'Smooth transition']}
              />
            </div>
          </div>

          <div>
            <h5>Black Fade Mask</h5>
            <div
              style={{ border: '1px solid #ccc', height: 60, background: '#333', color: 'white' }}
            >
              <Marquee
                direction={MarqueeDirection.LEFT}
                height={60}
                applyFadeMask={true}
                fadeMaskColor={FadeMaskColor.BLACK}
                marqueeItems={['Black fade mask', 'Dark theme']}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
        }}
      >
        <h4>Benefits of Using Enums:</h4>
        <ul>
          <li>
            <strong>Type Safety:</strong> No more typos like <code>"lef"</code> or{' '}
            <code>"whit"</code>
          </li>
          <li>
            <strong>IntelliSense:</strong> IDE autocomplete shows all available options
          </li>
          <li>
            <strong>Refactoring:</strong> Easy to rename values across the codebase
          </li>
          <li>
            <strong>Documentation:</strong> Self-documenting code with clear options
          </li>
          <li>
            <strong>Professional:</strong> Industry standard for React libraries
          </li>
        </ul>

        <h4>Usage:</h4>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '3px' }}>
          {`import Marquee, { MarqueeDirection, FadeMaskColor } from 'react-marquee';

<Marquee
  direction={MarqueeDirection.LEFT}
  fadeMaskColor={FadeMaskColor.WHITE}
  marqueeItems={['Your items here']}
/>`}
        </pre>
      </div>
    </div>
  );
}
