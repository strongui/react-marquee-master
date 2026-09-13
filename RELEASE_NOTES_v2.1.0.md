# 2.1.0

Bug fixes and packaging cleanup. No breaking API changes.

## ✨ Styles now work out of the box

The component's base styles (clipping, item positioning, horizontal layout and fade masks) were compiled as CSS modules with hashed class names, so they never matched the component's markup. Unless you wrote your own CSS, `applyFadeMask`, horizontal scrolling and edge clipping did not work.

They are now injected with plain class names and zero-specificity `:where()` selectors, so any rule of yours, including classes passed through `marqueeItemClassName` and friends, overrides them.

> **Heads up:** if you styled the marquee yourself to work around this, the base styles now apply underneath yours. Most visibly, fade masks appear because `applyFadeMask` defaults to `true` (pass `applyFadeMask={false}` to turn them off), and items get default padding and `white-space: nowrap`, which any rule of your own overrides.

## 🐛 Fixes

- **Node consumers work again**: since 2.0.0 the package declared `"type": "module"` while its CommonJS build used a `.js` extension, so `require('react-marquee-master')` (Node, SSR, Jest) failed or returned nothing. The CommonJS build is now `dist/index.cjs`, and an `exports` map sends `import` to the ES module build and `require` to the CommonJS build. Bundlers were unaffected.
- **Dummy spacer is reliably invisible**: the internal spacer item now carries `opacity: 0`, `pointer-events: none` and `flex-shrink: 0` as inline styles.
- **Cleaner package**: the published package no longer contains test type declarations or stale files from old builds.
- **Quiet server rendering**: rendering on the server (Next.js, Remix, `renderToString`) no longer logs React's `useLayoutEffect` warning.
- **Type declarations**: no longer import the unpublished `.scss` source (which broke projects using `noUncheckedSideEffectImports`), and relative imports now carry explicit `.js` extensions so the types resolve under `node16`/`nodenext` module resolution instead of silently becoming `any`.

## 🧩 Types

- `MarqueeItem`, `MarqueeItemObject` and `MarqueeItemWithId` are now exported from the package entry, so you can type your item arrays.

## 📦 Dependencies

- **Leaner install**: `np` and `@testing-library/dom` were accidentally listed as runtime dependencies. They are now dev dependencies, so `npm install react-marquee-master` no longer installs them (or their dependency trees).
- Security updates for development tooling (webpack, express/qs, lodash, node-forge, glob, js-yaml, postcss, nanoid, svgo, fast-uri, browserslist, baseline-browser-mapping). These do not affect the published bundle.

## 🔧 Maintenance

- CI runs the full test suite on every push and pull request.
- `npm publish` runs tests and a clean build first.
- Release workflow picks up `RELEASE_NOTES_<tag>.md` automatically, falling back to GitHub-generated notes.
