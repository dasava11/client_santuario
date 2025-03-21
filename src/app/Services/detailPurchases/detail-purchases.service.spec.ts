import { TestBed } from '@angular/core/testing';

import { DetailPurchasesService } from './detail-purchases.service';

describe('DetailPurchasesService', () => {
  let service: DetailPurchasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailPurchasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
