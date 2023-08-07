import { TestBed } from '@angular/core/testing';

import { TagekService } from './tagek.service';

describe('TagekService', () => {
  let service: TagekService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagekService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
