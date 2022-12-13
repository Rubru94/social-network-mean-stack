import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserHttpService } from 'src/app/public/http/user.http.service';
import { CounterSet } from 'src/app/public/models/counter-set.model';
import { Follow } from 'src/app/public/models/follow.model';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';
import { environment } from 'environments/env';
import { FollowHttpService } from '../../http/follow.http.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    title: string;
    token?: string;
    user: User;
    hasFollowing: boolean;
    hasFollower: boolean;
    identity?: User;
    counterSet?: CounterSet;
    status: FormStatus;
    errMsg?: string;
    api: string;
    followUserOver?: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private userHttpService: UserHttpService,
        private followHttpService: FollowHttpService
    ) {
        this.title = 'Profile';
        this.status = FormStatus.None;
        this.user = new User();
        this.hasFollowing = false;
        this.hasFollower = false;
        this.api = `${environment.apiURL}/api`;
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.loadPage();
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    get userImageSource(): string {
        return `${this.api}/user/image/${this.user.image}`;
    }

    loadPage(): void {
        this.activatedRoute.params.subscribe({
            next: (params) => {
                const userId = params['id'];
                if (!userId) this.router.navigate(['/private/profile', this.identity?._id]);
                else {
                    this.loadUser(userId);
                    this.counters(userId);
                }
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    isUserLogged(user: User): boolean {
        return user._id === this.identity?._id;
    }

    mouseEnter(user: User) {
        this.followUserOver = user._id;
    }

    mouseLeave() {
        this.followUserOver = undefined;
    }

    loadUser(id: string): void {
        this.userHttpService.getUser(id).subscribe({
            next: (res: { user: User; following: Follow; follower: Follow }) => {
                this.user = res.user;
                this.hasFollowing = !!res.following?._id;
                this.hasFollower = !!res.follower?._id;
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
                this.router.navigate(['/private/profile', this.identity?._id]);
            }
        });
    }

    counters(id: string): void {
        this.userHttpService.counters(id).subscribe({
            next: (res: CounterSet) => (this.counterSet = res),
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    createFollow(followedId: string) {
        const follow = new Follow({ user: this.userService.identity._id, followed: followedId });
        this.followHttpService.create(follow).subscribe({
            next: (res: Follow) => {
                this.hasFollowing = true;
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
                this.hasFollowing = false;
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
