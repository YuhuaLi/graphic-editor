import { DataSetting } from './data-setting.type';
import { EventListener } from '.';

export type WidgetData<T = any> = {
  id?: number;
  // 后续用作组件命名，暂未使用
  name?: string;
  /** 常规设置 */
  setting: T;
  /** 事件设置 */
  events?: EventListener[];
  /** 数据源设置 */
  dataSetting?: DataSetting[];
};
