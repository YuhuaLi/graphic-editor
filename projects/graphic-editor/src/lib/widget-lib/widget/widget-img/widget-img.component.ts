import { Component, OnDestroy, OnInit } from '@angular/core';
import { WidgetData } from '../../../model';
import { ImgSetting } from '../../../widget-setting/settings-lib/img-setting/img-setting.component';
import { BaseWidgetContent } from '../base-widget-content';

@Component({
  selector: 'lib-widget-img',
  templateUrl: './widget-img.component.html',
  styleUrls: ['./widget-img.component.scss'],
})
export class WidgetImgComponent
  extends BaseWidgetContent
  implements OnInit, OnDestroy
{
  widgetData: WidgetData<ImgSetting> = { setting: { imgSrc: '' } };

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.widgetData.setting.imgSrc) {
      URL.revokeObjectURL(this.widgetData.setting.imgSrc);
    }
  }
}
