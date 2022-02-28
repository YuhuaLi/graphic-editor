import { EventListener } from '.';

export type WidgetData<T = any> = {
  setting: T;
  events?: EventListener[];
  data?: any;
};
