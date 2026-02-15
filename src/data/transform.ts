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
  const counts = new Map<string, number>();
  let hasAggregated = false;

  // First pass: look for pre-aggregated data (string + number fields)
  for (const frame of series) {
    const categoryField = frame.fields.find((f) => f.type === FieldType.string);
    const valueField = frame.fields.find((f) => f.type === FieldType.number);

    if (!categoryField || !valueField) {
      continue;
    }

    hasAggregated = true;
    for (let i = 0; i < frame.length; i++) {
      const cat = categoryField.values[i];
      counts.set(cat, (counts.get(cat) ?? 0) + valueField.values[i]);
    }
  }

  // Fallback: raw observations — count occurrences of each string value
  if (!hasAggregated) {
    for (const frame of series) {
      const stringField = frame.fields.find((f) => f.type === FieldType.string);
      if (!stringField) {
        continue;
      }

      for (let i = 0; i < frame.length; i++) {
        const val = stringField.values[i];
        counts.set(val, (counts.get(val) ?? 0) + 1);
      }
    }
  }

  if (counts.size === 0) {
    return null;
  }

  // Sort descending by value
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const sortedCategories = sorted.map(([cat]) => cat);
  const sortedValues = sorted.map(([, val]) => val);
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
 * Groups categories beyond topN into an "Other" bucket.
 * Recalculates cumulative percentages while preserving the original total.
 */
export function applyTopNGrouping(data: ParetoData, topN: number): ParetoData {
  if (data.categories.length <= topN) {
    return data;
  }

  const categories = data.categories.slice(0, topN);
  const values = data.values.slice(0, topN);
  const otherSum = data.values.slice(topN).reduce((s, v) => s + v, 0);

  categories.push('Other');
  values.push(otherSum);

  const cumulativePercent: number[] = [];
  let runningSum = 0;
  for (const v of values) {
    runningSum += v;
    cumulativePercent.push(data.total > 0 ? (runningSum / data.total) * 100 : 0);
  }

  return {
    categories,
    values,
    cumulativePercent,
    total: data.total,
  };
}

export interface VitalSplit {
  vitalValues: Array<number | null>;
  trivialValues: Array<number | null>;
}

/**
 * Splits bar values into vital and trivial series based on the threshold crossing point.
 * Vital bars (at or before crossIdx) go in vitalValues, the rest in trivialValues.
 */
export function splitVitalTrivial(data: ParetoData, thresholdValue: number): VitalSplit {
  const crossIdx = data.cumulativePercent.findIndex((v) => v >= thresholdValue);
  const vitalValues: Array<number | null> = [];
  const trivialValues: Array<number | null> = [];

  for (let i = 0; i < data.values.length; i++) {
    if (crossIdx >= 0 && i <= crossIdx) {
      vitalValues.push(data.values[i]);
      trivialValues.push(null);
    } else {
      vitalValues.push(null);
      trivialValues.push(data.values[i]);
    }
  }

  return { vitalValues, trivialValues };
}

/**
 * Converts ParetoData to uPlot's AlignedData format.
 * [xIndices[], barValues[], cumulativePercent[]]
 *
 * When vitalSplit is provided, produces 4 series instead:
 * [xIndices[], vitalBarValues[], trivialBarValues[], cumulativePercent[]]
 */
export function toAlignedData(data: ParetoData, vitalSplit?: VitalSplit): AlignedData {
  const xIndices = data.categories.map((_, i) => i);
  if (vitalSplit) {
    return [xIndices, vitalSplit.vitalValues as number[], vitalSplit.trivialValues as number[], data.cumulativePercent];
  }
  return [xIndices, data.values, data.cumulativePercent];
}
