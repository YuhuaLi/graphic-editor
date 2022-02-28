import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { EventType, EventListener } from '../../model';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';

@Component({
  selector: 'lib-widget-event-listener',
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
  }
}
