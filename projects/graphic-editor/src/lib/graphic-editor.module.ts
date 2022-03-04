import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphicEditorComponent } from './graphic-editor.component';
import { Widget, WidgetSetting } from './type';
import { RulerComponent } from './component/ruler/ruler.component';
import { WidgetLibComponent } from './widget-lib/widget-lib.component';
import { WidgetLibService } from './widget-lib/widget-lib.service';
import { WidgetTextComponent } from './widget-lib/widget/widget-text/widget-text.component';
import { WidgetComponent } from './widget-lib/widget/widget.component';
import { WidgetImgComponent } from './widget-lib/widget/widget-img/widget-img.component';
import { PageSettingComponent } from './page-setting.component';
import { ZoomBoxComponent } from './component/zoom-box/zoom-box.component';
import { WidgetSettingComponent } from './widget-setting/widget-setting.component';
import { WidgetGeneralSettingComponent } from './widget-setting/widget-general-setting/widget-general-setting.component';
import { WidgetSettingItemComponent } from './widget-setting/widget-setting-item/widget-setting-item.component';
import { TextSettingComponent } from './widget-setting/settings-lib/text-setting/text-setting.component';
import { WidgetButtonComponent } from './widget-lib/widget/widget-button/widget-button.component';
import { ImgSettingComponent } from './widget-setting/settings-lib/img-setting/img-setting.component';
import { WIDGET_LIST, WIDGET_SETTING_LIST } from './injection-token';
import { WidgetSettingService } from './widget-setting/widget-setting.service';
import { AppearanceSettingComponent } from './widget-setting/settings-lib/appearance-setting/appearance-setting.component';
import { PageEventListenerComponent } from './event-listener/page-event-listener/page-event-listener.component';
import { WidgetEventListenerComponent } from './event-listener/widget-event-listener/widget-event-listener.component';
import { GraphicViewComponent } from './graphic-view.component';
import { SelectComponent } from './component/select/select.component';
import { EventPanelComponent } from './component/event-panel/event-panel.component';
import { WidgetLinkAreaComponent } from './widget-lib/widget/widget-link-area/widget-link-area.component';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './component/menu/menu.component';
import { GraphicEditorService } from './graphic-editor.service';
import { PageListComponent } from './page-list/page-list.component';
import { WidgetListComponent } from './widget-list/widget-list.component';
import { PageDataSettingComponent } from './data-setting/page-data-setting/page-data-setting.component';
import { WidgetDataSettingComponent } from './data-setting/widget-data-setting/widget-data-setting.component';
import { DataPanelComponent } from './component/data-panel/data-panel.component';

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
    PageEventListenerComponent,
    WidgetEventListenerComponent,
    GraphicViewComponent,
    SelectComponent,
    EventPanelComponent,
    WidgetLinkAreaComponent,
    MenuComponent,
    PageListComponent,
    WidgetListComponent,
    PageDataSettingComponent,
    WidgetDataSettingComponent,
    DataPanelComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [GraphicEditorComponent],
  // entryComponents: [...WIDGET_COMPONENT],
  providers: [WidgetLibService, WidgetSettingService, GraphicEditorService],
})
export class GraphicEditorModule {
  static forRoot(
    widgetList: Widget[],
    widgetSettingList: WidgetSetting[]
  ): ModuleWithProviders<GraphicEditorModule> {
    return {
      ngModule: GraphicEditorModule,
      providers: [
        {
          provide: WIDGET_LIST,
          useValue: widgetList,
        },
        { provide: WIDGET_SETTING_LIST, useValue: widgetSettingList },
      ],
    };
  }
}
