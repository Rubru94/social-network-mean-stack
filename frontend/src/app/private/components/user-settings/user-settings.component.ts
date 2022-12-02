import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
    title: string;
    token: string;
    user: User;

    constructor(private router: Router, private userService: UserService) {
        this.title = 'User settings';
        this.token = this.userService.token;
        this.user = this.userService.identity;
    }

    ngOnInit() {}
}
