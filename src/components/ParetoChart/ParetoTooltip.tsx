import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import uPlot from 'uplot';
import { GrafanaTheme2 } from '@grafana/data';
import { UPlotConfigBuilder, useStyles2, useTheme2, SeriesTable } from '@grafana/ui';
import { css } from '@emotion/css';
import { ParetoData } from '../../data/transform';

const TOOLTIP_OFFSET = 10;

export interface ParetoTooltipProps {
  config: UPlotConfigBuilder;
  data: ParetoData;
}

type TooltipState = {
  categoryIndex: number;
  clientX: number;
  clientY: number;
};

const getStyles = (theme: GrafanaTheme2) => ({
  tooltip: css({
    top: 0,
    left: 0,
    zIndex: theme.zIndex.portal,
    whiteSpace: 'pre',
    borderRadius: theme.shape.radius.default,
    position: 'fixed',
    background: theme.colors.background.primary,
    border: `1px solid ${theme.colors.border.weak}`,
    boxShadow: theme.shadows.z2,
    pointerEvents: 'none',
    padding: theme.spacing(1),
  }),
});

export const ParetoTooltip: React.FC<ParetoTooltipProps> = ({ config, data }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const plotRef = useRef<uPlot | undefined>(undefined);
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const u = plotRef.current;
    if (!u) {
      return;
    }

    const { left, top } = u.cursor;
    if (left == null || top == null || left < 0 || top < 0) {
      setTooltip(null);
      return;
    }

    // Find closest category by x position
    const xVal = u.posToVal(left, 'x');
    const categoryIndex = Math.round(xVal);
    const paretoData = dataRef.current;

    if (categoryIndex < 0 || categoryIndex >= paretoData.categories.length) {
      setTooltip(null);
      return;
    }

    setTooltip({
      categoryIndex,
      clientX: u.rect.left + left,
      clientY: u.rect.top + top,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  useLayoutEffect(() => {
    config.addHook('init', (u: uPlot) => {
      plotRef.current = u;
      u.over.addEventListener('mousemove', onMouseMove);
      u.over.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      const u = plotRef.current;
      if (u) {
        u.over.removeEventListener('mousemove', onMouseMove);
        u.over.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [config, onMouseMove, onMouseLeave]);

  if (!tooltip) {
    return null;
  }

  const idx = tooltip.categoryIndex;
  const category = data.categories[idx];
  const value = data.values[idx];
  const pctOfTotal = data.total > 0 ? (value / data.total) * 100 : 0;
  const cumulativePct = data.cumulativePercent[idx];

  const barColor = theme.visualization.getColorByName('blue');
  const lineColor = theme.colors.warning.main;

  const series = [
    {
      color: barColor,
      label: 'Frequency',
      value: String(value),
    },
    {
      color: barColor,
      label: '% of Total',
      value: `${pctOfTotal.toFixed(1)}%`,
    },
    {
      color: lineColor,
      label: 'Cumulative %',
      value: `${cumulativePct.toFixed(1)}%`,
    },
  ];

  return createPortal(
    <div
      className={styles.tooltip}
      style={{
        transform: `translateX(${tooltip.clientX + TOOLTIP_OFFSET}px) translateY(${tooltip.clientY + TOOLTIP_OFFSET}px)`,
      }}
    >
      <SeriesTable timestamp={category} series={series} />
    </div>,
    document.body
  );
};
