import { TestBed } from '@angular/core/testing';

import { SifarnikService } from './sifarnik.service';

describe('SifarnikService', () => {
  let service: SifarnikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SifarnikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
