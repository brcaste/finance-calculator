import { useState } from 'react'
import AutoLoanCalc from './components/AutoLoanCalc'
import MortgageCalc from './components/MortgageCalc'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('auto')

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">Finance Calculator</h1>
          <nav className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'auto' ? 'active' : ''}`}
              onClick={() => setActiveTab('auto')}
            >
              Auto Loan
            </button>
            <button
              className={`tab-btn ${activeTab === 'mortgage' ? 'active' : ''}`}
              onClick={() => setActiveTab('mortgage')}
            >
              Mortgage
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'auto' ? <AutoLoanCalc /> : <MortgageCalc />}
      </main>

      <footer className="app-footer">
        Results are estimates for informational purposes only. Consult a lender for exact figures.
      </footer>
    </div>
  )
}
