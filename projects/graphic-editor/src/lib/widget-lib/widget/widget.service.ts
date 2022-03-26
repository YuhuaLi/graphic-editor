import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WidgetStatus } from '../../enum';

@Injectable()
export class WidgetService {
  statusSubject$ = new Subject<WidgetStatus>();

  dataSubject$ = new Subject<void>();

  constructor() {}

  onStatusChange(): Observable<WidgetStatus> {
    return this.statusSubject$.asObservable();
  }

  changeStatus(status: WidgetStatus): void {
    this.statusSubject$.next(status);
  }

  onDataChange(): Observable<void> {
    return this.dataSubject$.asObservable();
  }

  changeData(): void {
    this.dataSubject$.next();
  }
}
