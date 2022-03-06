import { DataSetting } from './data-setting.type';
import { EventListener } from '.';

export type WidgetData<T = any> = {
  setting: T;
  events?: EventListener[];
  dataSetting?: DataSetting[];
};
