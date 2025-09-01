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

const dummyItemTemplate: DummyItem = {
  isDummy: true,
  text: '',
  id: 'dummy-spacer',
}

export default function Marquee(props: IMarqueeProps) {
  const marqueeContainerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  // Refs for each marquee item - direct access without DOM traversal
  const itemRefs = useRef<Map<string | number, HTMLDivElement>>(new Map())

  // Static dummy item template - only dimensions change

  // Type guard function for dummy items
  const isDummyItem = (item: MarqueeItem): item is DummyItem => {
    return typeof item === 'object' && item !== null && 'isDummy' in item && item.isDummy === true
  }

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

  // Register item ref for direct access
  const registerItemRef = useCallback((key: string | number, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(key, element)
    } else {
      itemRefs.current.delete(key)
    }
  }, [])

  // Get direction early for memoization
  const direction = props.direction || marqueeDefaults.direction
  const isHorizontal = direction === MarqueeDirection.LEFT || direction === MarqueeDirection.RIGHT
  const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN

  // Memoized dummy item styles - only height/width change
  const getDummyItemStyle = useCallback(
    (width: number, height: number) => ({
      width: isHorizontal ? `${width}px` : 'auto',
      height: isVertical ? `${height}px` : 'auto',
    }),
    [isHorizontal, isVertical]
  )

  const [state, setState] = useState(initState(props))
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null)
  const [isUpdatingSpacer, setIsUpdatingSpacer] = useState(false) // Prevent ResizeObserver loops
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
        // VERTICAL LAYOUT (UP/DOWN)
        const containerHeight = container.offsetHeight
        const contentHeight = marquee.scrollHeight
        const needsSpacer = contentHeight < containerHeight

        if (needsSpacer) {
          const spacerHeight = containerHeight - contentHeight
          console.log('🔍 [Marquee] VERTICAL SPACER: Adding dummy item with height:', spacerHeight)

          setIsUpdatingSpacer(true)
          setState(prev => {
            // Check if dummy item already exists
            const hasDummy = prev.marqueeItems.some(isDummyItem)

            if (!hasDummy) {
              // Add dummy item at the correct position
              const direction = props.direction || marqueeDefaults.direction
              const newItems = [...prev.marqueeItems]
              const dummyWithSize: DummyItem = {
                ...dummyItemTemplate,
                width: 0,
                height: spacerHeight,
              }

              if (direction === MarqueeDirection.UP) {
                newItems.unshift(dummyWithSize) // BEGINNING for UP
              } else {
                newItems.push(dummyWithSize) // END for DOWN
              }

              return { ...prev, marqueeItems: newItems }
            } else {
              // Update existing dummy item size
              return {
                ...prev,
                marqueeItems: prev.marqueeItems.map(item =>
                  isDummyItem(item) ? { ...item, height: spacerHeight } : item
                ),
              }
            }
          })
          setTimeout(() => setIsUpdatingSpacer(false), 100)
        } else {
          console.log('🔍 [Marquee] VERTICAL SPACER: No spacer needed, removing dummy item')
          setIsUpdatingSpacer(true)
          setState(prev => ({
            ...prev,
            marqueeItems: prev.marqueeItems.filter(item => !isDummyItem(item)),
          }))
          setTimeout(() => setIsUpdatingSpacer(false), 100)
        }
      } else {
        // HORIZONTAL LAYOUT (LEFT/RIGHT)
        const containerWidth = container.offsetWidth
        const contentWidth = marquee.scrollWidth
        const needsSpacer = contentWidth < containerWidth

        if (needsSpacer) {
          const spacerWidth = containerWidth - contentWidth
          console.log('🔍 [Marquee] HORIZONTAL SPACER: Adding dummy item with width:', spacerWidth)

          setIsUpdatingSpacer(true)
          setState(prev => {
            // Check if dummy item already exists
            const hasDummy = prev.marqueeItems.some(isDummyItem)

            if (!hasDummy) {
              // Add dummy item at the correct position
              const direction = props.direction || marqueeDefaults.direction
              const newItems = [...prev.marqueeItems]
              const dummyWithSize: DummyItem = {
                ...dummyItemTemplate,
                width: spacerWidth,
                height: 0,
              }

              if (direction === MarqueeDirection.LEFT) {
                newItems.unshift(dummyWithSize) // BEGINNING for LEFT
              } else {
                newItems.push(dummyWithSize) // END for RIGHT
              }

              return { ...prev, marqueeItems: newItems }
            } else {
              // Update existing dummy item size
              return {
                ...prev,
                marqueeItems: prev.marqueeItems.map(item =>
                  isDummyItem(item) ? { ...item, width: spacerWidth } : item
                ),
              }
            }
          })
          setTimeout(() => setIsUpdatingSpacer(false), 100)
        } else {
          console.log('🔍 [Marquee] HORIZONTAL SPACER: No spacer needed, removing dummy item')
          setIsUpdatingSpacer(true)
          setState(prev => ({
            ...prev,
            marqueeItems: prev.marqueeItems.filter(item => !isDummyItem(item)),
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
  }, [props.direction, props.marqueeItems])

  const { height, marqueeClassName, marqueeContainerClassName, marqueeItemClassName, minHeight } = props

  const delay = props.delay || marqueeDefaults.delay
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

    // Next tick value - 1 pixel movement for smooth scrolling
    nextPropValue -= 1
    const marqueeItemSize =
      direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT
        ? getFirstMarqueeItemSize()
        : getLastMarqueeItemSize()

    // Check if an item has passed completely off-screen
    const marqueeItemPassed = (marqueeItemSize ? Math.floor(Math.abs(nextPropValue) / marqueeItemSize) : 0) > 0

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
  }, [shouldPause, isUpdatingSpacer, marqueeItems, direction, state, getLastMarqueeItemSize, getFirstMarqueeItemSize])

  // Use the stable callback with useInterval
  useInterval(animationFunction, shouldPause ? null : delay || marqueeDefaults.delay)

  const marqueeItemElms = marqueeItems.map((marqueeItem, i) => {
    // Handle dummy items
    if (marqueeItem && typeof marqueeItem === 'object' && 'isDummy' in marqueeItem && marqueeItem.isDummy) {
      // Use the height/width from our calculated state instead of recalculating
      const dummyItem = marqueeItem as DummyItem
      const dummyWidth = dummyItem.width || 0
      const dummyHeight = dummyItem.height || 0

      return (
        <div
          ref={el => registerItemRef(`dummy-${i}`, el)}
          className={`marquee-item marquee-dummy-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
          key={`dummy-${i}`}
          style={getDummyItemStyle(dummyWidth, dummyHeight)}
        />
      )
    }

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
