import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { OperationMode } from './enum';
import { Page, WidgetData, WidgetStyle } from './type';
import { WidgetLibService } from './widget-lib/widget-lib.service';
import { WidgetComponent } from './widget-lib/widget/widget.component';

@Component({
  selector: 'lib-graphic-view',
  templateUrl: './graphic-view.component.html',
  styleUrls: ['./graphic-view.component.scss'],
})
export class GraphicViewComponent implements OnInit, AfterViewInit {
  @Input() page: Page = { style: { width: 0, height: 0, backgroundColor: '#ffffff00' } };

  @ViewChild('container', { static: false, read: ViewContainerRef })
  container!: ViewContainerRef;

  zoomX = 1;
  zoomY = 1;

  constructor(
    private cfr: ComponentFactoryResolver,
    private widgetLibSrv: WidgetLibService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    if (this.page.style.adaptive) {
      this.zoomX =
        this.elementRef.nativeElement.offsetWidth / this.page.style.width;
      this.zoomY =
        this.elementRef.nativeElement.offsetHeight / this.page.style.height;
    }
  }

  ngAfterViewInit(): void {
    if (this.page.widgets) {
      for (const widget of this.page.widgets) {
        this.createWidget(widget.type, widget.style, widget.widgetData);
      }
    }
  }

  createWidget(
    type: string,
    style: WidgetStyle,
    widgetData?: WidgetData
  ): void {
    const widget = this.widgetLibSrv.getWidgetByType(type);
    if (widget) {
      const factory = this.cfr.resolveComponentFactory(WidgetComponent);
      const comp = this.container.createComponent(factory);
      comp.instance.widget = widget;
      comp.instance.style = style;
      comp.instance.mode = OperationMode.Production;
      comp.instance.widgetData = widgetData;
      comp.changeDetectorRef.detectChanges();
    }
  }
}
