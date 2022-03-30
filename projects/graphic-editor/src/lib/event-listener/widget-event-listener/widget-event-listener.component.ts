import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { EventType } from '../../enum';
import { EventListener } from '../../type';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';

@Component({
  selector: 'ng-widget-event-listener',
  templateUrl: './widget-event-listener.component.html',
  styleUrls: ['./widget-event-listener.component.scss'],
})
export class WidgetEventListenerComponent implements OnInit {
  @Input() ref!: ComponentRef<WidgetComponent>;
  constructor() {}

  ngOnInit(): void {}

  addEventListener(event: Event): void {
    if (this.ref.instance.widgetData) {
      this.ref.instance.widgetData.events = [
        ...(this.ref.instance.widgetData.events || []),
        { type: EventType.Click, actionData: {} },
      ];
    }
    this.emitChange();
  }

  deleteEventListener(index: number): void {
    if (this.ref.instance.widgetData) {
      this.ref.instance.widgetData.events?.splice(index, 1);
    }
    this.emitChange();
  }

  emitChange(): void {
    this.ref.instance.page._modified = true;
  }
}
