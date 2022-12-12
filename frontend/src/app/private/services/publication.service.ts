import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PublicationService {
    newPublication$ = new Subject<void>();

    constructor(private router: Router) {}

    newPublicationEvent(): void {
        this.newPublication$.next();
    }

    hasNewPublication(): Observable<void> {
        return this.newPublication$.asObservable();
    }

    get isProfileView(): boolean {
        return this.router.url.includes('/private/profile');
    }
}
