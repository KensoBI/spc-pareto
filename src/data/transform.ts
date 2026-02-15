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
