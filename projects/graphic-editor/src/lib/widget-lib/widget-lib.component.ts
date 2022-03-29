import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WIDGET_CATEGORY } from '../const';
import { Widget, NavButton } from '../type';
import { WidgetLibService } from './widget-lib.service';

@Component({
  selector: 'ng-widget-lib',
  templateUrl: './widget-lib.component.html',
  styleUrls: ['./widget-lib.component.scss'],
})
export class WidgetLibComponent implements OnInit {
  inputControl = new FormControl();
  activeNavItem!: NavButton;
  navItems: NavButton[] = [];
  widgetMap: Map<string, Widget[]> = new Map();
  widgetList: Widget[] = [];

  constructor(
    private widgetLibSrv: WidgetLibService,
    private renderer2: Renderer2
  ) {
    const arr = this.widgetLibSrv.getWidgetLib();
    const navItems: NavButton[] = [];
    arr.forEach((item) => {
      if (!this.widgetMap.has(item.category)) {
        this.widgetMap.set(item.category, []);
        navItems.push({
          type: item.category,
          name: WIDGET_CATEGORY.get(item.category) || item.category,
          isActive: false,
        });
      }
      this.widgetMap.get(item.category)?.push(item);
    });
    this.navItems = navItems;
    // this.navItems = Array.from(WIDGET_CATEGORY).map((item, index) => ({
    //   type: item[0],
    //   name: item[1],
    //   isActive: index === 0,
    // }));
    if (this.navItems.length) {
      this.navItems[0].isActive = true;
      this.activeNavItem = this.navItems[0];
      this.widgetList = this.widgetMap.get(this.activeNavItem.type) || [];
    }
  }

  ngOnInit(): void {
    this.inputControl.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe((value: string) => {
        const widgetList = this.widgetMap.get(this.activeNavItem.type) || [];
        this.widgetList = value
          ? widgetList.filter((widget) =>
              new RegExp(`^.*${value}.*$`, 'i').test(widget.name)
            )
          : widgetList;
      });
  }

  onNavItemClick(event: NavButton): void {
    if (!event.isActive) {
      this.activeNavItem.isActive = false;
      event.isActive = true;
      this.activeNavItem = event;
      const widgetList = this.widgetMap.get(event.type) || [];
      this.widgetList = this.inputControl.value
        ? widgetList.filter((widget) =>
            new RegExp(`^.*${this.inputControl.value}.*$`, 'i').test(
              widget.name
            )
          )
        : widgetList;
    }
  }

  onWidgetDragStart(event: DragEvent, widget: Widget): void {
    event.dataTransfer?.setData('widgetType', widget.type);
    this.renderer2.addClass(
      document.body.querySelector('ng-graphic-editor'),
      'dragging'
    );
  }

  onWidgetDragEnd(event: DragEvent): void {
    this.renderer2.removeClass(
      document.body.querySelector('ng-graphic-editor'),
      'dragging'
    );
  }
}
