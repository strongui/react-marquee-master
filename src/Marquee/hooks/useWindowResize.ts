import { useEffect, useState } from 'react'
import useDebounce from '../../helpers/hookHelpers/useDebounce'

export default function useWindowResize(onResize: () => void, debounceDelay: number = 100) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })
  const debouncedWindowSize = useDebounce(windowSize, debounceDelay)

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  // Trigger callback when debounced window size changes
  useEffect(() => {
    onResize()
  }, [debouncedWindowSize, onResize])

  return debouncedWindowSize
}
