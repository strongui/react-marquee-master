import React from 'react'
import { render } from '@testing-library/react'
import { screen, fireEvent } from '@testing-library/dom'
import Marquee, { MarqueeDirection, FadeMaskColor } from '../Marquee'

// Mock the useInterval hook to avoid timing issues in tests
jest.mock('../helpers/hookHelpers/useInterval', () => {
  return jest.fn((callback: () => void, delay: number | null) => {
    if (delay !== null) {
      const interval = setInterval(callback, delay)
      return () => clearInterval(interval)
    }
  })
})

describe('Marquee Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Direction Integration', () => {
    const directions = [MarqueeDirection.UP, MarqueeDirection.RIGHT, MarqueeDirection.DOWN, MarqueeDirection.LEFT]

    directions.forEach(direction => {
      it(`renders correctly with ${direction} direction`, () => {
        render(
          <Marquee
            marqueeItems={[
              { id: 1, text: 'Item 1' },
              { id: 2, text: 'Item 2' },
              { id: 3, text: 'Item 3' }
            ]}
            direction={direction}
          />
        )

        expect(screen.getByText('Item 1')).toBeInTheDocument()
        expect(screen.getByText('Item 2')).toBeInTheDocument()
        expect(screen.getByText('Item 3')).toBeInTheDocument()
      })
    })
  })

  describe('Pause/Resume Integration', () => {
    it('integrates pause state functionality', () => {
      const onPause = jest.fn()
      const onResume = jest.fn()

      // Test paused state
      const { rerender } = render(
        <Marquee
          marqueeItems={[
            { id: 1, text: 'Item 1' },
            { id: 2, text: 'Item 2' }
          ]}
          paused={true}
          onPause={onPause}
          onResume={onResume}
        />
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()

      // Test non-paused state
      rerender(
        <Marquee
          marqueeItems={[
            { id: 1, text: 'Item 1' },
            { id: 2, text: 'Item 2' }
          ]}
          paused={false}
          onPause={onPause}
          onResume={onResume}
        />
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
    })

    it('integrates pauseOnHover functionality', () => {
      const onMarqueeHover = jest.fn()

      render(
        <Marquee
          marqueeItems={[
            { id: 1, text: 'Item 1' },
            { id: 2, text: 'Item 2' }
          ]}
          pauseOnHover={true}
          onMarqueeHover={onMarqueeHover}
        />
      )

      const container = screen.getByText('Item 1').closest('.marquee-container')
      expect(container).toBeInTheDocument()

      if (container) {
        fireEvent.mouseEnter(container)
        fireEvent.mouseLeave(container)
      }
    })

    it('integrates pauseOnItemHover functionality', () => {
      const onMarqueeItemHover = jest.fn()

      render(
        <Marquee
          marqueeItems={[
            { id: 1, text: 'Item 1' },
            { id: 2, text: 'Item 2' }
          ]}
          pauseOnItemHover={true}
          onMarqueeItemHover={onMarqueeItemHover}
        />
      )

      const item = screen.getByText('Item 1')
      expect(item).toBeInTheDocument()

      fireEvent.mouseEnter(item)
      fireEvent.mouseLeave(item)
    })
  })

  describe('Styling Integration', () => {
    it('integrates custom className props', () => {
      render(
        <Marquee
          marqueeItems={[{ id: 1, text: 'Item 1' }]}
          marqueeClassName="custom-marquee"
          marqueeContainerClassName="custom-container"
          marqueeItemClassName="custom-item"
        />
      )

      const container = document.querySelector('.custom-container')
      const marquee = document.querySelector('.custom-marquee')
      const item = document.querySelector('.custom-item')

      expect(container).toBeInTheDocument()
      expect(marquee).toBeInTheDocument()
      expect(item).toBeInTheDocument()
    })

    it('integrates height prop', () => {
      render(
        <Marquee
          marqueeItems={[{ id: 1, text: 'Item 1' }]}
          height={200}
        />
      )
      const container = document.querySelector('.marquee-container')
      expect(container).toHaveStyle({ height: '200px' })
    })

    it('integrates minHeight prop when no height is provided', () => {
      render(
        <Marquee
          marqueeItems={[{ id: 1, text: 'Item 1' }]}
          minHeight={150}
        />
      )
      const container = document.querySelector('.marquee-container')
      expect(container).toHaveStyle({ minHeight: '150px' })
    })

    it('integrates fade mask functionality', () => {
      render(
        <Marquee
          marqueeItems={[{ id: 1, text: 'Item 1' }]}
          applyFadeMask={true}
          fadeMaskColor={FadeMaskColor.BLACK}
        />
      )

      const container = document.querySelector('.marquee-container')
      expect(container).toHaveClass('fade-mask-black')
    })
  })

  describe('Item Types Integration', () => {
    it('integrates string items', () => {
      render(<Marquee marqueeItems={[
        { id: 1, text: 'String Item 1' },
        { id: 2, text: 'String Item 2' }
      ]} />)

      expect(screen.getByText('String Item 1')).toBeInTheDocument()
      expect(screen.getByText('String Item 2')).toBeInTheDocument()
    })

    it('integrates JSX element items', () => {
      const jsxItems = [<span key="1">JSX Item 1</span>, <div key="2">JSX Item 2</div>]

      render(<Marquee marqueeItems={jsxItems.map((item, index) => ({ id: index, content: item }))} />)

      expect(screen.getByText('JSX Item 1')).toBeInTheDocument()
      expect(screen.getByText('JSX Item 2')).toBeInTheDocument()
    })

    it('integrates object items with text property', () => {
      const objectItems = [
        { text: 'Object Item 1', color: 1 },
        { text: 'Object Item 2', color: 2 },
      ]

      render(<Marquee marqueeItems={objectItems.map((item, index) => ({ ...item, id: index }))} />)

      expect(screen.getByText('Object Item 1')).toBeInTheDocument()
      expect(screen.getByText('Object Item 2')).toBeInTheDocument()
    })
  })

  describe('Configuration Integration', () => {
    it('integrates all configuration options together', () => {
      const config = {
        marqueeItems: [
          { id: 1, text: 'Config Item 1' },
          { id: 2, text: 'Config Item 2' }
        ],
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
      }

      render(<Marquee {...config} />)

      expect(screen.getByText('Config Item 1')).toBeInTheDocument()
      expect(screen.getByText('Config Item 2')).toBeInTheDocument()

      const container = document.querySelector('.test-container')
      const marquee = document.querySelector('.test-marquee')
      const item = document.querySelector('.test-item')

      expect(container).toBeInTheDocument()
      expect(marquee).toBeInTheDocument()
      expect(item).toBeInTheDocument()
    })
  })

  describe('Dummy Item Integration', () => {
    it('integrates dummy items for all direction types', () => {
      const directions = [MarqueeDirection.UP, MarqueeDirection.RIGHT, MarqueeDirection.DOWN, MarqueeDirection.LEFT]

      directions.forEach(direction => {
        const { unmount } = render(
          <Marquee
            marqueeItems={[
            { id: 1, text: 'Item 1' },
            { id: 2, text: 'Item 2' }
          ]}
            direction={direction}
          />
        )

        const dummyItems = document.querySelectorAll('.marquee-dummy-item')
        expect(dummyItems.length).toBe(1)

        const dummyItem = dummyItems[0]
        expect(dummyItem).toHaveStyle({ opacity: '0', pointerEvents: 'none' })

        // Clean up for next iteration
        unmount()
      })
    })

    it('integrates dummy item positioning for different directions', () => {
      // Test UP direction (dummy at end)
      const { rerender } = render(
        <Marquee
          marqueeItems={[{ id: 1, text: 'Real Item' }]}
          direction={MarqueeDirection.UP}
        />
      )

      let marqueeItems = document.querySelectorAll('.marquee-item')
      let dummyItem = document.querySelector('.marquee-dummy-item')

      // For UP direction, dummy should be last
      expect(marqueeItems[marqueeItems.length - 1]).toBe(dummyItem)

      // Test DOWN direction (dummy at beginning)
      rerender(
        <Marquee
          marqueeItems={[{ id: 1, text: 'Real Item' }]}
          direction={MarqueeDirection.DOWN}
        />
      )

      marqueeItems = document.querySelectorAll('.marquee-item')
      dummyItem = document.querySelector('.marquee-dummy-item')

      // For DOWN direction, dummy should be first
      expect(marqueeItems[0]).toBe(dummyItem)
    })
  })

  describe('Callback Integration', () => {
    it('integrates callback props without throwing errors', () => {
      const callbacks = {
        onPause: jest.fn(),
        onResume: jest.fn(),
        onMarqueeHover: jest.fn(),
        onMarqueeItemHover: jest.fn(),
      }

      // Test that callbacks can be passed without causing errors
      expect(() => {
        render(
          <Marquee
            marqueeItems={[{ id: 1, text: 'Test Item' }]}
            pauseOnHover={true}
            pauseOnItemHover={true}
            {...callbacks}
          />
        )
      }).not.toThrow()

      expect(screen.getByText('Test Item')).toBeInTheDocument()
    })
  })
})
