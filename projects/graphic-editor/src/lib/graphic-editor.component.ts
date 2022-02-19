import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { WidgetLibComponent } from './widget-lib/widget-lib.component';
import { OperationMode, NavButton, Page, KeyboardCode } from './model';
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
  @ViewChild('compArea', { read: ViewContainerRef, static: false })
  compArea!: ViewContainerRef;

  alive = true;

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
    // {
    //   type: 'widget-library',
    //   name: '组件库',
    //   icon: 'icon-sucaiku',
    // },
    // {
    //   type: 'widget-library',
    //   name: '组件库',
    //   icon: 'icon-sucaiku',
    // },
    // {
    //   type: 'widget-library',
    //   name: '组件库',
    //   icon: 'icon-sucaiku',
    // },
    // {
    //   type: 'widget-library',
    //   name: '组件库',
    //   icon: 'icon-sucaiku',
    // },
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

  onKeydown = (event: KeyboardEvent): void => {
    if (event.target !== document.body || !this.selectedWidgets.length) {
      return;
    }

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
    console.log(event);
  };

  constructor(
    private cfr: ComponentFactoryResolver,
    private widgetLibSrv: WidgetLibService
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
  }

  onViewportScroll(event: Event): void {
    this.scrollLeft = (event.target as HTMLElement).scrollLeft;
    this.scrollTop = (event.target as HTMLElement).scrollTop;
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
        const comp = this.compArea.createComponent(factory);
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

  clearSelectedWidget(event: MouseEvent): void {
    this.selectedWidgets.forEach((item) => item.instance.resetStatus());
    this.selectedWidgets.splice(0);
  }

  zoomPage(event: number): void {
    this.zoom = event;
    this.widgets.forEach((widget) => widget.instance.setZoom(this.zoom));
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

  ngOnDestroy(): void {
    this.alive = false;
  }
}
