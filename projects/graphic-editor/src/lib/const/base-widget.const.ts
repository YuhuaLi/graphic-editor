import { WidgetCategory } from '../enum';
import { Widget } from '../type';
import { WidgetButtonComponent } from '../widget-lib/widget/widget-button/widget-button.component';
import { WidgetImgComponent } from '../widget-lib/widget/widget-img/widget-img.component';
import { WidgetLinkAreaComponent } from '../widget-lib/widget/widget-link-area/widget-link-area.component';
import { WidgetTextComponent } from '../widget-lib/widget/widget-text/widget-text.component';

export const BASE_WIDGET: Widget[] = [
  {
    category: WidgetCategory.Basic,
    type: 'text',
    name: '文字',
    icon: 'icon-text',
    width: 100,
    height: 100,
    component: WidgetTextComponent,
    settings: ['text'],
  },
  {
    category: WidgetCategory.Basic,
    type: 'image',
    name: '图片',
    icon: 'icon-image',
    width: 100,
    height: 100,
    component: WidgetImgComponent,
    settings: ['image'],
  },
  {
    category: WidgetCategory.Basic,
    type: 'button',
    name: '按钮',
    icon: 'icon-mtbutton',
    width: 100,
    height: 30,
    component: WidgetButtonComponent,
    settings: ['text', 'appearance'],
  },
  {
    category: WidgetCategory.Basic,
    type: 'link-area',
    name: '链接区域',
    icon: 'icon-area',
    component: WidgetLinkAreaComponent,
    width: 100,
    height: 100,
    settings: ['appearance'],
  },
];
