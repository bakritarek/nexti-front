import { TestBed } from '@angular/core/testing';

import { AutologoutService } from './autologout.service';

describe('AutologoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutologoutService = TestBed.get(AutologoutService);
    expect(service).toBeTruthy();
  });
});
