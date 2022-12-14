import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/env';
import { Follow } from '@public/models/follow.model';
import { UserService } from '@public/services/user.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FollowHttpService {
    api: string;

    constructor(private http: HttpClient, private userService: UserService) {
        this.api = `${environment.apiURL}/api/follow`;
    }

    create(follow: Partial<Follow>): Observable<Follow> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.post<Follow>(`${this.api}`, follow, { headers });
    }

    remove(id: string = ''): Observable<Follow[]> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.delete<Follow[]>(`${this.api}/${id}`, { headers });
    }

    getFollowing(
        page: number = 1,
        itemsPerPage = 0,
        user: string = ''
    ): Observable<{ follows: Follow[]; followings: string[]; followers: string[]; total: number; pages: number }> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<{ follows: Follow[]; followings: string[]; followers: string[]; total: number; pages: number }>(
            `${this.api}/following/${page}`,
            {
                headers,
                params: { itemsPerPage, user }
            }
        );
    }

    getFollowers(
        page: number = 1,
        itemsPerPage = 0,
        user: string = ''
    ): Observable<{ follows: Follow[]; followings: string[]; followers: string[]; total: number; pages: number }> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<{ follows: Follow[]; followings: string[]; followers: string[]; total: number; pages: number }>(
            `${this.api}/follower/${page}`,
            {
                headers,
                params: { itemsPerPage, user }
            }
        );
    }

    getFollows(followed: boolean = false): Observable<Follow[]> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<Follow[]>(`${this.api}`, {
            headers,
            params: { followed }
        });
    }
}
