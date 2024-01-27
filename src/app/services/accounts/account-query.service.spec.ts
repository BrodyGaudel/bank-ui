import { TestBed } from '@angular/core/testing';

import { AccountQueryService } from './account-query.service';

describe('AccountQueryService', () => {
  let service: AccountQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
