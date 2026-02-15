import { FieldType, DataFrame } from '@grafana/data';
import { transformToParetoData, toAlignedData } from './transform';

function makeFrame(categories: string[], values: number[]): DataFrame {
  return {
    fields: [
      { name: 'category', type: FieldType.string, values: categories, config: {} },
      { name: 'value', type: FieldType.number, values: values, config: {} },
    ],
    length: categories.length,
  };
}

describe('transformToParetoData', () => {
  it('should return null when no valid fields exist', () => {
    const frame: DataFrame = {
      fields: [{ name: 'x', type: FieldType.number, values: [1], config: {} }],
      length: 1,
    };
    expect(transformToParetoData([frame])).toBeNull();
  });

  it('should sort by value descending and compute cumulative percentages', () => {
    const frame = makeFrame(['A', 'B', 'C'], [10, 50, 40]);
    const result = transformToParetoData([frame]);

    expect(result).not.toBeNull();
    expect(result!.categories).toEqual(['B', 'C', 'A']);
    expect(result!.values).toEqual([50, 40, 10]);
    expect(result!.total).toBe(100);
    expect(result!.cumulativePercent).toEqual([50, 90, 100]);
  });

  it('should count occurrences from raw string-only observations', () => {
    const frame: DataFrame = {
      fields: [
        { name: 'defect', type: FieldType.string, values: ['A', 'B', 'A', 'C', 'A', 'B'], config: {} },
      ],
      length: 6,
    };
    const result = transformToParetoData([frame]);

    expect(result).not.toBeNull();
    expect(result!.categories).toEqual(['A', 'B', 'C']);
    expect(result!.values).toEqual([3, 2, 1]);
    expect(result!.total).toBe(6);
    expect(result!.cumulativePercent[0]).toBeCloseTo(50);
    expect(result!.cumulativePercent[1]).toBeCloseTo(83.33, 1);
    expect(result!.cumulativePercent[2]).toBeCloseTo(100);
  });

  it('should merge duplicate categories in aggregated data', () => {
    const frame = makeFrame(['A', 'B', 'A'], [10, 30, 20]);
    const result = transformToParetoData([frame]);

    expect(result).not.toBeNull();
    expect(result!.categories).toEqual(['A', 'B']);
    expect(result!.values).toEqual([30, 30]);
    expect(result!.total).toBe(60);
  });
});

describe('toAlignedData', () => {
  it('should convert ParetoData to uPlot AlignedData format', () => {
    const aligned = toAlignedData({
      categories: ['B', 'A'],
      values: [70, 30],
      cumulativePercent: [70, 100],
      total: 100,
    });

    expect(aligned).toEqual([[0, 1], [70, 30], [70, 100]]);
  });
});
