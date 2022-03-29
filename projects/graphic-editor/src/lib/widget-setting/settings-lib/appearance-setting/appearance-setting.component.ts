import { Component, ComponentRef, OnInit } from '@angular/core';
import { WidgetComponent } from '../../../widget-lib/widget/widget.component';

export type AppearanceSetting = {
  background?: { fill: boolean; color: string } | null;
  radius: number | number[];
  border?: {
    fill: boolean;
    color: string;
    style: string;
    width: number;
  } | null;
};

@Component({
  selector: 'ng-appearance-setting',
  templateUrl: './appearance-setting.component.html',
  styleUrls: ['./appearance-setting.component.scss'],
})
export class AppearanceSettingComponent implements OnInit {
  constructor(public ref: ComponentRef<WidgetComponent>) {}

  ngOnInit(): void {}

  onBackgroundColorChange(event: Event): void {
    if (this.ref.instance.widgetData) {
      Object.assign(
        (this.ref.instance.widgetData.setting as AppearanceSetting).background,
        { color: (event.target as HTMLInputElement).value }
      );
    }
  }

  onBorderColorChange(event: Event): void {
    if (this.ref.instance.widgetData) {
      Object.assign(
        (this.ref.instance.widgetData.setting as AppearanceSetting).border,
        { color: (event.target as HTMLInputElement).value }
      );
    }
  }

  cancelBackgroundColor(event: Event): void {
    if (this.ref.instance.widgetData) {
      Object.assign(
        (this.ref.instance.widgetData.setting as AppearanceSetting).background,
        { fill: (event.target as HTMLInputElement).checked }
      );
    }
  }

  cancelBorderColor(event: Event): void {
    if (this.ref.instance.widgetData) {
      Object.assign(
        (this.ref.instance.widgetData.setting as AppearanceSetting).border,
        { fill: (event.target as HTMLInputElement).checked }
      );
    }
  }

  onRadiusChange(event: Event): void {
    if (
      this.ref.instance.widgetData &&
      (event.target as HTMLInputElement).validity.valid
    ) {
      (this.ref.instance.widgetData.setting as AppearanceSetting).radius = (
        event.target as HTMLInputElement
      ).valueAsNumber;
    }
  }
}
