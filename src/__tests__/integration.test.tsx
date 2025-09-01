import React from 'react';
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import Marquee, { MarqueeDirection, FadeMaskColor } from '../Marquee';

// Mock the useInterval hook to avoid timing issues in tests
jest.mock('../helpers/hookHelpers/useInterval', () => {
  return jest.fn((callback: () => void, delay: number | null) => {
    if (delay !== null) {
      const interval = setInterval(callback, delay);
      return () => clearInterval(interval);
    }
  });
});

describe('Marquee Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Direction Integration', () => {
    const directions = [
      MarqueeDirection.UP,
      MarqueeDirection.RIGHT,
      MarqueeDirection.DOWN,
      MarqueeDirection.LEFT,
    ];

    directions.forEach((direction) => {
      it(`renders correctly with ${direction} direction`, () => {
        render(<Marquee marqueeItems={['Item 1', 'Item 2', 'Item 3']} direction={direction} />);

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();
      });
    });
  });

  describe('Pause/Resume Integration', () => {
    it('integrates pause and resume functionality', async () => {
      const onPause = jest.fn();
      const onResume = jest.fn();

      const { rerender } = render(
        <Marquee
          marqueeItems={['Item 1', 'Item 2']}
          paused={false}
          onPause={onPause}
          onResume={onResume}
        />
      );

      // Test pause
      rerender(
        <Marquee
          marqueeItems={['Item 1', 'Item 2']}
          paused={true}
          onPause={onPause}
          onResume={onResume}
        />
      );

      await waitFor(() => {
        expect(onPause).toHaveBeenCalledTimes(1);
      });

      // Test resume
      rerender(
        <Marquee
          marqueeItems={['Item 1', 'Item 2']}
          paused={false}
          onPause={onPause}
          onResume={onResume}
        />
      );

      await waitFor(() => {
        expect(onResume).toHaveBeenCalledTimes(1);
      });
    });

    it('integrates pauseOnHover functionality', () => {
      const onMarqueeHover = jest.fn();

      render(
        <Marquee
          marqueeItems={['Item 1', 'Item 2']}
          pauseOnHover={true}
          onMarqueeHover={onMarqueeHover}
        />
      );

      const container = screen.getByText('Item 1').closest('.marquee-container');
      expect(container).toBeInTheDocument();

      if (container) {
        fireEvent.mouseEnter(container);
        fireEvent.mouseLeave(container);
      }
    });

    it('integrates pauseOnItemHover functionality', () => {
      const onMarqueeItemHover = jest.fn();

      render(
        <Marquee
          marqueeItems={['Item 1', 'Item 2']}
          pauseOnItemHover={true}
          onMarqueeItemHover={onMarqueeItemHover}
        />
      );

      const item = screen.getByText('Item 1');
      expect(item).toBeInTheDocument();

      fireEvent.mouseEnter(item);
      fireEvent.mouseLeave(item);
    });
  });

  describe('Styling Integration', () => {
    it('integrates custom className props', () => {
      render(
        <Marquee
          marqueeItems={['Item 1']}
          marqueeClassName="custom-marquee"
          marqueeContainerClassName="custom-container"
          marqueeItemClassName="custom-item"
        />
      );

      const container = document.querySelector('.custom-container');
      const marquee = document.querySelector('.custom-marquee');
      const item = document.querySelector('.custom-item');

      expect(container).toBeInTheDocument();
      expect(marquee).toBeInTheDocument();
      expect(item).toBeInTheDocument();
    });

    it('integrates height and minHeight props', () => {
      render(<Marquee marqueeItems={['Item 1']} height={200} minHeight={150} />);

      const container = document.querySelector('.marquee-container');
      expect(container).toHaveStyle({ height: '200px', minHeight: '150px' });
    });

    it('integrates fade mask functionality', () => {
      render(
        <Marquee
          marqueeItems={['Item 1']}
          applyFadeMask={true}
          fadeMaskColor={FadeMaskColor.BLACK}
        />
      );

      const container = document.querySelector('.marquee-container');
      expect(container).toHaveClass('fade-mask-black');
    });
  });

  describe('Item Types Integration', () => {
    it('integrates string items', () => {
      render(<Marquee marqueeItems={['String Item 1', 'String Item 2']} />);

      expect(screen.getByText('String Item 1')).toBeInTheDocument();
      expect(screen.getByText('String Item 2')).toBeInTheDocument();
    });

    it('integrates JSX element items', () => {
      const jsxItems = [<span key="1">JSX Item 1</span>, <div key="2">JSX Item 2</div>];

      render(<Marquee marqueeItems={jsxItems} />);

      expect(screen.getByText('JSX Item 1')).toBeInTheDocument();
      expect(screen.getByText('JSX Item 2')).toBeInTheDocument();
    });

    it('integrates object items with text property', () => {
      const objectItems = [
        { text: 'Object Item 1', color: 1 },
        { text: 'Object Item 2', color: 2 },
      ];

      render(<Marquee marqueeItems={objectItems} />);

      expect(screen.getByText('Object Item 1')).toBeInTheDocument();
      expect(screen.getByText('Object Item 2')).toBeInTheDocument();
    });
  });

  describe('Configuration Integration', () => {
    it('integrates all configuration options together', () => {
      const config = {
        marqueeItems: ['Config Item 1', 'Config Item 2'],
        direction: MarqueeDirection.LEFT,
        height: 100,
        delay: 50,
        paused: false,
        pauseOnHover: true,
        pauseOnItemHover: false,
        applyFadeMask: true,
        fadeMaskColor: FadeMaskColor.WHITE,
        inverseMarqueeItems: false,
        marqueeClassName: 'test-marquee',
        marqueeContainerClassName: 'test-container',
        marqueeItemClassName: 'test-item',
      };

      render(<Marquee {...config} />);

      expect(screen.getByText('Config Item 1')).toBeInTheDocument();
      expect(screen.getByText('Config Item 2')).toBeInTheDocument();

      const container = document.querySelector('.test-container');
      const marquee = document.querySelector('.test-marquee');
      const item = document.querySelector('.test-item');

      expect(container).toBeInTheDocument();
      expect(marquee).toBeInTheDocument();
      expect(item).toBeInTheDocument();
    });
  });
});
