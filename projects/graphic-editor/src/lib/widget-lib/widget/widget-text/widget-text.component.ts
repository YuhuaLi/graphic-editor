import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { OperationMode, WidgetStatus } from '../../../enum';
import { WidgetData } from '../../../type';
import { TextSetting } from '../../../widget-setting/settings-lib/text-setting/text-setting.component';
import { BaseWidgetContent } from '../base-widget-content';
import { WidgetService } from '../widget.service';

@Component({
  selector: 'lib-widget-text',
  templateUrl: './widget-text.component.html',
  styleUrls: ['./widget-text.component.scss'],
})
export class WidgetTextComponent
  extends BaseWidgetContent
  implements OnInit, OnDestroy
{
  alive = true;
  // contenteditable = false;
  // lines = [];

  readonly = true;
  widgetData: WidgetData<TextSetting> = {
    setting: {
      text: '',
      fontSize: 16,
      bold: false,
      italic: false,
      underline: false,
      color: '#000000',
    },
  };

  constructor(private widgetSrv: WidgetService) {
    super();
  }

  ngOnInit(): void {
    this.widgetSrv
      .onStatusChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe((status) => {
        if (status !== WidgetStatus.Select) {
          this.readonly = true;
        }
      });
  }

  onDblClick(event: MouseEvent): void {
    if (this.mode === OperationMode.Production) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.readonly = false;
    (event.target as HTMLTextAreaElement).focus();
    (event.target as HTMLTextAreaElement).select();
    // this.contenteditable = true;
  }

  onTextChange(event: string): void {
    this.widgetData.setting = this.widgetData.setting || {};
    Object.assign(this.widgetData.setting, { text: event });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
