import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ZOOM_RANGE } from '../../const';

import { AbstractValueAccessor } from '../abstractvalueaccessor';

@Component({
  selector: 'ng-zoom-box',
  templateUrl: './zoom-box.component.html',
  styleUrls: ['./zoom-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZoomBoxComponent),
      multi: true,
    },
  ],
})
export class ZoomBoxComponent extends AbstractValueAccessor implements OnInit, OnDestroy {
  min = ZOOM_RANGE[0];
  max = ZOOM_RANGE[ZOOM_RANGE.length - 1];

  get zoom(): number {
    return this.value;
  }

  set zoom(val) {
    this.value = val;
  }

  showMenu = false;

  get zoomText(): string {
    return `${this.zoom * 100}%`;
  }

  onClick = () => {
    this.showMenu = false;
    document.removeEventListener('click', this.onClick);
  };

  constructor() {
    super();
  }

  ngOnInit(): void {}

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
    document.addEventListener('click', this.onClick);
  }

  zoomIn(event: MouseEvent): void {
    event.stopPropagation();
    if (this.zoom >= this.max) {
      return;
    }
    for (const item of ZOOM_RANGE) {
      if (this.zoom < item) {
        this.zoom = item;
        break;
      }
    }
  }

  zoomOut(event: MouseEvent): void {
    event.stopPropagation();
    if (this.zoom <= this.min) {
      return;
    }
    for (let i = ZOOM_RANGE.length - 1; i >= 0; i--) {
      const item = ZOOM_RANGE[i];
      if (this.zoom > item) {
        this.zoom = item;
        break;
      }
    }
  }

  onZoomChange(event: Event): void {
    const arr = (event.target as HTMLInputElement).value.match(/\d+/);
    if (arr && arr.length) {
      let num = parseInt(arr[0], 10) / 100;
      if (num < this.min) {
        num = this.min;
      } else if (num > this.max) {
        num = this.max;
      }
      this.zoom = num;
    }
  }

  ngOnDestroy(): void {
      document.removeEventListener('click', this.onClick);
  }
}
