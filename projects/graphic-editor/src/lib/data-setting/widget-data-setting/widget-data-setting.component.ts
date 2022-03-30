import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { DataSetting } from '../../type/data-setting.type';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';

@Component({
  selector: 'ng-widget-data-setting',
  templateUrl: './widget-data-setting.component.html',
  styleUrls: ['./widget-data-setting.component.scss'],
})
export class WidgetDataSettingComponent implements OnInit {
  @Input() ref!: ComponentRef<WidgetComponent>;

  constructor() {}

  ngOnInit(): void {}

  addDataSetting(event: Event): void {
    if (this.ref.instance.widgetData) {
      const id = this.ref.instance.widgetData.dataSetting?.length
        ? Math.max(
            ...this.ref.instance.widgetData.dataSetting.map((item) => item.id)
          ) + 1
        : 1;
      this.ref.instance.widgetData.dataSetting = [
        ...(this.ref.instance.widgetData.dataSetting || []),
        {
          id,
          name: `数据${id}`,
        },
      ];
    }
    this.emitChange();
  }

  onSettingChange(setting: DataSetting, index: number): void {
    if (this.ref.instance.widgetData) {
      this.ref.instance.widgetData.dataSetting?.splice(index, 1, setting);
    }
    this.emitChange();
  }

  deleteDataSetting(index: number): void {
    if (this.ref.instance.widgetData) {
      this.ref.instance.widgetData.dataSetting?.splice(index, 1);
    }
    this.emitChange();
  }

  emitChange(): void {
    this.ref.instance.page._modified = true;
  }
}
