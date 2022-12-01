import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/env';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    api: string;

    constructor(private httpClient: HttpClient) {
        this.api = `${environment.apiURL}/api/users`;
    }
}
