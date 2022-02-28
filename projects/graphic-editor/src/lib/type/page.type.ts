import { PageStyle, Widget, WidgetData, WidgetStyle } from '.';

export type Page = {
  style: PageStyle;
  widgets?: { type: string; style: WidgetStyle; widgetData?: WidgetData }[];
  // _widgetRefs?: ComponentRef<WidgetComponent>[];
  subPage?: Page[];
};
