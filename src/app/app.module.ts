import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  GraphicEditorModule,
} from 'projects/graphic-editor/src/public-api';
import { EditorComponent } from './editor/editor.component';
import { WidgetTextComponent } from 'projects/graphic-editor/src/lib/widget-lib/widget/widget-text/widget-text.component';
import { WidgetCategory } from 'projects/graphic-editor/src/lib/model';
import { TestComponent } from './test/test.component';
import { WIDGET_LIST } from 'projects/graphic-editor/src/lib/injection-token';

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

@NgModule({
  declarations: [AppComponent, EditorComponent, TestComponent],
  imports: [BrowserModule, AppRoutingModule, GraphicEditorModule],
  providers: [{ provide: WIDGET_LIST, useValue: arr }],
  bootstrap: [AppComponent],
})
export class AppModule {}
