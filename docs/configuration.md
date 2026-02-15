# Configuration

This page covers all panel options and field configuration settings available in the SPC Pareto panel.

## Panel Options

### Threshold

| Option | Description | Default |
|--------|-------------|---------|
| **Show threshold line** | Toggle the 80/20 threshold lines on the chart. When enabled, a horizontal dashed line is drawn at the threshold percentage, and a vertical dashed line marks the category where the cumulative percentage crosses the threshold. | On |
| **Threshold value** | The cumulative percentage at which to draw the threshold line. The classic Pareto threshold is 80%, but you can adjust this to any value between 0 and 100. Only visible when "Show threshold line" is enabled. | 80% |

### Cumulative Line

| Option | Description | Default |
|--------|-------------|---------|
| **Line color** | The color of the cumulative percentage line. Leave empty to use the theme's default warning color (yellow/amber). Click to open the color picker. | Theme warning color |
| **Line width** | The stroke width of the cumulative percentage line, in pixels. | 2 |
| **Show points** | Whether to show circular point markers at each data point on the cumulative line. Useful for identifying exact category positions. | On |

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

## Field Configuration

Field overrides are available under the **Overrides** tab in the panel editor.

| Option | Description | Default |
|--------|-------------|---------|
| **Fill opacity** | Controls the opacity of the bar fill, from 0 (transparent) to 100 (solid). | 80 |
| **Line width** | Controls the border width of the bars, in pixels. | 1 |
| **Gradient mode** | Controls the gradient fill of the bars. Options: None, Opacity, Hue, Scheme. | None |

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
