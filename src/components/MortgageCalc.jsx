import { useState } from 'react'
import AmortizationTable, { buildSchedule } from './AmortizationTable'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

function calculate({ homePrice, downPayment, annualRatePct, termYears, propTaxYear, insuranceYear, hoaMonth }) {
  const principal = homePrice - downPayment
  if (principal <= 0 || termYears <= 0 || annualRatePct < 0) return null

  const r = annualRatePct / 100 / 12
  const n = termYears * 12
  const pi =
    r === 0
      ? principal / n
      : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const monthlyTax = propTaxYear / 12
  const monthlyInsurance = insuranceYear / 12
  const monthlyHOA = hoaMonth

  const downPct = downPayment / homePrice
  const monthlyPMI = downPct < 0.2 ? (principal * 0.0058) / 12 : 0

  const totalMonthly = pi + monthlyTax + monthlyInsurance + monthlyHOA + monthlyPMI
  const totalInterest = pi * n - principal
  const schedule = buildSchedule(principal, annualRatePct, n, pi)

  return { pi, monthlyTax, monthlyInsurance, monthlyHOA, monthlyPMI, totalMonthly, totalInterest, principal, schedule }
}

export default function MortgageCalc() {
  const [form, setForm] = useState({
    homePrice: '',
    downDollar: '',
    downPct: '',
    rate: '',
    term: '30',
    propTax: '',
    insurance: '',
    hoa: '',
  })
  const [result, setResult] = useState(null)
  const [showSchedule, setShowSchedule] = useState(false)

  const set = (field) => (e) => {
    const val = e.target.value
    setForm((f) => {
      const updated = { ...f, [field]: val }
      const price = parseFloat(field === 'homePrice' ? val : f.homePrice) || 0

      if (field === 'downDollar') {
        updated.downPct = price > 0 ? ((parseFloat(val) || 0) / price * 100).toFixed(1) : ''
      } else if (field === 'downPct') {
        updated.downDollar = price > 0 ? ((parseFloat(val) || 0) / 100 * price).toFixed(0) : ''
      } else if (field === 'homePrice') {
        if (f.downPct) {
          updated.downDollar = price > 0 ? ((parseFloat(f.downPct) || 0) / 100 * price).toFixed(0) : ''
        } else if (f.downDollar) {
          updated.downPct = price > 0 ? ((parseFloat(f.downDollar) || 0) / price * 100).toFixed(1) : ''
        }
      }
      return updated
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setResult(
      calculate({
        homePrice: parseFloat(form.homePrice) || 0,
        downPayment: parseFloat(form.downDollar) || 0,
        annualRatePct: parseFloat(form.rate) || 0,
        termYears: parseInt(form.term) || 30,
        propTaxYear: parseFloat(form.propTax) || 0,
        insuranceYear: parseFloat(form.insurance) || 0,
        hoaMonth: parseFloat(form.hoa) || 0,
      })
    )
    setShowSchedule(false)
  }

  return (
    <>
      <div className="calc-card">
        <div className="calc-layout">
          <form className="calc-form" onSubmit={handleSubmit}>
            <h2 className="calc-title">Mortgage Calculator</h2>

            <div className="form-group">
              <label htmlFor="mg-price">Home Price</label>
              <div className="input-wrap">
                <span className="input-prefix">$</span>
                <input
                  id="mg-price"
                  type="number"
                  min="0"
                  step="1000"
                  value={form.homePrice}
                  onChange={set('homePrice')}
                  placeholder="350,000"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Down Payment</label>
              <div className="form-row">
                <div className="input-wrap" style={{ flex: 2 }}>
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.downDollar}
                    onChange={set('downDollar')}
                    placeholder="70,000"
                  />
                </div>
                <div className="input-wrap" style={{ flex: 1 }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={form.downPct}
                    onChange={set('downPct')}
                    placeholder="20"
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mg-rate">Interest Rate (APR)</label>
                <div className="input-wrap">
                  <input
                    id="mg-rate"
                    type="number"
                    min="0"
                    max="30"
                    step="0.125"
                    value={form.rate}
                    onChange={set('rate')}
                    placeholder="7.0"
                    required
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="mg-term">Loan Term</label>
                <select
                  id="mg-term"
                  className="select-input"
                  value={form.term}
                  onChange={set('term')}
                >
                  <option value="10">10 years</option>
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="25">25 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mg-tax">Property Tax / Year</label>
                <div className="input-wrap">
                  <span className="input-prefix">$</span>
                  <input
                    id="mg-tax"
                    type="number"
                    min="0"
                    step="100"
                    value={form.propTax}
                    onChange={set('propTax')}
                    placeholder="3,500"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="mg-ins">Home Insurance / Year</label>
                <div className="input-wrap">
                  <span className="input-prefix">$</span>
                  <input
                    id="mg-ins"
                    type="number"
                    min="0"
                    step="100"
                    value={form.insurance}
                    onChange={set('insurance')}
                    placeholder="1,200"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mg-hoa">HOA Fees / Month</label>
              <div className="input-wrap">
                <span className="input-prefix">$</span>
                <input
                  id="mg-hoa"
                  type="number"
                  min="0"
                  step="10"
                  value={form.hoa}
                  onChange={set('hoa')}
                  placeholder="0"
                />
              </div>
            </div>

            <button type="submit" className="calc-btn">Calculate</button>
          </form>

          <div className="results-panel">
            {result ? (
              <>
                <div className="result-hero">
                  <span className="result-label">Monthly Payment</span>
                  <span className="result-amount">{fmt(result.totalMonthly)}</span>
                </div>

                <div className="result-breakdown">
                  <div className="breakdown-row">
                    <span>Principal &amp; Interest</span>
                    <span>{fmt(result.pi)}</span>
                  </div>
                  {result.monthlyTax > 0 && (
                    <div className="breakdown-row">
                      <span>Property Tax</span>
                      <span>{fmt(result.monthlyTax)}</span>
                    </div>
                  )}
                  {result.monthlyInsurance > 0 && (
                    <div className="breakdown-row">
                      <span>Home Insurance</span>
                      <span>{fmt(result.monthlyInsurance)}</span>
                    </div>
                  )}
                  {result.monthlyPMI > 0 && (
                    <div className="breakdown-row pmi">
                      <span>PMI</span>
                      <span>{fmt(result.monthlyPMI)}</span>
                    </div>
                  )}
                  {result.monthlyHOA > 0 && (
                    <div className="breakdown-row">
                      <span>HOA Fees</span>
                      <span>{fmt(result.monthlyHOA)}</span>
                    </div>
                  )}
                  <div className="breakdown-row total">
                    <span>Total Monthly</span>
                    <span>{fmt(result.totalMonthly)}</span>
                  </div>
                </div>

                <div className="result-summary">
                  <div className="summary-item">
                    <span className="summary-label">Loan Amount</span>
                    <span className="summary-value">{fmt(result.principal)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Interest</span>
                    <span className="summary-value">{fmt(result.totalInterest)}</span>
                  </div>
                </div>

                {result.monthlyPMI > 0 && (
                  <p className="pmi-note">
                    * PMI applies until your loan balance reaches 80% of the home value.
                  </p>
                )}
              </>
            ) : (
              <div className="results-empty">
                <p>
                  Enter your mortgage details and click <strong>Calculate</strong> to
                  see your estimated monthly payment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="amort-section">
          <button
            className="amort-toggle-btn"
            onClick={() => setShowSchedule((s) => !s)}
          >
            {showSchedule ? '▴ Hide' : '▾ Show'} Amortization Schedule
          </button>
          {showSchedule && (
            <AmortizationTable
              schedule={result.schedule}
              note="Schedule reflects principal & interest only. Tax, insurance, PMI, and HOA are not amortized."
            />
          )}
        </div>
      )}
    </>
  )
}
