import React, { useRef, useEffect, useLayoutEffect } from 'react';
import uPlot from 'uplot';
import { UPlotConfigBuilder, useTheme2 } from '@grafana/ui';
import { ParetoData } from '../../data/transform';

export interface VitalHighlightProps {
  config: UPlotConfigBuilder;
  data: ParetoData;
  thresholdValue: number;
  trivialBarOpacity: number;
}

export const VitalHighlight: React.FC<VitalHighlightProps> = ({
  config,
  data,
  thresholdValue,
  trivialBarOpacity,
}) => {
  const theme = useTheme2();
  const dataRef = useRef(data);
  const thresholdRef = useRef(thresholdValue);
  const trivialOpacityRef = useRef(trivialBarOpacity);

  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { thresholdRef.current = thresholdValue; }, [thresholdValue]);
  useEffect(() => { trivialOpacityRef.current = trivialBarOpacity; }, [trivialBarOpacity]);

  useLayoutEffect(() => {
    const bgColor = theme.colors.background.primary;

    config.addHook('draw', (u: uPlot) => {
      const ctx = u.ctx;
      if (!ctx) {
        return;
      }

      const paretoData = dataRef.current;
      const threshold = thresholdRef.current;
      const trivialAlpha = trivialOpacityRef.current / 100;

      const crossIdx = paretoData.cumulativePercent.findIndex((v) => v >= threshold);
      if (crossIdx < 0 || crossIdx >= paretoData.values.length - 1) {
        return;
      }

      // Fade the trivial region by drawing a semi-transparent background overlay
      // covering everything from the midpoint between crossIdx and crossIdx+1 to the right edge.
      const crossX = u.valToPos(crossIdx, 'x', true);
      const nextX = u.valToPos(crossIdx + 1, 'x', true);
      const fadeLeft = (crossX + nextX) / 2;
      const plotRight = (u.bbox.left + u.bbox.width) / devicePixelRatio;
      const plotTop = u.bbox.top / devicePixelRatio;
      const plotHeight = u.bbox.height / devicePixelRatio;

      ctx.save();
      // Clip to plot area
      ctx.beginPath();
      ctx.rect(
        u.bbox.left / devicePixelRatio,
        plotTop,
        u.bbox.width / devicePixelRatio,
        plotHeight
      );
      ctx.clip();

      // Overlay background color with opacity to fade out trivial bars
      // opacity = 1 - trivialAlpha gives the fade amount
      ctx.globalAlpha = 1 - trivialAlpha;
      ctx.fillStyle = bgColor;
      ctx.fillRect(fadeLeft, plotTop, plotRight - fadeLeft, plotHeight);
      ctx.globalAlpha = 1;

      ctx.restore();
    });
  }, [config, theme]);

  return null;
};
