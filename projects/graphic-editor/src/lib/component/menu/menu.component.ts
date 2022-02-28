import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AbstractValueAccessor } from '../abstractvalueaccessor';

@Component({
  selector: 'lib-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MenuComponent),
      multi: true,
    },
  ],
})
export class MenuComponent
  extends AbstractValueAccessor
  implements OnInit, OnDestroy
{
  @Input() items: { name: string; value: any }[] = [];

  selectedItem?: { name: string; value: any };
  isExpand = false;
  alive = true;

  set value(val: any) {
    this.value$ = val;
    this.selectedItem = this.items.find((item) => item.value === val);
    this.onChange(val);
  }

  constructor(private elementRef: ElementRef) {
    super();
  }

  ngOnInit(): void {
    fromEvent(document, 'click')
      .pipe(takeWhile(() => this.alive))
      .subscribe((event: Event) => {
        if (!this.elementRef.nativeElement.contains(event.target)) {
          this.isExpand = false;
        }
      });
  }

  toggleExpand(event: Event): void {
    this.isExpand = !this.isExpand;
  }

  selectItem(item: { name: string; value: any }): void {
    this.selectedItem = item;
    this.isExpand = false;
    this.value = item.value;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
