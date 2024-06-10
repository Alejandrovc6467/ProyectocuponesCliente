import { TestBed } from '@angular/core/testing';

import { ProyectocuponesService } from './proyectocupones.service';

describe('ProyectocuponesService', () => {
  let service: ProyectocuponesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProyectocuponesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
