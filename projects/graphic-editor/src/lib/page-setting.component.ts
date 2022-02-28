import { Component, Input, OnInit } from '@angular/core';
import { NavButton, Page } from './type';

@Component({
  selector: 'lib-page-setting',
  templateUrl: './page-setting.component.html',
  styleUrls: ['./page-setting.component.scss'],
})
export class PageSettingComponent implements OnInit {
  @Input() page!: Page;

  navItems: NavButton[] = [
    { type: 'page-settings', name: '页面设置', isActive: true },
  ];

  constructor() {}

  ngOnInit(): void {}

  onNavItemClick(navItem: NavButton): void {
    this.navItems.forEach((item) => (item.isActive = item === navItem));
  }

  changePageAdaptive(event: Event): void {
    this.page.style.adaptive = (event.target as HTMLInputElement).checked;
  }
}
