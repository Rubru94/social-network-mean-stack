import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    errMsg?: string;
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
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
        this.userService.login(this.user).subscribe({
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
        });
    }

    requestToken() {
        this.userService.login(this.user, true).subscribe({
            next: (res: User | { token: string }) => {
                localStorage.setItem('token', (res as { token: string })?.token);
                this.router.navigateByUrl('/');
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
