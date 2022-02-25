import { Component, OnInit } from '@angular/core';
import { WidgetData } from '../../../model';
import { AppearanceSetting } from '../../../widget-setting/settings-lib/appearance-setting/appearance-setting.component';
import { TextSetting } from '../../../widget-setting/settings-lib/text-setting/text-setting.component';
import { BaseWidgetContent } from '../base-widget-content';

export type ButtonWidgetData = WidgetData<TextSetting & AppearanceSetting>;

@Component({
  selector: 'lib-widget-button',
  templateUrl: './widget-button.component.html',
  styleUrls: ['./widget-button.component.scss'],
})
export class WidgetButtonComponent extends BaseWidgetContent implements OnInit {
  widgetData: ButtonWidgetData = {
    setting: {
      text: '',
      fontSize: 16,
      bold: false,
      italic: false,
      underline: false,
      color: '#000000',
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

  constructor() {
    super();
  }

  ngOnInit(): void {}

  alert(val: any) {
    window.alert(val);
  }
}
