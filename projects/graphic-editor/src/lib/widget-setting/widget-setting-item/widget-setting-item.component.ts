import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { WidgetSetting } from '../../type';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';
import { WidgetSettingService } from '../widget-setting.service';

@Component({
  selector: 'lib-widget-setting-item',
  templateUrl: './widget-setting-item.component.html',
  styleUrls: ['./widget-setting-item.component.scss'],
})
export class WidgetSettingItemComponent implements OnInit, AfterViewInit {
  @Input() setting!: WidgetSetting;
  @Input() ref!: ComponentRef<WidgetComponent>;

  @ViewChild('render', { read: ViewContainerRef }) render!: ViewContainerRef;

  collapse = false;
  widgetSetting: Exclude<WidgetSetting, string> | null = null;

  constructor(
    private resolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private widgetSettingSrv: WidgetSettingService
  ) {}

  ngOnInit(): void {
    this.widgetSetting =
      typeof this.setting === 'string'
        ? this.widgetSettingSrv.getWidgetByType(this.setting)
        : this.setting;
  }

  ngAfterViewInit(): void {
    const factroy = this.resolver.resolveComponentFactory(
      typeof this.setting === 'string'
        ? this.widgetSettingSrv.getWidgetByType(this.setting)?.component
        : this.setting.component
    );
    const injector = Injector.create({
      providers: [
        {
          provide: ComponentRef,
          useValue: this.ref,
        },
      ],
    });
    const component: any = this.render.createComponent(factroy, 0, injector);
    this.cdr.detectChanges();
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }
}
