import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Marquee from '../Marquee';

// Mock the useInterval hook for integration tests
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

  describe('Pause/Resume Integration', () => {
    const TestComponent = () => {
      const [paused, setPaused] = useState(false);
      const [pauseCount, setPauseCount] = useState(0);
      const [resumeCount, setResumeCount] = useState(0);

      const handlePause = () => {
        setPauseCount((prev) => prev + 1);
      };

      const handleResume = () => {
        setResumeCount((prev) => prev + 1);
      };

      return (
        <div>
          <Marquee
            marqueeItems={['Item 1', 'Item 2', 'Item 3']}
            paused={paused}
            onPause={handlePause}
            onResume={handleResume}
          />
          <button onClick={() => setPaused(!paused)}>{paused ? 'Resume' : 'Pause'}</button>
          <div data-testid="pause-count">Paused: {pauseCount}</div>
          <div data-testid="resume-count">Resumed: {resumeCount}</div>
        </div>
      );
    };

    it('should handle pause/resume with user interaction', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      const button = screen.getByText('Pause');
      const pauseCount = screen.getByTestId('pause-count');
      const resumeCount = screen.getByTestId('resume-count');

      // Initial state
      expect(pauseCount).toHaveTextContent('Paused: 0');
      expect(resumeCount).toHaveTextContent('Resumed: 0');

      // Pause the marquee
      await user.click(button);

      await waitFor(() => {
        expect(pauseCount).toHaveTextContent('Paused: 1');
        expect(resumeCount).toHaveTextContent('Resumed: 0');
      });

      expect(screen.getByText('Resume')).toBeInTheDocument();

      // Resume the marquee
      await user.click(screen.getByText('Resume'));

      await waitFor(() => {
        expect(pauseCount).toHaveTextContent('Paused: 1');
        expect(resumeCount).toHaveTextContent('Resumed: 1');
      });

      expect(screen.getByText('Pause')).toBeInTheDocument();
    });
  });

  describe('Direction Changes Integration', () => {
    const DirectionTestComponent = () => {
      const [direction, setDirection] = useState<'up' | 'right' | 'down' | 'left'>('up');

      return (
        <div>
          <Marquee marqueeItems={['Item 1', 'Item 2', 'Item 3']} direction={direction} />
          <button onClick={() => setDirection('right')}>Right</button>
          <button onClick={() => setDirection('up')}>Up</button>
        </div>
      );
    };

    it('should handle direction changes correctly', async () => {
      const user = userEvent.setup();
      render(<DirectionTestComponent />);

      const container = document.querySelector('.marquee-container');

      // Initial state - vertical (up)
      expect(container).not.toHaveClass('horizontal');

      // Change to horizontal (right)
      await user.click(screen.getByText('Right'));
      expect(container).toHaveClass('horizontal');

      // Change back to vertical (up)
      await user.click(screen.getByText('Up'));
      expect(container).not.toHaveClass('horizontal');
    });
  });

  describe('Dynamic Content Integration', () => {
    const DynamicContentComponent = () => {
      const [items, setItems] = useState(['Item 1', 'Item 2']);

      const addItem = () => {
        setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
      };

      const removeItem = () => {
        setItems((prev) => prev.slice(0, -1));
      };

      return (
        <div>
          <Marquee marqueeItems={items} />
          <button onClick={addItem}>Add Item</button>
          <button onClick={removeItem}>Remove Item</button>
          <div data-testid="item-count">Items: {items.length}</div>
        </div>
      );
    };

    it('should handle dynamic content changes', async () => {
      const user = userEvent.setup();
      render(<DynamicContentComponent />);

      // Initial state
      expect(screen.getAllByText('Item 1')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Item 2')[0]).toBeInTheDocument();
      expect(screen.getByTestId('item-count')).toHaveTextContent('Items: 2');

      // Add item
      await user.click(screen.getByText('Add Item'));
      expect(screen.getAllByText('Item 3')[0]).toBeInTheDocument();
      expect(screen.getByTestId('item-count')).toHaveTextContent('Items: 3');

      // Remove item
      await user.click(screen.getByText('Remove Item'));
      expect(screen.queryByText('Item 3')).not.toBeInTheDocument();
      expect(screen.getByTestId('item-count')).toHaveTextContent('Items: 2');
    });
  });

  describe('Complex Configuration Integration', () => {
    const ComplexConfigComponent = () => {
      const [config, setConfig] = useState({
        direction: 'up' as 'up' | 'right' | 'down' | 'left',
        paused: false,
        delay: 40,
        height: 200,
      });

      const updateConfig = (newConfig: Partial<typeof config>) => {
        setConfig((prev) => ({ ...prev, ...newConfig }));
      };

      return (
        <div>
          <Marquee
            marqueeItems={['Item 1', 'Item 2', 'Item 3']}
            direction={config.direction}
            paused={config.paused}
            delay={config.delay}
            height={config.height}
            marqueeClassName="complex-marquee"
            marqueeContainerClassName="complex-container"
            marqueeItemClassName="complex-item"
          />

          <button onClick={() => updateConfig({ paused: !config.paused })}>Toggle Pause</button>
          <button onClick={() => updateConfig({ delay: 20 })}>Speed Up</button>
          <button onClick={() => updateConfig({ height: 300 })}>Increase Height</button>
        </div>
      );
    };

    it('should handle complex configuration changes', async () => {
      const user = userEvent.setup();
      render(<ComplexConfigComponent />);

      const container = document.querySelector('.complex-container');
      const marquee = document.querySelector('.complex-marquee');
      const item = document.querySelector('.complex-item');

      // Verify initial setup
      expect(container).toBeInTheDocument();
      expect(marquee).toBeInTheDocument();
      expect(item).toBeInTheDocument();
      expect(container).toHaveStyle('height: 200px');

      // Test height change
      await user.click(screen.getByText('Increase Height'));
      expect(container).toHaveStyle('height: 300px');

      // Verify all items are still present
      expect(screen.getAllByText('Item 1')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Item 2')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Item 3')[0]).toBeInTheDocument();
    });
  });
});
