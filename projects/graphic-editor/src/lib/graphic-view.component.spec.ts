import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicViewComponent } from './graphic-view.component';

describe('GraphicViewComponent', () => {
  let component: GraphicViewComponent;
  let fixture: ComponentFixture<GraphicViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphicViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
