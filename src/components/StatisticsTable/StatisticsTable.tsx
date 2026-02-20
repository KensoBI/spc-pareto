import React, { useMemo } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { InteractiveTable, useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import { CellProps } from 'react-table';
import { ParetoData } from '../../data/transform';

interface StatisticsTableProps {
  data: ParetoData;
}

interface TableRow {
  id: string;
  category: string;
  frequency: number;
  pctOfTotal: number;
  cumulativePct: number;
  cumulativeCount: number;
}

const getStyles = (_theme: GrafanaTheme2) => ({
  wrapper: css({
    width: '100%',
  }),
});

export const StatisticsTable: React.FC<StatisticsTableProps> = ({ data }) => {
  const styles = useStyles2(getStyles);

  const tableData: TableRow[] = useMemo(() => {
    let runningCount = 0;
    const rows: TableRow[] = [];
    for (let i = 0; i < data.categories.length; i++) {
      runningCount += data.values[i];
      rows.push({
        id: String(i),
        category: data.categories[i],
        frequency: data.values[i],
        pctOfTotal: data.total > 0 ? (data.values[i] / data.total) * 100 : 0,
        cumulativePct: data.cumulativePercent[i],
        cumulativeCount: runningCount,
      });
    }
    return rows;
  }, [data]);

  const columns = useMemo(
    () => [
      {
        id: 'category' as const,
        header: 'Category',
        sortType: 'string' as const,
      },
      {
        id: 'frequency' as const,
        header: 'Frequency',
        cell: ({ row }: CellProps<TableRow>) => row.original.frequency,
        sortType: 'number' as const,
      },
      {
        id: 'pctOfTotal' as const,
        header: '% of Total',
        cell: ({ row }: CellProps<TableRow>) => `${row.original.pctOfTotal.toFixed(1)}%`,
        sortType: 'number' as const,
      },
      {
        id: 'cumulativeCount' as const,
        header: 'Cumulative Count',
        cell: ({ row }: CellProps<TableRow>) => row.original.cumulativeCount,
        sortType: 'number' as const,
      },
      {
        id: 'cumulativePct' as const,
        header: 'Cumulative %',
        cell: ({ row }: CellProps<TableRow>) => `${row.original.cumulativePct.toFixed(1)}%`,
        sortType: 'number' as const,
      },
    ],
    []
  );

  if (tableData.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <InteractiveTable columns={columns} data={tableData} getRowId={(row: TableRow) => row.id} />
    </div>
  );
};
