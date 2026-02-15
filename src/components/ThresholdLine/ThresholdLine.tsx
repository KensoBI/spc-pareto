import React, { useRef, useEffect, useLayoutEffect } from 'react';
import uPlot from 'uplot';
import { useTheme2 } from '@grafana/ui';
import { UPlotConfigBuilder } from '@grafana/ui';
import { ParetoData } from '../../data/transform';

export interface ThresholdLineProps {
  config: UPlotConfigBuilder;
  data: ParetoData;
  thresholdValue: number;
}

export const ThresholdLine: React.FC<ThresholdLineProps> = ({ config, data, thresholdValue }) => {
  const theme = useTheme2();
  const dataRef = useRef(data);
  const thresholdRef = useRef(thresholdValue);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    thresholdRef.current = thresholdValue;
  }, [thresholdValue]);

  useLayoutEffect(() => {
    config.addHook('draw', (u: uPlot) => {
      const ctx = u.ctx;
      if (!ctx) {
        return;
      }

      const threshold = thresholdRef.current;
      const paretoData = dataRef.current;

      ctx.save();
      ctx.beginPath();
      ctx.rect(u.bbox.left, u.bbox.top, u.bbox.width, u.bbox.height);
      ctx.clip();

      const lineColor = theme.colors.error.main;

      // Horizontal line at threshold % on y-pct scale
      const yPos = u.valToPos(threshold, 'y-pct', true);
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = lineColor;
      ctx.moveTo(u.bbox.left, yPos);
      ctx.lineTo(u.bbox.left + u.bbox.width, yPos);
      ctx.stroke();
      ctx.closePath();

      // Draw label
      ctx.setLineDash([]);
      ctx.font = `10px ${theme.typography.fontFamily}`;
      ctx.fillStyle = lineColor;
      ctx.textAlign = 'right';
      ctx.fillText(`${threshold}%`, u.bbox.left + u.bbox.width - 4, yPos - 4);

      // Vertical line at the category where cumulative % crosses threshold
      const crossIdx = paretoData.cumulativePercent.findIndex((v) => v >= threshold);
      if (crossIdx >= 0) {
        const xPos = u.valToPos(crossIdx, 'x', true);
        ctx.beginPath();
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = lineColor;
        ctx.moveTo(xPos, u.bbox.top);
        ctx.lineTo(xPos, u.bbox.top + u.bbox.height);
        ctx.stroke();
        ctx.closePath();
      }

      ctx.restore();
    });
  }, [config, theme]);

  return null;
};
