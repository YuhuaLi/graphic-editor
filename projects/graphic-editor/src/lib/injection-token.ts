import { InjectionToken } from '@angular/core';
import { IGraphicEditorService } from './graphic-editor.service';
import { Widget, WidgetSetting } from './type';

export const WIDGET_LIST = new InjectionToken<Widget[]>('widget_list');

export const WIDGET_SETTING_LIST = new InjectionToken<WidgetSetting[]>(
  'widget_setting_list'
);

export const EDITOR_SERVICE = new InjectionToken<IGraphicEditorService>(
  'editor_service'
);
