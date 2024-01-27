import { TestBed } from '@angular/core/testing';

import { AccountCommandService } from './account-command.service';

describe('AccountCommandService', () => {
  let service: AccountCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
