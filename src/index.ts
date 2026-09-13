import './Marquee/index.scss'

import { IMarqueeProps as IMarqueePropsAlias, MarqueeDirection, FadeMaskColor } from './Marquee'
import Marquee from './Marquee'

export type IMarqueeProps = IMarqueePropsAlias
export type { MarqueeItem, MarqueeItemObject, MarqueeItemWithId } from './Marquee'
export { MarqueeDirection, FadeMaskColor }
export default Marquee
