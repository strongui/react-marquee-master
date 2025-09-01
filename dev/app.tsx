import React, { useState } from 'react';
import {
  BasicMarquee,
  ControlPanel,
  HorizontalMarquee,
  ItemManager,
  TestMarquee,
  TestVerticalMarquee,
  EnumExample,
} from './components';
import './styles.css';

const App: React.FC = () => {
  const [activeMarquee, setActiveMarquee] = useState<string>('basic');
  const [marqueeItems, setMarqueeItems] = useState([
    { id: 1, text: 'Welcome to React Marquee!', color: 1 },
    { id: 2, text: 'This is a powerful and flexible marquee component.', color: 2 },
    { id: 3, text: 'You can customize it in many ways.', color: 3 },
    { id: 4, text: 'Try different directions and speeds!', color: 4 },
  ]);

  const renderMarquee = () => {
    switch (activeMarquee) {
      case 'basic':
        return <BasicMarquee items={marqueeItems} />;
      case 'horizontal':
        return <HorizontalMarquee items={marqueeItems} />;
      case 'item-manager':
        return <ItemManager items={marqueeItems} onItemsChange={setMarqueeItems} />;
      case 'test':
        return <TestMarquee items={marqueeItems} />;
      case 'test-vertical':
        return <TestVerticalMarquee items={marqueeItems} />;
      case 'enum-example':
        return <EnumExample />;
      default:
        return <BasicMarquee items={marqueeItems} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Marquee Demo</h1>
        <nav className="nav-tabs">
          <button
            className={activeMarquee === 'basic' ? 'active' : ''}
            onClick={() => setActiveMarquee('basic')}
          >
            Basic
          </button>
          <button
            className={activeMarquee === 'horizontal' ? 'active' : ''}
            onClick={() => setActiveMarquee('horizontal')}
          >
            Horizontal
          </button>
          <button
            className={activeMarquee === 'item-manager' ? 'active' : ''}
            onClick={() => setActiveMarquee('item-manager')}
          >
            Item Manager
          </button>
          <button
            className={activeMarquee === 'test' ? 'active' : ''}
            onClick={() => setActiveMarquee('test')}
          >
            Test
          </button>
          <button
            className={activeMarquee === 'test-vertical' ? 'active' : ''}
            onClick={() => setActiveMarquee('test-vertical')}
          >
            Test Vertical
          </button>
          <button
            className={activeMarquee === 'enum-example' ? 'active' : ''}
            onClick={() => setActiveMarquee('enum-example')}
          >
            Enum Examples
          </button>
        </nav>
      </header>

      <main className="app-main">{renderMarquee()}</main>
    </div>
  );
};

export default App;
