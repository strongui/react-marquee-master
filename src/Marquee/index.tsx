import * as React from 'react'
import useInterval from '../helpers/hookHelpers/useInterval'
import './index.scss'

const { useRef, useState, useEffect, useCallback } = React

// Enums for better type safety and developer experience
export enum MarqueeDirection {
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LEFT = 'left',
}

export enum FadeMaskColor {
  NONE = 'none',
  WHITE = 'white',
  BLACK = 'black',
}

export interface IMarqueeProps {
  delay?: number
  direction?: MarqueeDirection
  height?: number
  inverseMarqueeItems?: boolean
  marqueeClassName?: string
  marqueeContainerClassName?: string
  marqueeItemClassName?: string
  marqueeItems: Array<string | JSX.Element | { text: string; color?: number; id?: number }>
  minHeight?: number
  paused?: boolean
  pauseOnHover?: boolean
  pauseOnItemHover?: boolean
  applyFadeMask?: boolean
  fadeMaskColor?: FadeMaskColor
  onPause?: () => void
  onResume?: () => void
  onMarqueeHover?: () => void
  onMarqueeItemHover?: (item: any, index: number) => void
}

const marqueeDefaults = {
  delay: 40,
  direction: MarqueeDirection.UP,
  marqueeItems: [],
  minHeight: 150,
  pauseOnHover: false,
  pauseOnItemHover: false,
  applyFadeMask: true,
  fadeMaskColor: FadeMaskColor.WHITE,
}

const initState = (props: IMarqueeProps) => {
  const marqueeItems = props.marqueeItems || marqueeDefaults.marqueeItems

  // Always inject dummy item with size 0/0 initially
  // We'll change its size to non-zero only when needed
  const dummyItem = {
    text: '',
    isDummy: true,
    width: 0,
    height: 0,
    id: Date.now() + Math.floor(Math.random() * 1000), // Unique ID
  }

  // For UP scrolling: dummy goes at BEGINNING (top) so items can scroll up smoothly
  // For DOWN scrolling: dummy goes at END (bottom) so items can scroll down smoothly
  // For LEFT scrolling: dummy goes at BEGINNING (left) so items can scroll left smoothly
  // For RIGHT scrolling: dummy goes at END (right) so items can scroll right smoothly
  const direction = props.direction || marqueeDefaults.direction
  const isHorizontal = direction === MarqueeDirection.LEFT || direction === MarqueeDirection.RIGHT
  const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN

  // Don't add dummy item initially - let the ResizeObserver decide if it's needed
  let itemsWithDummy = [...marqueeItems]

  return {
    bottom: 0,
    left: 0,
    marqueeItems: props.inverseMarqueeItems ? itemsWithDummy.reverse() : itemsWithDummy,
    right: 0,
    top: 0,
  }
}

export default function Marquee(props: IMarqueeProps) {
  const marqueeContainerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState(initState(props))
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null)
  const [isUpdatingSpacer, setIsUpdatingSpacer] = useState(false) // Prevent ResizeObserver loops
  const [isRecycling, setIsRecycling] = useState(false) // Prevent multiple recycling calls
  const { bottom, marqueeItems, top, left, right } = state

  // Sync props with internal state when items change
  useEffect(() => {
    console.log('🔄 [Marquee] Props changed, updating state')
    console.log('🔄 [Marquee] New marqueeItems:', props.marqueeItems)
    console.log('🔄 [Marquee] New inverseMarqueeItems:', props.inverseMarqueeItems)

    setState(initState(props))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.marqueeItems, props.inverseMarqueeItems])

  // CLEAN SPACER LOGIC - only calculates when container size changes
  useEffect(() => {
    if (!marqueeContainerRef.current || !marqueeRef.current) return

    const container = marqueeContainerRef.current
    const marquee = marqueeRef.current

    // Calculate spacer ONCE when dimensions are ready
    const calculateSpacerOnce = () => {
      if (!container.offsetWidth || !container.offsetHeight || !marquee.scrollWidth || !marquee.scrollHeight) {
        return
      }

      const direction = props.direction || marqueeDefaults.direction
      const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN

      if (isVertical) {
        const containerHeight = container.offsetHeight
        const contentHeight = marquee.scrollHeight
        const needsSpacer = contentHeight < containerHeight

        if (needsSpacer) {
          const spacerHeight = containerHeight - contentHeight
          console.log('🔍 [Marquee] SPACER: Adding dummy item with height:', spacerHeight)

          setIsUpdatingSpacer(true)
          setState(prev => {
            // Check if dummy item already exists
            const hasDummy = prev.marqueeItems.some(item => (item as any).isDummy)

            if (!hasDummy) {
              // Add dummy item at the correct position
              const direction = props.direction || marqueeDefaults.direction
              const newItems = [...prev.marqueeItems]
              const dummyWithSize = {
                isDummy: true,
                width: 0,
                height: spacerHeight,
                id: Date.now() + Math.floor(Math.random() * 1000),
              }

              if (direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT) {
                newItems.unshift(dummyWithSize as any) // BEGINNING for UP/LEFT
              } else {
                newItems.push(dummyWithSize as any) // END for DOWN/RIGHT
              }

              return { ...prev, marqueeItems: newItems }
            } else {
              // Update existing dummy item size
              return {
                ...prev,
                marqueeItems: prev.marqueeItems.map(item =>
                  (item as any).isDummy ? { ...item, height: spacerHeight } : item
                ),
              }
            }
          })
          setTimeout(() => setIsUpdatingSpacer(false), 100)
        } else {
          console.log('🔍 [Marquee] SPACER: No spacer needed, removing dummy item')
          setIsUpdatingSpacer(true)
          setState(prev => ({
            ...prev,
            marqueeItems: prev.marqueeItems.filter(item => !(item as any).isDummy),
          }))
          setTimeout(() => setIsUpdatingSpacer(false), 100)
        }
      }
    }

    // Calculate ONCE after render
    const timer = setTimeout(calculateSpacerOnce, 100)

    // Only recalculate if container size changes (not on every item change)
    const observer = new ResizeObserver(() => {
      console.log('🔍 [Marquee] Container size changed, recalculating spacer')
      calculateSpacerOnce()
    })

    observer.observe(container)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [props.direction]) // Only depend on direction, not marqueeItems

  const { height, marqueeClassName, marqueeContainerClassName, marqueeItemClassName, minHeight } = props

  const delay = props.delay || marqueeDefaults.delay
  const direction = props.direction || marqueeDefaults.direction
  const isHorizontal = direction === MarqueeDirection.LEFT || direction === MarqueeDirection.RIGHT
  const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN
  const paused = props.paused || false
  const pauseOnHover = props.pauseOnHover || marqueeDefaults.pauseOnHover
  const pauseOnItemHover = props.pauseOnItemHover || marqueeDefaults.pauseOnItemHover
  const applyFadeMask = props.applyFadeMask !== undefined ? props.applyFadeMask : marqueeDefaults.applyFadeMask
  const fadeMaskColor = props.fadeMaskColor || marqueeDefaults.fadeMaskColor
  const onMarqueeHover = props.onMarqueeHover
  const onMarqueeItemHover = props.onMarqueeItemHover

  const marqueeContainerStyle: React.CSSProperties = {}
  if (height) {
    marqueeContainerStyle.height = `${height}px`
  } else if (minHeight) {
    marqueeContainerStyle.minHeight = `${minHeight}px`
  } else {
    marqueeContainerStyle.minHeight = `${marqueeDefaults.minHeight}px`
  }

  const marqueeStyle: React.CSSProperties = {}
  if (direction === MarqueeDirection.UP) {
    marqueeStyle.top = `${top}px`
  } else if (direction === MarqueeDirection.RIGHT) {
    marqueeStyle.right = `${right}px`
  } else if (direction === MarqueeDirection.DOWN) {
    marqueeStyle.bottom = `${bottom}px`
  } else if (direction === MarqueeDirection.LEFT) {
    marqueeStyle.left = `${left}px`
  }

  const getFirstMarqueeItemSize = () => {
    // Find the first NON-DUMMY item
    const marqueeElement = marqueeRef.current
    if (!marqueeElement) return 0

    for (let i = 0; i < marqueeElement.children.length; i++) {
      const child = marqueeElement.children[i] as HTMLDivElement
      if (child && !child.classList.contains('marquee-dummy-item')) {
        if (isHorizontal) {
          return child.offsetWidth
        }
        return child.offsetHeight
      }
    }
    return 0
  }

  const getLastMarqueeItemSize = () => {
    // Find the last NON-DUMMY item
    const marqueeElement = marqueeRef.current
    if (!marqueeElement) return 0

    for (let i = marqueeElement.children.length - 1; i >= 0; i--) {
      const child = marqueeElement.children[i] as HTMLDivElement
      if (child && !child.classList.contains('marquee-dummy-item')) {
        if (isHorizontal) {
          return child.offsetWidth
        }
        return child.offsetHeight
      }
    }
    return 0
  }

  // Determine if marquee should be paused due to hover
  const shouldPause = paused || (pauseOnHover && isHovered) || (pauseOnItemHover && hoveredItemIndex !== null)

  const animationFunction = useCallback(() => {
    // Don't animate if paused or hovered
    if (shouldPause) return

    // Don't run animation if ResizeObserver is updating spacer
    if (isUpdatingSpacer) return

    const nextMarqueeItems = [...marqueeItems]
    let nextProp: 'top' | 'right' | 'bottom' | 'left'
    switch (direction) {
      case MarqueeDirection.UP:
        nextProp = 'top'
        break
      case MarqueeDirection.RIGHT:
        nextProp = 'right'
        break
      case MarqueeDirection.DOWN:
        nextProp = 'bottom'
        break
      case MarqueeDirection.LEFT:
        nextProp = 'left'
        break

      default:
        nextProp = 'top'
        break
    }

    let nextPropValue = state[nextProp]

    // Next tick value - smaller steps for smooth scrolling
    nextPropValue -= 0.5
    const marqueeItemSize =
      direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT
        ? getFirstMarqueeItemSize()
        : getLastMarqueeItemSize()

    const marqueeItemPassed = (marqueeItemSize ? Math.floor(Math.abs(nextPropValue) / marqueeItemSize) : 0) > 0

    // Handle recycling when item passes
    if (marqueeItemPassed && !isRecycling) {
      // PREVENT MULTIPLE RECYCLING CALLS
      setIsRecycling(true)

      if (direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT) {
        nextMarqueeItems.push(nextMarqueeItems.shift() as any)
      } else {
        nextMarqueeItems.unshift(nextMarqueeItems.pop() as any)
      }
      nextPropValue = nextPropValue + marqueeItemSize

      // Reset recycling flag after state update
      setTimeout(() => setIsRecycling(false), 50)
    }

    setState(s => {
      const newState = {
        ...s,
        [nextProp]: nextPropValue,
        marqueeItems: nextMarqueeItems,
      }

      return newState
    })

    // Animation complete
  })

  // Use the stable callback with useInterval
  useInterval(animationFunction, shouldPause ? null : delay)

  const marqueeItemElms = marqueeItems.map((marqueeItem, i) => {
    // Handle dummy items
    if (marqueeItem && typeof marqueeItem === 'object' && 'isDummy' in marqueeItem) {
      // Use the height/width from our calculated state instead of recalculating
      const dummyWidth = (marqueeItem as any).width || 0
      const dummyHeight = (marqueeItem as any).height || 0

      return (
        <div
          className={`marquee-item marquee-dummy-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
          key={`dummy-${i}`}
          style={{
            width: isHorizontal ? `${dummyWidth}px` : 'auto',
            height: isVertical ? `${dummyHeight}px` : 'auto',
            opacity: 0,
            pointerEvents: 'none',
            flexShrink: 0,
          }}
        />
      )
    }

    // Handle different item types for real items
    let itemText: string | JSX.Element
    let itemColor: number | undefined

    if (typeof marqueeItem === 'string') {
      itemText = marqueeItem
    } else if (React.isValidElement(marqueeItem)) {
      itemText = marqueeItem
    } else if (typeof marqueeItem === 'object' && 'text' in marqueeItem && typeof marqueeItem.text === 'string') {
      itemText = marqueeItem.text
      itemColor = (marqueeItem as any).color
    } else {
      itemText = String(marqueeItem)
    }

    return (
      <div
        className={`marquee-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
        key={itemColor ? `item-${itemColor}-${i}` : i}
        data-color={itemColor}
        onMouseEnter={() => {
          if (pauseOnItemHover) {
            setHoveredItemIndex(i)
            onMarqueeItemHover?.(marqueeItem, i)
          }
        }}
        onMouseLeave={() => {
          if (pauseOnItemHover) {
            setHoveredItemIndex(null)
          }
        }}
      >
        {itemText}
      </div>
    )
  })

  return (
    <div
      key={`marquee-${marqueeItems.length}-${JSON.stringify(marqueeItems.map(item => (typeof item === 'object' && 'id' in item ? item.id : item)))}`}
      className={`marquee-container${isHorizontal ? ' horizontal' : ''}${
        applyFadeMask ? ` fade-mask-${fadeMaskColor}` : ''
      }${marqueeContainerClassName ? ` ${marqueeContainerClassName}` : ''}`}
      ref={marqueeContainerRef}
      style={marqueeContainerStyle}
      onMouseEnter={() => {
        if (pauseOnHover) {
          setIsHovered(true)
          onMarqueeHover?.()
        }
      }}
      onMouseLeave={() => {
        if (pauseOnHover) {
          setIsHovered(false)
        }
      }}
    >
      <div
        className={`marquee${marqueeClassName ? ` ${marqueeClassName}` : ''}`}
        ref={marqueeRef}
        style={marqueeStyle}
      >
        {marqueeItemElms}
      </div>
    </div>
  )
}
