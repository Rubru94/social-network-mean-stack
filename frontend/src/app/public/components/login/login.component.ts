import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private userService: UserService) {
        this.title = 'Login';
        this.user = new User();
        this.loginForm = this.fb.group({});
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)])
        });
    }

    get loginFormControl(): { [key: string]: AbstractControl } {
        return this.loginForm.controls;
    }

    isInvalidControl(field: string) {
        return this.loginFormControl[field].invalid && (this.loginFormControl[field].dirty || this.loginFormControl[field].touched);
    }

    onSubmit(form: FormGroup) {
        this.user = new User(form.value);
    }
}
