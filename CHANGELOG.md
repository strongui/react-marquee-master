# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-09-12

### Added

- `MarqueeItem`, `MarqueeItemObject` and `MarqueeItemWithId` types are exported from the package entry
- `exports` map: `import` resolves to the ES module build, `require` to the CommonJS build

### Fixed

- Node consumers work again. Since 2.0.0 the package declared `"type": "module"` while its CommonJS build used a `.js` extension, so `require()` failed and Node, SSR and Jest consumers could not load it. The CommonJS build is now `dist/index.cjs`
- Bundled styles now actually apply. They were compiled as CSS modules with hashed class names that never matched the component's markup, so clipping, horizontal layout and fade masks did not work for npm consumers. Selectors are wrapped in `:where()` (zero specificity) so any consumer rule overrides them
- Dummy spacer item is now hidden and non-interactive via inline styles (`opacity: 0`, `pointer-events: none`, `flex-shrink: 0`)
- Dummy spacer stylesheet rule now targets `.marquee-dummy-item` directly
- Published package no longer contains test type declarations or stale build files
- Server-side rendering no longer logs React's `useLayoutEffect` warning
- Type declarations no longer import the unpublished `.scss` source, and use explicit `.js` extensions for relative imports so they resolve under `node16`/`nodenext` module resolution

### Changed

- Moved `np` and `@testing-library/dom` from `dependencies` to `devDependencies`, so installing the package no longer pulls them in
- `npm publish` now runs tests and a clean build first (`prepublishOnly`)
- Security updates for dev dependencies (webpack, express/qs, lodash, node-forge, glob, js-yaml, postcss, nanoid, svgo, fast-uri, browserslist, baseline-browser-mapping)
- CI now runs the test suite; the release workflow uses per-version release notes

## [2.0.0] - 2024-12-19

### 🎉 Major Features Added

#### ✨ **Icon Support for Marquee Items**

- Added `icon` property to `MarqueeItemObject` interface
- Icons are displayed before item text with proper spacing
- Full TypeScript support for icon properties
- 20+ emoji icons available in demo app

#### 🖱️ **Item Click Functionality**

- New `onItemClick` prop for handling item clicks
- Callback receives `(item: MarqueeItem, index: number)` parameters
- Visual feedback with pointer cursor and hover effects
- Excludes dummy items from click events
- Full documentation and examples provided

#### ⏸️ **Enhanced Hover Controls**

- `pauseOnHover` - Pause marquee when hovering over container
- `pauseOnItemHover` - Pause marquee when hovering over individual items
- `onMarqueeHover` and `onMarqueeItemHover` callback props
- Smooth pause/resume transitions

### 🔧 **Bug Fixes**

#### 🐛 **Container Width Issues Fixed**

- **CRITICAL FIX**: Resolved infinite scrolling issues when items are shorter than container width
- Improved dummy item sizing and positioning logic
- Fixed "conveyor belt" recycling for seamless infinite scroll
- Better handling of edge cases with few items

#### 🎯 **Animation Improvements**

- Fixed initial positioning for all scroll directions (UP, RIGHT, DOWN, LEFT)
- Corrected recycling thresholds for proper item cycling
- Improved spacer calculation using direct DOM measurements
- Enhanced animation speed (changed from 0.5px to 1px per frame)

### 🛡️ **TypeScript & Type Safety**

#### 📋 **Enhanced Type System**

- Added `MarqueeItemWithId` interface for JSX elements
- Created `DummyItem` type with proper type guards
- Implemented `isDummyItem` type guard function
- Removed all `any` types and improved type safety
- Better prop validation and IntelliSense support

#### 🎨 **Enum Improvements**

- Enhanced `MarqueeDirection` enum usage
- Improved `FadeMaskColor` enum implementation
- Better enum documentation and examples

### 🎨 **UI/UX Improvements**

#### 🎛️ **Demo Application Enhancements**

- **ItemManager Component**: Full item management with add/edit/remove
- **Icon Selection**: Dropdown with 20+ emoji options
- **Click Toggle**: Easy enable/disable for item click functionality
- **Real-time Updates**: All changes reflect immediately in marquees
- **Responsive Design**: Better mobile and desktop experience

#### 🎨 **Visual Feedback**

- Pointer cursor for clickable items
- Hover effects with opacity transitions
- Better button states and visual indicators
- Improved form styling and user experience

### ⚡ **Performance Optimizations**

#### 🚀 **React Performance**

- Replaced dynamic ID generation with stable `useRef` IDs
- Memoized dynamic styles using `useCallback`
- Batched state updates to prevent unnecessary re-renders
- Conditional state updates to avoid redundant operations
- Optimized `setState` calls throughout the component

#### 🔧 **DOM Access Improvements**

- Replaced DOM traversal with direct React refs
- Implemented `itemRefs` Map for efficient element access
- Added `registerItemRef` callback for proper ref management
- Better memory management and cleanup

### 📚 **Documentation & Developer Experience**

#### 📖 **Comprehensive Documentation**

- Updated README with all new features and props
- Added usage examples for icon support and click functionality
- Complete prop table with descriptions and types
- Better code examples and implementation guides

#### 🛠️ **Developer Tools**

- Enhanced TypeScript definitions
- Better error messages and debugging
- Improved build process and development workflow
- Added GitHub Pages deployment automation

### 🔄 **Breaking Changes**

#### ⚠️ **ID Requirements**

- **BREAKING**: All marquee items now require a unique `id` property
- This ensures stable React keys and optimal performance
- Updated all examples and documentation to reflect this requirement

#### ⚠️ **Direction Enum Changes**

- **BREAKING**: Removed `MarqueeDirection.BOTH` as it was causing issues
- Only `UP`, `DOWN`, `LEFT`, and `RIGHT` directions are now supported
- Update any code using `MarqueeDirection.BOTH` to use a specific direction

#### 🏗️ **Internal Architecture**

- Refactored internal state management
- Improved component lifecycle handling
- Better separation of concerns with custom hooks

### 🧪 **Testing & Quality**

#### ✅ **Enhanced Testing**

- Updated test suites for new functionality
- Better test coverage for edge cases
- Improved integration tests for marquee behavior

#### 🔍 **Code Quality**

- Removed all unused code and variables
- Improved code organization and readability
- Better error handling and edge case management
- Enhanced linting and type checking

---

## [1.4.5] - Previous Version

### Features

- Basic marquee functionality
- Horizontal and vertical scrolling
- Fade mask support
- Basic TypeScript support

### Known Issues (Fixed in 2.0.0)

- Items shorter than container width caused infinite scroll issues
- Limited type safety with `any` types
- No icon support for items
- No click functionality
- Performance issues with dynamic ID generation
