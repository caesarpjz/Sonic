import { TestBed } from '@angular/core/testing';

import { ManagersService } from './managers.service';

describe('ManagersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagersService = TestBed.get(ManagersService);
    expect(service).toBeTruthy();
  });
});
