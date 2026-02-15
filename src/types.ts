import { PanelProps } from '@grafana/data';
import {
  OptionsWithLegend,
  OptionsWithTooltip,
  GraphGradientMode,
} from '@grafana/schema';

export interface Options extends OptionsWithLegend, OptionsWithTooltip {
  showThresholdLine: boolean;
  thresholdValue: number;
  cumulativeLineColor: string;
  cumulativeLineWidth: number;
  showCumulativePoints: boolean;
  cumulativePointSize: number;
  showStatisticsTable: boolean;
  barColor: string;
  barFillOpacity: number;
  barLineWidth: number;
  barGradientMode: GraphGradientMode;
}

export interface FieldConfig {
  fillOpacity?: number;
  gradientMode?: GraphGradientMode;
  lineWidth?: number;
}

export const defaultFieldConfig: Partial<FieldConfig> = {
  fillOpacity: 80,
  gradientMode: GraphGradientMode.None,
  lineWidth: 1,
};

export const defaultOptions: Partial<Options> = {
  showThresholdLine: true,
  thresholdValue: 80,
  cumulativeLineColor: 'orange',
  cumulativeLineWidth: 2,
  showCumulativePoints: true,
  cumulativePointSize: 5,
  showStatisticsTable: true,
  barColor: 'blue',
  barFillOpacity: 80,
  barLineWidth: 1,
  barGradientMode: GraphGradientMode.None,
};

export interface PanelPropsDef extends PanelProps<Options> {}
