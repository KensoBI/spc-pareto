import { PanelProps } from '@grafana/data';
import {
  OptionsWithLegend,
  OptionsWithTooltip,
  GraphGradientMode,
} from '@grafana/schema';

export interface Options extends OptionsWithLegend, OptionsWithTooltip {
  showThresholdLine: boolean;
  thresholdValue: number;
  enableVitalHighlight: boolean;
  trivialBarOpacity: number;
  cumulativeLineColor: string;
  cumulativeLineWidth: number;
  showCumulativePoints: boolean;
  cumulativePointSize: number;
  showStatisticsTable: boolean;
  enableTopN: boolean;
  topNCount: number;
  barColor: string;
  barFillOpacity: number;
  barLineWidth: number;
  barGradientMode: GraphGradientMode;
  showBarLabels: boolean;
  barLabelContent: 'value' | 'percent' | 'both';
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
  enableVitalHighlight: false,
  trivialBarOpacity: 40,
  cumulativeLineColor: 'orange',
  cumulativeLineWidth: 2,
  showCumulativePoints: true,
  cumulativePointSize: 5,
  showStatisticsTable: true,
  enableTopN: false,
  topNCount: 10,
  barColor: 'blue',
  barFillOpacity: 80,
  barLineWidth: 1,
  barGradientMode: GraphGradientMode.None,
  showBarLabels: false,
  barLabelContent: 'value',
};

export interface PanelPropsDef extends PanelProps<Options> {}
