import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PublicationService {
    newPublication$ = new Subject<void>();

    newPublicationEvent(): void {
        this.newPublication$.next();
    }

    hasNewPublication(): Observable<void> {
        return this.newPublication$.asObservable();
    }
}
