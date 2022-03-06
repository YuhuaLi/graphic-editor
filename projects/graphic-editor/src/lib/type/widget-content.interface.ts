import { WidgetData } from '.';
import { OperationMode } from '../enum';

export interface IWidgetContent {
  widgetData: WidgetData;
  OperationMode?: OperationMode;
  data?: any;
}
