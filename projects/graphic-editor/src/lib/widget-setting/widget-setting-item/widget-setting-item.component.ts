import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { WidgetSetting } from '../../type';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';
import { WidgetSettingService } from '../widget-setting.service';

@Component({
  selector: 'ng-widget-setting-item',
  templateUrl: './widget-setting-item.component.html',
  styleUrls: ['./widget-setting-item.component.scss'],
})
export class WidgetSettingItemComponent
  implements OnInit, OnChanges, AfterViewInit
{
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
    this.renderSetting();
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }

  renderSetting(): void {
    this.render.clear();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.setting && !changes.setting.firstChange) {
      this.widgetSetting =
        typeof this.setting === 'string'
          ? this.widgetSettingSrv.getWidgetByType(this.setting)
          : this.setting;
    }
    if (changes.ref && !changes.ref.firstChange) {
      this.renderSetting();
    }
  }
}
