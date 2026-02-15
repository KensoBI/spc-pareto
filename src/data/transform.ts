import { DataFrame, FieldType } from '@grafana/data';
import { AlignedData } from 'uplot';

export interface ParetoData {
  categories: string[];
  values: number[];
  cumulativePercent: number[];
  total: number;
}

/**
 * Extracts category (string) and value (number) fields from a DataFrame,
 * sorts by value descending, and computes cumulative percentages.
 */
export function transformToParetoData(series: DataFrame[]): ParetoData | null {
  let categories: string[] = [];
  let values: number[] = [];

  for (const frame of series) {
    let categoryField = frame.fields.find((f) => f.type === FieldType.string);
    let valueField = frame.fields.find((f) => f.type === FieldType.number);

    if (!categoryField || !valueField) {
      continue;
    }

    for (let i = 0; i < frame.length; i++) {
      categories.push(categoryField.values[i]);
      values.push(valueField.values[i]);
    }
  }

  if (categories.length === 0) {
    return null;
  }

  // Build paired array and sort descending by value
  const paired = categories.map((cat, i) => ({ category: cat, value: values[i] }));
  paired.sort((a, b) => b.value - a.value);

  const sortedCategories = paired.map((p) => p.category);
  const sortedValues = paired.map((p) => p.value);
  const total = sortedValues.reduce((sum, v) => sum + v, 0);

  // Calculate cumulative percentages
  const cumulativePercent: number[] = [];
  let runningSum = 0;
  for (const v of sortedValues) {
    runningSum += v;
    cumulativePercent.push(total > 0 ? (runningSum / total) * 100 : 0);
  }

  return {
    categories: sortedCategories,
    values: sortedValues,
    cumulativePercent,
    total,
  };
}

/**
 * Converts ParetoData to uPlot's AlignedData format.
 * [xIndices[], barValues[], cumulativePercent[]]
 */
export function toAlignedData(data: ParetoData): AlignedData {
  const xIndices = data.categories.map((_, i) => i);
  return [xIndices, data.values, data.cumulativePercent];
}
