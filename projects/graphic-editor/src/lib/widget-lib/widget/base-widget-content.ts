import { OperationMode } from '../../enum';
import { WidgetData } from '../../type';
import { IWidgetContent } from '../../type/widget-content.interface';

export abstract class BaseWidgetContent implements IWidgetContent {
  widgetData: WidgetData = { setting: {} };
  mode?: OperationMode;
  data?: any;
}
