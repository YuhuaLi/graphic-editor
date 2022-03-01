import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { MenuItem } from '../../type';

@Component({
  selector: 'lib-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() items: MenuItem[] = [];
  @Output() selectItem = new EventEmitter<MenuItem>();

  isExpand = false;
  menuTop = 0;
  menuLeft = 0;
  alive = true;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    fromEvent(document, 'click')
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => (this.isExpand = false));
  }

  selectMenuItem(event: Event, item: MenuItem): void {
    event.preventDefault();
    event.stopPropagation();
    this.isExpand = false;
    this.selectItem.emit(item);
  }

  show(x: number, y: number, options: MenuItem[]): void {
    this.isExpand = true;
    this.menuLeft =
      window.innerWidth > x + 150 + 12 ? x : window.innerWidth - x - 150 - 12;
    this.menuTop =
      window.innerHeight > y + this.items.length * 26 + 12
        ? y
        : window.innerHeight - y - this.items.length * 26 - 12;
    this.items = options;
  }

  hide(): void {
    this.items = [];
    this.isExpand = false;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
