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
  id: string | number
  text: string
}

export interface MarqueeItemWithId {
  id: string | number
  content: string | JSX.Element
  color?: number
  icon?: string
}

export type DummyItem = {
  isDummy: boolean
  id: string
  width: number
  height: number
}

export type MarqueeItem = MarqueeItemObject | MarqueeItemWithId | DummyItem

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

  // Always add a dummy item for seamless infinite scroll
  const itemsWithDummy = [...marqueeItems, { isDummy: true, id: 'dummy-spacer', width: 0, height: 0 }]

  return {
    bottom: 0,
    left: 0,
    marqueeItems: props.inverseMarqueeItems ? itemsWithDummy.reverse() : itemsWithDummy,
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
  const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN

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

  // Type guard function for dummy items
  const isDummyItem = (item: MarqueeItem): item is DummyItem => {
    return typeof item === 'object' && item !== null && 'isDummy' in item && item.isDummy === true
  }

  // Helper function to get stable ID from any MarqueeItem
  const getItemId = (item: MarqueeItem, index: number): string => {
    if (isDummyItem(item)) {
      return item.id
    }
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return String(item.id)
    }
    // Fallback to index-based ID (not ideal, but safe)
    return `item-${index}`
  }

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

    if (typeof marqueeItem === 'object' && marqueeItem !== null) {
      if ('content' in marqueeItem) {
        // MarqueeItemWithId type
        itemText = marqueeItem.content
        itemColor = marqueeItem.color
        itemIcon = marqueeItem.icon
      } else if ('text' in marqueeItem && typeof marqueeItem.text === 'string') {
        // MarqueeItemObject type
        itemText = marqueeItem.text
        itemColor = marqueeItem.color
        itemIcon = marqueeItem.icon
      } else {
        itemText = String(marqueeItem)
      }
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
  const [marqueeState, setMarqueeState] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [dummyItemSize, setDummyItemSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

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
    setMarqueeState({ width: 0, height: 0 })

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
    let totalContentSize = 0
    for (const [, itemRef] of itemRefs.current.entries()) {
      // Skip dummy items
      if (itemRef.dataset.dummy) {
        continue
      }
      if (itemRef) {
        totalContentSize += isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight
      }
    }

    const offset = isHorizontal ? containerWidth - totalContentSize : containerHeight - totalContentSize

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

    // Batch all state updates together for optimal performance
    const dummySize =
      offset > 0
        ? isHorizontal
          ? { width: offset, height: 0 }
          : { width: 0, height: offset }
        : { width: 0, height: 0 }

    // All these will be batched into a single re-render
    setContainerIsReady(true)
    setContainerState({ width: containerWidth, height: containerHeight })
    setMarqueeState({ width: containerWidth, height: containerHeight })
    setDummyItemSize(dummySize)
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

  if (containerIsReady) {
    // if (isHorizontal) {
    //   marqueeStyle.width = `${marqueeState.width}px`
    // } else {
    //   marqueeStyle.height = `${marqueeState.height}px`
    // }
  } else {
    marqueeStyle.opacity = 0
  }

  const getFirstMarqueeItemSize = useCallback(() => {
    // Get first visible item from the array (skip dummy items with 0 size)
    const firstItem = marqueeItems.find(item => {
      if (!isDummyItem(item)) return true

      // For dummy items, check if they have visible size
      const itemId = getItemId(item, marqueeItems.indexOf(item))
      const itemRef = itemRefs.current.get(itemId)
      if (!itemRef) return false

      const size = isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight
      return size > 0
    })

    if (!firstItem) return 0

    // Get the ref for this specific item
    const itemId = getItemId(firstItem, marqueeItems.indexOf(firstItem))
    const itemRef = itemRefs.current.get(itemId)

    if (itemRef) {
      return isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight
    }
    return 0
  }, [isHorizontal, marqueeItems, getItemId, isDummyItem])

  const getLastMarqueeItemSize = useCallback(() => {
    // Get last visible item from the array (skip dummy items with 0 size)
    const lastItem = [...marqueeItems].reverse().find(item => {
      if (!isDummyItem(item)) return true

      // For dummy items, check if they have visible size
      const itemId = getItemId(item, marqueeItems.indexOf(item))
      const itemRef = itemRefs.current.get(itemId)
      if (!itemRef) return false

      const size = isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight
      return size > 0
    })

    if (!lastItem) return 0

    // Get the ref for this specific item
    const itemId = getItemId(lastItem, marqueeItems.indexOf(lastItem))
    const itemRef = itemRefs.current.get(itemId)

    if (itemRef) {
      return isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight
    }
    return 0
  }, [isHorizontal, marqueeItems, getItemId, isDummyItem])

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
      console.log('ALERT!!!!!!!!!!!!1 [Marquee] Marquee item passed, moving item')
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

      if (isHorizontal) {
        setMarqueeState(prev => ({ ...prev, width: containerWidth + marqueeItemSize }))
      } else {
        setMarqueeState(prev => ({ ...prev, height: containerHeight + marqueeItemSize }))
      }
    }

    setState(s => {
      const newState = {
        ...s,
        [nextProp]: nextPropValue,
        // Only update marqueeItems if they actually changed (during recycling)
        ...(marqueeItemPassed && { marqueeItems: nextMarqueeItems }),
      }

      return newState
    })

    // Animation complete
  }, [
    containerIsReady,
    shouldPause,
    marqueeItems,
    direction,
    state,
    getFirstMarqueeItemSize,
    getLastMarqueeItemSize,
    isHorizontal,
    containerWidth,
    containerHeight,
  ])

  // Use the stable callback with useInterval
  useInterval(animationFunction, shouldPause ? null : delay || marqueeDefaults.delay)

  const marqueeItemElms = marqueeItems.map((marqueeItem, i) => {
    // Get stable ID for this item
    const itemId = getItemId(marqueeItem, i)

    // Handle dummy items
    if (isDummyItem(marqueeItem)) {
      return (
        <div
          key={itemId}
          data-dummy={true}
          className="marquee-dummy-item"
          style={{
            width: isHorizontal ? `${dummyItemSize.width}px` : 0,
            height: isVertical ? `${dummyItemSize.height}px` : 0,
          }}
        />
      )
    }

    // Parse regular item using helper function
    const { itemText, itemColor, itemIcon } = parseMarqueeItem(marqueeItem)

    return (
      <div
        ref={el => registerItemRef(itemId, el)}
        className={`marquee-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
        key={itemId}
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
          className={`marquee${isHorizontal ? ` left-scroll` : ` top-scroll`}${marqueeClassName ? ` ${marqueeClassName}` : ''}`}
          ref={marqueeRef}
          style={marqueeStyle}
        >
          {marqueeItemElms}
        </div>
      </div>
    </>
  )
}
