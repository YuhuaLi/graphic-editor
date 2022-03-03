import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from '../type';

@Component({
  selector: 'lib-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss'],
})
export class PageListComponent implements OnInit {
  @Input() pages: Page[] = [];
  @Output() selectPage = new EventEmitter<Page>();
  @Output() deletePage = new EventEmitter<Page>();

  constructor() {}

  ngOnInit(): void {}

  onPageSelect(page: Page): void {
    this.selectPage.emit(page);
  }

  onPageDelete(page: Page, event: Event): void {
    event.stopPropagation();
    this.deletePage.emit(page);
  }
}
