import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WidgetData, WidgetStatus } from '../../model';

@Injectable()
export class WidgetService {

  statusSubject$ = new Subject<WidgetStatus>();

  dataSubject$ = new Subject<WidgetData>();

  constructor() { }

  onStatusChange(): Observable<WidgetStatus> {
    return this.statusSubject$.asObservable();
  }

  changeStatus(status: WidgetStatus): void {
    this.statusSubject$.next(status);
  }

  onDataChange(): Observable<WidgetData> {
    return this.dataSubject$.asObservable();
  }

  changeData(data: WidgetData): void {
    this.dataSubject$.next(data);
  }
}
