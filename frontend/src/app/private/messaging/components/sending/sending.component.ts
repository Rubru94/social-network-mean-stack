import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/env';
import { FollowHttpService } from '@private/http/follow.http.service';
import { MessageHttpService } from '@private/messaging/http/message.http.service';
import { Follow } from '@public/models/follow.model';
import { FormStatus } from '@public/models/form-status.model';
import { Message } from '@public/models/message.model';
import { User } from '@public/models/user.model';
import { UserService } from '@public/services/user.service';

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
