import { Component, DoCheck, OnInit } from '@angular/core';
import { UserService } from 'src/app/public/services/user.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, DoCheck {
    title: string;
    token?: string;

    constructor(private userService: UserService) {
        this.title = 'Social Network';
    }

    ngOnInit() {
        this.token = this.userService.token;
    }

    ngDoCheck(): void {
        this.token = this.userService.token;
    }
}
