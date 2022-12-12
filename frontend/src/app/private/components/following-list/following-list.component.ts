import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/env';
import { combineLatest } from 'rxjs';
import { UserHttpService } from 'src/app/public/http/user.http.service';
import { Follow } from 'src/app/public/models/follow.model';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';
import { FollowHttpService } from '../../services/follow.http.service';

@Component({
    selector: 'app-following-list',
    templateUrl: './following-list.component.html',
    styleUrls: ['./following-list.component.scss']
})
export class FollowingListComponent {
    title: string;
    currentPage: number;
    previousPage: number;
    nextPage: number;
    totalPages: number;
    itemsPerPage: number;
    followings: Follow[];
    follows: string[];
    status: FormStatus;
    errMsg?: string;
    followUserOver?: string;
    userPageId?: string;

    api: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private followHttpService: FollowHttpService
    ) {
        this.title = 'Following';
        this.currentPage = 1;
        this.previousPage = 0;
        this.nextPage = 0;
        this.totalPages = 1;
        this.itemsPerPage = 2;
        this.followings = [];
        this.follows = [];
        this.status = FormStatus.None;
        this.api = `${environment.apiURL}/api`;
    }

    ngOnInit(): void {
        this.actualPage();
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    followedFromFollow(follow: Follow): User {
        return new User(follow.followed as User);
    }

    actualPage(): void {
        combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams]).subscribe({
            next: ([params, queryParams]) => {
                const userId = queryParams['user'];
                this.userPageId = userId;
                const page = +params['page'];
                this.currentPage = page;
                this.nextPage = page + 1;
                this.previousPage = page - 1 > 0 ? page - 1 : 1;
                this.getFollowing(this.currentPage, userId);
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    getFollowing(page: number, userId: string) {
        this.followHttpService.getFollowing(page, this.itemsPerPage, userId).subscribe({
            next: (res: { follows: Follow[]; followings: string[]; followers: string[]; total: number; pages: number }) => {
                this.followings = res.follows;
                this.totalPages = res.pages;
                this.follows = res.followings;
                if (res.pages && page > res.pages) {
                    this.router.navigateByUrl('private/following-list');
                    this.ngOnInit();
                }
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
                this.router.navigateByUrl('private/following-list');
            }
        });
    }

    isUserLogged(user: User): boolean {
        return user._id === this.userService.identity._id;
    }

    isFollowing(user: User): boolean {
        return this.follows.includes(user._id);
    }

    mouseEnter(user: User) {
        this.followUserOver = user._id;
    }

    mouseLeave() {
        this.followUserOver = undefined;
    }

    createFollow(followedId: string) {
        const follow = new Follow({ user: this.userService.identity._id, followed: followedId });
        this.followHttpService.create(follow).subscribe({
            next: (res: Follow) => {
                this.follows.push(res.followed as string);
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    removeFollow(followedId: string) {
        this.followHttpService.remove(followedId).subscribe({
            next: (res: Follow[]) => {
                this.follows = this.follows.filter((follow: string) => !res.map((f: Follow) => f.followed).includes(follow));
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
