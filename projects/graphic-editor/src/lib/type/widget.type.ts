import { DataSetting } from './data-setting.type';
import { WidgetSetting } from '.';
import { WidgetCategory } from '../enum';

export type Widget = {
  /** 组件类别 */
  category: WidgetCategory | string;
  /** 显示名称 */
  name: string;
  /** 部件类型 */
  type: string;
  /** 部件初始宽度 */
  width?: number;
  /** 部件初始高度 */
  height?: number;
  /** 工具栏显示图标 */
  icon?: string;
  /** 部件类 */
  component: any;
  /** 设置 */
  settings?: WidgetSetting[];
};
