import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validatingGuard } from './validating.guard';

describe('validatingGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validatingGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
