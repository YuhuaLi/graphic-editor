import { ComponentRef } from '@angular/core';
import { PageStyle, Widget, WidgetData, WidgetStyle } from '.';
import { WidgetComponent } from '../widget-lib/widget/widget.component';

export type Page = {
  style: PageStyle;
  widgets?: { type: string; style: WidgetStyle; widgetData?: WidgetData }[];
  _widgetRefs?: ComponentRef<WidgetComponent>[];
  subPage?: Page[];
};
