import { Inject, Injectable, Optional } from '@angular/core';
import { BASE_WIDGET } from '../const';
import { WIDGET_LIST } from '../injection-token';
import { Widget } from '../type';

@Injectable()
export class WidgetLibService {
  widgetLib = BASE_WIDGET;

  constructor(@Optional() @Inject(WIDGET_LIST) widgets?: Widget[]) {
    this.widgetLib.push(...(widgets || []));
  }

  getWidgetLib(): Widget[] {
    return this.widgetLib;
  }

  getWidgetByType(type: string): Widget | null {
    return this.widgetLib.find((widget) => widget.type === type) || null;
  }
}
