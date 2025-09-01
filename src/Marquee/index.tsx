import * as React from 'react'
import userInterval from '../helpers/hookHelpers/useInterval'
import './index.scss'

const { useRef, useState, useEffect } = React

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

  // For left scrolling, dummy goes at the end (after real items)
  // For right scrolling, dummy goes at the beginning (before real items)
  // For up scrolling, dummy goes at the end (after real items)
  // For down scrolling, dummy goes at the beginning (before real items)
  const direction = props.direction || marqueeDefaults.direction
  const isHorizontal = direction === MarqueeDirection.LEFT || direction === MarqueeDirection.RIGHT
  const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN

  let itemsWithDummy = [...marqueeItems]
  if (isHorizontal || isVertical) {
    if (direction === MarqueeDirection.LEFT || direction === MarqueeDirection.UP) {
      itemsWithDummy.push(dummyItem as any)
    } else {
      itemsWithDummy.unshift(dummyItem as any)
    }
  }

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
  const { bottom, marqueeItems, top, left, right } = state

  // Sync props with internal state when items change
  useEffect(() => {
    console.log('🔄 [Marquee] Props changed, updating state')
    console.log('🔄 [Marquee] New marqueeItems:', props.marqueeItems)
    console.log('🔄 [Marquee] New inverseMarqueeItems:', props.inverseMarqueeItems)

    setState(initState(props))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.marqueeItems, props.inverseMarqueeItems])

  // Use ResizeObserver to measure content and calculate spacer size after render
  useEffect(() => {
    if (!marqueeContainerRef.current || !marqueeRef.current) return

    const container = marqueeContainerRef.current
    const marquee = marqueeRef.current

    let retryCount = 0
    const calculateSpacerSize = () => {
      // Only skip if we're in the middle of updating spacer state
      if (isUpdatingSpacer) {
        console.log('🔍 [Marquee] Skipping calculation - spacer update in progress')
        return
      }

      // Check if container is actually rendered and has dimensions
      if (!container.offsetWidth || !container.offsetHeight) {
        retryCount++
        if (retryCount > 3) {
          console.log('🔍 [Marquee] Too many retries, giving up')
          return
        }
        console.log('🔍 [Marquee] Container not ready yet, retrying... (attempt ' + retryCount + ')')
        // Retry after a short delay instead of giving up
        setTimeout(() => calculateSpacerSize(), 50)
        return
      }

      // Check if marquee content is also ready
      if (!marquee.scrollWidth || !marquee.scrollHeight) {
        retryCount++
        if (retryCount > 3) {
          console.log('🔍 [Marquee] Too many retries, giving up')
          return
        }
        console.log('🔍 [Marquee] Marquee content not ready yet, retrying... (attempt ' + retryCount + ')')
        setTimeout(() => calculateSpacerSize(), 50)
        return
      }

      // Reset retry count on successful calculation
      retryCount = 0

      // Define direction variables first so we can use them in the early check
      const direction = props.direction || marqueeDefaults.direction
      const isHorizontal = direction === MarqueeDirection.LEFT || direction === MarqueeDirection.RIGHT
      const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN

      // LOG THE ACTUAL DIMENSIONS TO SEE WHAT'S HAPPENING
      console.log('🔍 [Marquee] ACTUAL DIMENSIONS:')
      console.log('  - Container Height:', container.offsetHeight)
      console.log('  - Content Height:', marquee.scrollHeight)
      console.log('  - Difference:', container.offsetHeight - marquee.scrollHeight)
      console.log('  - Current Items:', marqueeItems.length)
      console.log(
        '  - Has Dummy:',
        marqueeItems.some(item => (item as any).isDummy)
      )

      // LOG INDIVIDUAL ITEM HEIGHTS TO SEE WHY CONTENT IS SHORT
      if (isVertical) {
        const realItems = marqueeItems.filter(item => !(item as any).isDummy)
        console.log('🔍 [Marquee] ITEM HEIGHTS:')
        realItems.forEach((item, index) => {
          const itemElement = marquee.querySelector(`[data-item-id="${item.id}"]`) as HTMLElement
          if (itemElement) {
            console.log(`  - Item ${index + 1}: ${itemElement.offsetHeight}px`)
          }
        })
        console.log('  - Total Real Items Height:', realItems.length * 50, 'px (expected)')
      }

      console.log('🔍 [Marquee] Calculating spacer size...')
      console.log('🔍 [Marquee] Direction:', direction)
      console.log('🔍 [Marquee] Is Horizontal:', isHorizontal)
      console.log('🔍 [Marquee] Is Vertical:', isVertical)

      if (isHorizontal) {
        const containerWidth = container.offsetWidth
        const contentWidth = marquee.scrollWidth

        console.log('🔍 [Marquee] Horizontal - Container Width:', containerWidth)
        console.log('🔍 [Marquee] Horizontal - Content Width:', contentWidth)
        console.log('🔍 [Marquee] Horizontal - Needs Spacer:', contentWidth < containerWidth)

        // If content doesn't fill container, calculate spacer width
        if (contentWidth < containerWidth) {
          const spacerWidth = containerWidth - contentWidth + 50 // Add some buffer
          console.log('🔍 [Marquee] Horizontal - Adding spacer width:', spacerWidth)

          // Update existing dummy item size
          setIsUpdatingSpacer(true)
          setState(prev => {
            console.log('🔍 [Marquee] Horizontal - Updating dummy item size')
            return {
              ...prev,
              marqueeItems: prev.marqueeItems.map(item =>
                (item as any).isDummy ? { ...item, width: spacerWidth } : item
              ),
            }
          })
          // Reset flag after state update with longer delay to prevent ResizeObserver conflicts
          setTimeout(() => setIsUpdatingSpacer(false), 200)
        } else {
          console.log('🔍 [Marquee] Horizontal - No spacer needed, keeping dummy at 0 width')
        }
      } else if (isVertical) {
        const containerHeight = container.offsetHeight
        const contentHeight = marquee.scrollHeight

        console.log('🔍 [Marquee] Vertical - Container Height:', containerHeight)
        console.log('🔍 [Marquee] Vertical - Content Height:', contentHeight)
        console.log('🔍 [Marquee] Vertical - Difference:', containerHeight - contentHeight)
        console.log('🔍 [Marquee] Vertical - Needs Spacer:', contentHeight < containerHeight)

        // If content doesn't fill container, calculate spacer height
        if (contentHeight < containerHeight) {
          const spacerHeight = containerHeight - contentHeight // NO BUFFER - exact size needed
          console.log('🔍 [Marquee] Vertical - ADDING SPACER height:', spacerHeight)
          console.log('🔍 [Marquee] Vertical - WHY? Content is SHORTER than container')

          // Update existing dummy item size
          setIsUpdatingSpacer(true)
          setState(prev => {
            console.log('🔍 [Marquee] Vertical - Updating dummy item size')
            return {
              ...prev,
              marqueeItems: prev.marqueeItems.map(item =>
                (item as any).isDummy ? { ...item, height: spacerHeight } : item
              ),
            }
          })
          // Reset flag after state update with longer delay to prevent ResizeObserver conflicts
          setTimeout(() => setIsUpdatingSpacer(false), 200)
        } else {
          console.log('🔍 [Marquee] Vertical - NO SPACER NEEDED - Content fills container')
          console.log('🔍 [Marquee] Vertical - Setting dummy height to 0')

          // Set dummy height to 0 when no spacer needed
          setIsUpdatingSpacer(true)
          setState(prev => ({
            ...prev,
            marqueeItems: prev.marqueeItems.map(item => ((item as any).isDummy ? { ...item, height: 0 } : item)),
          }))
          setTimeout(() => setIsUpdatingSpacer(false), 200)
        }
      }
    }

    console.log('🔍 [Marquee] Setting up ResizeObserver effect')
    console.log('🔍 [Marquee] Current marqueeItems length:', marqueeItems.length)
    console.log('🔍 [Marquee] Current direction:', props.direction)

    // Initial calculation - try immediately, then retry if needed
    calculateSpacerSize()

    // Set up ResizeObserver for dynamic updates
    const observer = new ResizeObserver(() => {
      console.log('🔍 [Marquee] ResizeObserver triggered')
      // Prevent infinite loops by checking if we're already updating
      if (isUpdatingSpacer) {
        console.log('🔍 [Marquee] Skipping ResizeObserver - already updating spacer')
        return
      }
      // Calculate immediately on resize
      calculateSpacerSize()
    })
    observer.observe(container)

    return () => {
      console.log('🔍 [Marquee] Cleaning up ResizeObserver')
      observer.disconnect()
    }
  }, [props.marqueeItems, props.direction])

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
    const childNode = marqueeRef.current?.firstChild
    if (childNode instanceof HTMLDivElement) {
      if (isHorizontal) {
        return childNode.offsetWidth
      }
      return childNode.offsetHeight
    }
    return 0
  }

  const getLastMarqueeItemSize = () => {
    const childNode = marqueeRef.current?.lastChild
    if (childNode instanceof HTMLDivElement) {
      if (isHorizontal) {
        return childNode.offsetWidth
      }
      return childNode.offsetHeight
    }
    return 0
  }

  // Determine if marquee should be paused due to hover
  const shouldPause = paused || (pauseOnHover && isHovered) || (pauseOnItemHover && hoveredItemIndex !== null)

  userInterval(
    () => {
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

      // Next tick value - smaller steps for smooth scrolling
      nextPropValue -= 0.5
      const marqueeItemSize =
        direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT
          ? getFirstMarqueeItemSize()
          : getLastMarqueeItemSize()

      const marqueeItemPassed = (marqueeItemSize ? Math.floor(Math.abs(nextPropValue) / marqueeItemSize) : 0) > 0

      if (marqueeItemPassed) {
        if (direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT) {
          nextMarqueeItems.push(nextMarqueeItems.shift() as any)
        } else {
          nextMarqueeItems.unshift(nextMarqueeItems.pop() as any)
        }
        nextPropValue = nextPropValue + marqueeItemSize
      }

      setState(s => ({
        ...s,
        [nextProp]: nextPropValue,
        marqueeItems: nextMarqueeItems,
      }))
    },
    shouldPause ? null : delay
  )

  const marqueeItemElms = marqueeItems.map((marqueeItem, i) => {
    // Handle dummy items
    if (marqueeItem && typeof marqueeItem === 'object' && 'isDummy' in marqueeItem) {
      // Use the height/width from our calculated state instead of recalculating
      const dummyWidth = (marqueeItem as any).width || 0
      const dummyHeight = (marqueeItem as any).height || 0

      return (
        <div
          className={`marquee-item marquee-dummy-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
          key={`dummy-${i}-${Date.now()}`}
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
