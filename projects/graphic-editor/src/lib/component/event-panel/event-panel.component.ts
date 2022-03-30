import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ACTION_TYPE_LIST,
  EVENT_TYPE_LIST,
  OPEN_PAGE_TYPE_LIST,
  OPEN_URL_TYPE_LIST,
} from '../../const';
import { ActionType, OpenPageType, OpenUrlType } from '../../enum';
import { EventListener, MenuItem } from '../../type';
import { WidgetLibService } from '../../widget-lib/widget-lib.service';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';

@Component({
  selector: 'ng-event-panel',
  templateUrl: './event-panel.component.html',
  styleUrls: ['./event-panel.component.scss'],
})
export class EventPanelComponent implements OnInit {
  @Input() ref!: ComponentRef<WidgetComponent>;
  @Input() listener!: EventListener;
  @Output() delete = new EventEmitter<EventListener>();

  eventTypeList = EVENT_TYPE_LIST;
  actionTypeList = ACTION_TYPE_LIST;
  openUrlTypeList = OPEN_URL_TYPE_LIST;
  openPageTypeList = OPEN_PAGE_TYPE_LIST;

  actionType = ActionType;
  openPageType = OpenPageType;
  linkWidgetList: { [key: string]: any }[] = [];

  pageList: MenuItem[] = [];

  constructor(private widgetLibSrv: WidgetLibService) {}

  ngOnInit(): void {
    this.getPageList();
    this.getLinkWidgetList();
  }

  getPageList(): void {
    this.pageList = this.ref.instance.pages
      .map((page) => ({
        name: page.name || `页面${page.id}`,
        value: page.id,
      }))
      .filter((item) => item.value !== this.ref.instance.page.id);
  }

  getLinkWidgetList(): void {
    this.linkWidgetList =
      this.ref.instance.widgets
        ?.filter((compRef) => compRef.instance.widget.type === 'link-area')
        .map((compRef) => ({
          name:
            compRef.instance.widgetData?.name || compRef.instance.widget.name,
          value: compRef.instance.widgetData?.id,
          instance: compRef.instance,
        })) || [];
  }

  linkWidgetHighlight(item: any): void {
    item.instance.setHighlight(true);
  }

  removeLinkWidgetHighlight(item: any): void {
    item.instance.setHighlight(false);
  }

  onLinkWidgetChange(id: any): void {
    this.ref.instance.widgets
      ?.find((compRef) => compRef.instance.widgetData?.id === id)
      ?.instance.setHighlight(false);
    this.emitChange();
  }

  onActionChange(action: ActionType): void {
    if (action === ActionType.JumpUrl) {
      this.listener.actionData.jumpTarget = OpenUrlType.NewWinow;
    }
    this.emitChange();
  }

  // onJumpUrlChange(event: Event): void {
  //   if (!this.listener.actionData) {
  //     this.listener.actionData = {};
  //   }
  //   this.listener.actionData.jumpUrl = (
  //     event.target as HTMLTextAreaElement
  //   ).value;
  //   this.emitChange();
  // }

  onJumTargetChange(event: OpenPageType): void {
    if (event === OpenPageType.CurrentPage) {
      this.listener.actionData.linkWidget = undefined;
    }
    this.emitChange();
  }

  deleteListener(): void {
    this.delete.emit(this.listener);
  }

  emitChange(): void {
    this.ref.instance.page._modified = true;
  }
}
