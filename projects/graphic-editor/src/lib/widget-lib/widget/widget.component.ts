import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  RendererStyleFlags2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CLICK_JUDGE_TIME } from '../../const';
import {
  ActionType,
  DataType,
  Direction,
  OpenPageType,
  OpenUrlType,
  OperationMode,
  WidgetStatus,
} from '../../enum';
import { GraphicEditorService } from '../../graphic-editor.service';
import {
  Coordinate,
  DataSetting,
  Page,
  Widget,
  WidgetData,
  WidgetStyle,
} from '../../type';
import { BaseWidgetContent } from './base-widget-content';
import { LinkAreaWidgetData } from './widget-link-area/widget-link-area.component';
import { WidgetService } from './widget.service';

@Component({
  selector: 'lib-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  providers: [WidgetService],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild(TemplateRef, { read: ViewContainerRef })
  container!: ViewContainerRef;

  @Input() mode: OperationMode = OperationMode.Development;

  @Input() style!: WidgetStyle;
  @Input() widget!: Widget;
  @Input() zoom = 1;
  @Input() page!: Page;
  @Input() pages!: Page[];
  @Input() widgets!: ComponentRef<WidgetComponent>[];

  @Output() selectWidget = new EventEmitter<any>();
  @Output() initialized = new EventEmitter<any>();
  @Output() contextMenu = new EventEmitter<any>();

  widgetData?: WidgetData;
  contentComponentRef?: ComponentRef<BaseWidgetContent>;

  data?: any;

  apiTimeout: any;

  @HostBinding('style.z-index') get zIndex(): number {
    return this.isSelected || this.isRotating || this.isDragging
      ? 999
      : this.style?.index;
  }

  /** 部件是否选中 */
  get isSelected(): boolean {
    return this.status === WidgetStatus.Select;
  }

  get isRotating(): boolean {
    return this.status === WidgetStatus.Rotate;
  }

  get isDragging(): boolean {
    return this.status === WidgetStatus.Drag;
  }

  get x(): number {
    return this.style.left;
  }
  set x(val: number) {
    this.style.left = val;
  }

  get y(): number {
    return this.style.top;
  }
  set y(val: number) {
    this.style.top = val;
  }

  get width(): number {
    return this.style.width;
  }
  set width(val: number) {
    this.style.width = val;
  }

  get height(): number {
    return this.style.height;
  }
  set height(val: number) {
    this.style.height = val;
  }

  get rotate(): number {
    return this.style.rotate || 0;
  }

  set rotate(val: number) {
    this.style.rotate = +val.toFixed(1);
  }

  alive = true;
  /** 是否鼠标hover部件 */
  isHover = false;
  /** hover左侧元素菜单触发部件高亮显示 */
  isHighlight = false;
  /** 锁定 */
  isLocked = false;
  /** 隐藏 */
  isHidden = false;
  /** 锁定宽高比 */
  isLockedScale = false;
  /** 锁定宽高比时的比例 */
  lockedScale = 0;
  /** 当前部件状态 */
  status = WidgetStatus.None;
  /** 临时鼠标坐标位置，用于拖拽缩放 */
  tempMousePos: Coordinate = { x: 0, y: 0 };
  /** 中心位置 */
  tempOrigin: Coordinate = { x: 0, y: 0 };
  /** 判断点击或拖拽的setTimeout */
  timeoutId: any;
  DIRECTION = Direction;
  OPERATION_MODE = OperationMode;
  /** raf条件变量 */
  isTicking = false;
  rafId: number | null = null;

  contentRef?: ComponentRef<BaseWidgetContent>;

  onMouseMove = (event: MouseEvent): void => {
    event.preventDefault();
    if (
      this.status === WidgetStatus.Select ||
      this.status === WidgetStatus.None ||
      (event.clientX === this.tempMousePos.x &&
        event.clientY === this.tempMousePos.y)
    ) {
      return;
    }
    if (this.status === WidgetStatus.Rotate) {
      console.log(
        event.clientX,
        event.clientY,
        this.tempOrigin.x,
        this.tempOrigin.y
      );
      this.rotate =
        (Math.atan2(
          event.clientY - this.tempOrigin.y,
          event.clientX - this.tempOrigin.x
        ) *
          180) /
          Math.PI +
        90;
    } else {
      if (!this.isTicking) {
        this.rafId = window.requestAnimationFrame(() => {
          const dx = (event.clientX - this.tempMousePos.x) / this.zoom;
          const dy = (event.clientY - this.tempMousePos.y) / this.zoom;
          this.tempMousePos.x = event.clientX;
          this.tempMousePos.y = event.clientY;
          if (this.status === WidgetStatus.Drag) {
            this.x = Math.round((this.x || 0) + dx);
            this.y = Math.round((this.y || 0) + dy);
          } else {
            this.resize(dx, dy);
          }
          this.isTicking = false;
          // this.cdr.detectChanges();
        });
      }
      this.isTicking = true;
    }
  };

  onMouseUp = (event: MouseEvent): void => {
    event.preventDefault();
    if (
      this.status === WidgetStatus.Select ||
      this.status === WidgetStatus.None
    ) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    } else {
      document.removeEventListener('mousemove', this.onMouseMove);
      this.setStatus(WidgetStatus.Select);
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.isTicking = false;
    }
    this.timeoutId = null;
    this.renderer2.removeStyle(document.body, 'cursor');
    this.renderer2.removeClass(
      document.body.querySelector('lib-graphic-editor'),
      'operation'
    );
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  constructor(
    private resolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private widgetSrv: WidgetService,
    private httpClient: HttpClient,
    private graphicEditorSrv: GraphicEditorService
  ) {}

  ngOnInit(): void {
    // this.widgetSrv
    //   .onDataChange()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((data) => {
    //     this.widgetData = data;
    //   });
  }

  getData(): void {
    if (this.widgetData?.dataSetting?.length) {
      this.data = [];
      for (const setting of this.widgetData.dataSetting) {
        let data: any = { id: setting.id };
        if (setting.type === DataType.Api) {
          this.getApiData(setting);
        } else if (setting.type === DataType.Const && setting.const) {
          try {
            data.value = JSON.parse(setting.const);
          } catch {
            console.error(`${setting.name}解析错误`);
          }
        } else if (setting.type === DataType.PageData) {
          const pageData = this.page.data?.find(
            (item) => item.id === setting.parent
          );
          if (pageData) {
            data = new Proxy(pageData, {
              get: (target, prop) => {
                if (prop === 'value') {
                  return target[prop];
                } else if (prop === 'id') {
                  return setting.id;
                }
                return;
              },
            });
            pageData.emitter
              ?.pipe(takeWhile(() => this.alive))
              .subscribe(() => this.widgetSrv.changeData());
          }
        }
        this.data.push(data);
      }
      this.widgetSrv.changeData();
    }
  }

  getApiData(setting: DataSetting): void {
    if (this.apiTimeout) {
      clearTimeout(this.apiTimeout);
      this.apiTimeout = null;
    }
    if (setting.apiUrl) {
      this.httpClient
        .get(setting.apiUrl)
        .pipe(takeWhile(() => this.alive))
        .subscribe(
          (res) => {
            const data = this.data?.find((item: any) => item.id === setting.id);
            if (data) {
              data.value = res;
              this.widgetSrv.changeData();
            }
            if (setting.polling && setting.interval) {
              this.apiTimeout = setTimeout(
                () => this.getApiData(setting),
                setting.interval * 1000
              );
            }
          },
          () => {
            if (setting.polling && setting.interval) {
              this.apiTimeout = setTimeout(
                () => this.getApiData(setting),
                setting.interval * 1000
              );
            }
          }
        );
    }
  }

  ngAfterViewInit(): void {
    if (this.mode === OperationMode.Production) {
      this.getData();
    }
    this.contentComponentRef = this.createContentComponent();
    this.initializeEvents();
    this.initialized.emit({
      type: this.widget.type,
      style: this.style,
      widgetData: this.widgetData,
    });
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.mode.currentValue &&
      this.contentRef &&
      changes.contentRef.currentValue
    ) {
      this.contentRef.instance.mode = this.mode;
    }
    if (changes.style) {
      this.cdr.detectChanges();
    }
  }

  createContentComponent(): ComponentRef<BaseWidgetContent> {
    const factory = this.resolver.resolveComponentFactory(
      this.widget.component
    );
    const injector = Injector.create({
      providers: [{ provide: WidgetService, useValue: this.widgetSrv }],
    });
    const component = this.container.createComponent(
      factory,
      0,
      injector
    ) as ComponentRef<BaseWidgetContent>;
    component.instance.mode = this.mode;
    this.contentRef = component;
    if (this.widgetData) {
      component.instance.widgetData = this.widgetData;
    } else {
      component.instance.widgetData.id = new Date().getTime();
      this.widgetData = component.instance.widgetData;
    }
    component.instance.data = this.data;
    return component;
  }

  initializeEvents(): void {
    if (
      this.mode === OperationMode.Production &&
      this.widgetData?.events?.length
    ) {
      for (const listener of this.widgetData.events) {
        switch (listener.action) {
          case ActionType.JumpUrl:
            const url = listener.actionData?.jumpUrl.trimStart().trimEnd();
            if (url && /^(http|https):\/\//.test(url)) {
              fromEvent(
                this.elementRef.nativeElement.firstElementChild,
                listener.type as string
              )
                .pipe(takeWhile(() => this.alive))
                .subscribe((event) => {
                  if (
                    listener.actionData.jumpTarget === OpenUrlType.CurrentWindow
                  ) {
                    window.location.href = url;
                  } else {
                    window.open(url, '_blank');
                  }
                });
            }
            break;
          case ActionType.JumpPage:
            const pageId = listener.actionData.jumpPage;
            const linkWidgetId = listener.actionData.linkWidget;
            const target = listener.actionData.jumpTarget;
            if (target === OpenPageType.LinkArea) {
              const widgetRef = this.widgets.find(
                (compRef) => compRef.instance.widgetData?.id === linkWidgetId
              );
              if (widgetRef && pageId) {
                fromEvent(
                  this.elementRef.nativeElement.firstElementChild,
                  listener.type as string
                )
                  .pipe(takeWhile(() => this.alive))
                  .subscribe((event) => {
                    this.graphicEditorSrv
                      .getPageById(pageId)
                      .pipe(takeWhile(() => this.alive))
                      .subscribe((page) => {
                        const ref = this.widgets.find(
                          (item) =>
                            item.instance.widgetData?.id === linkWidgetId
                        );
                        if (ref) {
                          const widgetData =
                            ref.instance.contentComponentRef?.instance
                              .widgetData;
                          if (widgetData) {
                            (widgetData as LinkAreaWidgetData).page = page;
                            ref.instance.cdr.detectChanges();
                          }
                        }
                      });
                  });
              }
            }
            break;
        }
      }
    }
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenu.emit(event);
  }

  onMouseDown(event: MouseEvent): void {
    if (this.mode === OperationMode.Production) {
      return;
    }
    event.stopPropagation();
    this.tempMousePos = { x: event.clientX, y: event.clientY };
    this.setSelected(event.ctrlKey);
    this.renderer2.addClass(
      document.body.querySelector('lib-graphic-editor'),
      'operation'
    );
    if (!this.isLocked) {
      this.timeoutId = setTimeout(() => {
        this.setStatus(WidgetStatus.Drag);
        this.renderer2.setStyle(document.body, 'cursor', 'move');

        document.addEventListener('mousemove', this.onMouseMove);
      }, CLICK_JUDGE_TIME);
    }
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onRotateStart(event: MouseEvent): void {
    if (this.mode === OperationMode.Production) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (this.isLocked) {
      return;
    }
    // console.log(event.offsetX, event.offsetY);
    const x =
      event.clientX +
      (8 - event.offsetX) * Math.cos((this.rotate * Math.PI) / 180) -
      (22 + this.height / 2) * Math.sin((this.rotate * Math.PI) / 180);
    const y =
      event.clientY +
      (8 - event.offsetY) * Math.cos((this.rotate * Math.PI) / 180) +
      (22 + this.height / 2) * Math.cos((this.rotate * Math.PI) / 180);
    this.tempOrigin = { x, y };
    this.tempMousePos = { x: event.clientX, y: event.clientY };

    this.status = WidgetStatus.Rotate;
    this.renderer2.addClass(
      document.body.querySelector('lib-graphic-editor'),
      'operation'
    );
    this.renderer2.setStyle(
      document.body,
      'cursor',
      'grabbing',
      RendererStyleFlags2.Important
    );
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onResizeStart(event: MouseEvent, direction: Direction): void {
    if (this.mode === OperationMode.Production) {
      return;
    }
    event.stopPropagation();
    if (this.isLocked) {
      return;
    }

    this.tempMousePos = { x: event.clientX, y: event.clientY };
    this.setSelected(false); // 清除其他选中
    this.renderer2.addClass(
      document.body.querySelector('lib-graphic-editor'),
      'operation'
    );
    switch (direction) {
      case Direction.Top:
        this.status = WidgetStatus.ResizeTop;
        this.renderer2.setStyle(document.body, 'cursor', 'n-resize');
        break;
      case Direction.Right:
        this.status = WidgetStatus.ResizeRight;
        this.renderer2.setStyle(document.body, 'cursor', 'e-resize');
        break;
      case Direction.Bottom:
        this.status = WidgetStatus.ResizeBottom;
        this.renderer2.setStyle(document.body, 'cursor', 's-resize');
        break;
      case Direction.Left:
        this.status = WidgetStatus.ResizeLeft;
        this.renderer2.setStyle(document.body, 'cursor', 'w-resize');
        break;
      case Direction.TopLeft:
        this.status = WidgetStatus.ResizeTopLeft;
        this.renderer2.setStyle(document.body, 'cursor', 'nw-resize');
        break;
      case Direction.TopRight:
        this.status = WidgetStatus.ResizeTopRight;
        this.renderer2.setStyle(document.body, 'cursor', 'ne-resize');
        break;
      case Direction.BottomLeft:
        this.status = WidgetStatus.ResizeBottomLeft;
        this.renderer2.setStyle(document.body, 'cursor', 'sw-resize');
        break;
      case Direction.BottomRight:
        this.status = WidgetStatus.ResizeBottomRight;
        this.renderer2.setStyle(document.body, 'cursor', 'se-resize');
        break;
    }
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  resize(dx: number, dy: number): void {
    if (!this.isLockedScale) {
      this.resizeWidth(dx);
      this.resizeHeight(dy);
    } else {
      this.resizeWithScale(dx, dy, this.lockedScale);
    }
  }

  resizeWidth(x: number): void {
    const dx = Math.round(x);
    switch (this.status) {
      case WidgetStatus.ResizeLeft:
      case WidgetStatus.ResizeTopLeft:
      case WidgetStatus.ResizeBottomLeft:
        if (dx < this.width) {
          this.x += dx;
          this.width -= dx;
        } else {
          this.x += this.width;
          this.tempMousePos.x -= (dx - this.width) * this.zoom;
          this.width = 0;
        }
        break;
      case WidgetStatus.ResizeRight:
      case WidgetStatus.ResizeTopRight:
      case WidgetStatus.ResizeBottomRight:
        if (dx > -1 * this.width) {
          this.width += dx;
        } else {
          this.tempMousePos.x -= (this.width + dx) * this.zoom;
          this.width = 0;
        }
        break;
    }
  }

  resizeHeight(y: number): void {
    const dy = Math.round(y);
    switch (this.status) {
      case WidgetStatus.ResizeTop:
      case WidgetStatus.ResizeTopLeft:
      case WidgetStatus.ResizeTopRight:
        if (dy < this.height) {
          this.y += dy;
          this.height -= dy;
        } else {
          this.y += this.height;
          this.tempMousePos.y -= (dy - this.height) * this.zoom;
          this.height = 0;
        }
        break;
      case WidgetStatus.ResizeBottom:
      case WidgetStatus.ResizeBottomLeft:
      case WidgetStatus.ResizeBottomRight:
        if (dy > -1 * this.height) {
          this.height += dy;
        } else {
          this.tempMousePos.y -= (this.height + dy) * this.zoom;
          this.height = 0;
        }
        break;
    }
  }

  resizeWithScale(x: number, y: number, scale: number): void {
    const dx = Math.round(x);
    const dy = Math.round(y);
    switch (this.status) {
      case WidgetStatus.ResizeBottomLeft: {
        if (y < -1 * this.height) {
          this.tempMousePos.y -= (y + this.height) * this.zoom;
        }
        this.height = Math.max(this.height + dy, 0);

        // this.y = y - this.height;
        const nx = this.x + this.width - Math.round(this.height * scale);
        this.width = Math.max(this.x + this.width - nx, 0);
        this.x = nx;
        break;
      }
      case WidgetStatus.ResizeBottomRight: {
        if (y < -1 * this.height) {
          this.tempMousePos.y -= (y + this.height) * this.zoom;
        }
        this.height = Math.max(this.height + dy, 0);
        this.width = Math.round(this.height * scale);
        break;
      }
      case WidgetStatus.ResizeTopLeft: {
        if (y > this.height) {
          this.tempMousePos.y += (this.height - y) * this.zoom;
        }
        const bottom = this.y + this.height;
        this.height = Math.max(bottom - this.y - dy, 0);
        this.y = Math.min(this.y + dy, bottom);
        const nx = this.x + this.width - Math.round(this.height * scale);
        this.width = Math.max(this.x + this.width - nx, 0);
        this.x = nx;
        break;
      }
      case WidgetStatus.ResizeTopRight: {
        if (y > this.height) {
          this.tempMousePos.y += (this.height - y) * this.zoom;
        }
        const bottom = this.y + this.height;
        this.height = Math.max(bottom - this.y - dy, 0);
        this.y = Math.min(this.y + dy, bottom);
        this.width = Math.round(this.height * scale);
        break;
      }
      case WidgetStatus.ResizeTop: {
        if (y > this.height) {
          this.tempMousePos.y += (this.height - y) * this.zoom;
        }
        const bottom = this.y + this.height;
        this.height = Math.max(this.height - dy, 0);
        this.y = Math.min(bottom, this.y + dy);
        const nw = Math.round(this.height * scale);
        this.x += (this.width - nw) / 2;
        this.width = nw;
        break;
      }
      case WidgetStatus.ResizeBottom: {
        if (y < -1 * this.height) {
          this.tempMousePos.y -= (y + this.height) * this.zoom;
        }
        this.height = Math.max(this.height + dy, 0);
        const nw = Math.round(this.height * scale);
        this.x += (this.width - nw) / 2;
        this.width = nw;
        break;
      }
      case WidgetStatus.ResizeLeft: {
        if (x > this.width) {
          this.tempMousePos.x += (this.width - x) * this.zoom;
        }
        const right = this.x + this.width;
        this.width = Math.max(this.width - dx, 0);
        this.x = Math.min(this.x + dx, right);
        const nh = Math.round(this.width / scale);
        this.y += (this.height - nh) / 2;
        this.height = nh;
        break;
      }
      case WidgetStatus.ResizeRight: {
        if (x < -1 * this.width) {
          this.tempMousePos.x -= (x + this.width) * this.zoom;
        }
        this.width = Math.max(this.width + dx, 0);
        const nh = Math.round(this.width / scale);
        this.y += (this.height - nh) / 2;
        this.height = nh;
        break;
      }
    }
  }

  resetStatus(): void {
    this.status = this.status = WidgetStatus.None;
    this.widgetSrv.changeStatus(this.status);
    // this.cdr.detectChanges();
  }

  setStatus(status: WidgetStatus): void {
    this.status = status;
    this.widgetSrv.changeStatus(this.status);
    // this.cdr.detectChanges();
  }

  setSelected(multi: boolean = false): void {
    this.setStatus(WidgetStatus.Select);
    this.selectWidget.emit({ multi });
  }

  toggleLocked(): void {
    this.isLocked = !this.isLocked;
    // this.cdr.detectChanges();
  }

  toggleHidden(): void {
    if (!this.isLocked) {
      this.isHidden = !this.isHidden;
      // this.cdr.detectChanges();
    }
  }

  toggleLockedScale(): void {
    if (!this.isLockedScale && (!this.width || !this.height)) {
      return;
    }
    this.isLockedScale = !this.isLockedScale;
    if (this.isLockedScale) {
      this.lockedScale = this.width / this.height;
    }
  }

  setHighlight(highlight: boolean): void {
    this.isHighlight = highlight;
    // this.cdr.detectChanges();
  }

  setZoom(zoom: number): void {
    this.zoom = zoom;
  }

  setZIndex(index: number): void {
    this.style.index = index;
  }

  ngOnDestroy(): void {
    this.alive = false;
    this.container.clear();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.apiTimeout) {
      clearTimeout(this.apiTimeout);
      this.apiTimeout = null;
    }
  }
}
