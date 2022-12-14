import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/env';
import { FollowHttpService } from '@private/http/follow.http.service';
import { FollowService } from '@private/services/follow.service';
import { UserHttpService } from '@public/http/user.http.service';
import { Follow } from '@public/models/follow.model';
import { FormStatus } from '@public/models/form-status.model';
import { User } from '@public/models/user.model';
import { UserService } from '@public/services/user.service';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'app-follow-list',
    templateUrl: './follow-list.component.html',
    styleUrls: ['./follow-list.component.scss']
})
export class FollowListComponent implements OnInit {
    title: string;
    currentPage: number;
    previousPage: number;
    nextPage: number;
    totalPages: number;
    itemsPerPage: number;
    follows: Follow[];
    followIds: string[];
    status: FormStatus;
    errMsg?: string;
    followUserOver?: string;
    userPageId?: string;
    user?: User;

    api: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private userHttpService: UserHttpService,
        private followHttpService: FollowHttpService,
        private followService: FollowService
    ) {
        this.title = this.followService.isFollowingView ? 'Following to' : this.followService.isFollowerView ? 'Followers of' : '';
        this.currentPage = 1;
        this.previousPage = 0;
        this.nextPage = 0;
        this.totalPages = 1;
        this.itemsPerPage = 2;
        this.follows = [];
        this.followIds = [];
        this.status = FormStatus.None;
        this.api = `${environment.apiURL}/api`;
    }

    ngOnInit(): void {
        this.actualPage();
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    get navigationURL(): string {
        return `/private/${
            this.followService.isFollowingView ? 'following-list' : this.followService.isFollowerView ? 'follower-list' : ''
        }`;
    }

    userFromFollow(follow: Follow): User {
        const user = this.followService.isFollowingView ? follow.followed : this.followService.isFollowerView ? follow.user : null;
        return new User(user as User);
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
                this.loadUserPage(userId);
                this.getFollows(this.currentPage, userId);
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    loadUserPage(id?: string): void {
        this.userHttpService.getUser(id ?? this.userService.identity._id).subscribe({
            next: (res: { user: User; following: Follow; follower: Follow }) => (this.user = new User(res.user)),
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    getFollows(page: number, userId: string) {
        const followFunction = this.followService.isFollowingView
            ? this.followHttpService.getFollowing(page, this.itemsPerPage, userId)
            : this.followService.isFollowerView
            ? this.followHttpService.getFollowers(page, this.itemsPerPage, userId)
            : null;

        if (followFunction)
            followFunction.subscribe({
                next: (res: { follows: Follow[]; followings: string[]; followers: string[]; total: number; pages: number }) => {
                    this.follows = res.follows;
                    this.totalPages = res.pages;
                    this.followIds = res.followings;
                    if (res.pages && page > res.pages) {
                        this.router.navigateByUrl(this.navigationURL);
                        this.ngOnInit();
                    }
                },
                error: (err: Error) => {
                    this.status = FormStatus.Invalid;
                    this.errMsg = err.message;
                    this.router.navigateByUrl(this.navigationURL);
                }
            });
    }

    isUserLogged(user: User): boolean {
        return user._id === this.userService.identity._id;
    }

    isFollowing(user: User): boolean {
        return this.followIds.includes(user._id);
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
                this.followIds.push(res.followed as string);
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
                this.followIds = this.followIds.filter((follow: string) => !res.map((f: Follow) => f.followed).includes(follow));
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
