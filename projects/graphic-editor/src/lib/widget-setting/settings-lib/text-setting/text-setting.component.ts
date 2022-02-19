import {
  Component,
  ComponentRef,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { TextWidgetData } from '../../../widget-lib/widget/widget-text/widget-text.component';
import { WidgetComponent } from '../../../widget-lib/widget/widget.component';

@Component({
  selector: 'lib-text-setting',
  templateUrl: './text-setting.component.html',
  styleUrls: ['./text-setting.component.scss'],
})
export class TextSettingComponent implements OnInit {
  constructor(public ref: ComponentRef<WidgetComponent>) {}

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
      // this.ref.instance.widgetData.setting =
      //   this.ref.instance.widgetData.setting || {};
      // Object.assign(this.ref.instance.widgetData.setting, { fontSize });
      (this.ref.instance.widgetData as TextWidgetData).setting.fontSize =
        fontSize;
    }
  }

  onColorChange(event: Event): void {
    (this.ref.instance.widgetData as TextWidgetData).setting.color = (
      event.target as HTMLInputElement
    ).value;
  }

  toggleBold(): void {
    (this.ref.instance.widgetData as TextWidgetData).setting.bold = !(
      this.ref.instance.widgetData as TextWidgetData
    ).setting.bold;
    // if (this.ref.instance.widgetData) {
    //   this.ref.instance.widgetData.setting =
    //     this.ref.instance.widgetData.setting || {};
    //   Object.assign(this.ref.instance.widgetData.setting, {
    //     bold: !this.ref.instance.widgetData?.setting?.bold,
    //   });
    // }
  }

  toggleItalic(): void {
    (this.ref.instance.widgetData as TextWidgetData).setting.italic = !(
      this.ref.instance.widgetData as TextWidgetData
    ).setting.italic;
    // if (this.ref.instance.widgetData) {
    //   this.ref.instance.widgetData.setting =
    //     this.ref.instance.widgetData.setting || {};
    //   Object.assign(this.ref.instance.widgetData.setting, {
    //     italic: !this.ref.instance.widgetData?.setting?.italic,
    //   });
    // }
  }

  toggleUnderline(): void {
    (this.ref.instance.widgetData as TextWidgetData).setting.underline = !(
      this.ref.instance.widgetData as TextWidgetData
    ).setting.underline;
    // if (this.ref.instance.widgetData) {
    //   this.ref.instance.widgetData.setting =
    //     this.ref.instance.widgetData.setting || {};
    //   Object.assign(this.ref.instance.widgetData.setting, {
    //     underline: !this.ref.instance.widgetData?.setting?.underline,
    //   });
    // }
  }
}
