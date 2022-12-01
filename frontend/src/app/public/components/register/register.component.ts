import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

enum RegisterStatus {
    Valid,
    Invalid,
    None
}
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    title: string;
    user: User;
    status: RegisterStatus;
    errMsg?: string;

    registerForm: FormGroup;

    constructor(private fb: FormBuilder, private userService: UserService) {
        this.title = 'Register';
        this.user = new User();
        this.status = RegisterStatus.None;
        this.registerForm = this.fb.group({});
    }

    ngOnInit() {
        this.registerForm = this.fb.group({
            name: new FormControl('', [Validators.required]),
            surname: new FormControl('', [Validators.required]),
            nick: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)])
        });
    }

    get registerFormControl(): { [key: string]: AbstractControl } {
        return this.registerForm.controls;
    }

    get RegisterStatus() {
        return RegisterStatus;
    }

    isInvalidControl(field: string) {
        return (
            this.registerFormControl[field].invalid && (this.registerFormControl[field].dirty || this.registerFormControl[field].touched)
        );
    }

    async onSubmit(form: FormGroup) {
        this.user = new User(form.value);
        this.userService.register(this.user).subscribe({
            next: (user: User) => {
                this.status = RegisterStatus.Valid;
                form.reset();
            },
            error: (err: Error) => {
                this.status = RegisterStatus.Invalid;
                this.errMsg = err.message;
            }
            /* complete: () => console.info('complete') */
        });
    }
}
