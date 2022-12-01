import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormStatus } from '../../models/form-status.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    title: string;
    user: User;
    status: FormStatus;
    token?: string;
    errMsg?: string;
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private userService: UserService) {
        this.title = 'Login';
        this.user = new User();
        this.status = FormStatus.None;
        this.loginForm = this.fb.group({});
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(4)])
        });
    }

    get loginFormControl(): { [key: string]: AbstractControl } {
        return this.loginForm.controls;
    }

    get FormStatus() {
        return FormStatus;
    }

    isInvalidControl(field: string) {
        return this.loginFormControl[field].invalid && (this.loginFormControl[field].dirty || this.loginFormControl[field].touched);
    }

    onSubmit(form: FormGroup) {
        this.user = new User(form.value);
        this.userService.login(this.user, true).subscribe({
            next: (res: { token: string }) => {
                this.token = res?.token;
                console.log(this.token);
                this.status = FormStatus.Valid;
                form.reset();
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
