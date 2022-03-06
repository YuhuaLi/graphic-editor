import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSettingComponent } from './chart-setting.component';

describe('ChartSettingComponent', () => {
  let component: ChartSettingComponent;
  let fixture: ComponentFixture<ChartSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
