import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDataSettingComponent } from './page-data-setting.component';

describe('PageDataSettingComponent', () => {
  let component: PageDataSettingComponent;
  let fixture: ComponentFixture<PageDataSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageDataSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDataSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
