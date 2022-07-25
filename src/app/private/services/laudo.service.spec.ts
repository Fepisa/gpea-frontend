import { TestBed } from '@angular/core/testing';

import { LaudoService } from './laudo.service';

describe('LaudoService', () => {
  let service: LaudoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaudoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
