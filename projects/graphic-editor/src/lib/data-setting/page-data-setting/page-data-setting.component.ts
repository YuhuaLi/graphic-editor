import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { Page } from '../../type';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';

@Component({
  selector: 'lib-page-data-setting',
  templateUrl: './page-data-setting.component.html',
  styleUrls: ['./page-data-setting.component.scss'],
})
export class PageDataSettingComponent implements OnInit {
  @Input() page!: Page;
  constructor() {}

  ngOnInit(): void {}

  addDataSetting(event: Event): void {
    this.page.dataSetting = [
      ...(this.page.dataSetting || []),
      { name: `数据${(this.page.dataSetting || []).length + 1}` },
    ];
  }

  deleteDataSetting(index: number): void {
    this.page.dataSetting?.splice(index, 1);
  }
}
