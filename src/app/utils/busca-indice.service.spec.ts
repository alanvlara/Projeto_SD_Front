import { TestBed } from '@angular/core/testing';

import { BuscaIndiceService } from './busca-indice.service';

describe('BuscaIndiceService', () => {
  let service: BuscaIndiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscaIndiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
