import { TestBed } from '@angular/core/testing';

import { MapPositionService } from './map-position.service';

describe('MapPositionService', () => {
  let service: MapPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
