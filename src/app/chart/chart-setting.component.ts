import { Component, ComponentRef, OnInit } from '@angular/core';
import { WidgetComponent } from 'projects/graphic-editor/src/lib/widget-lib/widget/widget.component';

export enum ChartType {
  Bar = 'bar',
}

@Component({
  selector: 'app-chart-setting',
  templateUrl: './chart-setting.component.html',
  styleUrls: ['./chart-setting.component.scss'],
})
export class ChartSettingComponent implements OnInit {
  chartTypeList = [{ name: '柱状图', value: ChartType.Bar }];
  sourceList: any[] = [];

  constructor(public ref: ComponentRef<WidgetComponent>) {}

  ngOnInit(): void {
    this.sourceList =
      this.ref.instance.widgetData?.dataSetting?.map((item) => ({
        name: item.name,
        value: item.id,
      })) || [];
  }

  onChartTypeChange(chartType: ChartType): void {
    if (this.ref.instance.widgetData) {
      this.ref.instance.widgetData.setting =
        this.ref.instance.widgetData.setting || {};
      Object.assign(this.ref.instance.widgetData.setting, { chartType });
    }
  }

  onChartSourceChange(source: number): void {
    if (this.ref.instance.widgetData) {
      this.ref.instance.widgetData.setting =
        this.ref.instance.widgetData.setting || {};
      Object.assign(this.ref.instance.widgetData.setting, { source });
    }
  }
}
