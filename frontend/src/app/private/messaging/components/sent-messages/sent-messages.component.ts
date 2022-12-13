import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sent-messages',
    templateUrl: './sent-messages.component.html',
    styleUrls: ['./sent-messages.component.scss']
})
export class SentMessagesComponent implements OnInit {
    title: string;

    constructor() {
        this.title = 'Sent messages';
    }

    ngOnInit(): void {}
}
