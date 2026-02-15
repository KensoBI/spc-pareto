import React, { useRef, useEffect, useLayoutEffect } from 'react';
import uPlot from 'uplot';
import { UPlotConfigBuilder, useTheme2 } from '@grafana/ui';
import { ParetoData } from '../../data/transform';

export interface BarLabelsProps {
  config: UPlotConfigBuilder;
  data: ParetoData;
  labelContent: 'value' | 'percent' | 'both';
}

export const BarLabels: React.FC<BarLabelsProps> = ({ config, data, labelContent }) => {
  const theme = useTheme2();
  const dataRef = useRef(data);
  const labelContentRef = useRef(labelContent);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    labelContentRef.current = labelContent;
  }, [labelContent]);

  useLayoutEffect(() => {
    config.addHook('draw', (u: uPlot) => {
      const ctx = u.ctx;
      if (!ctx) {
        return;
      }

      const paretoData = dataRef.current;
      const content = labelContentRef.current;

      ctx.save();
      ctx.font = `11px ${theme.typography.fontFamily}`;
      ctx.fillStyle = theme.colors.text.primary;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      for (let i = 0; i < paretoData.values.length; i++) {
        const xPos = u.valToPos(i, 'x', true);
        const yPos = u.valToPos(paretoData.values[i], 'y-freq', true);

        let label = '';
        const pct = paretoData.total > 0
          ? ((paretoData.values[i] / paretoData.total) * 100).toFixed(1) + '%'
          : '0%';

        if (content === 'value') {
          label = String(paretoData.values[i]);
        } else if (content === 'percent') {
          label = pct;
        } else {
          label = `${paretoData.values[i]} (${pct})`;
        }

        ctx.fillText(label, xPos, yPos - 4);
      }

      ctx.restore();
    });
  }, [config, theme]);

  return null;
};
