# Configuration

This page covers all panel options and field configuration settings available in the SPC Pareto panel.

## Panel Options

### Threshold

| Option | Description | Default |
|--------|-------------|---------|
| **Show threshold line** | Toggle the 80/20 threshold lines on the chart. When enabled, a horizontal dashed line is drawn at the threshold percentage, and a vertical dashed line marks the category where the cumulative percentage crosses the threshold. | On |
| **Threshold value** | The cumulative percentage at which to draw the threshold line. The classic Pareto threshold is 80%, but you can adjust this to any value between 0 and 100. Only visible when "Show threshold line" is enabled. | 80% |
| **Highlight vital few** | Visually distinguish the "vital few" bars from the "trivial many". When enabled, bars beyond the threshold crossing point are drawn with reduced opacity, making the most impactful categories stand out. Requires "Show threshold line" to be enabled. | Off |
| **Trivial bar opacity** | Controls the opacity of bars beyond the threshold crossing point (the "trivial many"), from 10% to 100%. Lower values create a stronger visual contrast between vital and trivial categories. Only visible when "Highlight vital few" is enabled. | 40% |

### Cumulative Line

| Option | Description | Default |
|--------|-------------|---------|
| **Line color** | The color of the cumulative percentage line. Leave empty to use the theme's default warning color (yellow/amber). Click to open the color picker. | Theme warning color |
| **Line width** | The stroke width of the cumulative percentage line, in pixels. | 2 |
| **Show points** | Whether to show circular point markers at each data point on the cumulative line. Useful for identifying exact category positions. | On |
| **Point size** | The size of point markers on the cumulative line, in pixels. Only visible when "Show points" is enabled. | 5 |

### Top N / Other

| Option | Description | Default |
|--------|-------------|---------|
| **Limit categories** | When enabled, only the top N categories are shown individually. All remaining categories are grouped into a single "Other" bucket. This is useful when your data has many low-frequency categories that add clutter to the chart. | Off |
| **Show top N categories** | The number of individual categories to display before grouping the rest into "Other". Only visible when "Limit categories" is enabled. | 10 |

### Bar

| Option | Description | Default |
|--------|-------------|---------|
| **Bar color** | The fill color of the frequency bars. Click to open the color picker. | Blue |
| **Fill opacity** | Controls the opacity of the bar fill, from 0 (transparent) to 100 (solid). | 80% |
| **Line width** | Controls the border width of the bars, in pixels. | 1 |
| **Gradient mode** | Controls the gradient fill of the bars. Options: None, Opacity, Hue. | None |
| **Show value labels** | Display labels above each bar showing the frequency value, percentage, or both. Useful for reading exact values without hovering or consulting the table. | Off |
| **Label content** | What to display in the bar labels. Options: Count (raw frequency), % of Total (percentage of grand total), Both (count and percentage). Only visible when "Show value labels" is enabled. | Count |

### Statistics Table

| Option | Description | Default |
|--------|-------------|---------|
| **Show statistics table** | Toggle the interactive statistics table below the chart. When enabled, a resizable table displays detailed metrics for each category. | On |

### Legend

Standard Grafana legend options are available:

- **Visibility** — show or hide the legend
- **Placement** — bottom or right
- **Width** — fixed width when placed on the right

### Tooltip

Standard Grafana tooltip options are available:

- **Mode** — single or all series

## Layout

The panel is divided into two resizable panes:

1. **Chart** (top) — the Pareto chart visualization
2. **Statistics table** (bottom) — the interactive data table

Drag the horizontal splitter between them to adjust how much space each section occupies. The default split is 75% chart / 25% table.

## Axes

The chart uses three axes:

| Axis | Position | Description |
|------|----------|-------------|
| **Categories** | Bottom | Category names from the string field. Labels are automatically thinned if there are too many to display without overlap. |
| **Frequency** | Left | Numeric values from the number field. Automatically scaled with a soft minimum of 0. |
| **Cumulative %** | Right | Fixed scale from 0% to 100%. Shows the running cumulative percentage. |

## Tooltip

Hovering over the chart displays a tooltip with:

- **Category name** — the category under the cursor
- **Frequency** — the raw count/value for that category
- **% of Total** — the category's share of the overall total
- **Cumulative %** — the running cumulative percentage up to and including that category
