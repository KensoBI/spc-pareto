import { PanelProps } from '@grafana/data';
import {
  AxisConfig,
  OptionsWithLegend,
  OptionsWithTooltip,
  HideableFieldConfig,
  GraphGradientMode,
} from '@grafana/schema';

export interface Options extends OptionsWithLegend, OptionsWithTooltip {
  showThresholdLine: boolean;
  thresholdValue: number;
  cumulativeLineColor: string;
  cumulativeLineWidth: number;
  showCumulativePoints: boolean;
  showStatisticsTable: boolean;
}

export interface FieldConfig extends AxisConfig, HideableFieldConfig {
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
  cumulativeLineColor: '',
  cumulativeLineWidth: 2,
  showCumulativePoints: true,
  showStatisticsTable: true,
};

export interface PanelPropsDef extends PanelProps<Options> {}
