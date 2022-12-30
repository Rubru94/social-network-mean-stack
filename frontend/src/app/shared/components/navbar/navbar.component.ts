import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/env';
import { UserHttpService } from '@public/http/user.http.service';
import { User } from '@public/models/user.model';
import { UserService } from '@public/services/user.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, DoCheck {
    title: string;
    token?: string;
    identity?: User;
    userImage?: string;
    api: string;

    constructor(private router: Router, private userService: UserService, private userHttpService: UserHttpService) {
        this.title = 'Social Network';
        this.api = `${environment.apiURL}/api`;
    }

    setUserImage(): void {
        this.userHttpService.getImage(this.identity?.image).subscribe({
            next: (res: { base64: string }) => (this.userImage = res.base64)
        });
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        if (this.identity?.image) this.setUserImage();
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
