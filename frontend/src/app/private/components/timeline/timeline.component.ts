import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { Publication } from 'src/app/public/models/publication.model';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';
import { environment } from '../../../../../environments/env';
import { PublicationHttpService } from '../../services/publication.http.service';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
    title: string;
    publications: Publication[];
    totalPages: number;
    token?: string;
    identity?: User;
    api: string;
    status: FormStatus;
    errMsg?: string;

    constructor(private router: Router, private userService: UserService, private publicationHttpService: PublicationHttpService) {
        this.title = 'Timeline';
        this.publications = [];
        this.totalPages = 1;
        this.api = `${environment.apiURL}/api`;
        this.status = FormStatus.None;
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.getUsers(1);
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    getUsers(page: number) {
        this.publicationHttpService.getPublications(page).subscribe({
            next: (res: { publications: Publication[]; total: number; pages: number }) => {
                this.publications = res.publications.map((p: Publication) => new Publication(p));
                this.totalPages = res.pages;
                console.log(res);
                if (res.pages && page > res.pages) {
                    this.router.navigateByUrl('/private/timeline');
                    this.ngOnInit();
                }
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    userFromPublication(publication: Publication): User {
        return new User(publication.user as User);
    }
}
