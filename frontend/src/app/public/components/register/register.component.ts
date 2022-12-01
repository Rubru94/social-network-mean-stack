import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormStatus } from '../../models/form-status.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    title: string;
    user: User;
    status: FormStatus;
    errMsg?: string;
    registerForm: FormGroup;

    constructor(private fb: FormBuilder, private userService: UserService) {
        this.title = 'Register';
        this.user = new User();
        this.status = FormStatus.None;
        this.registerForm = this.fb.group({});
    }

    ngOnInit() {
        this.registerForm = this.fb.group({
            name: new FormControl('', [Validators.required]),
            surname: new FormControl('', [Validators.required]),
            nick: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(4)])
        });
    }

    get registerFormControl(): { [key: string]: AbstractControl } {
        return this.registerForm.controls;
    }

    get FormStatus() {
        return FormStatus;
    }

    isInvalidControl(field: string) {
        return (
            this.registerFormControl[field].invalid && (this.registerFormControl[field].dirty || this.registerFormControl[field].touched)
        );
    }

    onSubmit(form: FormGroup) {
        this.user = new User(form.value);
        this.userService.register(this.user).subscribe({
            next: (res: User) => {
                this.status = FormStatus.Valid;
                form.reset();
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
            /* complete: () => console.info('complete') */
        });
    }
}
