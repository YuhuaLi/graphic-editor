import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { MenuItem } from '../../type';
import { AbstractValueAccessor } from '../abstractvalueaccessor';

@Component({
  selector: 'lib-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent
  extends AbstractValueAccessor
  implements OnInit, OnDestroy
{
  @Input() items: MenuItem[] = [];

  menuTop = 30;
  menuLeft = 0;

  selectedItem?: MenuItem;
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

    if (this.isExpand) {
      const boundingRect =
        this.elementRef.nativeElement.getBoundingClientRect();
      this.menuLeft =
        window.innerWidth > boundingRect.x + 150 + 12
          ? 0
          : window.innerWidth - boundingRect.x - 150 - 12;
      this.menuTop =
        window.innerHeight >
        boundingRect.y + boundingRect.height + this.items.length * 26 + 12
          ? boundingRect.height + 2
          : window.innerHeight -
            boundingRect.y -
            boundingRect.height -
            this.items.length * 26 - 12;
    }
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
