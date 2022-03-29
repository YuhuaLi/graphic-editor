import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { WidgetComponent } from '../widget-lib/widget/widget.component';

@Component({
  selector: 'ng-widget-list',
  templateUrl: './widget-list.component.html',
  styleUrls: ['./widget-list.component.scss'],
})
export class WidgetListComponent implements OnInit {
  @Input() widgets: ComponentRef<WidgetComponent>[] = [];
  @Output() contextMenu = new EventEmitter<{
    x: number;
    y: number;
    widget: ComponentRef<WidgetComponent>;
  }>();
  @Output() selectWidget = new EventEmitter<{
    multi: boolean;
    widget: ComponentRef<WidgetComponent>;
  }>();
  @Output() deleteWidget = new EventEmitter<ComponentRef<WidgetComponent>>();

  constructor() {}

  ngOnInit(): void {}

  onWidgetContextMenu(
    event: MouseEvent,
    widget: ComponentRef<WidgetComponent>
  ): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenu.emit({ x: event.clientX, y: event.clientY, widget });
  }

  togleWidgetLocked(ref: ComponentRef<WidgetComponent>): void {
    ref.instance.toggleLocked();
  }

  toggleWidgetHidden(ref: ComponentRef<WidgetComponent>): void {
    ref.instance.toggleHidden();
  }

  onWidgetDelete(widget: ComponentRef<WidgetComponent>): void {
    this.deleteWidget.emit(widget);
  }

  onWidgetSelect(
    event: MouseEvent,
    widget: ComponentRef<WidgetComponent>
  ): void {
    this.selectWidget.emit({ multi: event.ctrlKey, widget });
  }
}
