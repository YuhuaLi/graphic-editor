import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';

@Component({
  selector: 'ng-widget-general-setting',
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
    this.emitChange();
  }

  toggleWidgetLockedScale(): void {
    this.ref.instance.toggleLockedScale();
  }

  onWidthChange(width: number): void {
    if (this.ref.instance.isLockedScale) {
      this.ref.instance.height = width / this.ref.instance.lockedScale;
    }
    this.emitChange();
  }

  onHeightChange(height: number): void {
    if (this.ref.instance.isLockedScale) {
      this.ref.instance.width = height / this.ref.instance.lockedScale;
    }
    this.emitChange();
  }

  emitChange(): void {
    this.ref.instance.page._modified = true;
  }
}
