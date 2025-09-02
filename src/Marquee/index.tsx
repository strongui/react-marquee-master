import * as React from 'react'
import useInterval from '../helpers/hookHelpers/useInterval'
import useWindowResize from './hooks/useWindowResize'
import './index.scss'

const { useRef, useState, useEffect, useCallback, useLayoutEffect, useMemo } = React

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
  onItemClick?: (item: MarqueeItem, index: number) => void
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
  const direction = props.direction || marqueeDefaults.direction

  // Always add a dummy item for seamless infinite scroll
  // For RIGHT/DOWN: dummy goes at the beginning (items get moved to end)
  // For LEFT/UP: dummy goes at the end (items get moved to beginning)
  const dummyItem = { isDummy: true, id: 'dummy-spacer', width: 0, height: 0 }
  const itemsWithDummy =
    direction === MarqueeDirection.RIGHT || direction === MarqueeDirection.DOWN
      ? [dummyItem, ...marqueeItems]
      : [...marqueeItems, dummyItem]

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
  const {
    height,
    marqueeClassName: marqueeClassNameProp,
    marqueeContainerClassName,
    marqueeItemClassName,
    minHeight,
    onItemClick,
  } = props

  /* Vars */
  // Get direction early for memoization
  const direction = props.direction || marqueeDefaults.direction
  const isHorizontal = direction === MarqueeDirection.LEFT || direction === MarqueeDirection.RIGHT
  const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN

  // Compute marquee className with direction-specific class
  const marqueeClassName = `marquee ${
    direction === MarqueeDirection.LEFT
      ? 'left-scroll'
      : direction === MarqueeDirection.RIGHT
        ? 'right-scroll'
        : direction === MarqueeDirection.UP
          ? 'top-scroll'
          : 'bottom-scroll'
  }${marqueeClassNameProp ? ` ${marqueeClassNameProp}` : ''}`

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
  const isDummyItem = useCallback((item: MarqueeItem): item is DummyItem => {
    return typeof item === 'object' && item !== null && 'isDummy' in item && item.isDummy === true
  }, [])

  // Helper function to get stable ID from any MarqueeItem
  const getItemId = useCallback(
    (item: MarqueeItem, index: number): string => {
      if (isDummyItem(item)) {
        return item.id
      }
      if (typeof item === 'object' && item !== null && 'id' in item) {
        return String(item.id)
      }
      // Fallback to index-based ID (not ideal, but safe)
      return `item-${index}`
    },
    [isDummyItem]
  )

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

  const [dummyItemSize, setDummyItemSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const { bottom, marqueeItems, top, left, right } = state

  /* Effects */
  // Sync props with internal state when items change
  useEffect(() => {
    setState(initState(props))
    setContainerIsReady(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.marqueeItems, props.inverseMarqueeItems])

  // Handle window resize to recalculate container size and dummy items
  const handleWindowResize = useCallback(() => {
    setContainerIsReady(false)
    setDummyItemSize({ width: 0, height: 0 })
  }, [])

  useWindowResize(handleWindowResize, 100)

  const getFirstMarqueeItemSize = useCallback(
    (skipDummy = false) => {
      // Get the actual first item in the array (could be dummy or regular)
      const firstItem = marqueeItems[0]

      if (!firstItem) return 0

      // If we need to skip dummy items, find the first real item
      if (skipDummy && firstItem && 'isDummy' in firstItem && firstItem.isDummy) {
        let firstRealItem = null
        let firstRealIndex = -1

        for (let i = 0; i < marqueeItems.length; i++) {
          const item = marqueeItems[i]
          if (item && (!('isDummy' in item) || !item.isDummy)) {
            firstRealItem = item
            firstRealIndex = i
            break
          }
        }

        if (!firstRealItem) return 0

        // Get the ref for this specific item
        const itemId = getItemId(firstRealItem, firstRealIndex)
        const itemRef = itemRefs.current.get(itemId)

        if (itemRef) {
          const size = isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight

          return size
        }
        return 0
      }

      // Get the ref for this specific item
      const itemId = getItemId(firstItem, 0)
      const itemRef = itemRefs.current.get(itemId)

      if (itemRef) {
        const size = isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight

        return size
      }

      return 0
    },
    [isHorizontal, marqueeItems, getItemId]
  )

  const getLastMarqueeItemSize = useCallback(
    (skipDummy = false) => {
      // Get the actual last item in the array (could be dummy or regular)
      const lastItem = marqueeItems[marqueeItems.length - 1]

      if (!lastItem) return 0

      // If we need to skip dummy items, find the last real item
      if (skipDummy && lastItem && 'isDummy' in lastItem && lastItem.isDummy) {
        let lastRealItem = null
        let lastRealIndex = -1

        for (let i = marqueeItems.length - 1; i >= 0; i--) {
          const item = marqueeItems[i]
          if (item && (!('isDummy' in item) || !item.isDummy)) {
            lastRealItem = item
            lastRealIndex = i
            break
          }
        }

        if (!lastRealItem) return 0

        // Get the ref for this specific item
        const itemId = getItemId(lastRealItem, lastRealIndex)
        const itemRef = itemRefs.current.get(itemId)

        if (itemRef) {
          const size = isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight

          return size
        }
        return 0
      }

      // Get the ref for this specific item
      const itemId = getItemId(lastItem, marqueeItems.length - 1)
      const itemRef = itemRefs.current.get(itemId)

      if (itemRef) {
        const size = isHorizontal ? itemRef.offsetWidth : itemRef.offsetHeight

        return size
      }

      return 0
    },
    [isHorizontal, marqueeItems, getItemId]
  )

  // Set initial off-screen positioning for infinite scroll
  useLayoutEffect(() => {
    if (
      containerIsReady ||
      !marqueeContainerRef.current ||
      !marqueeRef.current ||
      !marqueeContainerRef.current?.getBoundingClientRect ||
      !marqueeRef.current?.getBoundingClientRect
    ) {
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

    // Get the size of the largest item for buffer calculation
    // We need enough buffer to handle the largest item that might scroll in
    const firstItemSize = getFirstMarqueeItemSize(true) // Skip dummy items
    const lastItemSize = getLastMarqueeItemSize(true) // Skip dummy items
    const nextItemSize = Math.max(firstItemSize, lastItemSize)

    // We need content to fill container + first item size for seamless scrolling
    const requiredContentSize = isHorizontal ? containerWidth + nextItemSize : containerHeight + nextItemSize
    const offset = requiredContentSize - totalContentSize

    // Set initial position based on direction
    if (direction === MarqueeDirection.LEFT) {
      // Start items off-screen to the right
      setState(prev => ({ ...prev, left: containerWidth }))
    } else if (direction === MarqueeDirection.RIGHT) {
      // Start items off-screen to the left
      setState(prev => ({ ...prev, right: containerWidth }))
    } else if (direction === MarqueeDirection.UP) {
      // Start items off-screen below
      setState(prev => ({ ...prev, top: containerHeight }))
    } else if (direction === MarqueeDirection.DOWN) {
      // Start items off-screen above
      setState(prev => ({ ...prev, bottom: containerHeight }))
    }

    // Calculate dummy spacer size: ensure content fills container + has item ready to scroll in
    let dummySize = { width: 0, height: 0 }

    // We need a spacer if content doesn't fill the required size (container + first item)
    if (offset > 0) {
      // Dummy size = gap to fill to reach required content size
      dummySize = isHorizontal ? { width: offset, height: 0 } : { width: 0, height: offset }
    }

    // All these will be batched into a single re-render
    setContainerIsReady(true)
    setDummyItemSize(dummySize)
  }, [direction, isHorizontal, containerIsReady, getFirstMarqueeItemSize, getLastMarqueeItemSize])

  const marqueeContainerStyle: React.CSSProperties = useMemo(() => {
    const style: React.CSSProperties = {}
    if (height) {
      style.height = `${height}px`
    } else if (minHeight) {
      style.minHeight = `${minHeight}px`
    } else {
      style.minHeight = `${marqueeDefaults.minHeight}px`
    }
    return style
  }, [height, minHeight])

  const marqueeStyle: React.CSSProperties = useMemo(() => {
    const style: React.CSSProperties = {}
    if (direction === MarqueeDirection.UP) {
      style.top = `${top}px`
    } else if (direction === MarqueeDirection.RIGHT) {
      style.right = `${right}px`
    } else if (direction === MarqueeDirection.DOWN) {
      style.bottom = `${bottom}px`
    } else if (direction === MarqueeDirection.LEFT) {
      style.left = `${left}px`
    }

    if (!containerIsReady) {
      style.opacity = 0
    }
    return style
  }, [direction, top, right, bottom, left, containerIsReady])

  const containerClassName = useMemo(() => {
    const baseClass = 'marquee-container'
    const orientationClass = isHorizontal ? ' horizontal' : ' vertical'
    const fadeMaskClass = applyFadeMask ? ` fade-mask-${fadeMaskColor}` : ''
    const customClass = marqueeContainerClassName ? ` ${marqueeContainerClassName}` : ''

    return `${baseClass}${orientationClass}${fadeMaskClass}${customClass}`
  }, [isHorizontal, applyFadeMask, fadeMaskColor, marqueeContainerClassName])

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

    // Next tick value - 1 pixel movement for smooth scrolling
    nextPropValue -= 1
    const marqueeItemSize =
      direction === MarqueeDirection.LEFT || direction === MarqueeDirection.UP
        ? getFirstMarqueeItemSize() // For UP, LEFT, DOWN: first item gets moved to end
        : getLastMarqueeItemSize() // For RIGHT: last item gets moved to beginning

    // Check if an item has passed completely off-screen in the direction it's traveling
    let marqueeItemPassed = false

    if (direction === MarqueeDirection.LEFT) {
      // Item started off-screen right, check if it's now completely off-screen left
      const threshold = 0 - marqueeItemSize
      marqueeItemPassed = nextPropValue <= threshold
    } else if (direction === MarqueeDirection.RIGHT) {
      // Item started off-screen left, check if it's now completely off-screen right
      const threshold = 0 - marqueeItemSize
      marqueeItemPassed = nextPropValue <= threshold
    } else if (direction === MarqueeDirection.UP) {
      // Item started off-screen below, check if it's now completely off-screen above
      const threshold = 0 - marqueeItemSize
      marqueeItemPassed = nextPropValue <= threshold
    } else if (direction === MarqueeDirection.DOWN) {
      // Item started off-screen above, check if it's now completely off-screen below
      const threshold = 0 - marqueeItemSize
      marqueeItemPassed = nextPropValue <= threshold
    }

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
        // Only update marqueeItems if they actually changed (during recycling)
        ...(marqueeItemPassed && { marqueeItems: nextMarqueeItems }),
      }

      return newState
    })

    // Animation complete
  }, [containerIsReady, shouldPause, marqueeItems, direction, state, getFirstMarqueeItemSize, getLastMarqueeItemSize])

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
          ref={el => registerItemRef(itemId, el)}
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
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        ref={el => registerItemRef(itemId, el)}
        className={`marquee-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}${onItemClick ? ' marquee-item--clickable' : ''}`}
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
        onClick={() => {
          onItemClick?.(marqueeItem, i)
        }}
      >
        {itemIcon && <span className="marquee-item-icon">{itemIcon}</span>}
        {itemIcon && <span className="marquee-item-separator"> </span>}
        {itemText}
      </div>
    )
  })

  return (
    <div
      className={containerClassName}
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
        className={marqueeClassName}
        ref={marqueeRef}
        style={marqueeStyle}
      >
        {marqueeItemElms}
      </div>
    </div>
  )
}
