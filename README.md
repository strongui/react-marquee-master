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
<img src="/docs/images/sample.gif" width="300">
<!-- markdownlint-enable MD033 -->

Reverse it, and speed it up!

<!-- markdownlint-disable MD033 -->
<img src="/docs/images/sample-2.gif" width="300">

<!-- markdownlint-enable MD033 -->

Or horizontal!

<!-- markdownlint-disable MD033 -->
<img src="/docs/images/sample-3.gif" width="300">
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

### Standalone

You can import `node_modules/react-marquee-master/dist/index.js` into your page. Please make sure
that you have already imported `react` and `react-dom` into your page.

## Options

Notes:

- The `marqueeItems` property just needs to be an array. You can pass strings or components.
- You must define either a `height` or `minHeight` for the marquee, because the marquee elements is
  absolutley positioned and will not grow the marquee container on its own.
- All other props are optional, and are there to allow you to customize the marquee to your liking.
- The component comes without any styles or style sheets. It's up to your to style the marquee any
  way you want. All this component will do is handle the animations for you. I did not want to force
  any arbitrary styles on you or grow the size of the package by importing additional libraries.

| Prop                      | Type                       | Values                | Default | Description                                                    |
| ------------------------- | -------------------------- | --------------------- | ------- | -------------------------------------------------------------- |
| delay                     | number                     | 0-99999               | 40      | Delay of the animation. Lower number speeds up the scroll.     |
| direction                 | string                     | up, right, down, left | up      | Direction of the scroll.                                       |
| height                    | number                     | 0-99999               |         | The fixed height of the marquee                                |
| inverseMarqueeItems       | boolean                    | true                  | false   | Reverse the marquee array. Useful when scrolling down.         |
| marqueeClassName          | string                     |                       |         | Class to apply to marquee element.                             |
| marqueeContainerClassName | string                     |                       |         | Class to apply to marquee container element.                   |
| marqueeItemClassName      | string                     |                       |         | Class to apply to each marquee element.                        |
| marqueeItemClassName      | string                     |                       |         | Class to apply to each marquee element.                        |
| marqueeItems              | Array<string\|JSX.Element> | []                    | []      | The text / Components to display.                              |
| minHeight                 | number                     | 0-99999               |         | More dynamic sizing option with a minimum size that will grow. |

### To test locally in a separate app that imports this library

1. Open console at root of react-marquee-master
2. run `npm link ../YOUR_APP_NAME/node_modules/react`
3. run `npm link`
4. In YOUR_APP_NAME run `npm link react-marquee-master`
5. Now in YOUR_APP_NAME you can import this module
   (`import Marquee, { IMarqueeProps } from 'react-marquee-master';`)
6. `npm start` (rollup to update react-marquee-master)

### To release

`np`

## Contributing

I welcome your contribution! Fork the repo, make some changes, submit a pull-request!

## License

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
