import { DataSetting } from './data-setting.type';
import { EventListener } from '.';

export type WidgetData<T = any> = {
  id?: number;
  name?: string;
  setting: T;
  events?: EventListener[];
  dataSetting?: DataSetting[];
};
