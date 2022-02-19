import { Injectable, InjectionToken } from '@angular/core';
import { Widget } from './model';

@Injectable()
export class GraphicEditorService {
  constructor() {}
}

export const WIDGET_LIST = new InjectionToken<Widget[]>('widget_list');
