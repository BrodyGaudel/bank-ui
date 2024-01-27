import { TestBed } from '@angular/core/testing';

import { CustomerCommandService } from './customer-command.service';

describe('CustomerCommandService', () => {
  let service: CustomerCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
