# EMIROI Calculator - Calculation Logic & Pricing

## Overview
This document explains all pricing, costs, and calculation logic used in the DA-640 ROI Calculator for the UAE market. All prices are in AED (UAE Dirham).

## 1. Investment Pricing

### Base Investment
- **Starting Price**: 220,000 AED
- **Recommended Floor**: 195,000 AED (UI highlights "in the red" when going lower)
- **Negotiation Range**: Flexible; calculator and slider allow dipping below the floor for special concessions
- **Default Slider Flex**: Extends ~100K AED below the floor and dynamically stretches further if deeper concessions are offered

### Price Negotiation Modes
1. **Slider Mode**: Visual slider for quick adjustments
2. **Calculator Mode**: Numeric input for precise pricing

## 2. Media Costs

### Roll Specifications
- **Width**: 1.5 meters
- **Length**: 50 meters
- **Total Area per Roll**: 75 m² (1.5m × 50m)

### Media Types & Pricing

| Media Type | Roll Price (AED) | Cost per m² (AED) | Margin Profile |
|------------|------------------|-------------------|----------------|
| Economy    | 1,670           | 22.27            | Best Margin    |
| Standard   | 2,260           | 30.13            | Balanced       |
| Premium    | 2,850           | 38.00            | Best Quality   |

**Calculation**: Cost per m² = Roll Price ÷ 75 m²

## 3. Ink Costs

### Ink Usage Pattern
- **Total Ink Usage**: 15ml per m²
- **Split**: 60% CMYK / 40% Structural

### Ink Types & Costs

| Ink Type    | Usage per m² | Bottle Size | Bottle Price (AED) | Cost per ml | Cost per m² |
|-------------|--------------|-------------|-------------------|-------------|-------------|
| CMYK        | 9ml (60%)    | 500ml       | 375              | 0.75        | 6.75        |
| Structural  | 6ml (40%)    | 500ml       | 460              | 0.92        | 5.52        |
| **Total**   | **15ml**     | -           | -                | -           | **12.27**   |

**Calculations**:
- CMYK cost per ml = 375 AED ÷ 500ml = 0.75 AED/ml
- CMYK cost per m² = 9ml × 0.75 AED/ml = 6.75 AED
- Structural cost per ml = 460 AED ÷ 500ml = 0.92 AED/ml
- Structural cost per m² = 6ml × 0.92 AED/ml = 5.52 AED

## 4. Total Production Costs

### Cost per m² Breakdown

| Media Type | Media Cost | CMYK Ink | Structural Ink | Total Cost per m² |
|------------|------------|----------|----------------|-------------------|
| Economy    | 22.27      | 6.75     | 5.52          | 34.54            |
| Standard   | 30.13      | 6.75     | 5.52          | 42.40            |
| Premium    | 38.00      | 6.75     | 5.52          | 50.27            |

## 5. Revenue & Profit Calculations

### Input Variables
- **Monthly Output**: User-defined (default: 150 m²)
- **Selling Price**: User-defined (default: 190 AED/m²)
- **Media Type**: User-selected (Economy/Standard/Premium)

### Monthly Calculations

```
Monthly Revenue = Monthly Output (m²) × Selling Price (AED/m²)
Monthly Costs = Monthly Output (m²) × Total Cost per m² (based on media type)
Monthly Profit = Monthly Revenue - Monthly Costs
```

### Example (Dashboard Defaults)
- Monthly Output: 150 m²
- Selling Price: 190 AED/m²
- Media Type: Economy (34.54 AED/m² total cost)

```
Monthly Revenue = 150 × 190 = 28,500 AED
Monthly Costs = 150 × 34.54 ≈ 5,181 AED
Monthly Profit = 28,500 - 5,181 ≈ 23,319 AED
```

## 6. ROI Metrics

### Profit Margin
```
Profit Margin % = (Monthly Profit ÷ Monthly Revenue) × 100
```
Example: (22,140 ÷ 28,500) × 100 = 77.7%

### Payback Period
```
Payback Period (months) = Investment Amount ÷ Monthly Profit
```
Example: 220,000 ÷ 22,140 = 9.9 months

### Annual Metrics
```
Annual Profit = Monthly Profit × 12
Annual Revenue = Monthly Revenue × 12
```

## 7. Display Formatting

### Number Formats
- **Large amounts**: Shown as "22K" (thousands)
- **Percentages**: Shown without decimals "78%"
- **Payback**: Shown as "9.9 MONTHS"

### Value Ranges
- **Output Range**: 50 - 1000 m² per month
- **Selling Price Range**: 100 - 500 AED per m²
- **Payback Progress**: Visualized against 24-month timeline

## 8. Settings & Adjustments

### User Adjustable Settings
1. **Minimum Investment Price**: Floor price for negotiations
2. **Media Prices**: Cost per roll for each quality level
3. **Ink Prices**: Cost per 500ml bottle
4. **Roll Dimensions**: Width and length for area calculations

### Fixed Parameters
- Ink usage split: 60% CMYK / 40% Structural
- Total ink usage: 15ml per m²

## 9. Business Logic

### Price Validation & Visual Cues
- Sales reps can negotiate below the recommended floor; the calculator environment shifts to red to signal margin risk
- Haggle message updates to "In the red" when below floor to support on-the-spot justification

### Margin Calculation
```
Margin per m² = Selling Price - Total Cost per m²
```

### Break-even Analysis
The calculator shows progress toward break-even using a visual progress bar scaled to 24 months, helping visualize how quickly the investment will be recovered.

## Summary

The calculator provides real-time ROI analysis for the DA-640 printer in the UAE market, focusing on:
- **Monthly Profit** as the primary metric
- **Profit Margin** to show business efficiency
- **Payback Period** to demonstrate investment recovery time
- **Flexible pricing** through negotiation tools

All calculations update dynamically as users adjust output volume, selling price, media type, and investment amount, providing immediate feedback for sales negotiations.
