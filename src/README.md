# SPC Pareto

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/kensobi-spcpareto-panel&label=Marketplace&prefix=v&color=F47A20)
![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.downloads&url=https://grafana.com/api/plugins/kensobi-spcpareto-panel&label=Downloads&color=blue)
![Grafana](https://img.shields.io/badge/Grafana-12.3%2B-orange?logo=grafana)

Bring **Statistical Process Control** directly into your Grafana dashboards. The SPC Pareto panel helps quality and manufacturing teams identify the most significant factors contributing to defects, downtime, or any categorical issue — so you can focus improvement efforts where they matter most.

<!-- TODO: Replace with actual screenshot URL after publishing -->
<!-- ![SPC Pareto panel overview](https://raw.githubusercontent.com/kensobi/spc-pareto/main/src/img/screenshot-overview.png) -->
<!-- SCREENSHOT: Full panel showing bars sorted descending with cumulative percentage line, 80/20 threshold, dual y-axes, and statistics table below -->

## Why SPC Pareto?

The **Pareto principle** (80/20 rule) states that roughly 80% of effects come from 20% of causes. This plugin makes that insight instantly visible:

- **Bars sorted by impact** — categories are automatically ranked from highest to lowest frequency, making the biggest contributors immediately obvious
- **Cumulative percentage line** — a running total overlay shows how quickly contributions accumulate toward 100%
- **80/20 threshold line** — a configurable threshold line highlights where the "vital few" end and the "trivial many" begin

<!-- TODO: Replace with actual screenshot URL after publishing -->
<!-- ![Pareto chart with threshold](https://raw.githubusercontent.com/kensobi/spc-pareto/main/src/img/screenshot-threshold.png) -->
<!-- SCREENSHOT: Close-up of the chart area showing bars, cumulative line with point markers, and the dashed 80% threshold line crossing both axes -->

## Built for Grafana

SPC Pareto is built using Grafana's native visualization components. This means it inherits the look, feel, and behavior you already know:

- **Native theming** — automatically adapts to light and dark mode
- **Standard panel options** — legend placement, tooltip behavior, and field overrides work just like any other Grafana panel
- **Resizable statistics table** — drag the splitter to balance chart and table space, just like Grafana's built-in panels
- **Works with any data source** — use it with SQL databases, Prometheus, InfluxDB, CSV files, or any other Grafana data source

## Features

| Feature | Description |
|---------|-------------|
| Automatic sorting | Categories are ranked by frequency — no manual ordering needed |
| Dual y-axes | Left axis shows frequency counts, right axis shows cumulative percentage (0–100%) |
| Threshold line | Configurable threshold (default 80%) with horizontal and vertical reference lines |
| Cumulative line | Customizable color, width, and point markers |
| Statistics table | Interactive table with category, frequency, % of total, cumulative count, and cumulative % |
| Resizable layout | Drag the splitter between chart and table to adjust the view |

<!-- TODO: Replace with actual screenshot URL after publishing -->
<!-- ![Statistics table](https://raw.githubusercontent.com/kensobi/spc-pareto/main/src/img/screenshot-table.png) -->
<!-- SCREENSHOT: The statistics table section showing all columns with sortable headers -->

## Use Cases

- **Manufacturing quality** — identify top defect types across production lines
- **IT operations** — rank incident categories to prioritize root cause analysis
- **Customer support** — surface the most common complaint categories
- **Software development** — analyze bug categories, test failure reasons, or build errors
- **Supply chain** — rank supplier issues or shipment delay causes

## Requirements

- Grafana **12.3** or later

## Getting Started

1. Install the plugin from the [Grafana Plugin Catalog](https://grafana.com/grafana/plugins/kensobi-spcpareto-panel/)
2. Add a new panel and select **SPC Pareto** as the visualization
3. Configure a query that returns two fields:
   - A **string field** for category names (e.g., defect type, error code)
   - A **number field** for the count or frequency of each category
4. The chart automatically sorts, calculates cumulative percentages, and renders the Pareto view

<!-- TODO: Replace with actual screenshot URL after publishing -->
<!-- ![Panel configuration](https://raw.githubusercontent.com/kensobi/spc-pareto/main/src/img/screenshot-config.png) -->
<!-- SCREENSHOT: Grafana panel editor showing a query returning category+count data with the SPC Pareto visualization selected -->

### Example Query (SQL)

```sql
SELECT defect_type AS category, COUNT(*) AS count
FROM inspections
WHERE $__timeFilter(inspection_time)
GROUP BY defect_type
```

### Example Query (TestData)

For a quick demo, use the **TestData** data source with the **CSV Content** scenario:

```csv
category,count
Scratch,45
Dent,38
Contamination,29
Misalignment,22
Color Defect,15
Crack,12
Burr,8
Warping,6
Porosity,4
```

## Panel Options

| Option | Description | Default |
|--------|-------------|---------|
| Show threshold line | Display the 80/20 reference lines | On |
| Threshold value | Cumulative percentage threshold | 80% |
| Cumulative line color | Color of the cumulative percentage line | Theme warning color |
| Cumulative line width | Stroke width of the cumulative line | 2 |
| Show points | Show point markers on the cumulative line | On |
| Show statistics table | Display the interactive statistics table | On |

## Documentation

For detailed documentation, configuration guides, and examples, see the [full documentation](https://github.com/kensobi/spc-pareto/tree/main/docs).

## Part of the Kenso SPC Suite

SPC Pareto is part of a growing family of **Statistical Process Control** plugins for Grafana by Kenso Software:

- **SPC Histogram** — histogram visualization with control limits, bell curve fitting, and capability indices (Cp, Cpk, Pp, Ppk)
- **SPC Pareto** — Pareto chart for identifying the vital few contributors

## Contributing

We welcome contributions, feedback, and feature requests. Please [open an issue](https://github.com/kensobi/spc-pareto/issues) on GitHub to get started.

## License

Apache License 2.0 — see [LICENSE](https://github.com/kensobi/spc-pareto/blob/main/LICENSE) for details.
