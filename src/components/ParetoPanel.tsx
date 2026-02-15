import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UPlotConfigBuilder, useSplitter, useTheme2 } from '@grafana/ui';
import { PanelDataErrorView } from '@grafana/runtime';
import { ParetoChart } from './ParetoChart/ParetoChart';
import { ThresholdLine } from './ThresholdLine/ThresholdLine';
import { BarLabels } from './BarLabels/BarLabels';
import { ParetoTooltip } from './ParetoChart/ParetoTooltip';
import { StatisticsTable } from './StatisticsTable/StatisticsTable';
import { transformToParetoData, applyTopNGrouping, ParetoData } from '../data/transform';
import { PanelPropsDef } from '../types';

export const ParetoPanel: React.FC<PanelPropsDef> = ({ data, options, width, height, fieldConfig, id }) => {
  const theme = useTheme2();

  const paretoData = useMemo<ParetoData | null>(() => {
    if (!data.series.length) {
      return null;
    }
    let result = transformToParetoData(data.series);
    if (result && options.enableTopN) {
      result = applyTopNGrouping(result, options.topNCount ?? 10);
    }
    return result;
  }, [data.series, options.enableTopN, options.topNCount]);

  const showTable = options.showStatisticsTable !== false;

  const [chartHeight, setChartHeight] = useState(Math.round(height * 0.75));

  const { containerProps, primaryProps, secondaryProps, splitterProps } = useSplitter({
    direction: 'column',
    initialSize: 0.75,
  });

  useEffect(() => {
    if (!showTable) {
      return;
    }
    const el = primaryProps.ref.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChartHeight(Math.round(entry.contentRect.height));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [primaryProps.ref, showTable]);

  const renderOverlays = useCallback(
    (config: UPlotConfigBuilder) => {
      if (!paretoData) {
        return null;
      }
      return (
        <>
          {options.showThresholdLine && (
            <ThresholdLine config={config} data={paretoData} thresholdValue={options.thresholdValue ?? 80} />
          )}
          {options.showBarLabels && (
            <BarLabels
              config={config}
              data={paretoData}
              labelContent={options.barLabelContent ?? 'value'}
            />
          )}
          <ParetoTooltip config={config} data={paretoData} />
        </>
      );
    },
    [
      paretoData,
      options.showThresholdLine,
      options.thresholdValue,
      options.showBarLabels,
      options.barLabelContent,
    ]
  );

  if (!paretoData) {
    return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} needsStringField />;
  }

  return (
    <div {...containerProps} style={{ height, width }}>
      <div
        {...primaryProps}
        style={{ ...primaryProps.style, overflow: 'hidden', minHeight: 0, ...(!showTable && { flexGrow: 1 }) }}
      >
        <ParetoChart
          data={paretoData}
          options={options}
          width={width}
          height={showTable ? chartHeight : height}
          theme={theme}
        >
          {renderOverlays}
        </ParetoChart>
      </div>
      {showTable && <div {...splitterProps} />}
      {showTable && (
        <div
          {...secondaryProps}
          style={{
            ...secondaryProps.style,
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            minHeight: 0,
          }}
        >
          <StatisticsTable data={paretoData} />
        </div>
      )}
    </div>
  );
};
