import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CounterSet } from 'src/app/public/models/counter-set.model';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';
import { environment } from '../../../../../environments/env';

@Component({
    selector: 'app-user-sidebar',
    templateUrl: './user-sidebar.component.html',
    styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent implements OnInit, DoCheck {
    counterSet?: CounterSet;
    token?: string;
    identity?: User;
    api: string;
    status: FormStatus;
    errMsg?: string;

    constructor(private router: Router, private userService: UserService) {
        this.api = `${environment.apiURL}/api`;
        this.status = FormStatus.None;
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }

    get identityImageSource(): string {
        return `${this.api}/user/image/${this.identity?.image}`;
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.counterSet = this.userService.counterSet;
    }

    ngDoCheck(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
        this.counterSet = this.userService.counterSet;
    }
}
