import { useState } from 'react'
import AmortizationTable, { buildSchedule } from './AmortizationTable'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

function calculate({ price, downPayment, tradeIn, salesTaxPct, fees, financeFees, annualRatePct, termMonths }) {
  const taxAmount = price * (salesTaxPct / 100)
  const financedFees = financeFees ? fees : 0
  const principal = price - downPayment - tradeIn + taxAmount + financedFees

  if (principal <= 0 || termMonths <= 0 || annualRatePct < 0) return null

  const r = annualRatePct / 100 / 12
  const monthly =
    r === 0
      ? principal / termMonths
      : (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)

  const totalPayment = monthly * termMonths
  const totalInterest = totalPayment - principal
  const upfrontFees = financeFees ? 0 : fees
  const schedule = buildSchedule(principal, annualRatePct, termMonths, monthly)

  return { principal, monthly, totalPayment, totalInterest, upfrontFees, schedule, annualRatePct, termMonths }
}

export default function AutoLoanCalc() {
  const [form, setForm] = useState({
    price: '',
    downPayment: '',
    tradeIn: '',
    salesTax: '',
    fees: '',
    financeFees: true,
    rate: '',
    term: '60',
  })
  const [result, setResult] = useState(null)
  const [showSchedule, setShowSchedule] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const toggle = (field) => () => setForm((f) => ({ ...f, [field]: !f[field] }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setResult(
      calculate({
        price: parseFloat(form.price) || 0,
        downPayment: parseFloat(form.downPayment) || 0,
        tradeIn: parseFloat(form.tradeIn) || 0,
        salesTaxPct: parseFloat(form.salesTax) || 0,
        fees: parseFloat(form.fees) || 0,
        financeFees: form.financeFees,
        annualRatePct: parseFloat(form.rate) || 0,
        termMonths: parseInt(form.term) || 60,
      })
    )
    setShowSchedule(false)
  }

  const principalPct = result
    ? (result.principal / result.totalPayment) * 100
    : 0

  return (
    <>
      <div className="calc-card">
        <div className="calc-layout">
          <form className="calc-form" onSubmit={handleSubmit}>
            <h2 className="calc-title">Auto Loan Calculator</h2>

            <div className="form-group">
              <label htmlFor="al-price">Vehicle Price</label>
              <div className="input-wrap">
                <span className="input-prefix">$</span>
                <input
                  id="al-price"
                  type="number"
                  min="0"
                  step="100"
                  value={form.price}
                  onChange={set('price')}
                  placeholder="25,000"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="al-down">Down Payment</label>
                <div className="input-wrap">
                  <span className="input-prefix">$</span>
                  <input
                    id="al-down"
                    type="number"
                    min="0"
                    step="100"
                    value={form.downPayment}
                    onChange={set('downPayment')}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="al-tradein">Trade-In Value</label>
                <div className="input-wrap">
                  <span className="input-prefix">$</span>
                  <input
                    id="al-tradein"
                    type="number"
                    min="0"
                    step="100"
                    value={form.tradeIn}
                    onChange={set('tradeIn')}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="al-rate">Interest Rate (APR)</label>
                <div className="input-wrap">
                  <input
                    id="al-rate"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={form.rate}
                    onChange={set('rate')}
                    placeholder="6.5"
                    required
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="al-term">Loan Term</label>
                <select
                  id="al-term"
                  className="select-input"
                  value={form.term}
                  onChange={set('term')}
                >
                  <option value="24">24 months (2 yr)</option>
                  <option value="36">36 months (3 yr)</option>
                  <option value="48">48 months (4 yr)</option>
                  <option value="60">60 months (5 yr)</option>
                  <option value="72">72 months (6 yr)</option>
                  <option value="84">84 months (7 yr)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="al-tax">Sales Tax</label>
                <div className="input-wrap">
                  <input
                    id="al-tax"
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={form.salesTax}
                    onChange={set('salesTax')}
                    placeholder="0"
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="al-fees">Other Fees</label>
                <div className="input-wrap">
                  <span className="input-prefix">$</span>
                  <input
                    id="al-fees"
                    type="number"
                    min="0"
                    step="50"
                    value={form.fees}
                    onChange={set('fees')}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.financeFees}
                onChange={toggle('financeFees')}
              />
              Roll fees into loan
            </label>

            <button type="submit" className="calc-btn">Calculate</button>
          </form>

          <div className="results-panel">
            {result ? (
              <>
                <div className="result-hero">
                  <span className="result-label">Monthly Payment</span>
                  <span className="result-amount">{fmt(result.monthly)}</span>
                </div>

                <div className="result-breakdown">
                  <div className="breakdown-row">
                    <span>Loan Amount</span>
                    <span>{fmt(result.principal)}</span>
                  </div>
                  {result.upfrontFees > 0 && (
                    <div className="breakdown-row">
                      <span>Fees Due at Signing</span>
                      <span>{fmt(result.upfrontFees)}</span>
                    </div>
                  )}
                  <div className="breakdown-row">
                    <span>Total Interest Paid</span>
                    <span>{fmt(result.totalInterest)}</span>
                  </div>
                  <div className="breakdown-row total">
                    <span>Total Cost of Loan</span>
                    <span>{fmt(result.totalPayment + result.upfrontFees)}</span>
                  </div>
                </div>

                <div className="interest-bar-wrap">
                  <div className="interest-bar-label">
                    <span>Principal</span>
                    <span>Interest</span>
                  </div>
                  <div className="interest-bar">
                    <div
                      className="interest-bar-fill principal"
                      style={{ width: `${principalPct}%` }}
                    />
                    <div
                      className="interest-bar-fill interest"
                      style={{ width: `${100 - principalPct}%` }}
                    />
                  </div>
                  <div className="interest-bar-label">
                    <span>{fmt(result.principal)}</span>
                    <span>{fmt(result.totalInterest)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="results-empty">
                <p>
                  Enter your loan details and click <strong>Calculate</strong> to
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
            <AmortizationTable schedule={result.schedule} />
          )}
        </div>
      )}
    </>
  )
}
