import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    title: string;

    constructor() {
        this.title = 'Welcome to Social Network!!';
    }
}
