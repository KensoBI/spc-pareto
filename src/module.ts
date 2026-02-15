import { FieldConfigProperty, PanelPlugin } from '@grafana/data';
import { GraphGradientMode } from '@grafana/schema';
import { commonOptionsBuilder } from '@grafana/ui';
import { Options, FieldConfig, defaultFieldConfig, defaultOptions } from './types';
import { ParetoPanel } from './components/ParetoPanel';

export const plugin = new PanelPlugin<Options, FieldConfig>(ParetoPanel)
  .useFieldConfig({
    standardOptions: {
      [FieldConfigProperty.Color]: {
        settings: {
          byValueSupport: false,
        },
      },
    },
    useCustomConfig: (builder) => {
      builder
        .addSliderInput({
          path: 'fillOpacity',
          name: 'Fill opacity',
          defaultValue: defaultFieldConfig.fillOpacity,
          settings: {
            min: 0,
            max: 100,
            step: 1,
          },
        })
        .addSliderInput({
          path: 'lineWidth',
          name: 'Line width',
          defaultValue: defaultFieldConfig.lineWidth,
          settings: {
            min: 0,
            max: 10,
            step: 1,
          },
        })
        .addRadio({
          path: 'gradientMode',
          name: 'Gradient mode',
          defaultValue: defaultFieldConfig.gradientMode,
          settings: {
            options: [
              { value: GraphGradientMode.None, label: 'None' },
              { value: GraphGradientMode.Opacity, label: 'Opacity' },
              { value: GraphGradientMode.Hue, label: 'Hue' },
              { value: GraphGradientMode.Scheme, label: 'Scheme' },
            ],
          },
        });
    },
  })
  .setPanelOptions((builder) => {
    builder
      .addBooleanSwitch({
        path: 'showThresholdLine',
        name: 'Show threshold line',
        description: 'Show the 80/20 threshold line on the chart',
        defaultValue: defaultOptions.showThresholdLine,
        category: ['Threshold'],
      })
      .addSliderInput({
        path: 'thresholdValue',
        name: 'Threshold value (%)',
        description: 'The cumulative percentage threshold (e.g. 80 for 80/20 rule)',
        defaultValue: defaultOptions.thresholdValue,
        settings: {
          min: 0,
          max: 100,
          step: 1,
        },
        category: ['Threshold'],
        showIf: (opts) => opts.showThresholdLine,
      })
      .addColorPicker({
        path: 'cumulativeLineColor',
        name: 'Line color',
        description: 'Color of the cumulative percentage line. Leave empty for default.',
        defaultValue: defaultOptions.cumulativeLineColor,
        category: ['Cumulative line'],
      })
      .addSliderInput({
        path: 'cumulativeLineWidth',
        name: 'Line width',
        defaultValue: defaultOptions.cumulativeLineWidth,
        settings: {
          min: 1,
          max: 10,
          step: 1,
        },
        category: ['Cumulative line'],
      })
      .addBooleanSwitch({
        path: 'showCumulativePoints',
        name: 'Show points',
        description: 'Show point markers on the cumulative line',
        defaultValue: defaultOptions.showCumulativePoints,
        category: ['Cumulative line'],
      })
      .addBooleanSwitch({
        path: 'showStatisticsTable',
        name: 'Show statistics table',
        description: 'Show a table with Pareto statistics below the chart',
        defaultValue: defaultOptions.showStatisticsTable,
        category: ['Statistics table'],
      });

    commonOptionsBuilder.addLegendOptions(builder);
    commonOptionsBuilder.addTooltipOptions(builder);
  });
