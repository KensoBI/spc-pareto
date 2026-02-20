import React, { useRef, useEffect, useLayoutEffect } from 'react';
import uPlot from 'uplot';
import { GrafanaTheme2 } from '@grafana/data';
import { UPlotConfigBuilder, useTheme2, UPLOT_AXIS_FONT_SIZE } from '@grafana/ui';
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
  const themeRef = useRef<GrafanaTheme2>(theme);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    labelContentRef.current = labelContent;
  }, [labelContent]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useLayoutEffect(() => {
    config.addHook('draw', (u: uPlot) => {
      const ctx = u.ctx;
      if (!ctx) {
        return;
      }

      const paretoData = dataRef.current;
      const content = labelContentRef.current;
      const t = themeRef.current;

      ctx.save();
      ctx.font = `${UPLOT_AXIS_FONT_SIZE}px ${t.typography.fontFamily}`;
      ctx.fillStyle = t.colors.text.primary;
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
  }, [config]);

  return null;
};
