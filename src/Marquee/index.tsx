import * as React from 'react'
import useInterval from '../helpers/hookHelpers/useInterval'
import './index.scss'

const { useRef, useState, useEffect, useCallback, useLayoutEffect } = React

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

export interface MarqueeItemObject {
  color?: number
  icon?: string
  id: number
  text: string
}

export interface DummyItem {
  isDummy: true
  text: string
  id: string
  width?: number
  height?: number
}

export type MarqueeItem = string | JSX.Element | MarqueeItemObject | DummyItem

export interface IMarqueeProps {
  delay?: number
  direction?: MarqueeDirection
  height?: number
  inverseMarqueeItems?: boolean
  marqueeClassName?: string
  marqueeContainerClassName?: string
  marqueeItemClassName?: string
  marqueeItems: MarqueeItem[]
  minHeight?: number
  paused?: boolean
  pauseOnHover?: boolean
  pauseOnItemHover?: boolean
  applyFadeMask?: boolean
  fadeMaskColor?: FadeMaskColor
  onPause?: () => void
  onResume?: () => void
  onMarqueeHover?: () => void
  onMarqueeItemHover?: (item: MarqueeItem, index: number) => void
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

  // No dummy items - we'll use off-screen positioning for infinite scroll
  return {
    bottom: 0,
    left: 0,
    marqueeItems: props.inverseMarqueeItems ? marqueeItems.reverse() : marqueeItems,
    right: 0,
    top: 0,
  }
}

export default function Marquee(props: IMarqueeProps) {
  /* Props */
  const { height, marqueeClassName, marqueeContainerClassName, marqueeItemClassName, minHeight } = props

  /* Vars */
  // Get direction early for memoization
  const direction = props.direction || marqueeDefaults.direction
  const isHorizontal = direction === MarqueeDirection.LEFT || direction === MarqueeDirection.RIGHT

  const delay = props.delay || marqueeDefaults.delay
  const paused = props.paused || false
  // const paused = true
  const pauseOnHover = props.pauseOnHover || marqueeDefaults.pauseOnHover
  const pauseOnItemHover = props.pauseOnItemHover || marqueeDefaults.pauseOnItemHover
  const applyFadeMask = props.applyFadeMask !== undefined ? props.applyFadeMask : marqueeDefaults.applyFadeMask
  const fadeMaskColor = props.fadeMaskColor || marqueeDefaults.fadeMaskColor
  const onMarqueeHover = props.onMarqueeHover
  const onMarqueeItemHover = props.onMarqueeItemHover

  /* Refs */
  const marqueeContainerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  // Refs for each marquee item - direct access without DOM traversal
  const itemRefs = useRef<Map<string | number, HTMLDivElement>>(new Map())

  // Register item ref for direct access
  const registerItemRef = useCallback((key: string | number, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(key, element)
    } else {
      itemRefs.current.delete(key)
    }
  }, [])

  // Helper function to parse marquee items and extract text, color, and icon
  const parseMarqueeItem = useCallback((marqueeItem: MarqueeItem) => {
    let itemText: string | JSX.Element
    let itemColor: number | undefined
    let itemIcon: string | undefined

    if (typeof marqueeItem === 'string') {
      itemText = marqueeItem
    } else if (React.isValidElement(marqueeItem)) {
      itemText = marqueeItem
    } else if (typeof marqueeItem === 'object' && 'text' in marqueeItem && typeof marqueeItem.text === 'string') {
      itemText = marqueeItem.text
      itemColor = (marqueeItem as MarqueeItemObject).color
      itemIcon = (marqueeItem as MarqueeItemObject).icon
    } else {
      itemText = String(marqueeItem)
    }

    return { itemText, itemColor, itemIcon }
  }, [])

  /* State */
  const [state, setState] = useState(initState(props))
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null)
  const [containerIsReady, setContainerIsReady] = useState(false)
  const [containerState, setContainerState] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  const { width: containerWidth, height: containerHeight } = containerState
  const { bottom, marqueeItems, top, left, right } = state

  /* Effects */
  // Sync props with internal state when items change
  useEffect(() => {
    console.log('🔄 [Marquee] Props changed, updating state')
    console.log('🔄 [Marquee] New marqueeItems:', props.marqueeItems)
    console.log('🔄 [Marquee] New inverseMarqueeItems:', props.inverseMarqueeItems)
    console.log('🔄 [Marquee] Props Have Changed, Resetting State:', state)

    setState(initState(props))
    setContainerIsReady(false)
    setContainerState({ width: 0, height: 0 })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.marqueeItems, props.inverseMarqueeItems])

  // ONLY handle container size changes - spacer logic moved to useLayoutEffect
  useEffect(() => {
    if (!marqueeContainerRef.current) return

    const container = marqueeContainerRef.current

    // Only recalculate if container size changes (not on every item change)
    const observer = new ResizeObserver(() => {
      console.log('🔍 [Marquee] Container size changed, triggering useLayoutEffect')
      // The useLayoutEffect will handle the spacer calculation
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Set initial off-screen positioning for infinite scroll
  useLayoutEffect(() => {
    if (
      containerIsReady ||
      !marqueeContainerRef.current ||
      !marqueeRef.current ||
      !marqueeContainerRef.current?.getBoundingClientRect ||
      !marqueeRef.current?.getBoundingClientRect
    ) {
      console.log('🔄 [Marquee] Container is not ready, skipping useLayoutEffect')
      console.log('🔄 [Marquee] Container is not ready, skipping useLayoutEffect', containerIsReady)
      console.log('🔄 [Marquee] Container is not ready, skipping useLayoutEffect', marqueeContainerRef.current)
      console.log('🔄 [Marquee] Container is not ready, skipping useLayoutEffect', marqueeRef.current)
      console.log(
        '🔄 [Marquee] Container is not ready, skipping useLayoutEffect',
        marqueeContainerRef.current?.getBoundingClientRect
      )
      console.log(
        '🔄 [Marquee] Container is not ready, skipping useLayoutEffect',
        marqueeRef.current?.getBoundingClientRect
      )

      return
    }

    const container = marqueeContainerRef.current
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    // const marquee = marqueeRef.current

    // // Calculate total content width/height
    // let totalContentSize = 0
    // for (const [, itemRef] of itemRefs.current.entries()) {
    //   if (itemRef) {
    //     totalContentSize += isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight
    //   }
    // }

    // Set initial position based on direction
    if (direction === MarqueeDirection.LEFT) {
      // Start items off-screen to the right
      setState(prev => ({ ...prev, left: containerWidth }))
    } else if (direction === MarqueeDirection.RIGHT) {
      // Start items off-screen to the left
      setState(prev => ({ ...prev, right: containerWidth }))
    } else if (direction === MarqueeDirection.UP) {
      // Start items off-screen below
      setState(prev => ({ ...prev, top: containerWidth }))
    } else if (direction === MarqueeDirection.DOWN) {
      // Start items off-screen above
      setState(prev => ({ ...prev, bottom: containerWidth }))
    }

    console.log('🔄 [Marquee] Container is ready, setting containerIsReadyRef to true', containerWidth)

    setContainerIsReady(true)
    setContainerState({ width: containerWidth, height: containerHeight })
  }, [direction, isHorizontal, containerIsReady])

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

  if (!containerIsReady) {
    marqueeStyle.opacity = 0
  }

  const getFirstMarqueeItemSize = useCallback(() => {
    // Get first non-dummy item size using refs
    for (const [, itemRef] of itemRefs.current) {
      if (itemRef && !itemRef.classList.contains('marquee-dummy-item')) {
        return isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight
      }
    }
    return 0
  }, [isHorizontal])

  const getLastMarqueeItemSize = useCallback(() => {
    // Get last non-dummy item size using refs
    const entries = Array.from(itemRefs.current.entries())
    for (let i = entries.length - 1; i >= 0; i--) {
      const [, itemRef] = entries[i]
      if (itemRef && !itemRef.classList.contains('marquee-dummy-item')) {
        return isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight
      }
    }
    return 0
  }, [isHorizontal])

  // Determine if marquee should be paused due to hover
  const shouldPause = paused || (pauseOnHover && isHovered) || (pauseOnItemHover && hoveredItemIndex !== null)

  const animationFunction = useCallback(() => {
    if (!containerIsReady) return

    // Don't animate if paused or hovered
    if (shouldPause) return

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

    console.log('nextPropValue', nextPropValue)

    // Next tick value - 1 pixel movement for smooth scrolling
    nextPropValue -= 1
    const marqueeItemSize =
      direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT
        ? getFirstMarqueeItemSize()
        : getLastMarqueeItemSize()

    console.log('marqueeItemSize', marqueeItemSize)
    console.log('nextPropValue', nextPropValue)

    // Check if an item has passed completely off-screen in the direction it's traveling
    let marqueeItemPassed = false

    const containerSize = isHorizontal ? containerWidth : containerHeight

    if (direction === MarqueeDirection.LEFT) {
      // Item started off-screen right, check if it's now completely off-screen left
      marqueeItemPassed = nextPropValue <= 0 - marqueeItemSize
    } else if (direction === MarqueeDirection.RIGHT) {
      // Item started off-screen left, check if it's now completely off-screen right
      marqueeItemPassed = nextPropValue >= containerSize + marqueeItemSize
    } else if (direction === MarqueeDirection.UP) {
      // Item started off-screen below, check if it's now completely off-screen above
      marqueeItemPassed = nextPropValue <= 0 - marqueeItemSize
    } else if (direction === MarqueeDirection.DOWN) {
      // Item started off-screen above, check if it's now completely off-screen below
      marqueeItemPassed = nextPropValue >= containerSize + marqueeItemSize
    }

    console.log('marqueeItemPassed', marqueeItemPassed)

    // Move items like a conveyor belt for infinite scrolling
    if (marqueeItemPassed) {
      if (direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT) {
        // For UP/LEFT: move first item to end
        const shiftedItem = nextMarqueeItems.shift()
        if (shiftedItem) nextMarqueeItems.push(shiftedItem)
      } else {
        // For DOWN/RIGHT: move last item to beginning
        const poppedItem = nextMarqueeItems.pop()
        if (poppedItem) nextMarqueeItems.unshift(poppedItem)
      }
      // Reset position after moving item
      nextPropValue = nextPropValue + marqueeItemSize
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
  }, [shouldPause, marqueeItems, direction, state, getLastMarqueeItemSize, getFirstMarqueeItemSize, containerIsReady])

  // Use the stable callback with useInterval
  useInterval(animationFunction, shouldPause ? null : delay || marqueeDefaults.delay)

  const marqueeItemElms = marqueeItems.map((marqueeItem, i) => {
    // Parse item using helper function
    const { itemText, itemColor, itemIcon } = parseMarqueeItem(marqueeItem)

    const itemKey = itemColor ? `item-${itemColor}-${i}` : i
    return (
      <div
        ref={el => registerItemRef(itemKey, el)}
        className={`marquee-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
        key={itemKey}
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
        {itemIcon && <span className="marquee-item-icon">{itemIcon}</span>}
        {itemIcon && <span className="marquee-item-separator"> </span>}
        {itemText}
      </div>
    )
  })

  return (
    <>
      <div>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
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
    </>
  )
}
