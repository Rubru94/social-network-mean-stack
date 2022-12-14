import { TestBed } from '@angular/core/testing';

import { PublicationHttpService } from './publication.http.service';

describe('PublicationHttpService', () => {
    let service: PublicationHttpService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PublicationHttpService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
