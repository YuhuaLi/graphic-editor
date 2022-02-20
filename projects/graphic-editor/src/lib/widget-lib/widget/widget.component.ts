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
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { CLICK_JUDGE_TIME } from '../../const';
import {
  Coordinate,
  Direction,
  OperationMode,
  Widget,
  WidgetData,
  WidgetStatus,
  WidgetStyle,
} from '../../model';
import { IWidgetContent } from '../../model/widget-content.interface';
import { BaseWidgetContent } from './base-widget-content';
import { WidgetService } from './widget.service';

@Component({
  selector: 'lib-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  providers: [WidgetService],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(TemplateRef, { read: ViewContainerRef })
  container!: ViewContainerRef;

  @Input() mode: OperationMode = OperationMode.Development;

  @Input() style!: WidgetStyle;
  @Input() widget!: Widget;
  @Input() zoom = 1;

  @Output() selectWidget = new EventEmitter<any>();

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
  /** offsetX和clientX偏差 */
  offsetX = 0;
  /** offsetY和clientY偏差 */
  offsetY = 0;

  timeoutId: any;
  DIRECTION = Direction;
  /** raf条件变量 */
  isTicking = false;
  rafId: number | null = null;

  onWidgetMove = (event: MouseEvent): void => {
    event.preventDefault();
    if (
      this.status === WidgetStatus.Select ||
      this.status === WidgetStatus.None
    ) {
      return;
    }
    if (!this.isTicking) {
      this.rafId = window.requestAnimationFrame(() => {
        if (this.status === WidgetStatus.Drag) {
          const x = Math.round(
            (event.clientX - this.tempMousePos.x) / this.zoom
          );
          const y = Math.round(
            (event.clientY - this.tempMousePos.y) / this.zoom
          );
          this.tempMousePos.x = event.clientX;
          this.tempMousePos.y = event.clientY;
          this.x = (this.x || 0) + x;
          this.y = (this.y || 0) + y;
        } else {
          const x = Math.round((event.clientX - this.offsetX) / this.zoom);
          const y = Math.round((event.clientY - this.offsetY) / this.zoom);
          this.resize(x, y);
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
      document.removeEventListener('mousemove', this.onWidgetMove);
      this.setStatus(WidgetStatus.Select);
    } else {
      // 缩放
      document.removeEventListener('mousemove', this.onWidgetMove);
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
    this.widgetSrv
      .onDataChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.widgetData = data;
      });
  }

  ngAfterViewInit(): void {
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
    if (this.widgetData) {
      component.instance.setWidgetData(this.widgetData);
    } else {
      this.widgetData = component.instance.widgetData;
    }
    const { x, y } =
      this.elementRef.nativeElement.firstElementChild.getBoundingClientRect();
    this.offsetX =
      x - this.elementRef.nativeElement.firstElementChild.offsetLeft;
    this.offsetY =
      y - this.elementRef.nativeElement.firstElementChild.offsetTop;
    this.cdr.detectChanges();
  }

  onMouseDown(event: MouseEvent): void {
    if (this.mode === OperationMode.Production) {
      return;
    }
    event.stopPropagation();
    this.tempMousePos = { x: event.clientX, y: event.clientY };
    this.setSelected(event.ctrlKey);
    this.timeoutId = setTimeout(() => {
      this.setStatus(WidgetStatus.Drag);
      this.renderer2.setStyle(document.body, 'cursor', 'move');
      this.renderer2.addClass(
        document.body.querySelector('lib-graphic-editor'),
        'operation'
      );
      document.addEventListener('mousemove', this.onWidgetMove);
    }, CLICK_JUDGE_TIME);
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
    document.addEventListener('mousemove', this.onWidgetMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  resize(x: number, y: number): void {
    this.resizeWidth(x);
    this.resizeHeight(y);

    // if (Math.abs(x) > Math.abs(y)) {
    //   y = Math.round(x / scale);
    // } else {
    //   x = Math.round(y * scale);
    // }
  }

  resizeWidth(x: number): void {
    switch (this.status) {
      case WidgetStatus.ResizeLeft:
      case WidgetStatus.ResizeTopLeft:
      case WidgetStatus.ResizeBottomLeft:
        // if (
        //   !this.width &&
        //   this.tempMousePos.x - this.offsetX >= this.x + this.width
        // ) {
        //   break;
        // }
        // if (x > this.width) {
        //   this.x += this.width;
        //   // this.tempMousePos.x = this.x;
        //   this.width = 0;
        // } else {
        //   this.x += +x;
        //   this.width = this.width - x;
        // }
        if (x > this.x + this.width) {
          this.x += this.width;
        } else {
          this.width = this.x + this.width - x;
          this.x = x;
        }
        break;
      case WidgetStatus.ResizeRight:
      case WidgetStatus.ResizeTopRight:
      case WidgetStatus.ResizeBottomRight:
        // if (!this.width && this.tempMousePos.x - this.offsetX <= this.x) {
        //   break;
        // }
        // if (x < -1 * this.width) {
        //   // this.tempMousePos.x = this.x;
        //   this.width = 0;
        // } else {
        //   this.width += x;
        // }
        if (x < this.x) {
          this.width = 0;
        } else {
          this.width = x - this.x;
        }
        break;
    }
  }

  resizeHeight(y: number): void {
    switch (this.status) {
      case WidgetStatus.ResizeTop:
      case WidgetStatus.ResizeTopLeft:
      case WidgetStatus.ResizeTopRight:
        // if (
        //   !this.height &&
        //   this.tempMousePos.y - this.offsetY >= this.y + this.height
        // ) {
        //   break;
        // }
        // if (y > this.height) {
        //   this.y += this.height;
        //   // this.tempMousePos.y = this.y;
        //   this.height = 0;
        // } else {
        //   this.y += y;
        //   this.height -= y;
        // }
        if (y > this.y + this.height) {
          this.y += this.height;
        } else {
          this.height = this.y + this.height - y;
          this.y = y;
        }
        break;
      case WidgetStatus.ResizeBottom:
      case WidgetStatus.ResizeBottomLeft:
      case WidgetStatus.ResizeBottomRight:
        // if (!this.height && this.tempMousePos.y - this.offsetY <= this.y) {
        //   break;
        // }
        // if (y < -1 * this.height) {
        //   // this.tempMousePos.y = this.y;
        //   this.height = 0;
        // } else {
        //   this.height += y;
        // }
        if (y < this.y) {
          this.height = 0;
        } else {
          this.height = y - this.y;
        }
        break;
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
