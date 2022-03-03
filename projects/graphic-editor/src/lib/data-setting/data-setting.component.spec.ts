import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSettingComponent } from './data-setting.component';

describe('DataSettingComponent', () => {
  let component: DataSettingComponent;
  let fixture: ComponentFixture<DataSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
