import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sending',
    templateUrl: './sending.component.html',
    styleUrls: ['./sending.component.scss']
})
export class SendingComponent implements OnInit {
    title: string;

    constructor() {
        this.title = 'Send messages';
    }

    ngOnInit(): void {}
}
