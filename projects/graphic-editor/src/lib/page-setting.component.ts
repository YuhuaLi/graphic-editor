import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavButton, Page } from './type';

@Component({
  selector: 'ng-page-setting',
  templateUrl: './page-setting.component.html',
  styleUrls: ['./page-setting.component.scss'],
})
export class PageSettingComponent implements OnInit, OnChanges {
  @Input() page!: Page;

  navItems: NavButton[] = [
    { type: 'page-settings', name: '页面设置', isActive: true },
    { type: 'page-data', name: '数据' },
  ];

  // get color(): string {
  //   if (
  //     /^#([0-9a-f]{6})|([0-9a-f]{8})$/i.test(this.page.style.backgroundColor)
  //   ) {
  //     return this.page.style.backgroundColor.substring(0, 7);
  //   }
  //   return '';
  // }

  // get opacity(): number {
  //   if (/^#([0-9a-f]{8})$/i.test(this.page.style.backgroundColor)) {
  //     return +(
  //       parseInt(this.page.style.backgroundColor.substring(7, 9), 16) / 255
  //     ).toFixed(1);
  //   }
  //   return 1;
  // }
  opacity = 1;
  color = '#ffffff';
  navType = 'page-settings';

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.page &&
      changes.page.currentValue &&
      !changes.page.firstChange
    ) {
      this.color = /^#([0-9a-f]{6})|([0-9a-f]{8})$/i.test(
        changes.page.currentValue.style.backgroundColor
      )
        ? changes.page.currentValue.style.backgroundColor.substring(0, 7)
        : '#ffffff';
      this.opacity = /^#([0-9a-f]{8})$/i.test(
        changes.page.currentValue.style.backgroundColor
      )
        ? +(
            parseInt(
              changes.page.currentValue.style.backgroundColor.substring(7, 9),
              16
            ) / 255
          ).toFixed(1)
        : 1;
    }
  }

  onNavItemClick(navItem: NavButton): void {
    this.navItems.forEach((item) => (item.isActive = item === navItem));
    this.navType = navItem.type;
  }

  changePageAdaptive(event: Event): void {
    this.page.style.adaptive = (event.target as HTMLInputElement).checked;
  }

  onBackgroundColorChange(color: string): void {
    this.color = color;
    this.page.style.backgroundColor = `${this.color}${Math.floor(
      this.opacity * 255
    ).toString(16)}`;
  }

  onOpacityChange(opacity: number): void {
    this.opacity = opacity;
    this.page.style.backgroundColor = `${this.color}${
      opacity ? Math.floor(this.opacity * 255).toString(16) : '00'
    }`;
  }
}
