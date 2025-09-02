import { useEffect, useRef } from 'react'

import { useLayoutEffect } from 'react'

export default function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay === null) {
      return
    }

    const id = window.setInterval(() => {
      savedCallback.current()
    }, delay)

    return () => {
      window.clearInterval(id)
    }
  }, [delay])
}
