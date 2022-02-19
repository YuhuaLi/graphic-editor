import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetImgComponent } from './widget-img.component';

describe('WidgetImgComponent', () => {
  let component: WidgetImgComponent;
  let fixture: ComponentFixture<WidgetImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
