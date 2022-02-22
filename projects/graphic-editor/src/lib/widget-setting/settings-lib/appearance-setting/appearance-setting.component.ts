import { Component, ComponentRef, OnInit } from '@angular/core';
import { WidgetComponent } from '../../../widget-lib/widget/widget.component';

export type AppearanceSetting = {
  background?: { color: string } | null;
  radius: number | number[];
  border?: {
    color: string;
    style: string;
    width: number;
  } | null;
};

@Component({
  selector: 'lib-appearance-setting',
  templateUrl: './appearance-setting.component.html',
  styleUrls: ['./appearance-setting.component.scss'],
})
export class AppearanceSettingComponent implements OnInit {
  constructor(public ref: ComponentRef<WidgetComponent>) {}

  ngOnInit(): void {}

  onBackgroundColorChange(event: Event): void {}

  onBorderColorChange(event: Event): void {}
}
