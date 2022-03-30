import { Component, Input, OnInit } from '@angular/core';
import { Page } from '../../type';
import { DataSetting } from '../../type/data-setting.type';

@Component({
  selector: 'ng-page-data-setting',
  templateUrl: './page-data-setting.component.html',
  styleUrls: ['./page-data-setting.component.scss'],
})
export class PageDataSettingComponent implements OnInit {
  @Input() page!: Page;
  constructor() {}

  ngOnInit(): void {}

  addDataSetting(event: Event): void {
    const id = this.page.dataSetting?.length
      ? Math.max(...this.page.dataSetting.map((item) => Number(item.id))) + 1
      : 1;
    this.page.dataSetting = [
      ...(this.page.dataSetting || []),
      { id, name: `数据${(this.page.dataSetting || []).length + 1}` },
    ];
    this.emitChange();
  }

  deleteDataSetting(setting: DataSetting, index: number): void {
    this.page.dataSetting?.splice(index, 1);
    if (this.page.widgets) {
      this.page.widgets.forEach((widget) => {
        if (widget.widgetData?.dataSetting) {
          const i = widget.widgetData.dataSetting.findIndex(
            (item) => item.id === item.id
          );
          if (i > -1) {
            widget.widgetData.dataSetting.splice(i, 1);
          }
        }
      });
    }
    this.emitChange();
  }

  onSettingChange(setting: DataSetting, index: number): void {
    this.page.dataSetting?.splice(index, 1, setting);
    this.emitChange();
  }

  emitChange(): void {
    this.page._modified = true;
  }
}
