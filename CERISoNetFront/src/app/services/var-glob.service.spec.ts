import { TestBed } from '@angular/core/testing';

import { VarGlobService } from './var-glob.service';

describe('VarGlobService', () => {
  let service: VarGlobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VarGlobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
