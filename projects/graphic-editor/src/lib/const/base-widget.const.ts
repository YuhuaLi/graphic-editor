import { Widget, WidgetCategory } from '../model';
import { WidgetButtonComponent } from '../widget-lib/widget/widget-button/widget-button.component';
import { WidgetImgComponent } from '../widget-lib/widget/widget-img/widget-img.component';
import { WidgetTextComponent } from '../widget-lib/widget/widget-text/widget-text.component';
import { TextSettingComponent } from '../widget-setting/settings-lib/text-setting/text-setting.component';

export const BASE_WIDGET: Widget[] = [
  {
    category: WidgetCategory.Basic,
    type: 'text',
    name: '文字',
    icon: 'icon-text',
    width: 100,
    height: 100,
    component: WidgetTextComponent,
    settings: [
      {
        name: '文字',
        component: TextSettingComponent,
      },
    ],
  },
  {
    category: WidgetCategory.Basic,
    type: 'image',
    name: '图片',
    icon: 'icon-image',
    width: 100,
    height: 100,
    component: WidgetImgComponent,
  },
  {
    category: WidgetCategory.Basic,
    type: 'button',
    name: '按钮',
    icon: 'icon-mtbutton',
    width: 100,
    height: 30,
    component: WidgetButtonComponent,
  },
];
