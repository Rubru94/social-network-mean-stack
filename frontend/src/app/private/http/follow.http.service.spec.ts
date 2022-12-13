import { TestBed } from '@angular/core/testing';

import { FollowHttpService } from './follow.http.service';

describe('FollowHttpService', () => {
  let service: FollowHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
