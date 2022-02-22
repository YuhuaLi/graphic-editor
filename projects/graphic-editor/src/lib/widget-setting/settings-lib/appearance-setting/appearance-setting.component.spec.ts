import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearanceSettingComponent } from './appearance-setting.component';

describe('AppearanceSettingComponent', () => {
  let component: AppearanceSettingComponent;
  let fixture: ComponentFixture<AppearanceSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppearanceSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
