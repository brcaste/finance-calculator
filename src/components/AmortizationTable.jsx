import { useState } from 'react'

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export function buildSchedule(principal, annualRatePct, termMonths, monthlyPayment) {
  const r = annualRatePct / 100 / 12
  const rows = []
  let balance = principal

  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * r
    const principalPaid = monthlyPayment - interest
    balance = Math.max(0, balance - principalPaid)
    rows.push({ month, payment: monthlyPayment, principal: principalPaid, interest, balance })
  }
  return rows
}

function groupByYear(schedule) {
  const years = []
  for (let i = 0; i < schedule.length; i += 12) {
    const months = schedule.slice(i, i + 12)
    years.push({
      year: Math.floor(i / 12) + 1,
      months,
      totalPayment: months.reduce((s, m) => s + m.payment, 0),
      totalPrincipal: months.reduce((s, m) => s + m.principal, 0),
      totalInterest: months.reduce((s, m) => s + m.interest, 0),
      endBalance: months[months.length - 1].balance,
    })
  }
  return years
}

export default function AmortizationTable({ schedule, note }) {
  const [expanded, setExpanded] = useState(new Set())

  const toggle = (year) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(year) ? next.delete(year) : next.add(year)
      return next
    })

  const years = groupByYear(schedule)

  return (
    <div className="amort-wrap">
      {note && <p className="amort-note">{note}</p>}
      <div className="amort-scroll">
        <table className="amort-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Payment</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {years.map((yr) => (
              <>
                <tr
                  key={`y${yr.year}`}
                  className="amort-year-row"
                  onClick={() => toggle(yr.year)}
                >
                  <td>
                    <span className="amort-chevron">
                      {expanded.has(yr.year) ? '▾' : '▸'}
                    </span>
                    Year {yr.year}
                  </td>
                  <td>{fmt(yr.totalPayment)}</td>
                  <td>{fmt(yr.totalPrincipal)}</td>
                  <td>{fmt(yr.totalInterest)}</td>
                  <td>{fmt(yr.endBalance)}</td>
                </tr>
                {expanded.has(yr.year) &&
                  yr.months.map((mo) => (
                    <tr key={`m${mo.month}`} className="amort-month-row">
                      <td className="amort-month-label">Month {mo.month}</td>
                      <td>{fmt(mo.payment)}</td>
                      <td>{fmt(mo.principal)}</td>
                      <td>{fmt(mo.interest)}</td>
                      <td>{fmt(mo.balance)}</td>
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
