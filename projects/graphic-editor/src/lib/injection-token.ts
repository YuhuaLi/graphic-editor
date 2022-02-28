import { InjectionToken } from '@angular/core';
import { Widget } from './type';

export const WIDGET_LIST = new InjectionToken<Widget[]>('widget_list');

export const WIDGET_SETTING_LIST = new InjectionToken<Widget[]>(
  'widget_setting_list'
);
