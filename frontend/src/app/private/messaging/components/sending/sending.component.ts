import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/env';
import { Observable } from 'rxjs';
import { FollowHttpService } from 'src/app/private/http/follow.http.service';
import { Follow } from 'src/app/public/models/follow.model';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { Message } from 'src/app/public/models/message.model';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';
import { MessageHttpService } from '../../http/message.http.service';

@Component({
    selector: 'app-sending',
    templateUrl: './sending.component.html',
    styleUrls: ['./sending.component.scss']
})
export class SendingComponent implements OnInit {
    title: string;
    message: Message;
    follows: Follow[];
    token?: string;
    identity?: User;
    api: string;
    status: FormStatus;
    errMsg?: string;
    sendingForm: FormGroup;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private followHttpService: FollowHttpService,
        private messageHttpService: MessageHttpService,
        private fb: FormBuilder
    ) {
        this.title = 'Send messages';
        this.message = new Message();
        this.follows = [];
        this.api = `${environment.apiURL}/api`;
        this.status = FormStatus.None;
        this.sendingForm = this.fb.group({});
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;

        this.sendingForm = this.fb.group({
            text: new FormControl('', [Validators.required]),
            receiver: new FormControl(this.follows, [Validators.required])
        });

        this.getFollows();
    }

    get sendingFormControl(): { [key: string]: AbstractControl } {
        return this.sendingForm.controls;
    }

    get FormStatus() {
        return FormStatus;
    }

    userFromFollow(follow: Follow): User {
        return new User(follow.user as User);
    }

    isInvalidControl(field: string) {
        return this.sendingFormControl[field].invalid && (this.sendingFormControl[field].dirty || this.sendingFormControl[field].touched);
    }

    onSubmit(form: FormGroup) {
        this.message = new Message({ ...form.value, ...{ emitter: this.identity?._id } });
        console.log(this.message);
        this.messageHttpService.create(this.message).subscribe({
            next: (res: Message) => {
                this.status = FormStatus.Valid;
                form.reset();
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    getFollows(): void {
        const followed = true;
        this.followHttpService.getFollows(followed).subscribe({
            next: (res: Follow[]) => {
                this.follows = res;
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
