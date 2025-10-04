import { TestBed } from '@angular/core/testing';

import { PropertyFilter } from './property-filter';

describe('PropertyFilter', () => {
  let service: PropertyFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyFilter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
