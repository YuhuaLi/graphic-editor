import { WidgetSetting } from '../model';
import { ImgSettingComponent } from '../widget-setting/settings-lib/img-setting/img-setting.component';
import { TextSettingComponent } from '../widget-setting/settings-lib/text-setting/text-setting.component';

export const BASE_WIDGET_SETTING: WidgetSetting[] = [
  {
    type: 'text',
    name: '文字',
    component: TextSettingComponent,
  },
  {
    type: 'image',
    component: ImgSettingComponent,
  },
];
