import { TestBed } from '@angular/core/testing';

import { CustomerQueryService } from './customer-query.service';

describe('CustomerQueryService', () => {
  let service: CustomerQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
