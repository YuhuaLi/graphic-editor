import { WidgetStyle } from './type/widget-style.type';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { WidgetLibComponent } from './widget-lib/widget-lib.component';
import {
  NavButton,
  Page,
  Coordinate,
  MenuItem,
  Widget,
  WidgetData,
} from './type';
import { WidgetLibService } from './widget-lib/widget-lib.service';
import { WidgetComponent } from './widget-lib/widget/widget.component';
import { takeWhile } from 'rxjs/operators';
import { WIDGET_MENU, ZOOM_RANGE } from './const';
import { KeyboardCode, MenuOperation, OperationMode } from './enum';
import { MenuComponent } from './component/menu/menu.component';
import { fromEvent } from 'rxjs';
import { GraphicEditorService } from './graphic-editor.service';

@Component({
  selector: 'lib-graphic-editor',
  templateUrl: 'graphic-editor.component.html',
  styleUrls: [`./graphic-editor.component.scss`],
})
export class GraphicEditorComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() mode: OperationMode = OperationMode.Development;
  @Output() save = new EventEmitter<Page[]>();

  @ViewChild('toolContainer', { read: ViewContainerRef, static: false })
  toolContainer!: ViewContainerRef;
  @ViewChild('compAreaContainer', { read: ViewContainerRef, static: false })
  compAreaContainer!: ViewContainerRef;
  @ViewChild('sectionArea', { read: ElementRef, static: true })
  selectionArea?: ElementRef;
  @ViewChild('compArea', { static: true }) compArea!: ElementRef;
  @ViewChild('menu') menu!: MenuComponent;

  alive = true;

  OPERATION_MODE = OperationMode;
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
  // /** 已有的页面 */
  pages: Page[] = [];
  /** 当前页面 */
  get currentPage(): Page {
    return this.pages.find((page) => !!page.selected) || this.pages[0];
  }
  /** 鼠标点击标志，用于绘制选中区域 */
  isMouseDown = false;
  /** resize左侧边栏标志 */
  isResizeStart = false;
  /** 左侧边栏宽度 */
  leftWidth = 210;
  tempMousePos: Coordinate = { x: 0, y: 0 };
  selectionCtx!: CanvasRenderingContext2D;
  dpr = window.devicePixelRatio || 1;

  isTicking = false;

  onKeydown = (event: KeyboardEvent): void => {
    if (event.target !== document.body) {
      return;
    }
    switch (event.code) {
      case KeyboardCode.Delete:
        this.deleteWidget(...this.selectedWidgets);
        break;
      case KeyboardCode.ArrowLeft:
        event.preventDefault();
        this.selectedWidgets.forEach((ref) => {
          if (!ref.instance.isLocked) {
            ref.instance.style.left -= 1;
          }
        });
        break;
      case KeyboardCode.ArrowUp:
        event.preventDefault();
        this.selectedWidgets.forEach((ref) => {
          if (!ref.instance.isLocked) {
            ref.instance.style.top -= 1;
          }
        });
        break;
      case KeyboardCode.ArrowRight:
        event.preventDefault();
        this.selectedWidgets.forEach((ref) => {
          if (!ref.instance.isLocked) {
            ref.instance.style.left += 1;
          }
        });
        break;
      case KeyboardCode.ArrowDown:
        event.preventDefault();
        this.selectedWidgets.forEach((ref) => {
          if (!ref.instance.isLocked) {
            ref.instance.style.top += 1;
          }
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

  onSelectRangMouseUp = (event: MouseEvent): void => {
    if (this.isMouseDown) {
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
        if (
          this.isWidgetInRect(widget.instance, x, y, width, height) &&
          !widget.instance.isHidden
        ) {
          widget.instance.setSelected(true);
        }
      }
      this.renderer2.removeClass(this.ref.nativeElement, 'operation');
      document.removeEventListener('mousemove', this.onSelectRangMouseUp);
      document.removeEventListener('mouseup', this.onSelectRangMouseUp);
    }
  };

  onResizeMouseUp = (event: MouseEvent): void => {
    if (this.isResizeStart) {
      this.leftWidth += event.pageX - this.tempMousePos.x;
      this.isResizeStart = false;
      document.removeEventListener('mousemove', this.onResizeMouseMove);
      document.removeEventListener('mouseup', this.onResizeMouseUp);
    }
  };

  onSelectRangMouseMove = (event: MouseEvent): void => {
    if (this.isMouseDown && !this.isTicking) {
      let x = event.offsetX;
      let y = event.offsetY;
      if (event.target !== this.compArea.nativeElement) {
        const { left, top } = this.compAreaClientBoundingRect;
        x = (event.clientX - left + this.scrollLeft) / this.zoom;
        y = (event.clientY - top + this.scrollTop) / this.zoom;
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

  onResizeMouseMove = (event: MouseEvent): void => {
    if (this.isResizeStart) {
      this.leftWidth += event.pageX - this.tempMousePos.x;
      this.tempMousePos.x = event.pageX;
      this.tempMousePos.y = event.pageY;
    }
  };

  constructor(
    private cfr: ComponentFactoryResolver,
    private widgetLibSrv: WidgetLibService,
    private ref: ElementRef,
    private renderer2: Renderer2,
    private graphicEditorSrv: GraphicEditorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.pages = [
    //   {
    //     id: 1,
    //     style: { width: 1920, height: 1080, backgroundColor: '#ffffff' },
    //     widgets: [],
    //   },
    // ];
    this.graphicEditorSrv
      .getAllPages()
      .toPromise()
      .then((pages) => {
        if (!pages.length) {
          return this.addPage();
        } else {
          this.pages = pages;
        }
        return this.pages;
      })
      .then((pages) => {
        pages[0].selected = true;
        this.selectPage(this.pages[0]);
        this.initSelectionArea();
        this.cdr.detectChanges();
      });
    document.addEventListener('keydown', this.onKeydown);
  }

  ngAfterViewInit(): void {
    this.createComponent(this.toolBtns[0].component);
    this.compAreaClientBoundingRect =
      this.compArea.nativeElement.getBoundingClientRect();

    // this.initSelectionArea();
    fromEvent(this.ref.nativeElement, 'contextmenu')
      .pipe(takeWhile(() => this.alive))
      .subscribe((event: any) => {
        event.preventDefault();
        event.stopPropagation();
        document.getSelection()?.removeAllRanges();
      });
  }

  addPage(): Promise<Page[]> {
    // const page = {
    //   style: { width: 1920, height: 1080, backgroundColor: '#ffffff' },
    //   widgets: [],
    // };
    // this.pages.push(page);
    return this.graphicEditorSrv
      .addPage()
      .toPromise()
      .then((page) => {
        this.pages.push(page);
        return this.pages;
      });
  }

  deletePage(page: Page): void {
    this.graphicEditorSrv.deletePage(page).subscribe(() => {
      const index = this.pages.findIndex((p) => p === page);
      if (index > -1) {
        this.pages.splice(index, 1);
      }
      if (page.selected) {
        this.pages[0].selected = true;
        this.selectPage(this.pages[0]);
      }
    });
  }

  selectPage(page: Page): void {
    if (this.currentPage) {
      this.currentPage.selected = false;
    }
    page.selected = true;
    this.renderPage(page);
  }

  renderPage(page: Page): void {
    this.widgets = [];
    this.compAreaContainer.clear();
    for (const widgetItem of this.currentPage.widgets || []) {
      const type = widgetItem.type;
      const widget = this.widgetLibSrv.getWidgetByType(type);
      if (widget) {
        const comp = this.createWidget(
          widget,
          widgetItem.style,
          widgetItem.widgetData
        );
        this.widgets.unshift(comp);
      }
    }
  }

  initSelectionArea(): void {
    if (this.selectionArea && this.currentPage) {
      this.selectionArea.nativeElement.width =
        this.currentPage.style.width * this.zoom * this.dpr;
      this.selectionArea.nativeElement.height =
        this.currentPage.style.height * this.zoom * this.dpr;
      this.selectionCtx = this.selectionArea.nativeElement.getContext('2d');
      this.selectionCtx.fillStyle = '#1684fc4d';
      this.selectionCtx.strokeStyle = '#1684fc';
      this.selectionCtx.scale(this.dpr, this.dpr);
    }
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
    if (this.selectionArea) {
      this.selectionCtx.clearRect(
        0,
        0,
        this.selectionArea.nativeElement.width,
        this.selectionArea.nativeElement.height
      );
    }
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

  onResizeLeftSideStart(event: MouseEvent): void {
    this.tempMousePos = { x: event.pageX, y: event.pageY };
    event.preventDefault();
    event.stopPropagation();
    this.isResizeStart = true;
    document.addEventListener('mouseup', this.onResizeMouseUp);
    document.addEventListener('mousemove', this.onResizeMouseMove);
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
        const width = widget.width || 100;
        const height = widget.height || 100;
        const left = event.offsetX - width / 2;
        const top = event.offsetY - height / 2;
        const rotate = 0;
        const index = this.widgets.length + 1;
        const comp = this.createWidget(widget, {
          left,
          top,
          width,
          height,
          rotate,
          index,
        });
        comp.instance.initialized
          .pipe(takeWhile(() => this.alive))
          .subscribe(({ type, style, widgetData }) => {
            if (!this.currentPage?.widgets) {
              this.currentPage.widgets = [];
            }
            this.currentPage.widgets.unshift({
              type,
              style,
              widgetData,
            });
          });
        comp.instance.setSelected();
        this.widgets.unshift(comp);
      }
    }
  }

  createWidget(
    widget: Widget,
    widgetStyle: WidgetStyle,
    widgetData?: WidgetData
  ): ComponentRef<WidgetComponent> {
    const factory = this.cfr.resolveComponentFactory(WidgetComponent);
    const comp = this.compAreaContainer.createComponent(factory);
    comp.instance.widget = widget;
    comp.instance.style = widgetStyle;
    comp.instance.page = this.currentPage;
    if (widgetData) {
      comp.instance.widgetData = widgetData;
    }
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

    comp.instance.contextMenu
      .pipe(takeWhile(() => this.alive))
      .subscribe((ev: MouseEvent) => {
        this.onWidgetContextMenu({
          x: ev.clientX,
          y: ev.clientY,
          widget: comp,
        });
      });
    comp.instance.setZoom(this.zoom);

    return comp;
  }

  onWidgetContextMenu(event: {
    x: number;
    y: number;
    widget: ComponentRef<WidgetComponent>;
  }): void {
    event.widget.instance.setSelected(false);
    this.showMenu(event.x, event.y, WIDGET_MENU);
  }

  selectWidget(event: {
    multi: boolean;
    widget: ComponentRef<WidgetComponent>;
  }): void {
    event.widget.instance.setSelected(event.multi);
  }

  showMenu(
    x: number,
    y: number,
    options: { name: string; value: any }[]
  ): void {
    this.menu.show(x, y, options);
  }

  onSelectMenuItem(event: MenuItem): void {
    this.triggerMenuOperation(event.value);
  }

  deleteWidget(...refs: ComponentRef<WidgetComponent>[]): void {
    refs.forEach((ref) => {
      let index = this.selectedWidgets.findIndex((item) => item === ref);
      this.selectedWidgets.splice(index, 1);
      ref.destroy();
      index = this.widgets.findIndex((item) => item === ref);
      this.widgets.splice(index, 1);
      this.currentPage.widgets?.splice(index, 1);
    });
    const arr = this.widgets.sort((widget) => widget.instance.style.index);
    arr.forEach((widget, idx) => {
      widget.instance.style.index = idx + 1;
    });
  }

  onSelectRangeStart(event: MouseEvent): void {
    event.preventDefault();
    document.getSelection()?.removeAllRanges();
    this.isMouseDown = true;
    this.tempMousePos.x = event.offsetX;
    this.tempMousePos.y = event.offsetY;

    this.selectedWidgets.forEach((item) => item.instance.resetStatus());
    this.selectedWidgets.splice(0);
    this.renderer2.addClass(this.ref.nativeElement, 'operation');
    document.addEventListener('mouseup', this.onSelectRangMouseUp);
    document.addEventListener('mousemove', this.onSelectRangMouseMove);
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

  togglePreview(): void {
    this.mode =
      this.mode === OperationMode.Development
        ? OperationMode.Production
        : OperationMode.Development;
  }

  back(): void {
    if (this.mode === OperationMode.Production) {
      this.mode = OperationMode.Development;
    }
  }

  saveProject(): void {
    console.log(this.pages);
    const pages = this.pages.map(
      ({ id, name, style, widgets, dataSetting }) => ({
        id,
        name,
        style,
        widgets,
        dataSetting,
      })
    );
    this.graphicEditorSrv.updatePage(pages).subscribe();
    this.save.emit(this.pages);
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
    console.log('resize');
    this.initSelectionArea();
  }

  triggerMenuOperation(operation: MenuOperation): void {
    let arr: any = Array.from({ length: this.widgets.length });
    this.selectedWidgets.forEach(
      (ref) => (arr[ref.instance.style.index - 1] = ref)
    );
    switch (operation) {
      case MenuOperation.MoveUp:
        while (arr[arr.length - 1] && arr.length) {
          arr.pop();
        }
        arr = arr.filter((ref: any) => !!ref).reverse();
        for (const ref of arr) {
          const zIndex = ref.instance.style.index;
          this.widgets
            .find((item) => item.instance.style.index === zIndex + 1)
            ?.instance.setZIndex(zIndex);
          ref.instance.setZIndex(zIndex + 1);
        }

        break;
      case MenuOperation.MoveDown:
        while (arr[0] && arr.length) {
          arr.shift();
        }
        arr = arr.filter((ref: any) => !!ref);
        for (const ref of arr) {
          const zIndex = ref.instance.style.index;
          this.widgets
            .find((item) => item.instance.style.index === zIndex - 1)
            ?.instance.setZIndex(zIndex);
          ref.instance.setZIndex(zIndex - 1);
        }
        break;
      case MenuOperation.SetTop:
        while (arr[arr.length - 1] && arr.length) {
          arr.pop();
        }
        arr = arr
          .map(
            (ref: any, idx: number) =>
              !ref &&
              this.widgets.find((item) => item.instance.style.index === idx + 1)
          )
          .filter((item: any) => !!item);
        arr.forEach((ref: any, idx: number) => {
          ref.instance.setZIndex(idx + 1);
        });
        arr = this.selectedWidgets
          .sort((ref) => ref.instance.style.index)
          .reverse();
        arr.forEach((ref: any, idx: number) => {
          ref.instance.setZIndex(this.widgets.length - idx);
        });
        break;
      case MenuOperation.SetBottom:
        while (arr[0] && arr.length) {
          arr.shift();
        }
        arr = arr
          .map(
            (ref: any, idx: number) =>
              !ref &&
              this.widgets.find((item) => item.instance.style.index === idx + 1)
          )
          .filter((item: any) => !!item);
        arr.forEach((ref: any, idx: number) => {
          ref.instance.setZIndex(idx + this.selectedWidgets.length + 1);
        });
        this.selectedWidgets
          .sort((ref) => ref.instance.style.index)
          .forEach((ref: any, idx: number) => {
            ref.instance.setZIndex(idx + 1);
          });
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
