import { Component, OnInit } from '@angular/core';
import { Page, WidgetData } from '../../../type';
import { AppearanceSetting } from '../../../widget-setting/settings-lib/appearance-setting/appearance-setting.component';

export type LinkAreaWidgetData = WidgetData<AppearanceSetting>;

@Component({
  selector: 'lib-widget-link-area',
  templateUrl: './widget-link-area.component.html',
  styleUrls: ['./widget-link-area.component.scss'],
})
export class WidgetLinkAreaComponent implements OnInit {
  page!: Page;

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

  constructor() {}

  ngOnInit(): void {}
}
