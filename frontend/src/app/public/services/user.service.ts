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

    constructor(private http: HttpClient) {
        this.api = `${environment.apiURL}/api/user`;
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(`${this.api}/register`, user);
    }
}
