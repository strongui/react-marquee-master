import React from 'react';

const { useEffect, useRef } = React;

export default function useInterval(callback: () => any, delay: number) {
  const savedCallback: { current: { callback: () => any } } = useRef({
    callback: () => undefined,
  });

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current.callback = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current.callback();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
}
