import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicEditorComponent } from './graphic-editor.component';

describe('GraphicEditorComponent', () => {
  let component: GraphicEditorComponent;
  let fixture: ComponentFixture<GraphicEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphicEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
