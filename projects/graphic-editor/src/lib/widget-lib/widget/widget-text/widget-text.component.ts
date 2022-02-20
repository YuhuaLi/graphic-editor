import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { WidgetData, WidgetStatus } from '../../../model';
import { BaseWidgetContent } from '../base-widget-content';
import { WidgetService } from '../widget.service';

export type TextWidgetData = Exclude<WidgetData, 'setting'> & {
  setting: {
    text: string;
    fontSize: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
  };
};

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

  readonly = true;
  widgetData: TextWidgetData = {
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
    console.log(this.widgetData);
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
    event.preventDefault();
    event.stopPropagation();
    this.readonly = false;
    (event.target as HTMLTextAreaElement).focus();
    (event.target as HTMLTextAreaElement).select();
  }

  onTextChange(event: string): void {
    this.widgetData.setting = this.widgetData.setting || {};
    Object.assign(this.widgetData.setting, { text: event });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
