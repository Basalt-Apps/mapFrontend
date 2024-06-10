import { TestBed } from '@angular/core/testing';

import { PinDataService } from './pin-data.service';

describe('PinDataService', () => {
  let service: PinDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
