import React, { useState } from 'react'
import { BasicMarquee, ItemManager, TestVerticalMarquee } from './components'
import './styles.css'

const App: React.FC = () => {
  const [marqueeItems, setMarqueeItems] = useState([
    { id: 1, text: 'Welcome to React Marquee!', color: 1 },
    { id: 2, text: 'This is a powerful and flexible marquee component.', color: 2 },
    { id: 3, text: 'You can customize it in many ways.', color: 3 },
    { id: 4, text: 'Try different directions and speeds!', color: 4 },
  ])

  const renderBasicMarque = true
  const renderVerticalMarquee = false

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Marquee Demo</h1>
        <p className="app-subtitle">Interactive demo showcasing the React Marquee component</p>
      </header>

      <main className="app-main">
        {/* Item Manager - Controls all marquees */}
        <section className="item-manager-section">
          <ItemManager
            items={marqueeItems}
            onItemsChange={setMarqueeItems}
          />
        </section>

        {/* Basic Horizontal Marquee */}
        {renderBasicMarque && (
          <section className="marquee-section">
            <h2>Basic Horizontal Marquee</h2>
            <BasicMarquee items={marqueeItems} />
          </section>
        )}
        {/* Vertical Marquee */}
        {renderVerticalMarquee && (
          <section className="marquee-section">
            <h2>Vertical Marquee</h2>
            <TestVerticalMarquee items={marqueeItems} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
