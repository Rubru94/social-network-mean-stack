import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserHttpService } from 'src/app/public/http/user.http.service';
import { CounterSet } from 'src/app/public/models/counter-set.model';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    title: string;
    token?: string;
    user?: User;
    identity?: User;
    stats?: CounterSet;
    status: FormStatus;
    errMsg?: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private userHttpService: UserHttpService
    ) {
        this.title = 'Profile';
        this.status = FormStatus.None;
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.loadPage();
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    loadPage(): void {
        this.activatedRoute.params.subscribe({
            next: (params) => {
                const userId = params['id'];
                console.log(userId);
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

    loadUser(id: string): void {
        this.userHttpService.getUser(id).subscribe({
            next: (res: { user: User }) => {
                this.user = res.user;
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
            next: (res: CounterSet) => (this.stats = res),
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
