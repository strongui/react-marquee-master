import { useEffect, useLayoutEffect } from 'react'

// useLayoutEffect warns during server rendering, so fall back to useEffect where there is no DOM
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
