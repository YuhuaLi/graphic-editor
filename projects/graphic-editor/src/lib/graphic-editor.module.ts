import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphicEditorComponent } from './graphic-editor.component';
import { Widget } from './model';
import { RulerComponent } from './ruler/ruler.component';
import { WidgetLibComponent } from './widget-lib/widget-lib.component';
import { WidgetLibService } from './widget-lib/widget-lib.service';
import { WidgetTextComponent } from './widget-lib/widget/widget-text/widget-text.component';
import { WidgetComponent } from './widget-lib/widget/widget.component';
import { WidgetImgComponent } from './widget-lib/widget/widget-img/widget-img.component';
import { PageSettingComponent } from './page-setting.component';
import { ZoomBoxComponent } from './zoom-box/zoom-box.component';
import { WidgetSettingComponent } from './widget-setting/widget-setting.component';
import { WidgetGeneralSettingComponent } from './widget-setting/widget-general-setting/widget-general-setting.component';
import { WidgetSettingItemComponent } from './widget-setting/widget-setting-item/widget-setting-item.component';
import { TextSettingComponent } from './widget-setting/settings-lib/text-setting/text-setting.component';
import { WidgetButtonComponent } from './widget-lib/widget/widget-button/widget-button.component';
import { ImgSettingComponent } from './widget-setting/settings-lib/img-setting/img-setting.component';
import { WIDGET_LIST } from './injection-token';
import { WidgetSettingService } from './widget-setting/widget-setting.service';
import { AppearanceSettingComponent } from './widget-setting/settings-lib/appearance-setting/appearance-setting.component';

const WIDGET_COMPONENT = [
  WidgetComponent,
  WidgetTextComponent,
  WidgetImgComponent,
];

const WIDGET_SETTING_COMPONENT = [TextSettingComponent, ImgSettingComponent];

@NgModule({
  declarations: [
    GraphicEditorComponent,
    RulerComponent,
    WidgetLibComponent,
    PageSettingComponent,
    WidgetSettingComponent,
    WidgetGeneralSettingComponent,
    WidgetSettingItemComponent,
    ZoomBoxComponent,
    ...WIDGET_COMPONENT,
    ...WIDGET_SETTING_COMPONENT,
    WidgetButtonComponent,
    AppearanceSettingComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [GraphicEditorComponent],
  // entryComponents: [...WIDGET_COMPONENT],
  providers: [WidgetLibService, WidgetSettingService],
})
export class GraphicEditorModule {
  static forRoot(
    widgetList: Widget[]
  ): ModuleWithProviders<GraphicEditorModule> {
    return {
      ngModule: GraphicEditorModule,
      providers: [
        {
          provide: WIDGET_LIST,
          useValue: widgetList,
        },
      ],
    };
  }
}
