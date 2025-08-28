import * as React from 'react';
import userInterval from '../helpers/hookHelpers/useInterval';
import './index.scss';

const { useRef, useState, useEffect } = React;

export interface IMarqueeProps {
  delay?: number;
  direction?: 'up' | 'right' | 'down' | 'left';
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
  fadeMaskColor?: 'white' | 'black';
  onPause?: () => void;
  onResume?: () => void;
  onMarqueeHover?: () => void;
  onMarqueeItemHover?: (item: any, index: number) => void;
}

const marqueeDefaults = {
  delay: 40,
  direction: 'up',
  marqueeItems: [],
  minHeight: 150,
  pauseOnHover: false,
  pauseOnItemHover: false,
  applyFadeMask: true,
  fadeMaskColor: 'white',
};

const initState = (props: IMarqueeProps) => {
  const marqueeItems = props.marqueeItems || marqueeDefaults.marqueeItems;
  return {
    bottom: 0,
    left: 0,
    marqueeItems: props.inverseMarqueeItems ? marqueeItems.reverse() : marqueeItems,
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
  const isHorizontal = direction === 'left' || direction === 'right';
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
  if (direction === 'up') {
    marqueeStyle.top = `${top}px`;
  } else if (direction === 'right') {
    marqueeStyle.right = `${right}px`;
  } else if (direction === 'down') {
    marqueeStyle.bottom = `${bottom}px`;
  } else if (direction === 'left') {
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
        case 'up':
          nextProp = 'top';
          break;
        case 'right':
          nextProp = 'right';
          break;
        case 'down':
          nextProp = 'bottom';
          break;
        case 'left':
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
        direction === 'up' || direction === 'left'
          ? getFirstMarqueeItemSize()
          : getLastMarqueeItemSize();

      const marqueeItemPassed =
        (marqueeItemSize ? Math.floor(Math.abs(nextPropValue) / marqueeItemSize) : 0) > 0;

      if (marqueeItemPassed) {
        if (direction === 'up' || direction === 'left') {
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
    // Handle different item types
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
