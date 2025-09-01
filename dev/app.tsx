import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BasicMarquee,
  HorizontalMarquee,
  ItemManager,
  TestMarquee,
  TestVerticalMarquee,
} from './components';
import './styles.css';

interface MarqueeItem {
  id: number;
  text: string;
  color: number;
}

const initialItems: MarqueeItem[] = [
  { id: 1, text: '1. 🎉 Welcome to React Marquee Master!', color: 1 },
  { id: 2, text: '2. ⚡ This is a smooth scrolling text component', color: 2 },
  { id: 3, text: '3. 🚀 Built with TypeScript and React', color: 3 },
  { id: 4, text: '4. 📢 Perfect for announcements and news', color: 4 },
  { id: 5, text: '5. 🛠️ Easy to customize and use', color: 1 },
  { id: 6, text: '6. ♾️ Smooth infinite scrolling effect', color: 2 },
  { id: 7, text: '7. ✨ With beautiful fade masks', color: 3 },
  { id: 8, text: '8. 🎯 No jerky movements, just smooth flow', color: 4 },
];

// Configuration array - add the marquee types you want to test
const activeMarquees: string[] = ['basic', 'horizontal', 'test', 'test-vertical'];

// Main App Component
const App: React.FC = () => {
  const [items, setItems] = useState<MarqueeItem[]>(initialItems);

  const renderMarquee = (type: string) => {
    switch (type) {
      case 'basic':
        return <BasicMarquee key={type} items={items} />;
      case 'horizontal':
        return <HorizontalMarquee key={type} items={items} />;
      case 'test':
        return <TestMarquee key={type} items={items} />;
      case 'test-vertical':
        return <TestVerticalMarquee key={type} items={items} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h1>React Marquee Master - Live Development Demo</h1>
      <p>This is a live development environment to test the React Marquee component.</p>
      <p>
        <strong>Active Marquees:</strong> Basic (vertical), Horizontal, Test (smart scrolling), and
        Test Vertical
      </p>

      {/* Item Manager - Controls all marquees */}
      <ItemManager items={items} onItemsChange={setItems} />

      {/* Render all marquees with shared items */}
      {activeMarquees.map(renderMarquee)}
    </div>
  );
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
});
