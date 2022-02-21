import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { WidgetLibComponent } from './widget-lib/widget-lib.component';
import {
  OperationMode,
  NavButton,
  Page,
  KeyboardCode,
  Coordinate,
} from './model';
import { WidgetLibService } from './widget-lib/widget-lib.service';
import { WidgetComponent } from './widget-lib/widget/widget.component';
import { takeWhile } from 'rxjs/operators';
import { ZOOM_RANGE } from './const';

@Component({
  selector: 'lib-graphic-editor',
  templateUrl: 'graphic-editor.component.html',
  styleUrls: [`./graphic-editor.component.scss`],
})
export class GraphicEditorComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() mode: OperationMode = OperationMode.Development;

  @ViewChild('toolContainer', { read: ViewContainerRef, static: false })
  toolContainer!: ViewContainerRef;
  @ViewChild('compAreaContainer', { read: ViewContainerRef, static: false })
  compAreaContainer!: ViewContainerRef;
  @ViewChild('sectionArea', { read: ElementRef, static: true })
  selectionArea!: ElementRef;
  @ViewChild('compArea', { static: true }) compArea!: ElementRef;

  alive = true;

  compAreaClientBoundingRect: any;
  zoom = 1;
  scrollLeft = 0;
  scrollTop = 0;
  toolBtns: NavButton[] = [
    {
      type: 'widget-library',
      name: '组件库',
      icon: 'icon-sucaiku',
      component: WidgetLibComponent,
      isActive: true,
    },
  ];
  /** 选中的部件 */
  selectedWidgets: ComponentRef<WidgetComponent>[] = [];
  /** 已创建的部件实例 */
  widgets: ComponentRef<WidgetComponent>[] = [];
  /** 选中的页面 */
  selectedPages: Page[] = [];
  /** 已有的页面 */
  pages: Page[] = [];
  /** 当前页面 */
  get currentPage(): Page {
    return this.selectedPages[0];
  }

  isMouseDown = false;
  tempMousePos: Coordinate = { x: 0, y: 0 };
  selectionCtx!: CanvasRenderingContext2D;
  dpr = window.devicePixelRatio || 1;

  isTicking = false;

  onKeydown = (event: KeyboardEvent): void => {
    switch (event.code) {
      case KeyboardCode.Delete:
        this.deleteWidget(...this.selectedWidgets);
        break;
      case KeyboardCode.ArrowLeft:
        event.preventDefault();
        this.selectedWidgets.forEach((ref) => {
          ref.instance.style.left -= 1;
        });
        break;
      case KeyboardCode.ArrowUp:
        event.preventDefault();
        this.selectedWidgets.forEach((ref) => {
          ref.instance.style.top -= 1;
        });
        break;
      case KeyboardCode.ArrowRight:
        event.preventDefault();
        this.selectedWidgets.forEach((ref) => {
          ref.instance.style.left += 1;
        });
        break;
      case KeyboardCode.ArrowDown:
        event.preventDefault();
        this.selectedWidgets.forEach((ref) => {
          ref.instance.style.top += 1;
        });
        break;
      case KeyboardCode.NumpadAdd:
      case KeyboardCode.Equal:
        if (event.ctrlKey && !event.shiftKey && !event.altKey) {
          this.zoomIn();
        }
        break;
      case KeyboardCode.NumpadSubtract:
      case KeyboardCode.Minus:
        if (event.ctrlKey && !event.shiftKey && !event.altKey) {
          this.zoomOut();
        }
        break;
    }
  };

  onMouseUp = (event: MouseEvent): void => {
    this.isMouseDown = false;
    this.clearSelectionArea();
    let offsetX = event.offsetX;
    let offsetY = event.offsetY;
    if (event.target !== this.compArea.nativeElement) {
      const { left, top } = this.compAreaClientBoundingRect;
      offsetX = event.clientX - left + this.scrollLeft;
      offsetY = event.clientY - top + this.scrollTop;
    }
    const x = offsetX > this.tempMousePos.x ? this.tempMousePos.x : offsetX;
    const y = offsetY > this.tempMousePos.y ? this.tempMousePos.y : offsetY;
    const width = Math.abs(offsetX - this.tempMousePos.x);
    const height = Math.abs(offsetY - this.tempMousePos.y);
    for (const widget of this.widgets) {
      if (this.isWidgetInRect(widget.instance, x, y, width, height)) {
        widget.instance.setSelected(true);
      }
    }
    this.renderer2.removeClass(this.ref.nativeElement, 'operation');
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  onMouseMove = (event: MouseEvent): void => {
    if (this.isMouseDown && !this.isTicking) {
      let x = event.offsetX;
      let y = event.offsetY;
      if (event.target !== this.compArea.nativeElement) {
        const { left, top } = this.compAreaClientBoundingRect;
        x = event.clientX - left + this.scrollLeft;
        y = event.clientY - top + this.scrollTop;
      }
      requestAnimationFrame(() => {
        if (this.isMouseDown) {
          this.drawSelectionArea(
            this.tempMousePos.x * this.zoom,
            this.tempMousePos.y * this.zoom,
            (x - this.tempMousePos.x) * this.zoom,
            (y - this.tempMousePos.y) * this.zoom
          );
        }
        this.isTicking = false;
      });
      this.isTicking = true;
    }
  };

  constructor(
    private cfr: ComponentFactoryResolver,
    private widgetLibSrv: WidgetLibService,
    private ref: ElementRef,
    private renderer2: Renderer2
  ) {
    const page = {
      style: { width: 1920, height: 1080 },
      widgets: [],
    };
    this.pages.push(page);
    this.selectedPages.unshift(page);
  }

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeydown);
  }

  ngAfterViewInit(): void {
    this.createComponent(this.toolBtns[0].component);
    this.compAreaClientBoundingRect =
      this.compArea.nativeElement.getBoundingClientRect();
    this.initSelectionArea();
  }

  initSelectionArea(): void {
    this.selectionArea.nativeElement.width =
      this.selectionArea.nativeElement.offsetWidth * this.zoom * this.dpr;
    this.selectionArea.nativeElement.height =
      this.selectionArea.nativeElement.offsetHeight * this.zoom * this.dpr;
    this.selectionCtx = this.selectionArea.nativeElement.getContext('2d');
    this.selectionCtx.fillStyle = '#1684fc4d';
    this.selectionCtx.strokeStyle = '#1684fc';
    this.selectionCtx.scale(this.dpr, this.dpr);
  }

  drawSelectionArea(x: number, y: number, width: number, height: number): void {
    this.clearSelectionArea();
    const [dx, dy, dw, dh] = [
      Math.round(x),
      Math.round(y),
      Math.round(width),
      Math.round(height),
    ];
    this.selectionCtx.fillRect(dx + 0.5, dy + 0.5, dw, dh);
    this.selectionCtx.strokeRect(dx + 0.5, dy + 0.5, dw, dh);
  }

  clearSelectionArea(): void {
    this.selectionCtx.clearRect(
      0,
      0,
      this.selectionArea.nativeElement.width,
      this.selectionArea.nativeElement.height
    );
  }

  onViewportScroll(event: Event): void {
    this.scrollLeft = (event.target as HTMLElement).scrollLeft;
    this.scrollTop = (event.target as HTMLElement).scrollTop;
  }

  onWheel(event: WheelEvent): void | boolean {
    if (event.ctrlKey) {
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
      return false;
    }
  }

  onToolBtnClick(event: NavButton): void {
    this.toolContainer.clear();
    if (event.isActive) {
      event.isActive = false;
      return;
    }
    this.toolBtns.forEach((btn) => (btn.isActive = false));
    event.isActive = true;
    if (event.component) {
      this.createComponent(event.component);
    }
  }

  createComponent(component: any): void {
    const componentFactory = this.cfr.resolveComponentFactory(component);
    const componentRef = this.toolContainer.createComponent(componentFactory);
    componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * 拖放新控件
   */
  onCompAreaDrop(event: DragEvent): void {
    event.preventDefault();
    const widgetType = event.dataTransfer?.getData('widgetType');
    if (widgetType) {
      const widget = this.widgetLibSrv.getWidgetByType(widgetType);
      if (widget) {
        const factory = this.cfr.resolveComponentFactory(WidgetComponent);
        const comp = this.compAreaContainer.createComponent(factory);
        const width = widget.width || 100;
        const height = widget.height || 100;
        const left = event.offsetX - width / 2;
        const top = event.offsetY - height / 2;
        const index = this.widgets.length + 1;
        comp.instance.widget = widget;
        comp.instance.style = { left, top, width, height, index };
        comp.instance.mode = this.mode;
        comp.instance.selectWidget
          .pipe(takeWhile(() => this.alive))
          .subscribe(({ multi }) => {
            if (multi && !this.selectedWidgets.includes(comp)) {
              this.selectedWidgets.push(comp);
            } else {
              this.selectedWidgets.forEach((item) => {
                if (item !== comp) {
                  item.instance.resetStatus();
                }
              });
              this.selectedWidgets.splice(0, this.selectedWidgets.length, comp);
            }
          });
        comp.instance.setSelected();
        comp.instance.setZoom(this.zoom);
        this.widgets.unshift(comp);
      }
    }
  }

  selectWidget(event: MouseEvent, ref: ComponentRef<WidgetComponent>): void {
    ref.instance.setSelected(event.ctrlKey);
  }

  deleteWidget(...refs: ComponentRef<WidgetComponent>[]): void {
    refs.forEach((ref) => {
      let index = this.selectedWidgets.findIndex((item) => item === ref);
      this.selectedWidgets.splice(index, 1);
      ref.destroy();
      index = this.widgets.findIndex((item) => item === ref);
      this.widgets.splice(index, 1);
    });
  }

  togleWidgetLocked(
    event: MouseEvent,
    ref: ComponentRef<WidgetComponent>
  ): void {
    ref.instance.toggleLocked();
  }

  toggleWidgetHidden(
    event: MouseEvent,
    ref: ComponentRef<WidgetComponent>
  ): void {
    ref.instance.toggleHidden();
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.isMouseDown = true;
    this.tempMousePos.x = event.offsetX;
    this.tempMousePos.y = event.offsetY;

    this.selectedWidgets.forEach((item) => item.instance.resetStatus());
    this.selectedWidgets.splice(0);
    this.renderer2.addClass(this.ref.nativeElement, 'operation');
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  zoomPage(event: number): void {
    this.zoom = event;
    this.widgets.forEach((widget) => widget.instance.setZoom(this.zoom));
    this.initSelectionArea();
  }

  zoomIn(): void {
    if (this.zoom >= ZOOM_RANGE[ZOOM_RANGE.length - 1]) {
      return;
    }
    for (const item of ZOOM_RANGE) {
      if (this.zoom < item) {
        this.zoom = item;
        break;
      }
    }
  }

  zoomOut(): void {
    if (this.zoom <= ZOOM_RANGE[0]) {
      return;
    }
    for (let i = ZOOM_RANGE.length - 1; i >= 0; i--) {
      const item = ZOOM_RANGE[i];
      if (this.zoom > item) {
        this.zoom = item;
        break;
      }
    }
  }

  // 通过两矩形中心距离判断是否相交
  isWidgetInRect(
    widget: WidgetComponent,
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    return (
      Math.abs(widget.x + widget.width / 2 - x - width / 2) <=
        widget.width / 2 + width / 2 &&
      Math.abs(widget.y + widget.height / 2 - y - height / 2) <=
        widget.height / 2 + height / 2
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.initSelectionArea();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
