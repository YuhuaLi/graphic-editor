import { TestBed } from '@angular/core/testing';

import { WidgetLibService } from './widget-lib.service';

describe('WidgetLibService', () => {
  let service: WidgetLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
