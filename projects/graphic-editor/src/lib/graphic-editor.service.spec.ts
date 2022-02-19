import { TestBed } from '@angular/core/testing';

import { GraphicEditorService } from './graphic-editor.service';

describe('GraphicEditorService', () => {
  let service: GraphicEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphicEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
