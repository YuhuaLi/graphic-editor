import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  InjectionToken,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { WidgetSetting } from '../../model';
import { WidgetComponent } from '../../widget-lib/widget/widget.component';

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

  constructor(
    private resolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const factroy = this.resolver.resolveComponentFactory(
      this.setting.component
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
