import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { TestComponent } from './test/test.component';
import { GraphicEditorModule, WidgetCategory, WIDGET_LIST, WIDGET_SETTING_LIST } from 'projects/graphic-editor/src/public-api';


const arr = [
  {
    category: WidgetCategory.Advanced,
    name: '文字11111111111111111111111111111111111',
    icon: 'icon-sucaiku',
    type: 'text1',
    width: 100,
    height: 100,
    component: TestComponent,
  },
];

const arr1 = [
  {
    type: 'test',
    component: TestComponent,
  },
];

@NgModule({
  declarations: [AppComponent, EditorComponent, TestComponent],
  imports: [BrowserModule, AppRoutingModule, GraphicEditorModule],
  providers: [
    { provide: WIDGET_LIST, useValue: arr },
    { provide: WIDGET_SETTING_LIST, useValue: arr1 },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
