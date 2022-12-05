import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserHttpService } from 'src/app/public/http/user.http.service';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { User } from 'src/app/public/models/user.model';
import { environment } from '../../../../../environments/env';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
    title: string;
    currentPage: number;
    previousPage: number;
    nextPage: number;
    totalPages: number;
    users: User[];
    follows: string[];
    status: FormStatus;
    errMsg?: string;
    followUserOver?: string;

    api: string;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private userHttpService: UserHttpService) {
        this.title = 'People';
        this.currentPage = 1;
        this.previousPage = 0;
        this.nextPage = 0;
        this.totalPages = 1;
        this.users = [];
        this.follows = [];
        this.status = FormStatus.None;
        this.api = `${environment.apiURL}/api`;
    }

    async ngOnInit(): Promise<void> {
        this.actualPage();
        console.log(this.currentPage);
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    actualPage(): void {
        this.activatedRoute.params.subscribe({
            next: (params) => {
                const page = +params['page'];
                this.currentPage = page;
                this.nextPage = page + 1;
                this.previousPage = page - 1 > 0 ? page - 1 : 1;
                this.getUsers(this.currentPage);
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    getUsers(page: number) {
        this.userHttpService.getUsers(page).subscribe({
            next: (res: { users: User[]; followings: string[]; followers: string[]; total: number; pages: number }) => {
                console.log(res);
                this.users = res.users;
                this.totalPages = res.pages;
                this.follows = res.followings;
                if (res.pages && page > res.pages) {
                    this.router.navigateByUrl('/private/people');
                    this.ngOnInit();
                }
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
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
}
