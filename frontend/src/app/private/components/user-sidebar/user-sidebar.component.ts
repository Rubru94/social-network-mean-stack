import { Component, DoCheck, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CounterSet } from 'src/app/public/models/counter-set.model';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { Publication } from 'src/app/public/models/publication.model';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';
import { environment } from '../../../../../environments/env';

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

    constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
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
        console.log(this.publication);
        /*
      this.userHttpService.login(this.user).subscribe({
          next: (res: User | { token: string }) => {
              localStorage.setItem('identity', JSON.stringify(res));
              this.requestToken();
              this.status = FormStatus.Valid;
              form.reset();
          },
          error: (err: Error) => {
              this.status = FormStatus.Invalid;
              this.errMsg = err.message;
          }
      }); */
    }

    onFileSelected(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        this.fileInput = element.files?.[0];
    }
}
