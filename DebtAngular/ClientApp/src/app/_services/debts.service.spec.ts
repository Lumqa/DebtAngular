/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DebtsService } from './debts.service';

describe('Service: Debts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebtsService]
    });
  });

  it('should ...', inject([DebtsService], (service: DebtsService) => {
    expect(service).toBeTruthy();
  }));
});
