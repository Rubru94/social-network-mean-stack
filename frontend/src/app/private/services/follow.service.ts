import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class FollowService {
    constructor(private router: Router) {}

    get isFollowingView(): boolean {
        return this.router.url.includes('/private/following');
    }

    get isFollowerView(): boolean {
        return this.router.url.includes('/private/follower');
    }
}
