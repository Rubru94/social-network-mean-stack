import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserHttpService } from 'src/app/public/http/user.http.service';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { User } from 'src/app/public/models/user.model';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
    title: string;
    currentPage: number;
    users: User[];
    status: FormStatus;
    errMsg?: string;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private userHttpService: UserHttpService) {
        this.title = 'People';
        this.currentPage = 1;
        this.users = [];
        this.status = FormStatus.None;
    }

    async ngOnInit(): Promise<void> {
        this.currentPage = await this.actualPage();
        this.getUsers(this.currentPage);
        console.log(this.currentPage);
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    async actualPage(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.activatedRoute.params.subscribe({
                next: (params) => resolve(+params['page']),
                error: (err: Error) => {
                    this.status = FormStatus.Invalid;
                    this.errMsg = err.message;
                }
            });
        });
    }

    getUsers(page: number) {
        this.userHttpService.getUsers(page).subscribe({
            next: (res: { users: User[]; total: number; pages: number }) => {
                console.log(res);
                this.users = res.users;
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
}
