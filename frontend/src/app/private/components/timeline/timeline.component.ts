import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/env';
import { PublicationHttpService } from '@private/http/publication.http.service';
import { PublicationService } from '@private/services/publication.service';
import { FormStatus } from '@public/models/form-status.model';
import { Publication } from '@public/models/publication.model';
import { User } from '@public/models/user.model';
import { UserService } from '@public/services/user.service';

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
    showMorePublications: boolean;
    publicationImagesToShow: (string | null)[];

    @Input()
    userId?: string;

    constructor(
        private router: Router,
        private userService: UserService,
        private publicationService: PublicationService,
        private publicationHttpService: PublicationHttpService
    ) {
        this.title = 'Timeline';
        this.publications = [];
        this.currentPage = 1;
        this.totalItems = 0;
        this.totalPages = 1;
        this.itemsPerPage = 3;
        this.api = `${environment.apiURL}/api`;
        this.status = FormStatus.None;
        this.showMorePublications = true;
        this.publicationImagesToShow = [];
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.loadPublications(this.currentPage);
        this.publicationService.hasNewPublication().subscribe(() => this.reloadPublications());
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    get isProfileView(): boolean {
        return this.publicationService.isProfileView;
    }

    userFromPublication(publication: Publication): User {
        return new User(publication.user as User);
    }

    loadPublications(page: number): void {
        this.publicationHttpService.getPublications(page, this.itemsPerPage, this.userId).subscribe({
            next: (res: { publications: Publication[]; itemsPerPage: number; total: number; pages: number }) => {
                this.publications = this.publications.concat(res.publications.map((p: Publication) => new Publication(p)));
                this.publicationImagesToShow = Array(this.publications.length).fill(null);
                this.totalItems = res.total;
                this.totalPages = res.pages;
                this.itemsPerPage = res.itemsPerPage;

                if (this.publications.length === this.totalItems) this.showMorePublications = false;

                /**
                 * @info Scroll animation using jQuery
                 */
                $('html, body').animate({ scrollTop: $('html').prop('scrollHeight') }, 500);

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

    reloadPublications(): void {
        this.publications = [];
        this.publicationImagesToShow = [];
        this.currentPage = 1;
        this.showMorePublications = true;
        this.loadPublications(this.currentPage);
    }

    showMore(): void {
        this.loadPublications(++this.currentPage);
    }

    showImage(id: string, index: number): void {
        this.publicationImagesToShow[index] = this.publicationImagesToShow[index] !== id ? id : null;
    }

    removePublication(id: string): void {
        this.publicationHttpService.remove(id).subscribe({
            next: (res: Publication[]) => {
                this.reloadPublications();
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
