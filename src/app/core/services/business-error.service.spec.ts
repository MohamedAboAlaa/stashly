import { TestBed } from '@angular/core/testing';

import { BusinessErrorService } from './business-error.service';

describe('BusinessErrorService', () => {
  let service: BusinessErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
