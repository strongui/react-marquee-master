import './Marquee/index.scss';

import { IMarqueeProps as IMarqueePropsAlias, MarqueeDirection, FadeMaskColor } from './Marquee';
import Marquee from './Marquee';

export interface IMarqueeProps extends IMarqueePropsAlias { }
export { MarqueeDirection, FadeMaskColor };
export default Marquee;
