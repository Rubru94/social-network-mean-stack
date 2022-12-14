import { Component, DoCheck, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@environments/env';
import { PublicationHttpService } from '@private/http/publication.http.service';
import { PublicationService } from '@private/services/publication.service';
import { CounterSet } from '@public/models/counter-set.model';
import { FormStatus } from '@public/models/form-status.model';
import { Publication } from '@public/models/publication.model';
import { User } from '@public/models/user.model';
import { UserService } from '@public/services/user.service';

@Component({
    selector: 'app-user-sidebar',
    templateUrl: './user-sidebar.component.html',
    styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent implements OnInit, DoCheck {
    title: string;
    counterSet?: CounterSet;
    token?: string;
    identity?: User;
    api: string;
    publication: Publication;
    status: FormStatus;
    errMsg?: string;

    publicationForm: FormGroup;
    fileInput?: File | null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private publicationService: PublicationService,
        private publicationHttpService: PublicationHttpService
    ) {
        this.title = 'User data';
        this.publication = new Publication();
        this.api = `${environment.apiURL}/api`;
        this.status = FormStatus.None;
        this.publicationForm = this.fb.group({});
    }

    get publicationFormControl(): { [key: string]: AbstractControl } {
        return this.publicationForm.controls;
    }

    isInvalidControl(field: string): boolean {
        return (
            this.publicationFormControl[field].invalid &&
            (this.publicationFormControl[field].dirty || this.publicationFormControl[field].touched)
        );
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    get identityImageSource(): string {
        return `${this.api}/user/image/${this.identity?.image}`;
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.counterSet = this.userService.counterSet;

        this.publicationForm = this.fb.group({
            text: new FormControl('', [Validators.required]),
            file: new FormControl()
        });
    }

    ngDoCheck(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.counterSet = this.userService.counterSet;
    }

    onSubmit(form: FormGroup): void {
        this.publication = new Publication({ ...form.value, ...{ user: this.identity?._id } });

        this.publicationHttpService.create(this.publication).subscribe({
            next: (res: Publication) => {
                this.status = FormStatus.Valid;
                form.reset();
                this.router.navigateByUrl('/private/timeline');
                this.publication = new Publication(res);
                if (this.fileInput) {
                    this.publicationHttpService.uploadImage(this.publication, this.fileInput).subscribe({
                        next: (res: Publication) => {
                            this.publication = new Publication(res);
                            this.publicationService.newPublicationEvent();
                            form.controls['file'].reset();
                        },
                        error: (err: Error) => {
                            this.status = FormStatus.Invalid;
                            this.errMsg = err.message;
                        }
                    });
                } else this.publicationService.newPublicationEvent();
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    onFileSelected(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        this.fileInput = element.files?.[0];
    }
}
