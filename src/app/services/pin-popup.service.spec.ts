import { TestBed } from '@angular/core/testing';

import { PinPopupService } from './pin-popup.service';

describe('PinPopupService', () => {
  let service: PinPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
