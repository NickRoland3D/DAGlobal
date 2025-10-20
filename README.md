# DA-640 ROI Calculator

A comprehensive Return on Investment (ROI) calculator for the DA-640 printer, designed for the UAE market. This interactive web application helps sales representatives and customers analyze financial projections, profit margins, and payback periods for different printing scenarios.

## Features

- **Real-time Calculations**: Instant updates as users adjust parameters
- **Interactive Sliders**: Easy-to-use controls for monthly output and selling price
- **Media Type Selection**: Compare ROI across Economy, Standard, and Premium media
- **Visual Analytics**:
  - 24-month ROI timeline chart with profit projections
  - Cost breakdown visualization
  - Profit margin pie chart
  - Payback period progress indicator
- **Responsive Design**: Optimized layouts for desktop (3-column), tablet (2-column), and mobile
- **Centered Dashboard**: Content stays centered and fully visible without scrolling

## Tech Stack

- **React 18.3** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **Recharts 2.15** - Interactive data visualization
- **PostCSS** - CSS processing

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd DAFigma

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Netlify functions rely on Supabase credentials that should **not** be committed to source control. Copy `netlify.env.example` to `netlify.env` and provide your deployment-specific values before running Netlify locally or deploying:

```bash
cp netlify.env.example netlify.env
# then edit netlify.env to include your Supabase URL, service role key, and table name
```

## Responsive Breakpoints

The application features three responsive layouts:

### Mobile/Small Tablets (< 900px)
- Stacked vertical layout
- Full-width components
- Optimized for touch interaction

### Tablet (900px - 1229px)
- 2-column layout
- Left: Input controls (360px fixed width)
- Right: ROI chart + metrics grid
- Bottom section stacks vertically on narrow tablets

### Desktop (≥ 1230px)
- 3-column layout
- Left: Input controls (360px fixed)
- Middle: ROI chart, cost breakdown, monthly overhead (460-580px flexible)
- Right: Key metrics (360px fixed)
- Dashboard uses available space up to 1440px max width

## Project Structure

```
src/
├── components/
│   ├── Slider.tsx              # Reusable slider input component
│   ├── MediaSelector.tsx       # Media type selection UI
│   ├── MetricCard.tsx          # Individual metric display card
│   ├── ProgressBar.tsx         # Visual progress indicator
│   ├── ROIChart.tsx            # 24-month timeline chart
│   ├── PieChart.tsx            # Profit margin visualization
│   ├── CostBreakdown.tsx       # Cost analysis breakdown
│   └── MonthlyOverhead.tsx     # Overhead cost input
├── hooks/
│   └── useCalculator.ts        # ROI calculation logic
├── types.ts                    # TypeScript type definitions
├── constants.ts                # Media types, ranges, defaults
├── App.tsx                     # Main application component
└── main.tsx                    # Application entry point
```

## Key Components

### useCalculator Hook
Central calculation engine that computes:
- Total costs per m²
- Profit margins
- Monthly revenue and profit
- Payback period
- Break-even volume
- 24-month ROI projections

### ROIChart
Interactive timeline showing:
- Monthly profit (line)
- Cumulative return (filled area)
- Break-even point (reference line)
- Responsive chart scaling

### PieChart
Profit margin visualization displaying:
- Profit percentage
- Media cost breakdown
- Ink cost breakdown
- Responsive sizing

## Configuration

### Media Types
Defined in `src/constants.ts`:
- **Economy**: 22.27 AED/m² - Best Margin
- **Standard**: 30.13 AED/m² - Balanced
- **Premium**: 38.00 AED/m² - Best Quality

### Default Values
- Total Investment: 220,000 AED
- Monthly Output: 150 m²
- Selling Price: 190 AED/m²
- Ink Cost: 12.27 AED/m²
- Monthly Overhead: 0 AED

### Slider Ranges
- Monthly Output: 50 - 1000 m² (step: 10)
- Selling Price: 100 - 500 AED/m² (step: 10)
- Monthly Overhead: 0 - 50,000 AED (step: 1000)

## Calculations

Detailed calculation logic is documented in `ROI_CALCULATIONS.md`. Key formulas:

```
Total Cost/m² = Media Cost + Ink Cost (12.27 AED)
Profit Margin/m² = Selling Price - Total Cost/m²
Monthly Revenue = Monthly Output × Selling Price
Monthly Profit = Monthly Revenue - (Monthly Output × Total Cost/m²) - Monthly Overhead
Payback Period = Total Investment ÷ Monthly Profit
Break-even Volume = Total Investment ÷ Profit Margin/m²
```

## Styling

### Tailwind Configuration
Custom theme extensions in `tailwind.config.js`:
- **Colors**:
  - Primary: #2d5f5d (teal)
  - Secondary: #afc1c0 (light teal)
  - Background: #d1d8d4 (sage)
- **Breakpoints**:
  - md: 900px
  - xl: 1230px

### Design System
- Rounded cards: `rounded-3xl`
- Consistent spacing: 24px gaps (16px at tight widths)
- Typography: Font-black headings, tracking-wider for labels
- Shadows: Subtle `shadow-sm` on cards

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- React.useMemo for expensive calculations
- Responsive images and charts
- Minimal re-renders with proper state management
- Code splitting via Vite
- CSS purging in production builds

## Future Enhancements

- Settings panel for customizing investment amount and costs
- Share functionality for exporting reports
- Monthly overhead toggle/apply feature
- Multiple currency support
- Print/PDF export
- Historical scenario comparison

## License

[Your License Here]

## Support

For issues or questions, please contact [Your Contact Information].

---

Built with React + TypeScript + Vite
