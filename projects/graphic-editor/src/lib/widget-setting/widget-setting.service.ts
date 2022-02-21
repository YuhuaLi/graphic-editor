import { Inject, Injectable, Optional } from '@angular/core';
import { BASE_WIDGET_SETTING } from '../const';
import { WIDGET_SETTING_LIST } from '../injection-token';
import { WidgetSetting } from '../model';

@Injectable()
export class WidgetSettingService {
  widgetSettingLib = BASE_WIDGET_SETTING;

  constructor(
    @Optional() @Inject(WIDGET_SETTING_LIST) widgets?: WidgetSetting[]
  ) {}

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
