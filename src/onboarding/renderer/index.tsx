import { createRoot } from 'react-dom/client'
import React from 'react'

const App = () => {
  const handleComplete = () => {
    window.onboardingAPI.complete()
  }

  return (
    <div>
      <h1>Welcome to Gittastic</h1>
      <button onClick={handleComplete}>Get Started</button>
    </div>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
