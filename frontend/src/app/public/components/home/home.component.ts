import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    title: string;

    constructor(private userService: UserService) {
        this.title = 'Welcome to Social Network!!';
    }

    get token() {
        return this.userService.token;
    }
}
