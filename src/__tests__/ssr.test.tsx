/**
 * @jest-environment node
 */
import React from 'react'
import { renderToString } from 'react-dom/server'
import Marquee from '../Marquee'

describe('Server-side rendering', () => {
  it('renders to a string without useLayoutEffect warnings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    const html = renderToString(
      <Marquee
        marqueeItems={[{ id: 1, text: 'SSR Item' }]}
        height={50}
      />
    )

    const warnings = consoleError.mock.calls.flat().filter(arg => String(arg).includes('useLayoutEffect'))
    consoleError.mockRestore()

    expect(html).toContain('SSR Item')
    expect(warnings).toEqual([])
  })
})
