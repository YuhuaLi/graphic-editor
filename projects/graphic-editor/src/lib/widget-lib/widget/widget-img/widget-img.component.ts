import { Component, OnInit } from '@angular/core';
import { WidgetData } from '../../../model';
import { BaseWidgetContent } from '../base-widget-content';

export type ImgWidgetData = Exclude<WidgetData, 'setting'> & {
  setting?: { imgSrc?: string | null };
};

@Component({
  selector: 'lib-widget-img',
  templateUrl: './widget-img.component.html',
  styleUrls: ['./widget-img.component.scss'],
})
export class WidgetImgComponent extends BaseWidgetContent implements OnInit {
  widgetData: ImgWidgetData = { setting: { imgSrc: '' } };

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
