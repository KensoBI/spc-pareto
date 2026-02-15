# Data Format

The SPC Pareto panel expects query results containing two fields:

1. A **string field** — category names (e.g., defect type, error code, department name)
2. A **number field** — the count or frequency for each category

The plugin uses the **first string field** and the **first number field** found in the query results. Field names do not matter — only the field types are used for matching.

If your query returns multiple frames (e.g., from multiple queries), the plugin combines all frames by collecting category-value pairs from each.

## Query Examples

### SQL Databases (MySQL, PostgreSQL, MSSQL)

```sql
SELECT defect_type AS category, COUNT(*) AS count
FROM inspections
WHERE $__timeFilter(created_at)
GROUP BY defect_type
```

With a time range filter and additional grouping:

```sql
SELECT
  failure_mode,
  COUNT(*) AS occurrences
FROM production_events
WHERE $__timeFilter(event_time)
  AND line_id = '$line'
GROUP BY failure_mode
ORDER BY occurrences DESC
```

> **Note:** The plugin sorts categories automatically. You do not need `ORDER BY` in your query, but it won't cause issues if included.

### InfluxDB (Flux)

```flux
from(bucket: "manufacturing")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "defects")
  |> group(columns: ["defect_type"])
  |> count()
  |> rename(columns: {defect_type: "category", _value: "count"})
```

### Prometheus

Prometheus data is typically numeric time series. To use it with Pareto, you need categorical labels and counts. One approach:

```promql
sum by (error_type) (increase(app_errors_total[$__range]))
```

The `error_type` label becomes the category, and the summed increase becomes the count.

### TestData (for demos)

Use the built-in **TestData** data source with the **CSV Content** scenario:

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

### JSON API

If your API returns JSON, use the JSON data source or Infinity data source:

```json
[
  { "category": "Scratch", "count": 45 },
  { "category": "Dent", "count": 38 },
  { "category": "Contamination", "count": 29 }
]
```

## Multiple Queries

If you configure multiple queries (A, B, C...), the plugin extracts category-value pairs from each frame and combines them into a single Pareto chart. This is useful when data comes from different sources or tables.

## Data Transformations

You can use Grafana's built-in **Transformations** to reshape your data before it reaches the panel. Useful transformations include:

- **Group by** — aggregate raw data into categories
- **Filter by name** — select specific fields
- **Rename by regex** — adjust field names
- **Reduce** — collapse multiple rows into summary statistics

## Troubleshooting

### "No data" or error view

The panel shows an error view when:

- No query results are returned
- The results contain no string field (needed for categories)
- The results contain no number field (needed for values)

**Fix:** Ensure your query returns at least one string column and one numeric column.

### Categories appear unsorted

The plugin always sorts categories by descending value. If your chart appears unsorted, check whether:

- The number field contains the expected values (not nulls or strings)
- Multiple frames are being combined in an unexpected way

### All bars are the same height

This usually means the number field contains identical values. Check your `GROUP BY` clause and aggregation function.
