import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { NavButton } from '../type';
import { WidgetComponent } from '../widget-lib/widget/widget.component';

@Component({
  selector: 'ng-widget-setting',
  templateUrl: './widget-setting.component.html',
  styleUrls: ['./widget-setting.component.scss'],
})
export class WidgetSettingComponent implements OnInit {
  @Input() ref!: ComponentRef<WidgetComponent>;

  navItems: NavButton[] = [
    { type: 'widget-settings', name: '属性', isActive: true },
    { type: 'widget-events', name: '事件' },
    { type: 'widget-data', name: '数据' },
  ];

  navType = 'widget-settings';

  constructor() {}

  ngOnInit(): void {}

  onNavItemClick(navItem: NavButton): void {
    this.navItems.forEach((item) => (item.isActive = item === navItem));
    this.navType = navItem.type;
  }
}
