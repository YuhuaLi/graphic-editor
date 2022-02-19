import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetGeneralSettingComponent } from './widget-general-setting.component';

describe('WidgetGeneralSettingComponent', () => {
  let component: WidgetGeneralSettingComponent;
  let fixture: ComponentFixture<WidgetGeneralSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetGeneralSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetGeneralSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
