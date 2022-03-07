import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Page } from '../type';

@Component({
  selector: 'lib-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss'],
})
export class PageListComponent implements OnInit, OnDestroy {
  @Input() pages: Page[] = [];
  @Output() selectPage = new EventEmitter<Page>();
  @Output() deletePage = new EventEmitter<Page>();

  editingPage?: Page;
  alive = true;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    fromEvent(document, 'mousedown')
      .pipe(takeWhile(() => this.alive))
      .subscribe((event) => {
        if (
          !this.elementRef.nativeElement.contains(event.target) ||
          (event.target as HTMLInputElement).tagName !== 'INPUT'
        ) {
          this.editingPage = undefined;
        }
      });
  }

  onPageSelect(page: Page): void {
    this.selectPage.emit(page);
  }

  onPageDelete(page: Page, event: Event): void {
    event.stopPropagation();
    if (page === this.editingPage) {
      this.editingPage = undefined;
    }
    this.deletePage.emit(page);
  }

  onPageNameEdit(page: Page, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.editingPage = page;
  }

  onPageNameChange(page: Page, name: string): void {
    page.name = name;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
