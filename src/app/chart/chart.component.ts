import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ComponentRef,
} from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';
import { ChartType } from './chart-setting.component';
import { BaseWidgetContent, WidgetData, WidgetService, AppearanceSetting } from 'ng-graphic-editor';

export type ChartWidgetData = WidgetData<
  {
    chartType?: ChartType;
    source?: number;
  } & AppearanceSetting
>;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent
  extends BaseWidgetContent
  implements OnInit, AfterViewInit
{
  @ViewChild('chartArea') chartArea!: ElementRef;

  widgetData: ChartWidgetData = {
    setting: {
      background: { fill: true, color: '#efefef' },
      radius: 4,
      border: {
        fill: true,
        color: '#efefef',
        style: 'solid',
        width: 1,
      },
    },
  };
  resizeObserver: ResizeObserver | null = null;
  chart: any;

  constructor(
    private widgetSrv: WidgetService
  ) {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.chartArea.nativeElement);
    this.resizeObserver = new ResizeObserver((entries: any) => {
      this.chart.resize();
    });

    this.resizeObserver.observe(this.chartArea.nativeElement);

    this.draw();
    this.widgetSrv.onDataChange().subscribe(() => {
      console.log('change');
      this.draw();
    });
    // 绘制图表
    // myChart.setOption({
    //   title: {
    //     text: 'ECharts 入门示例',
    //   },
    //   tooltip: {},
    //   xAxis: {
    //     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       name: '销量',
    //       type: 'bar',
    //       data: [5, 20, 36, 10, 10, 20],
    //     },
    //   ],
    // });
  }

  draw(): void {
    const chartType = this.widgetData.setting.chartType;
    const source = this.widgetData.setting.source;
    if (this.data?.length && chartType && source) {
      const chartData = this.data.find((item: any) => item.id === source);
      if (chartData.value) {
        const option = {
          legend: {},
          tooltip: {},
          dataset: {
            // 提供一份数据。
            source: chartData.value,
          },
          // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
          xAxis: { type: 'category' },
          // 声明一个 Y 轴，数值轴。
          yAxis: {},
          // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
          series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
        };
        this.chart.setOption(option);
      }
    }
  }
}
