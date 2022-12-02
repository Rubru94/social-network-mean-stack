import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserHttpService } from 'src/app/public/http/user.http.service';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
    title: string;
    token: string;
    user: User;
    status: FormStatus;
    errMsg?: string;
    userSettingsForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private userService: UserService,
        private userHttpService: UserHttpService
    ) {
        this.title = 'User settings';
        this.token = this.userService.token;
        this.user = this.userService.identity;
        this.status = FormStatus.None;
        this.userSettingsForm = this.fb.group({});
    }

    ngOnInit() {
        this.userSettingsForm = this.fb.group({
            name: new FormControl(this.user.name, [Validators.required]),
            surname: new FormControl(this.user.surname, [Validators.required]),
            nick: new FormControl(this.user.nick, [Validators.required]),
            email: new FormControl(this.user.email, [Validators.required, Validators.email])
            // password: new FormControl('', [Validators.required, Validators.minLength(4)])
        });
    }

    get userSettingsFormControl(): { [key: string]: AbstractControl } {
        return this.userSettingsForm.controls;
    }

    get FormStatus() {
        return FormStatus;
    }

    isInvalidControl(field: string) {
        return (
            this.userSettingsFormControl[field].invalid &&
            (this.userSettingsFormControl[field].dirty || this.userSettingsFormControl[field].touched)
        );
    }

    onSubmit(form: FormGroup) {
        this.user = { ...this.user, ...form.value };
        this.userHttpService.update(this.user).subscribe({
            next: (res: User) => {
                this.status = FormStatus.Valid;
                localStorage.setItem('identity', JSON.stringify(res));
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
