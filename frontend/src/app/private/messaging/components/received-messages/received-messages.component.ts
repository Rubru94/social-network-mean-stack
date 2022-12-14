import { Component, OnInit } from '@angular/core';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { Message } from 'src/app/public/models/message.model';
import { User } from 'src/app/public/models/user.model';
import { environment } from 'environments/env';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/public/services/user.service';
import { MessageHttpService } from '../../http/message.http.service';

@Component({
    selector: 'app-received-messages',
    templateUrl: './received-messages.component.html',
    styleUrls: ['./received-messages.component.scss']
})
export class ReceivedMessagesComponent implements OnInit {
    title: string;
    messages: Message[];
    token?: string;
    identity?: User;
    api: string;
    status: FormStatus;
    errMsg?: string;

    currentPage: number;
    previousPage: number;
    nextPage: number;
    totalPages: number;
    itemsPerPage: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private messageHttpService: MessageHttpService
    ) {
        this.title = 'Received messages';
        this.messages = [];
        this.api = `${environment.apiURL}/api`;
        this.status = FormStatus.None;

        this.currentPage = 1;
        this.previousPage = 0;
        this.nextPage = 0;
        this.totalPages = 1;
        this.itemsPerPage = 2;
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.actualPage();
    }

    get FormStatus() {
        return FormStatus;
    }

    emitterFromMessage(message: Message): User {
        return new User(message.emitter as User);
    }

    receiverFromMessage(message: Message): User {
        return new User(message.receiver as User);
    }

    actualPage(): void {
        this.activatedRoute.params.subscribe({
            next: (params) => {
                const page = +params['page'];
                this.currentPage = page;
                this.nextPage = page + 1;
                this.previousPage = page - 1 > 0 ? page - 1 : 1;
                this.getMessages(this.currentPage);
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }

    getMessages(page: number) {
        this.messageHttpService.getReceivedMessages(page, this.itemsPerPage).subscribe({
            next: (res: { messages: Message[]; itemsPerPage: number; total: number; pages: number }) => {
                this.messages = res.messages;
                this.totalPages = res.pages;
                if (res.pages && page > res.pages) {
                    this.router.navigateByUrl('/private/messaging/received');
                    this.ngOnInit();
                }
                console.log(res);
            },
            error: (err: Error) => {
                this.status = FormStatus.Invalid;
                this.errMsg = err.message;
            }
        });
    }
}
