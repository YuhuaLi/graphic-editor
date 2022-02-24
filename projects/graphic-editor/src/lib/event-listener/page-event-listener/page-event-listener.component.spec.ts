import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEventListenerComponent } from './page-event-listener.component';

describe('PageEventListenerComponent', () => {
  let component: PageEventListenerComponent;
  let fixture: ComponentFixture<PageEventListenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageEventListenerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEventListenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
