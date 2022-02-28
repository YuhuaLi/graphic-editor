import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomBoxComponent } from './zoom-box.component';

describe('ZoomBoxComponent', () => {
  let component: ZoomBoxComponent;
  let fixture: ComponentFixture<ZoomBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
