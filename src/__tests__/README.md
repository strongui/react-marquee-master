# Test Suite Documentation

This directory contains comprehensive tests for the React Marquee component.

## Test Structure

### 1. **Marquee.test.tsx** - Component Unit Tests

- **Basic Rendering**: Tests component rendering with various props
- **Direction Props**: Tests different scroll directions (up, down, left, right, both)
- **Styling Props**: Tests height, minHeight, and className applications
- **Pause/Resume Functionality**: Tests pause state changes and callbacks
- **Both Direction Configuration**: Tests bidirectional scrolling
- **Inverse Marquee Items**: Tests item reversal functionality
- **Props Validation**: Tests edge cases and default values
- **Accessibility**: Basic accessibility checks

### 2. **useInterval.test.ts** - Hook Unit Tests

- **Interval Execution**: Tests callback execution at specified intervals
- **Null Delay Handling**: Tests pausing when delay is null
- **Callback Updates**: Tests that latest callback is used
- **Delay Changes**: Tests interval updates when delay changes
- **Cleanup**: Tests proper cleanup on unmount
- **Pause/Resume**: Tests pausing and resuming intervals

### 3. **integration.test.tsx** - Integration Tests

- **Pause/Resume Integration**: Tests pause/resume with user interactions
- **Direction Changes**: Tests dynamic direction changes
- **Dynamic Content**: Tests adding/removing items dynamically
- **Complex Configuration**: Tests multiple prop changes together

### 4. **index.test.tsx** - Export Tests

- **Component Export**: Tests that component exports correctly
- **Interface Export**: Tests that TypeScript interfaces export correctly

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite achieves approximately **82% code coverage** with:

- **82.5%** statement coverage
- **74.19%** branch coverage
- **100%** function coverage
- **82.05%** line coverage

## Testing Approach

- **Mocking**: The `useInterval` hook is mocked to avoid timing issues in tests
- **User Interactions**: Uses `@testing-library/user-event` for realistic user interactions
- **Assertions**: Uses `@testing-library/jest-dom` for DOM-specific assertions
- **Integration**: Tests component behavior in realistic usage scenarios

## Key Test Scenarios

1. **Basic Functionality**: Rendering with different props
2. **State Management**: Pause/resume and direction changes
3. **Dynamic Updates**: Handling prop changes during runtime
4. **Edge Cases**: Empty arrays, null values, undefined props
5. **User Interactions**: Button clicks and state changes
6. **Performance**: Proper cleanup and memory management

## Future Test Improvements

- Add visual regression tests for animations
- Add more accessibility tests (ARIA attributes, keyboard navigation)
- Add performance benchmarks
- Add tests for touch/mobile interactions
- Add tests for error boundaries and error handling
