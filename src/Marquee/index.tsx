import * as React from 'react';
import userInterval from '../helpers/hookHelpers/useInterval';

const { useRef, useState } = React;

export interface IMarqueeProps {
  delay?: number;
  direction?: 'up' | 'down';
  height?: number;
  inverseMarqueeItems?: boolean;
  marqueeClassName?: string;
  marqueeContainerClassName?: string;
  marqueeItemClassName?: string;
  marqueeItems: Array<string | JSX.Element>;
  minHeight?: number;
}

const marqueeDefaults = {
  delay: 40,
  direction: 'up',
  marqueeItems: [],
  minHeight: 150,
};

const initState = (props: IMarqueeProps) => {
  const marqueeItems = props.marqueeItems || marqueeDefaults.marqueeItems;
  return {
    marqueeItems: props.inverseMarqueeItems ? marqueeItems.reverse() : marqueeItems,
    bottom: 0,
    top: 0,
  };
};

export default function Marquee(props: IMarqueeProps) {
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState(initState(props));
  const { bottom, marqueeItems, top } = state;

  const {
    height,
    marqueeClassName,
    marqueeContainerClassName,
    marqueeItemClassName,
    minHeight,
  } = props;

  const delay = props.delay || marqueeDefaults.delay;
  const direction = props.direction || marqueeDefaults.direction;

  const marqueeContainerStyle: React.CSSProperties = {
    overflow: 'hidden',
    minHeight: '150px',
    position: 'relative',
  };
  if (height) {
    marqueeContainerStyle.height = `${height}px`;
  } else if (minHeight) {
    marqueeContainerStyle.minHeight = `${minHeight}px`;
  } else {
    marqueeContainerStyle.minHeight = `${marqueeDefaults.minHeight}px`;
  }

  const marqueeStyle: React.CSSProperties = {
    position: 'absolute',
  };
  if (direction === 'down') {
    marqueeStyle.bottom = `${bottom}px`;
  } else {
    marqueeStyle.top = `${top}px`;
  }

  const getFirstMarqueeItemHeight = () => {
    const childNode = marqueeRef.current?.firstChild;
    if (childNode instanceof HTMLDivElement) {
      return childNode.offsetHeight;
    }
    return 0;
  };

  const getLastMarqueeItemHeight = () => {
    const childNode = marqueeRef.current?.lastChild;
    if (childNode instanceof HTMLDivElement) {
      return childNode.offsetHeight;
    }
    return 0;
  };

  userInterval(() => {
    const nextMarqueeItems = [...marqueeItems];
    let nextTop = top;
    let nextBottom = bottom;

    if (direction === 'up') {
      nextTop = nextTop - 1;
      const firstMarqueeItemHeight = getFirstMarqueeItemHeight();
      const firstMarqueeItemPassed =
        (firstMarqueeItemHeight ? Math.floor(Math.abs(nextTop) / firstMarqueeItemHeight) : 0) > 0;
      if (firstMarqueeItemPassed) {
        nextMarqueeItems.push(nextMarqueeItems.shift() as string);
        nextTop = nextTop + firstMarqueeItemHeight;
      }
    } else {
      nextBottom = nextBottom - 1;
      const lastMarqueeItemHeight = getLastMarqueeItemHeight();
      const lastMarqueeItemPassed =
        (lastMarqueeItemHeight ? Math.floor(Math.abs(nextBottom) / lastMarqueeItemHeight) : 0) > 0;

      if (lastMarqueeItemPassed) {
        nextMarqueeItems.unshift(nextMarqueeItems.pop() as string);
        nextBottom = nextBottom + lastMarqueeItemHeight;
      }
    }

    setState((s) => ({
      ...s,
      marqueeItems: nextMarqueeItems,
      top: nextTop,
      bottom: nextBottom,
    }));
  }, delay);

  const marqueeItemElms = marqueeItems.map((marqueeItem, i) => {
    if (typeof marqueeItem === 'string') {
      return (
        <div
          className={`marquee-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
          key={i}
        >
          {marqueeItem}
        </div>
      );
    }
    return React.cloneElement(marqueeItem, { key: i });
  });

  return (
    <div
      className={`marquee-container${
        marqueeContainerClassName ? ` ${marqueeContainerClassName}` : ''
      }`}
      ref={marqueeContainerRef}
      style={marqueeContainerStyle}
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
