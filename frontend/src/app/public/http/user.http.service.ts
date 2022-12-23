import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/env';
import { Observable } from 'rxjs';
import { CounterSet } from '../models/counter-set.model';
import { Follow } from '../models/follow.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class UserHttpService {
    apiUser: string;
    apiUserPublic: string;

    constructor(private http: HttpClient, private userService: UserService) {
        this.apiUser = `${environment.apiURL}/api/user`;
        this.apiUserPublic = `${environment.apiURL}/api`;
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUserPublic}/register`, user);
    }

    login(user: User, token: boolean = false): Observable<User | { token: string }> {
        return this.http.post<User | { token: string }>(`${this.apiUserPublic}/login`, user, { params: { token } });
    }

    counters(id: string = ''): Observable<CounterSet> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<CounterSet>(`${this.apiUser}/counters`, { headers, params: { user: id } });
    }

    update(user: User): Observable<User> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.put<User>(`${this.apiUser}/update/${user._id}`, user, { headers });
    }

    uploadImage(user: User, file: File): Observable<User> {
        const formData: FormData = new FormData();
        formData.append('image', file, file.name);
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.post<User>(`${this.apiUser}/upload-image/${user._id}`, formData, { headers });
    }

    getUsers(
        page: number = 1,
        itemsPerPage = 0
    ): Observable<{ users: User[]; followings: string[]; followers: string[]; total: number; pages: number }> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<{ users: User[]; followings: string[]; followers: string[]; total: number; pages: number }>(
            `${this.apiUser}/all/${page}`,
            {
                headers,
                params: { itemsPerPage }
            }
        );
    }

    getUser(id: string = ''): Observable<{ user: User; following: Follow; follower: Follow }> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<{ user: User; following: Follow; follower: Follow }>(`${this.apiUser}/${id}`, { headers });
    }
}
