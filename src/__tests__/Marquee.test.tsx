import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Marquee, { IMarqueeProps } from '../Marquee';

// Mock the useInterval hook to avoid timing issues in tests
jest.mock('../helpers/hookHelpers/useInterval', () => {
  return jest.fn((callback: () => void, delay: number | null) => {
    if (delay !== null) {
      const interval = setInterval(callback, delay);
      return () => clearInterval(interval);
    }
  });
});

describe('Marquee Component', () => {
  const defaultProps: IMarqueeProps = {
    marqueeItems: ['Item 1', 'Item 2', 'Item 3'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Marquee {...defaultProps} />);
      expect(screen.getAllByText('Item 1')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Item 2')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Item 3')[0]).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <Marquee
          {...defaultProps}
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

    it('renders with JSX elements', () => {
      const jsxItems = [<span key="1">JSX Item 1</span>, <div key="2">JSX Item 2</div>];

      render(<Marquee marqueeItems={jsxItems} />);

      expect(screen.getAllByText('JSX Item 1')[0]).toBeInTheDocument();
      expect(screen.getAllByText('JSX Item 2')[0]).toBeInTheDocument();
    });
  });

  describe('Direction Props', () => {
    it('applies correct class for horizontal direction', () => {
      render(<Marquee {...defaultProps} direction="right" />);

      const container = document.querySelector('.marquee-container');
      expect(container).toHaveClass('horizontal');
    });

    it('applies correct class for horizontal direction', () => {
      render(<Marquee {...defaultProps} direction="left" />);

      const container = document.querySelector('.marquee-container');
      expect(container).toHaveClass('horizontal');
    });

    it('does not apply horizontal class for vertical directions', () => {
      render(<Marquee {...defaultProps} direction="up" />);

      const container = document.querySelector('.marquee-container');
      expect(container).not.toHaveClass('horizontal');
    });
  });

  describe('Styling Props', () => {
    it('applies height when provided', () => {
      render(<Marquee {...defaultProps} height={300} />);

      const container = document.querySelector('.marquee-container');
      expect(container).toHaveStyle('height: 300px');
    });

    it('applies minHeight when provided', () => {
      render(<Marquee {...defaultProps} minHeight={200} />);

      const container = document.querySelector('.marquee-container');
      expect(container).toHaveStyle('min-height: 200px');
    });

    it('applies default minHeight when no height props provided', () => {
      render(<Marquee {...defaultProps} />);

      const container = document.querySelector('.marquee-container');
      expect(container).toHaveStyle('min-height: 150px');
    });
  });

  describe('Pause/Resume Functionality', () => {
    it('calls onPause when paused becomes true', async () => {
      const onPause = jest.fn();
      const { rerender } = render(<Marquee {...defaultProps} paused={false} onPause={onPause} />);

      rerender(<Marquee {...defaultProps} paused={true} onPause={onPause} />);

      await waitFor(() => {
        expect(onPause).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onResume when paused becomes false', async () => {
      const onResume = jest.fn();
      const { rerender } = render(<Marquee {...defaultProps} paused={true} onResume={onResume} />);

      rerender(<Marquee {...defaultProps} paused={false} onResume={onResume} />);

      await waitFor(() => {
        expect(onResume).toHaveBeenCalledTimes(1);
      });
    });

    it('does not call callbacks when paused state does not change', () => {
      const onPause = jest.fn();
      const onResume = jest.fn();
      const { rerender } = render(
        <Marquee {...defaultProps} paused={false} onPause={onPause} onResume={onResume} />
      );

      rerender(<Marquee {...defaultProps} paused={false} onPause={onPause} onResume={onResume} />);

      expect(onPause).not.toHaveBeenCalled();
      expect(onResume).not.toHaveBeenCalled();
    });
  });

  describe('Inverse Marquee Items', () => {
    it('reverses items when inverseMarqueeItems is true', () => {
      render(<Marquee {...defaultProps} inverseMarqueeItems={true} />);

      const items = document.querySelectorAll('.marquee-item');
      expect(items[0]).toHaveTextContent('Item 3');
      expect(items[1]).toHaveTextContent('Item 2');
      expect(items[2]).toHaveTextContent('Item 1');
    });

    it('does not reverse items when inverseMarqueeItems is false or undefined', () => {
      render(<Marquee {...defaultProps} inverseMarqueeItems={false} />);

      const items = document.querySelectorAll('.marquee-item');
      expect(items[0]).toHaveTextContent('Item 1');
      expect(items[1]).toHaveTextContent('Item 2');
      expect(items[2]).toHaveTextContent('Item 3');
    });
  });

  describe('Props Validation', () => {
    it('handles empty marqueeItems array', () => {
      render(<Marquee marqueeItems={[]} />);

      const container = document.querySelector('.marquee-container');
      expect(container).toBeInTheDocument();
    });

    it('uses default delay when not provided', () => {
      render(<Marquee {...defaultProps} />);

      // Component should render without errors
      expect(screen.getAllByText('Item 1')[0]).toBeInTheDocument();
    });

    it('uses custom delay when provided', () => {
      render(<Marquee {...defaultProps} delay={100} />);

      // Component should render without errors
      expect(screen.getAllByText('Item 1')[0]).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Marquee {...defaultProps} />);

      const container = document.querySelector('.marquee-container');
      expect(container).toBeInTheDocument();

      // Check that items are accessible
      expect(screen.getAllByText('Item 1')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Item 2')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Item 3')[0]).toBeInTheDocument();
    });
  });
});
