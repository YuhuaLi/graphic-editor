import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { TestComponent } from './test/test.component';
// import {
//   GraphicEditorModule,
//   WidgetCategory,
//   WIDGET_LIST,
//   WIDGET_SETTING_LIST,
// } from 'projects/graphic-editor/src/public-api';
import { ChartComponent } from './chart/chart.component';
import { ChartSettingComponent } from './chart/chart-setting.component';
import { CustomHttpInterceptor } from './custom-http-Interceptor';
import {
  EDITOR_SERVICE,
  GraphicEditorModule,
  WidgetCategory,
  WIDGET_LIST,
  WIDGET_SETTING_LIST,
} from 'ng-graphic-editor';
import { CommonModule } from '@angular/common';
import { AppService } from './app.service';

const arr = [
  {
    category: WidgetCategory.Advanced,
    name: '图表',
    icon: 'icon-chart',
    type: 'chart',
    width: 100,
    height: 100,
    component: ChartComponent,
    settings: [
      { type: 'chart', name: '图表', component: ChartSettingComponent },
      'appearance',
    ],
  },
];

const arr1 = [
  {
    type: 'test',
    component: TestComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    TestComponent,
    ChartComponent,
    ChartSettingComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GraphicEditorModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    { provide: WIDGET_LIST, useValue: arr },
    { provide: WIDGET_SETTING_LIST, useValue: arr1 },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,
    },
    { provide: EDITOR_SERVICE, useFactory: () => new AppService() },
  ],
  entryComponents: [ChartComponent, ChartSettingComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
