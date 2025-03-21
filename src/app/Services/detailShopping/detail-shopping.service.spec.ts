import { TestBed } from '@angular/core/testing';

import { DetailShoppingService } from './detail-shopping.service';

describe('DetailShoppingService', () => {
  let service: DetailShoppingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailShoppingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
