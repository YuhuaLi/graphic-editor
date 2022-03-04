import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDataSettingComponent } from './widget-data-setting.component';

describe('WidgetDataSettingComponent', () => {
  let component: WidgetDataSettingComponent;
  let fixture: ComponentFixture<WidgetDataSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetDataSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDataSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
