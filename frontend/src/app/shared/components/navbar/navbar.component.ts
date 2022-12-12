import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';
import { environment } from 'environments/env';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, DoCheck {
    title: string;
    token?: string;
    identity?: User;
    api: string;

    constructor(private router: Router, private userService: UserService) {
        this.title = 'Social Network';
        this.api = `${environment.apiURL}/api`;
    }

    get identityImageSource(): string {
        return `${this.api}/user/image/${this.identity?.image}`;
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
    }

    ngDoCheck(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
    }

    logout() {
        this.userService.logout();
        this.router.navigateByUrl('/');
    }
}
