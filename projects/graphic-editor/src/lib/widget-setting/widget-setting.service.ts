import { Inject, Injectable, Optional } from '@angular/core';
import { BASE_WIDGET_SETTING } from '../const';
import { WIDGET_SETTING_LIST } from '../injection-token';
import { WidgetSetting } from '../type';

@Injectable()
export class WidgetSettingService {
  widgetSettingLib = BASE_WIDGET_SETTING;

  constructor(
    @Optional() @Inject(WIDGET_SETTING_LIST) settings?: WidgetSetting[]
  ) {
    this.widgetSettingLib.push(...(settings || []));
  }

  getWidgetSettingLib(): WidgetSetting[] {
    return this.widgetSettingLib;
  }

  getWidgetByType(type: string): Exclude<WidgetSetting, string> | null {
    return (
      (this.widgetSettingLib.find((setting) => {
        return (setting as Exclude<WidgetSetting, string>).type === type;
      }) as Exclude<WidgetSetting, string>) || null
    );
  }
}
