import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';

@Component({
  selector: 'lib-widget-general-setting',
  templateUrl: './widget-general-setting.component.html',
  styleUrls: ['./widget-general-setting.component.scss'],
})
export class WidgetGeneralSettingComponent implements OnInit {
  @Input() ref!: ComponentRef<WidgetComponent>;

  isLockedScale = false;

  constructor() {}

  ngOnInit(): void {}

  togleWidgetLocked(): void {
    this.ref.instance.toggleLocked();
  }

  toggleWidgetHidden(): void {
    this.ref.instance.toggleHidden();
  }

  onWidthChange(width: number): void {
    if (this.ref.instance.isLockedScale) {
      this.ref.instance.height = width / this.ref.instance.lockedScale;
    }
  }

  onHeightChange(height: number): void {
    if (this.ref.instance.isLockedScale) {
      this.ref.instance.width = height / this.ref.instance.lockedScale;
    }
  }
}
