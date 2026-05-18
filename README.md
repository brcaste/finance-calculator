# Finance Calculator

A responsive web application for estimating auto loan and mortgage payments. Built with React and Vite, designed to work seamlessly on both mobile and desktop.

## Features

### Auto Loan Calculator
- Vehicle price, down payment, and trade-in value
- Adjustable APR and loan term (24–84 months)
- Sales tax and additional fees
- Option to finance fees into the loan or pay at signing
- Principal vs. interest breakdown bar

### Mortgage Calculator
- Home price with synced dollar / percentage down payment fields
- Adjustable APR and loan term (10–30 years)
- Property tax, home insurance, and HOA fees
- Automatic PMI calculation when down payment is under 20%
- Itemized monthly payment breakdown

### Amortization Schedule
- Available for both calculators after calculating
- Grouped by year with expandable month-by-month detail
- Shows payment, principal, interest, and remaining balance per period

### Responsive Design
- Two-column layout on desktop
- Single-column stacked layout on mobile
- Accessible form inputs with proper labels and validation

## Tech Stack

- **React 19** — UI and state management
- **Vite 8** — build tooling and dev server
- **CSS (no UI framework)** — custom design system with CSS variables, responsive grid, and dark-mode-ready color tokens
- **JavaScript** — all financial calculations implemented from scratch (no math libraries)

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── App.jsx                      # Tab navigation (Auto Loan / Mortgage)
├── App.css                      # Design system and component styles
├── index.css                    # Global reset and CSS variables
└── components/
    ├── AutoLoanCalc.jsx         # Auto loan form and results
    ├── MortgageCalc.jsx         # Mortgage form and results
    └── AmortizationTable.jsx    # Shared amortization schedule table
```

## Financial Formulas

Monthly payment is calculated using the standard amortization formula:

```
M = P × [r(1+r)^n] / [(1+r)^n - 1]
```

Where `P` = principal, `r` = monthly interest rate, `n` = number of payments.
