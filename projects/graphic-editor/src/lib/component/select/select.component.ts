import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
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
  implements OnInit, OnChanges, OnDestroy
{
  @ContentChild('template') template?: TemplateRef<any>;
  @Input() items: { [key: string]: any }[] = [];
  @Input() options: { displayField?: string; valueField?: string } = {};
  @Output() expand = new EventEmitter<any>();
  @Output() mouseenterItem = new EventEmitter<any>();
  @Output() mouseleaveItem = new EventEmitter<any>();

  currentOptions: { displayField: string; valueField: string } = {
    displayField: 'name',
    valueField: 'value',
  };

  menuTop = 30;
  menuLeft = 0;

  selectedItem?: { [key: string]: any };
  isExpand = false;
  alive = true;

  set value(val: any) {
    this.value$ = val;
    this.selectedItem = this.items.find(
      (item) => item[this.currentOptions.valueField] === val
    );
    this.onChange(val);
  }

  constructor(private elementRef: ElementRef) {
    super();
  }

  ngOnInit(): void {
    this.currentOptions = { ...this.currentOptions, ...(this.options || {}) };
    fromEvent(document, 'click')
      .pipe(takeWhile(() => this.alive))
      .subscribe((event: Event) => {
        if (!this.elementRef.nativeElement.contains(event.target)) {
          this.isExpand = false;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && !changes.items.firstChange) {
      this.selectedItem = this.items.find((item) => item.value === this.value$);
    }
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
            this.items.length * 26 -
            12;
      this.expand.emit();
    }
  }

  selectItem(item: { [key: string]: any }): void {
    if (this.selectedItem !== item) {
      this.selectedItem = item;
      this.isExpand = false;
      this.value = item[this.currentOptions.valueField];
    }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
