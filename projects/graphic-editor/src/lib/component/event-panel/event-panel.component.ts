import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ACTION_TYPE_LIST,
  EVENT_TYPE_LIST,
  OPEN_URL_TYPE_LIST,
} from '../../const';
import { ActionType } from '../../enum';
import { EventListener, OpenUrlType } from '../../type';

@Component({
  selector: 'lib-event-panel',
  templateUrl: './event-panel.component.html',
  styleUrls: ['./event-panel.component.scss'],
})
export class EventPanelComponent implements OnInit {
  @Input() listener!: EventListener;
  @Output() delete = new EventEmitter<EventListener>();

  eventTypeList = EVENT_TYPE_LIST;
  actionTypeList = ACTION_TYPE_LIST;
  openUrlTypeList = OPEN_URL_TYPE_LIST;

  actionType = ActionType;

  constructor() {}

  ngOnInit(): void {}

  onActionChange(action: ActionType): void {
    if (action === ActionType.JumpUrl) {
      this.listener.actionData.jumpTarget = OpenUrlType.NewWinow;
    }
  }

  onJumpUrlChange(event: Event): void {
    if (!this.listener.actionData) {
      this.listener.actionData = {};
    }
    this.listener.actionData.jumpUrl = (
      event.target as HTMLTextAreaElement
    ).value;
  }

  deleteListener(): void {
    this.delete.emit(this.listener);
  }
}
