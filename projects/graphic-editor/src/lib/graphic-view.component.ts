import { GraphicEvent } from './type/graphic-event.type';
import { DataSetting } from './type/data-setting.type';
import { takeWhile } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActionType, DataType, OperationMode } from './enum';
import { Page, WidgetData, WidgetStyle } from './type';
import { WidgetLibService } from './widget-lib/widget-lib.service';
import { WidgetComponent } from './widget-lib/widget/widget.component';

@Component({
  selector: 'lib-graphic-view',
  templateUrl: './graphic-view.component.html',
  styleUrls: ['./graphic-view.component.scss'],
})
export class GraphicViewComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() page!: Page;
  @Input() pages: Page[] = [];

  @ViewChild('container', { static: false, read: ViewContainerRef })
  container!: ViewContainerRef;

  zoomX = 1;
  zoomY = 1;
  alive = true;
  apiTimeout: any;
  widgets: ComponentRef<WidgetComponent>[] = [];

  constructor(
    private cfr: ComponentFactoryResolver,
    private widgetLibSrv: WidgetLibService,
    private elementRef: ElementRef,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    if (this.page.style.adaptive) {
      this.zoomX =
        this.elementRef.nativeElement.offsetWidth / this.page.style.width;
      this.zoomY =
        this.elementRef.nativeElement.offsetHeight / this.page.style.height;
    }
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.page && !changes.page.firstChange) {
      if (this.page.style.adaptive) {
        this.zoomX =
          this.elementRef.nativeElement.offsetWidth / this.page.style.width;
        this.zoomY =
          this.elementRef.nativeElement.offsetHeight / this.page.style.height;
      }
      this.getData();
      this.renderPage();
    }
  }

  getData(): void {
    if (this.page.dataSetting?.length) {
      this.page.data = [];
      for (const setting of this.page.dataSetting) {
        const data: any = { id: setting.id };
        this.page.data.push(data);
        if (setting.type === DataType.Api) {
          data.emitter = new EventEmitter<any>();
          this.getApiData(setting);
        } else if (setting.type === DataType.Const && setting.const) {
          try {
            data.value = JSON.parse(setting.const);
          } catch {
            console.error(`${setting.name}解析错误`);
          }
        }
      }
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
            const data = this.page.data?.find((item) => item.id === setting.id);
            if (data) {
              data.value = res;
              data.emitter.emit();
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
    this.renderPage();
  }

  renderPage(): void {
    this.container.clear();
    this.widgets = [];
    if (this.page?.widgets) {
      for (const widget of this.page.widgets) {
        this.createWidget(widget.type, widget.style, widget.widgetData);
      }
    }
  }

  createWidget(
    type: string,
    style: WidgetStyle,
    widgetData?: WidgetData
  ): ComponentRef<WidgetComponent> | null {
    const widget = this.widgetLibSrv.getWidgetByType(type);
    if (widget) {
      const factory = this.cfr.resolveComponentFactory(WidgetComponent);
      const comp = this.container.createComponent(factory);
      comp.instance.widget = widget;
      comp.instance.style = style;
      comp.instance.page = this.page;
      comp.instance.pages = this.pages;
      comp.instance.widgets = this.widgets;
      comp.instance.mode = OperationMode.Production;
      if (widgetData) {
        comp.instance.widgetData = widgetData;
      }
      comp.instance.widgetEvent
        .pipe(takeWhile(() => this.alive))
        .subscribe((event: GraphicEvent) => {
          if (event.type === ActionType.JumpPage) {
            this.page = event.data;
            this.renderPage();
          }
        });
      this.widgets.unshift(comp);
      // comp.changeDetectorRef.detectChanges();
      return comp;
    }
    return null;
  }

  ngOnDestroy(): void {
    this.alive = false;
    if (this.apiTimeout) {
      clearTimeout(this.apiTimeout);
      this.apiTimeout = null;
    }
  }
}
