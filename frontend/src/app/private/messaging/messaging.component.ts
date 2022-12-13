import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-messaging',
    templateUrl: './messaging.component.html',
    styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit {
    title: string;

    constructor() {
        this.title = 'Private messages';
    }

    ngOnInit(): void {}
}
