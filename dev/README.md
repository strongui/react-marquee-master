# 🚀 Development Environment

This directory contains a complete development environment for testing the React Marquee component.

## Quick Start

```bash
npm run dev
```

This will start a webpack dev server at `http://localhost:3000` with hot reload enabled.

## Features

### 🎯 Live Interactive Demos
- **Basic Vertical Marquee** - Test up/down scrolling with speed controls
- **Horizontal Marquee** - Test left/right scrolling
- **Both Directions** - Test diagonal scrolling with customizable directions
- **Dynamic Content** - Add/remove items, toggle reverse functionality

### 🔧 Development Tools
- **Hot Module Replacement** - Changes update instantly without page reload
- **Live Reload** - Full page reload when needed
- **TypeScript Support** - Full type checking and IntelliSense
- **Source Maps** - Debug with original source code
- **Console Logging** - See callback events in browser console

### 🎨 Visual Testing
- **Styled Components** - Beautiful gradient backgrounds for easy visibility
- **Interactive Controls** - Buttons, sliders, and toggles for all features
- **Status Display** - Real-time status updates showing current configuration
- **Responsive Design** - Test on different screen sizes

## File Structure

```
dev/
├── index.html          # HTML template with styled UI
├── app.tsx            # React application with interactive demos
├── dist/              # Built files (auto-generated)
└── README.md          # This file
```

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit files in `src/` directory
   - Changes automatically reflect in browser
   - Test all features with interactive controls

3. **Debug**
   - Use browser developer tools
   - Check console for callback events
   - Source maps point to original TypeScript code

4. **Build for Production**
   ```bash
   npm run build
   ```

## Testing Scenarios

### Basic Functionality
- ✅ Vertical scrolling (up/down)
- ✅ Horizontal scrolling (left/right)
- ✅ Speed adjustment
- ✅ Pause/resume functionality

### Advanced Features
- ✅ Bidirectional scrolling (diagonal)
- ✅ Dynamic content updates
- ✅ Item reversal
- ✅ Custom styling

### Edge Cases
- ✅ Empty item arrays
- ✅ Single item
- ✅ Very fast/slow speeds
- ✅ Rapid state changes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tips for Development

1. **Use Browser DevTools** - Inspect elements, check console logs
2. **Test Different Speeds** - Use speed sliders to test performance
3. **Try All Directions** - Test each direction and combination
4. **Dynamic Updates** - Add/remove items while running
5. **Pause/Resume** - Test pause functionality with callbacks

## Troubleshooting

If you encounter issues:

1. **Clear Cache** - Hard refresh browser (Ctrl+Shift+R)
2. **Check Console** - Look for error messages
3. **Restart Dev Server** - Stop with Ctrl+C, run `npm run dev` again
4. **Update Dependencies** - Run `npm install` to ensure latest packages

## Production Build

To create a production build of the development environment:

```bash
npm run dev:build
```

This creates optimized files in `dev/dist/` for deployment.