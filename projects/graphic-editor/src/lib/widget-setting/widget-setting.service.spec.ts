import { TestBed } from '@angular/core/testing';

import { WidgetSettingService } from './widget-setting.service';

describe('WidgetSettingService', () => {
  let service: WidgetSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
