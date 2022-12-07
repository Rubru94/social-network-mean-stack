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
    currentPage: number;
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    token?: string;
    identity?: User;
    api: string;
    status: FormStatus;
    errMsg?: string;

    show: boolean;

    constructor(private router: Router, private userService: UserService, private publicationHttpService: PublicationHttpService) {
        this.title = 'Timeline';
        this.publications = [];
        this.currentPage = 1;
        this.totalItems = 0;
        this.totalPages = 1;
        this.itemsPerPage = 3;
        this.api = `${environment.apiURL}/api`;
        this.status = FormStatus.None;
        this.show = true;
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.loadPublications(this.currentPage);
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    userFromPublication(publication: Publication): User {
        return new User(publication.user as User);
    }

    loadPublications(page: number) {
        this.publicationHttpService.getPublications(page, this.itemsPerPage).subscribe({
            next: (res: { publications: Publication[]; itemsPerPage: number; total: number; pages: number }) => {
                this.publications = this.publications.concat(res.publications.map((p: Publication) => new Publication(p)));
                this.totalItems = res.total;
                this.totalPages = res.pages;
                this.itemsPerPage = res.itemsPerPage;

                if (this.publications.length === this.totalItems) this.show = false;

                /**
                 * @info Scroll animation using jQuery
                 */
                $('html, body').animate({ scrollTop: $('body').prop('scrollHeight') }, 500);

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

    showMore(): void {
        this.loadPublications(++this.currentPage);
    }
}
