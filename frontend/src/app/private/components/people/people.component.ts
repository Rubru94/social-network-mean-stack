import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserHttpService } from 'src/app/public/http/user.http.service';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
    title: string;

    constructor(private router: Router, private userHttpService: UserHttpService) {
        this.title = 'People';
    }

    ngOnInit(): void {}
}
