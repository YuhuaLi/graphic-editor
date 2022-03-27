import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OperationMode } from '../../../enum';
import { Page, WidgetData } from '../../../type';
import { AppearanceSetting } from '../../../widget-setting/settings-lib/appearance-setting/appearance-setting.component';
import { BaseWidgetContent } from '../base-widget-content';

export type LinkAreaWidgetData = WidgetData<AppearanceSetting> & {
  page?: Page;
};

@Component({
  selector: 'lib-widget-link-area',
  templateUrl: './widget-link-area.component.html',
  styleUrls: ['./widget-link-area.component.scss'],
})
export class WidgetLinkAreaComponent
  extends BaseWidgetContent
  implements OnInit
{
  page?: Page;
  pages?: Page[];

  widgetData: LinkAreaWidgetData = {
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

  OPERATION_MODE = OperationMode;

  constructor() {
    super();
  }

  renderPage(page: Page, pages: Page[] = []): void {
    console.log('render', page);
    this.page = page;
    this.pages = pages;
  }

  ngOnInit(): void {}
}
