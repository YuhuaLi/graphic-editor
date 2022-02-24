import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetEventListenerComponent } from './widget-event-listener.component';

describe('WidgetEventListenerComponent', () => {
  let component: WidgetEventListenerComponent;
  let fixture: ComponentFixture<WidgetEventListenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetEventListenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEventListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
