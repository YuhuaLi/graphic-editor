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
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CLICK_JUDGE_TIME } from '../../const';
import { ActionType, Direction, OperationMode, WidgetStatus } from '../../enum';
import {
  Coordinate,
  OpenUrlType,
  Widget,
  WidgetData,
  WidgetStyle,
} from '../../type';
import { BaseWidgetContent } from './base-widget-content';
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

  @Output() selectWidget = new EventEmitter<any>();
  @Output() initialized = new EventEmitter<any>();

  widgetData?: WidgetData;

  @HostBinding('style.z-index') get zIndex(): number {
    return this.isSelected ? 999 : this.style?.index;
  }

  /** 部件是否选中 */
  get isSelected(): boolean {
    return this.status === WidgetStatus.Select;
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
      this.status === WidgetStatus.None
    ) {
      return;
    }
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
    } else if (this.status === WidgetStatus.Drag) {
      document.removeEventListener('mousemove', this.onMouseMove);
      this.setStatus(WidgetStatus.Select);
    } else {
      // 缩放
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
    private widgetSrv: WidgetService
  ) {}

  ngOnInit(): void {
    // this.widgetSrv
    //   .onDataChange()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((data) => {
    //     this.widgetData = data;
    //   });
  }

  ngAfterViewInit(): void {
    this.createContentComponent();
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

  createContentComponent(): void {
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
      component.instance.setWidgetData(this.widgetData);
    } else {
      this.widgetData = component.instance.widgetData;
    }
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
        }
      }
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (this.mode === OperationMode.Production) {
      return;
    }
    event.stopPropagation();
    this.tempMousePos = { x: event.clientX, y: event.clientY };
    this.setSelected(event.ctrlKey);
    if (!this.isLocked) {
      this.timeoutId = setTimeout(() => {
        this.setStatus(WidgetStatus.Drag);
        this.renderer2.setStyle(document.body, 'cursor', 'move');
        this.renderer2.addClass(
          document.body.querySelector('lib-graphic-editor'),
          'operation'
        );
        document.addEventListener('mousemove', this.onMouseMove);
      }, CLICK_JUDGE_TIME);
    }
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
    this.selectWidget.emit(event); // 清除其他选中
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

  ngOnDestroy(): void {
    this.alive = false;
    this.container.clear();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
