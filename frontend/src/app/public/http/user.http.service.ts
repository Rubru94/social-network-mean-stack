import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/env';
import { CounterSet } from '../models/counter-set.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class UserHttpService {
    api: string;

    constructor(private http: HttpClient, private userService: UserService) {
        this.api = `${environment.apiURL}/api/user`;
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(`${this.api}/register`, user);
    }

    login(user: User, token: boolean = false): Observable<User | { token: string }> {
        return this.http.post<User | { token: string }>(`${this.api}/login`, user, { params: { token } });
    }

    counters(id: string = ''): Observable<CounterSet> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<CounterSet>(`${this.api}/counters/${id}`, { headers });
    }
}
