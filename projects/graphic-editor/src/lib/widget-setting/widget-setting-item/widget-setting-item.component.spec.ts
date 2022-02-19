import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSettingItemComponent } from './widget-setting-item.component';

describe('WidgetSettingItemComponent', () => {
  let component: WidgetSettingItemComponent;
  let fixture: ComponentFixture<WidgetSettingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetSettingItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetSettingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
