import * as React from 'react';
import userInterval from '../helpers/hookHelpers/useInterval';

const { useRef, useState } = React;

export interface IMarqueeProps {
  delay?: number;
  direction?: 'up' | 'right' | 'down' | 'left';
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
  const { bottom, marqueeItems, top, left, right } = state;

  const {
    height,
    marqueeClassName,
    marqueeContainerClassName,
    marqueeItemClassName,
    minHeight,
  } = props;

  const delay = props.delay || marqueeDefaults.delay;
  const direction = props.direction || marqueeDefaults.direction;
  const isHorizontal = direction === 'left' || direction === 'right';

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

  userInterval(() => {
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

    // Next tic value
    nextPropValue -= 1;
    const marqueeItemSize =
      direction === 'up' || direction === 'left'
        ? getFirstMarqueeItemSize()
        : getLastMarqueeItemSize();

    const marqueeItemPassed =
      (marqueeItemSize ? Math.floor(Math.abs(nextPropValue) / marqueeItemSize) : 0) > 0;

    if (marqueeItemPassed) {
      if (direction === 'up' || direction === 'left') {
        nextMarqueeItems.push(nextMarqueeItems.shift() as string);
      } else {
        nextMarqueeItems.unshift(nextMarqueeItems.pop() as string);
      }
      nextPropValue = nextPropValue + marqueeItemSize;
    }

    setState((s) => ({
      ...s,
      [nextProp]: nextPropValue,
      marqueeItems: nextMarqueeItems,
    }));
  }, delay);

  const marqueeItemElms = marqueeItems.map((marqueeItem, i) => {
    return (
      <div
        className={`marquee-item${marqueeItemClassName ? ` ${marqueeItemClassName}` : ''}`}
        key={i}
      >
        {marqueeItem}
      </div>
    );
  });

  return (
    <div
      className={`marquee-container${isHorizontal ? ' horizontal' : ''}${
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
