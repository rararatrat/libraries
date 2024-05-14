import { TestBed } from '@angular/core/testing';

import { RouteObserverService } from './route-observer.service';

describe('RouteObserverService', () => {
  let service: RouteObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
