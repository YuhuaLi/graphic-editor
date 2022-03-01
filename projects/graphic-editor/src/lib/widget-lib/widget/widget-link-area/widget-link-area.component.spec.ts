import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetLinkAreaComponent } from './widget-link-area.component';

describe('WidgetLinkAreaComponent', () => {
  let component: WidgetLinkAreaComponent;
  let fixture: ComponentFixture<WidgetLinkAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetLinkAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetLinkAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
