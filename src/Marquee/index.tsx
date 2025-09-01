import * as React from 'react';
import userInterval from '../helpers/hookHelpers/useInterval';
import './index.scss';

const { useRef, useState, useEffect } = React;

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
  delay?: number;
  direction?: MarqueeDirection;
  height?: number;
  inverseMarqueeItems?: boolean;
  marqueeClassName?: string;
  marqueeContainerClassName?: string;
  marqueeItemClassName?: string;
  marqueeItems: Array<string | JSX.Element | { text: string; color?: number; id?: number }>;
  minHeight?: number;
  paused?: boolean;
  pauseOnHover?: boolean;
  pauseOnItemHover?: boolean;
  applyFadeMask?: boolean;
  fadeMaskColor?: FadeMaskColor;
  onPause?: () => void;
  onResume?: () => void;
  onMarqueeHover?: () => void;
  onMarqueeItemHover?: (item: any, index: number) => void;
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
};

const initState = (props: IMarqueeProps) => {
  const marqueeItems = props.marqueeItems || marqueeDefaults.marqueeItems;

  // Add dummy item to ensure scrolling is always visible
  const dummyItem = {
    text: '',
    isDummy: true,
    width: 0,
    height: 0,
  };

  // For left scrolling, dummy goes at the end (after real items)
  // For right scrolling, dummy goes at the beginning (before real items)
  // For up scrolling, dummy goes at the end (after real items)
  // For down scrolling, dummy goes at the beginning (before real items)
  const direction = props.direction || marqueeDefaults.direction;
  const isHorizontal = direction === MarqueeDirection.LEFT || direction === MarqueeDirection.RIGHT;
  const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN;

  let itemsWithDummy = [...marqueeItems];
  if (isHorizontal || isVertical) {
    if (direction === MarqueeDirection.LEFT || direction === MarqueeDirection.UP) {
      itemsWithDummy.push(dummyItem as any);
    } else {
      itemsWithDummy.unshift(dummyItem as any);
    }
  }

  return {
    bottom: 0,
    left: 0,
    marqueeItems: props.inverseMarqueeItems ? itemsWithDummy.reverse() : itemsWithDummy,
    right: 0,
    top: 0,
  };
};

export default function Marquee(props: IMarqueeProps) {
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState(initState(props));
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const { bottom, marqueeItems, top, left, right } = state;

  // Sync props with internal state when items change
  useEffect(() => {
    setState(initState(props));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.marqueeItems, props.inverseMarqueeItems]);

  const { height, marqueeClassName, marqueeContainerClassName, marqueeItemClassName, minHeight } =
    props;

  const delay = props.delay || marqueeDefaults.delay;
  const direction = props.direction || marqueeDefaults.direction;
  const isHorizontal = direction === MarqueeDirection.LEFT || direction === MarqueeDirection.RIGHT;
  const isVertical = direction === MarqueeDirection.UP || direction === MarqueeDirection.DOWN;
  const paused = props.paused || false;
  const pauseOnHover = props.pauseOnHover || marqueeDefaults.pauseOnHover;
  const pauseOnItemHover = props.pauseOnItemHover || marqueeDefaults.pauseOnItemHover;
  const applyFadeMask =
    props.applyFadeMask !== undefined ? props.applyFadeMask : marqueeDefaults.applyFadeMask;
  const fadeMaskColor = props.fadeMaskColor || marqueeDefaults.fadeMaskColor;
  const onMarqueeHover = props.onMarqueeHover;
  const onMarqueeItemHover = props.onMarqueeItemHover;

  const marqueeContainerStyle: React.CSSProperties = {};
  if (height) {
    marqueeContainerStyle.height = `${height}px`;
  } else if (minHeight) {
    marqueeContainerStyle.minHeight = `${minHeight}px`;
  } else {
    marqueeContainerStyle.minHeight = `${marqueeDefaults.minHeight}px`;
  }

  const marqueeStyle: React.CSSProperties = {};
  if (direction === MarqueeDirection.UP) {
    marqueeStyle.top = `${top}px`;
  } else if (direction === MarqueeDirection.RIGHT) {
    marqueeStyle.right = `${right}px`;
  } else if (direction === MarqueeDirection.DOWN) {
    marqueeStyle.bottom = `${bottom}px`;
  } else if (direction === MarqueeDirection.LEFT) {
    marqueeStyle.left = `${left}px`;
  }

  const getFirstMarqueeItemSize = () => {
    const childNode = marqueeRef.current?.firstChild;
    if (childNode instanceof HTMLDivElement) {
      if (isHorizontal) {
        return childNode.offsetWidth;
      }
      return childNode.offsetHeight;
    }
    return 0;
  };

  const getLastMarqueeItemSize = () => {
    const childNode = marqueeRef.current?.lastChild;
    if (childNode instanceof HTMLDivElement) {
      if (isHorizontal) {
        return childNode.offsetWidth;
      }
      return childNode.offsetHeight;
    }
    return 0;
  };

  // Determine if marquee should be paused due to hover
  const shouldPause =
    paused || (pauseOnHover && isHovered) || (pauseOnItemHover && hoveredItemIndex !== null);

  userInterval(
    () => {
      // Don't animate if paused or hovered
      if (shouldPause) return;

      const nextMarqueeItems = [...marqueeItems];
      let nextProp: 'top' | 'right' | 'bottom' | 'left';
      switch (direction) {
        case MarqueeDirection.UP:
          nextProp = 'top';
          break;
        case MarqueeDirection.RIGHT:
          nextProp = 'right';
          break;
        case MarqueeDirection.DOWN:
          nextProp = 'bottom';
          break;
        case MarqueeDirection.LEFT:
          nextProp = 'left';
          break;

        default:
          nextProp = 'top';
          break;
      }

      let nextPropValue = state[nextProp];

      // Next tick value - smaller steps for smooth scrolling
      nextPropValue -= 0.5;
      const marqueeItemSize =
        direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT
          ? getFirstMarqueeItemSize()
          : getLastMarqueeItemSize();

      const marqueeItemPassed =
        (marqueeItemSize ? Math.floor(Math.abs(nextPropValue) / marqueeItemSize) : 0) > 0;

      if (marqueeItemPassed) {
        if (direction === MarqueeDirection.UP || direction === MarqueeDirection.LEFT) {
          nextMarqueeItems.push(nextMarqueeItems.shift() as any);
        } else {
          nextMarqueeItems.unshift(nextMarqueeItems.pop() as any);
        }
        nextPropValue = nextPropValue + marqueeItemSize;
      }

      setState((s) => ({
        ...s,
        [nextProp]: nextPropValue,
        marqueeItems: nextMarqueeItems,
      }));
    },
    shouldPause ? null : delay
  );

  const marqueeItemElms = marqueeItems.map((marqueeItem, i) => {
    // Handle dummy items
    if (marqueeItem && typeof marqueeItem === 'object' && 'isDummy' in marqueeItem) {
      // Calculate dummy dimensions dynamically
      let dummyWidth = 0;
      let dummyHeight = 0;

      if (marqueeContainerRef.current && marqueeRef.current) {
        const containerWidth = marqueeContainerRef.current.offsetWidth;
        const containerHeight = marqueeContainerRef.current.offsetHeight;
        let totalRealItemsWidth = 0;
        let totalRealItemsHeight = 0;

        // Calculate dimensions of all real items (excluding this dummy)
        marqueeItems.forEach((item, index) => {
          if (index !== i && (!item || typeof item !== 'object' || !('isDummy' in item))) {
            // This is a real item, estimate its dimensions
            if (typeof item === 'string') {
              totalRealItemsWidth += item.length * 8 + 20; // Rough estimate + padding
              totalRealItemsHeight += 20 + 20; // Line height + padding
            } else if (React.isValidElement(item)) {
              totalRealItemsWidth += 100 + 20; // Default width + padding
              totalRealItemsHeight += 20 + 20; // Default height + padding
            } else if (typeof item === 'object' && 'text' in item) {
              totalRealItemsWidth += (item.text as string).length * 8 + 20;
              totalRealItemsHeight += 20 + 20;
            }
          }
        });

        // Calculate dummy dimensions based on scroll direction
        if (isHorizontal) {
          // For horizontal scrolling, calculate width
          const extraWidth = Math.max(containerWidth * 0.1, 50); // At most 10% of container or 50px
          dummyWidth = Math.max(0, containerWidth - totalRealItemsWidth + extraWidth);
        } else if (isVertical) {
          // For vertical scrolling, calculate height
          const extraHeight = Math.max(containerHeight * 0.1, 50); // At most 10% of container or 50px
          dummyHeight = Math.max(0, containerHeight - totalRealItemsHeight + extraHeight);
        }
      }

      return (
        <div
          className={`marquee-item marquee-dummy-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
          key="dummy-item"
          style={{
            width: isHorizontal ? `${dummyWidth}px` : 'auto',
            height: isVertical ? `${dummyHeight}px` : 'auto',
            opacity: 0,
            pointerEvents: 'none',
            flexShrink: 0,
          }}
        />
      );
    }

    // Handle different item types for real items
    let itemText: string | JSX.Element;
    let itemColor: number | undefined;

    if (typeof marqueeItem === 'string') {
      itemText = marqueeItem;
    } else if (React.isValidElement(marqueeItem)) {
      itemText = marqueeItem;
    } else if (
      typeof marqueeItem === 'object' &&
      'text' in marqueeItem &&
      typeof marqueeItem.text === 'string'
    ) {
      itemText = marqueeItem.text;
      itemColor = (marqueeItem as any).color;
    } else {
      itemText = String(marqueeItem);
    }

    return (
      <div
        className={`marquee-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
        key={itemColor ? `item-${itemColor}-${i}` : i}
        data-color={itemColor}
        onMouseEnter={() => {
          if (pauseOnItemHover) {
            setHoveredItemIndex(i);
            onMarqueeItemHover?.(marqueeItem, i);
          }
        }}
        onMouseLeave={() => {
          if (pauseOnItemHover) {
            setHoveredItemIndex(null);
          }
        }}
      >
        {itemText}
      </div>
    );
  });

  return (
    <div
      key={`marquee-${marqueeItems.length}-${JSON.stringify(marqueeItems.map((item) => (typeof item === 'object' && 'id' in item ? item.id : item)))}`}
      className={`marquee-container${isHorizontal ? ' horizontal' : ''}${
        applyFadeMask ? ` fade-mask-${fadeMaskColor}` : ''
      }${marqueeContainerClassName ? ` ${marqueeContainerClassName}` : ''}`}
      ref={marqueeContainerRef}
      style={marqueeContainerStyle}
      onMouseEnter={() => {
        if (pauseOnHover) {
          setIsHovered(true);
          onMarqueeHover?.();
        }
      }}
      onMouseLeave={() => {
        if (pauseOnHover) {
          setIsHovered(false);
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
  );
}
