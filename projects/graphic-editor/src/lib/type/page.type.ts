import { PageStyle, Widget, WidgetData, WidgetStyle } from '.';

export type Page = {
  id: number;
  name?: string;
  style: PageStyle;
  widgets?: { type: string; style: WidgetStyle; widgetData?: WidgetData }[];
  // _widgetRefs?: ComponentRef<WidgetComponent>[];
  subPage?: Page[];
  selected?: boolean;
  _modified?: boolean;
};
