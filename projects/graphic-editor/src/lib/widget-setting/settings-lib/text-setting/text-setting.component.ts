import {
  Component,
  ComponentRef,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { WidgetData } from '../../../model';

import { WidgetComponent } from '../../../widget-lib/widget/widget.component';

export type TextSetting = {
  text: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
};

@Component({
  selector: 'lib-text-setting',
  templateUrl: './text-setting.component.html',
  styleUrls: ['./text-setting.component.scss'],
})
export class TextSettingComponent implements OnInit {
  constructor(public ref: ComponentRef<WidgetComponent>) {
    console.log(ref);
  }

  ngOnInit(): void {}

  onTextChange(event: string): void {
    if (this.ref.instance.widgetData) {
      this.ref.instance.widgetData.setting =
        this.ref.instance.widgetData.setting || {};
      Object.assign(this.ref.instance.widgetData.setting, { text: event });
    }
  }

  onFontSizeChange(event: Event): void {
    const fontSize = (event.target as HTMLInputElement).valueAsNumber;
    const isValid = (event.target as HTMLInputElement).validity.valid;
    if (this.ref.instance.widgetData && !isNaN(fontSize) && isValid) {
      this.ref.instance.widgetData.setting.fontSize = fontSize;
    }
  }

  onColorChange(event: Event): void {
    (this.ref.instance.widgetData as WidgetData<TextSetting>).setting.color = (
      event.target as HTMLInputElement
    ).value;
  }

  toggleBold(): void {
    (this.ref.instance.widgetData as WidgetData<TextSetting>).setting.bold = !(
      this.ref.instance.widgetData as WidgetData<TextSetting>
    ).setting.bold;
  }

  toggleItalic(): void {
    (this.ref.instance.widgetData as WidgetData<TextSetting>).setting.italic =
      !(this.ref.instance.widgetData as WidgetData<TextSetting>).setting.italic;
  }

  toggleUnderline(): void {
    (
      this.ref.instance.widgetData as WidgetData<TextSetting>
    ).setting.underline = !(
      this.ref.instance.widgetData as WidgetData<TextSetting>
    ).setting.underline;
  }
}
