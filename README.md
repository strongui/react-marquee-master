# react-marquee-master

Simple component to create a scrolling marquee. The marquee HTML tag has been discontinued, but
sometimes you just have to add some flare to your site! Build with typescript to provide typings out
of the box.

[![Version](http://img.shields.io/npm/v/react-marquee-master.svg)](https://www.npmjs.org/package/react-marquee-master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm download][download-image]][download-url]
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[download-image]: https://img.shields.io/npm/dm/react-marquee-master.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-marquee-master

## Demo

Simple scroll:

<!-- markdownlint-disable MD033 -->
<img src="/docs/images/sample.gif" width="300" alt="Simple use case for scrolling">
<!-- markdownlint-enable MD033 -->

Reverse it, and speed it up!

<!-- markdownlint-disable MD033 -->
<img src="/docs/images/sample-2.gif" width="300" alt="Control the speed and direction!">

<!-- markdownlint-enable MD033 -->

Or horizontal!

<!-- markdownlint-disable MD033 -->
<img src="/docs/images/sample-3.gif" width="300" alt="Even support horizontal scrolling!">
<!-- markdownlint-enable MD033 -->

## Maintainers

[strongui](https://github.com/strongui) Active maintainer - accepting PRs and doing minor testing,
fixing issues or doing active development.

## Installation

```sh
npm install react-marquee-master
```

or

```sh
yarn add react-marquee-master
```

## Usage

### Using NPM

1 . Require react-marquee-master after installation

```js
import Marquee from 'react-marquee-master';
```

2 . Add your Marquee element

```jsx
<Marquee marqueeItems={marqueeItems} />
```

### Advanced Usage Examples

**Pause/Resume with callbacks:**

```jsx
const [isPaused, setIsPaused] = useState(false);

<Marquee
  marqueeItems={['Item 1', 'Item 2', 'Item 3']}
  paused={isPaused}
  onPause={() => console.log('Marquee paused')}
  onResume={() => console.log('Marquee resumed')}
/>

<button onClick={() => setIsPaused(!isPaused)}>
  {isPaused ? 'Resume' : 'Pause'}
</button>
```

**Hover pause functionality:**

```jsx
<Marquee
  marqueeItems={['Item 1', 'Item 2', 'Item 3']}
  pauseOnHover={true}
  pauseOnItemHover={true}
  onMarqueeHover={() => console.log('Marquee area hovered')}
  onMarqueeItemHover={(item, index) => console.log(`Item ${index} hovered:`, item)}
/>
```

### Standalone

You can import `node_modules/react-marquee-master/dist/index.js` into your page. Please make sure
that you have already imported `react` and `react-dom` into your page.

## Options

Notes:

- The `marqueeItems` property accepts an array of strings, JSX elements, or objects with `text`, `color`, and `id` properties.
- You must define either a `height` or `minHeight` for the marquee, because the marquee elements are absolutely positioned and will not grow the marquee container on their own.
- All other props are optional, and are there to allow you to customize the marquee to your liking.
- The component comes without any styles or style sheets. It's up to you to style the marquee any way you want. All this component will do is handle the animations for you.

| Prop                      | Type                       | Values                | Default | Description                                                    |
| ------------------------- | -------------------------- | --------------------- | ------- | -------------------------------------------------------------- |
| delay                     | number                     | 0-99999               | 40      | Delay of the animation. Lower number speeds up the scroll.     |
| direction                 | string                     | up, right, down, left       | up      | Direction of the scroll.                                       |
| height                    | number                     | 0-99999               |         | The fixed height of the marquee                                |
| inverseMarqueeItems       | boolean                    | true                  | false   | Reverse the marquee array. Useful when scrolling down.         |
| marqueeClassName          | string                     |                       |         | Class to apply to marquee element.                             |
| marqueeContainerClassName | string                     |                       |         | Class to apply to marquee container element.                   |
| marqueeItemClassName      | string                     |                       |         | Class to apply to each marquee element.                        |
| marqueeItems              | Array<string\|JSX.Element\|{text: string, color?: number, id?: number}> | []                    | []      | The text / Components / Objects to display.                    |
| minHeight                 | number                     | 0-99999               |         | More dynamic sizing option with a minimum size that will grow. |
| paused                    | boolean                    | true, false           | false   | Pause or resume the marquee animation.                         |
| pauseOnHover             | boolean                    | true, false           | false   | Pause marquee when hovering over the marquee container area.   |
| pauseOnItemHover         | boolean                    | true, false           | false   | Pause marquee when hovering over any marquee item.            |
| applyFadeMask             | boolean                    | true, false           | true    | Enable fade mask overlays at container edges.                  |
| fadeMaskColor             | string                     | white, black          | white   | Color of the fade mask overlays.                               |
| onPause                   | function                   |                       |         | Callback function called when marquee is paused.               |
| onResume                  | function                   |                       |         | Callback function called when marquee is resumed.              |
| onMarqueeHover           | function                   |                       |         | Callback function called when hovering over marquee container. |
| onMarqueeItemHover       | function                   |                       |         | Callback function called when hovering over a marquee item.   |

## Fade Mask Features

The marquee component includes elegant fade mask overlays that create smooth transitions at container edges:

### **applyFadeMask**

Controls whether fade mask overlays are displayed at the container edges. When enabled, items smoothly fade in/out rather than abruptly appearing or disappearing.

### **fadeMaskColor**

Determines the color of the fade mask overlays:

- **`white`**: Creates subtle white fade masks (default)
- **`black`**: Creates dark fade masks for light backgrounds

### **Direction-Aware Positioning**

- **Vertical scrolling** (up/down): Fade masks at top and bottom
- **Horizontal scrolling** (left/right): Fade masks at left and right edges

### **Example Usage**

```jsx
// White fade masks (default)
<Marquee marqueeItems={items} applyFadeMask={true} fadeMaskColor="white" />

// Black fade masks
<Marquee marqueeItems={items} applyFadeMask={true} fadeMaskColor="black" />

// Disable fade masks entirely
<Marquee marqueeItems={items} applyFadeMask={false} />
```

## Hover Pause Features

The marquee component now supports intelligent pause functionality when users hover over the content:

### **pauseOnHover**

Pauses the marquee animation when the user hovers over the marquee container area. This is useful for allowing users to read content without it scrolling away.

### **pauseOnItemHover**

Pauses the marquee animation when the user hovers over any specific marquee item. This provides granular control and allows users to focus on particular content.

### **Hover Callbacks**

- `onMarqueeHover`: Triggered when hovering over the marquee container
- `onMarqueeItemHover(item, index)`: Triggered when hovering over a specific item, providing the item content and its index

### **Use Cases**

- **News tickers**: Pause to read important headlines
- **Product showcases**: Stop scrolling to examine specific items
- **Announcements**: Allow users to read complete messages
- **Interactive content**: Provide better user experience during hover interactions

## Contributing

I welcome your contribution! Fork the repo, make some changes, submit a pull-request!

## License

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
