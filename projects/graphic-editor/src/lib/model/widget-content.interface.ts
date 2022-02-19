import { WidgetData } from '.';

export interface IWidgetContent {
  widgetData: WidgetData;

  setWidgetData(widgetData: WidgetData): void;
}
