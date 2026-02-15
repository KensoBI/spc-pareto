# Overview

## What is a Pareto Chart?

A Pareto chart is a combined bar-and-line chart used in quality control and process improvement. It is named after Vilfredo Pareto and his observation that roughly 80% of effects come from 20% of causes — known as the **Pareto principle** or the **80/20 rule**.

The chart consists of:

1. **Bars** — representing individual categories (e.g., defect types), sorted in descending order by frequency or impact
2. **Cumulative percentage line** — a running total that shows how categories accumulate toward 100%
3. **Threshold line** — typically set at 80%, marking the boundary between the "vital few" and the "trivial many"

By reading the chart left to right, you can quickly identify which categories contribute the most to the total and where cumulative effort should be focused.

## How the SPC Pareto Panel Works

The plugin takes query results containing **categories** (string values) and **counts** (numeric values), then automatically:

1. Sorts categories from highest to lowest count
2. Calculates each category's percentage of the total
3. Computes the running cumulative percentage
4. Renders bars on the left y-axis (frequency) and the cumulative line on the right y-axis (0–100%)
5. Draws a configurable threshold line (default 80%) across both axes

## Anatomy of the Panel

```
 Frequency                                  Cumulative %
    |                                            |
 45 | ██                              ●──────── 100%
    | ██                         ●               |
 38 | ██ ██                 ●                    80% ── threshold
    | ██ ██            ●                         |
 29 | ██ ██ ██    ●                              |
    | ██ ██ ██ ██                                |
    | ██ ██ ██ ██ ██ ██ ██ ██ ██                 |
    +────────────────────────────────────────────+
      A    B    C    D    E    F    G    H    I
                      Categories

    ┌──────────────────────────────────────────────────┐
    │ Category │ Frequency │ % Total │ Cum. Count │ Cum. % │
    │ A        │ 45        │ 24.7%   │ 45         │ 24.7%  │
    │ B        │ 38        │ 20.9%   │ 83         │ 45.6%  │
    │ ...      │ ...       │ ...     │ ...        │ ...    │
    └──────────────────────────────────────────────────┘
```

The panel is divided into two resizable sections:

- **Chart area** (top) — the Pareto chart with bars, cumulative line, and threshold
- **Statistics table** (bottom) — an interactive table showing detailed numbers for each category

Drag the splitter between them to adjust the layout.

## When to Use a Pareto Chart

Pareto charts are most useful when you need to:

- **Prioritize improvement efforts** — determine which defect types, failure modes, or issue categories to address first
- **Communicate impact** — show stakeholders where the biggest opportunities lie
- **Track progress** — compare Pareto charts before and after corrective actions to verify improvement
- **Validate assumptions** — confirm whether the 80/20 pattern holds in your data

### Common Applications

| Domain | Example |
|--------|---------|
| Manufacturing | Top defect types on a production line |
| IT Operations | Most frequent incident categories |
| Customer Support | Leading complaint reasons |
| Software Engineering | Bug categories, build failure causes |
| Supply Chain | Supplier quality issues, shipment delays |
| Healthcare | Patient complaint categories, medication errors |

## Relationship to Other SPC Tools

In the SPC (Statistical Process Control) toolkit, the Pareto chart complements other analysis methods:

- **Control Charts** — monitor process stability over time
- **Histograms** — understand the distribution of continuous measurements (see: SPC Histogram plugin)
- **Pareto Charts** — identify the most significant categorical contributors
- **Cause-and-Effect Diagrams** — explore root causes of the top Pareto categories

A typical workflow starts with a Pareto chart to identify the biggest problem areas, then uses control charts and histograms to analyze those areas in detail.
