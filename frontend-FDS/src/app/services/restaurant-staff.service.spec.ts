import { TestBed } from '@angular/core/testing';

import { RestaurantStaffService } from './restaurant-staff.service';

describe('RestaurantStaffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestaurantStaffService = TestBed.get(RestaurantStaffService);
    expect(service).toBeTruthy();
  });
});
