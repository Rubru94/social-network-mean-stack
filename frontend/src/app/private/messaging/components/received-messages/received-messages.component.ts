import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-received-messages',
    templateUrl: './received-messages.component.html',
    styleUrls: ['./received-messages.component.scss']
})
export class ReceivedMessagesComponent implements OnInit {
    title: string;

    constructor() {
        this.title = 'Received messages';
    }

    ngOnInit(): void {}
}
