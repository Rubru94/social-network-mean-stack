import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    title: string;
    token?: string;
    identity?: User;

    constructor(private router: Router, private userService: UserService) {
        this.title = 'Profile';
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
    }
}
