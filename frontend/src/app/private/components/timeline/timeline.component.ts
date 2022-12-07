import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormStatus } from 'src/app/public/models/form-status.model';
import { User } from 'src/app/public/models/user.model';
import { UserService } from 'src/app/public/services/user.service';
import { environment } from '../../../../../environments/env';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
    title: string;
    token?: string;
    identity?: User;
    api: string;
    status: FormStatus;
    errMsg?: string;

    constructor(private router: Router, private userService: UserService) {
        this.title = 'Timeline';
        this.api = `${environment.apiURL}/api`;
        this.status = FormStatus.None;
    }

    ngOnInit(): void {
        this.token = this.userService.token;
        this.identity = this.userService.identity;
    }

    get FormStatus(): typeof FormStatus {
        return FormStatus;
    }
}
