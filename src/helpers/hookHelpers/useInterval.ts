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
    console.log('🔄 [useInterval] Setting up interval:', { delay, hasCallback: !!callback })

    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay === null) {
      console.log('🔄 [useInterval] No delay specified, skipping interval')
      return
    }

    const id = window.setInterval(() => {
      savedCallback.current()
    }, delay)

    console.log('🔄 [useInterval] New interval created:', id)

    return () => {
      window.clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay])
}
