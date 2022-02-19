import { Component, OnInit } from '@angular/core';
import { WidgetData } from '../../../model';
import { BaseWidgetContent } from '../base-widget-content';

export type ButtonWidgetData = Exclude<WidgetData, 'setting'> & {
  setting?: { btnText: string };
};

@Component({
  selector: 'lib-widget-button',
  templateUrl: './widget-button.component.html',
  styleUrls: ['./widget-button.component.scss'],
})
export class WidgetButtonComponent extends BaseWidgetContent implements OnInit {
  widgetData: ButtonWidgetData = { setting: { btnText: '' } };

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
