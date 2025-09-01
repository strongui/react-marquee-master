import React from 'react'
import { ItemManager } from './components'
import './styles.css'

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React Marquee Demo</h1>
        <p className="app-subtitle">Interactive demo showcasing the React Marquee component</p>
      </header>

      <main className="app-main">
        {/* Item Manager - Now the parent component that renders marquees */}
        <ItemManager
          renderBasicMarquee={true}
          renderVerticalMarquee={false}
        />
      </main>
    </div>
  )
}

export default App
