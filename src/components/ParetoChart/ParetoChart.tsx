import React from 'react';
import uPlot, { AlignedData } from 'uplot';
import { GrafanaTheme2 } from '@grafana/data';
import { ScaleDistribution, AxisPlacement, ScaleDirection, ScaleOrientation } from '@grafana/schema';
import {
  UPlotConfigBuilder,
  UPlotChart,
  VizLayout,
  PlotLegend,
  measureText,
  UPLOT_AXIS_FONT_SIZE,
} from '@grafana/ui';
import { ParetoData, toAlignedData } from '../../data/transform';
import { Options, FieldConfig, defaultFieldConfig } from '../../types';

export interface ParetoChartProps {
  data: ParetoData;
  options: Options;
  width: number;
  height: number;
  theme: GrafanaTheme2;
  children?: (config: UPlotConfigBuilder) => React.ReactNode;
}

const prepConfig = (data: ParetoData, theme: GrafanaTheme2, options: Options) => {
  const builder = new UPlotConfigBuilder();
  const customConfig: FieldConfig = { ...defaultFieldConfig };

  // X scale — ordinal categories
  builder.addScale({
    scaleKey: 'x',
    isTime: false,
    distribution: ScaleDistribution.Ordinal,
    orientation: ScaleOrientation.Horizontal,
    direction: ScaleDirection.Right,
    range: [-0.5, data.categories.length - 0.5],
  });

  // Y scale — frequency (left axis)
  builder.addScale({
    scaleKey: 'y-freq',
    isTime: false,
    distribution: ScaleDistribution.Linear,
    orientation: ScaleOrientation.Vertical,
    direction: ScaleDirection.Up,
    softMin: 0,
  });

  // Y scale — cumulative percentage (right axis, fixed 0-100)
  builder.addScale({
    scaleKey: 'y-pct',
    isTime: false,
    distribution: ScaleDistribution.Linear,
    orientation: ScaleOrientation.Vertical,
    direction: ScaleDirection.Up,
    range: [0, 100],
  });

  // X axis — category labels
  builder.addAxis({
    scaleKey: 'x',
    isTime: false,
    placement: AxisPlacement.Bottom,
    splits: () => data.categories.map((_, i) => i),
    values: (u: uPlot, splits: number[]) => {
      const maxWidth = data.categories.reduce(
        (max, label) => Math.max(measureText(label, UPLOT_AXIS_FONT_SIZE).width, max),
        0
      );
      const labelSpacing = 10;
      const maxCount = u.bbox.width / ((maxWidth + labelSpacing) * devicePixelRatio);
      const keepMod = Math.max(1, Math.ceil(splits.length / maxCount));

      return splits.map((idx, i) => {
        if (i % keepMod !== 0) {
          return null as unknown as string;
        }
        return data.categories[idx] ?? '';
      });
    },
    theme,
  });

  // Y axis left — frequency
  builder.addAxis({
    scaleKey: 'y-freq',
    isTime: false,
    placement: AxisPlacement.Left,
    theme,
  });

  // Y axis right — cumulative %
  builder.addAxis({
    scaleKey: 'y-pct',
    isTime: false,
    placement: AxisPlacement.Right,
    formatValue: (v: number) => `${Math.round(v)}%`,
    theme,
  });

  // Cursor config
  builder.setCursor({
    points: { show: false },
    drag: {
      x: false,
      y: false,
      setScale: false,
    },
  });

  // Bar series — frequency values
  const barPathBuilder = uPlot.paths.bars!({ align: 0, size: [1, Infinity] });
  const barColor = theme.visualization.getColorByName('blue');

  builder.addSeries({
    scaleKey: 'y-freq',
    lineWidth: customConfig.lineWidth,
    lineColor: barColor,
    fillOpacity: customConfig.fillOpacity,
    theme,
    pathBuilder: barPathBuilder,
    show: true,
    gradientMode: customConfig.gradientMode,
  });

  // Line series — cumulative percentage
  const lineColor = options.cumulativeLineColor
    ? theme.visualization.getColorByName(options.cumulativeLineColor)
    : theme.colors.warning.main;

  builder.addSeries({
    scaleKey: 'y-pct',
    lineWidth: options.cumulativeLineWidth ?? 2,
    lineColor: lineColor,
    fillOpacity: 0,
    theme,
    show: true,
    drawStyle: 'line' as any,
    showPoints: options.showCumulativePoints ? 'always' as any : 'never' as any,
    pointSize: 5,
    pointColor: lineColor,
  });

  return builder;
};

interface State {
  config: UPlotConfigBuilder;
  alignedData: AlignedData;
}

export class ParetoChart extends React.Component<ParetoChartProps, State> {
  constructor(props: ParetoChartProps) {
    super(props);
    this.state = this.prepState(props);
  }

  prepState(props: ParetoChartProps): State {
    const config = prepConfig(props.data, props.theme, props.options);
    const alignedData = toAlignedData(props.data);
    return { config, alignedData };
  }

  componentDidUpdate(prevProps: ParetoChartProps) {
    if (
      this.props.data !== prevProps.data ||
      this.props.options !== prevProps.options ||
      this.props.theme !== prevProps.theme
    ) {
      this.setState(this.prepState(this.props));
    }
  }

  renderLegend(config: UPlotConfigBuilder) {
    const { options } = this.props;
    if (!options.legend || options.legend.showLegend === false) {
      return null;
    }
    return <PlotLegend data={[]} config={config} maxHeight="35%" maxWidth="60%" {...options.legend} />;
  }

  render() {
    const { width, height, children } = this.props;
    const { config, alignedData } = this.state;

    return (
      <VizLayout width={width} height={height} legend={this.renderLegend(config)}>
        {(vizWidth: number, vizHeight: number) => (
          <UPlotChart config={config} data={alignedData} width={vizWidth} height={vizHeight}>
            {children ? children(config) : null}
          </UPlotChart>
        )}
      </VizLayout>
    );
  }
}
