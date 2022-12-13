import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from 'src/app/public/models/message.model';
import { environment } from 'environments/env';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/public/services/user.service';

@Injectable({
    providedIn: 'root'
})
export class MessageHttpService {
    api: string;
    message: Message;

    constructor(private http: HttpClient, private userService: UserService) {
        this.api = `${environment.apiURL}/api/message`;
        this.message = new Message();
    }

    create(message: Partial<Message>): Observable<Message> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.post<Message>(`${this.api}`, message, { headers });
    }

    getReceivedMessages(
        page: number = 1,
        itemsPerPage: number = 0
    ): Observable<{ messages: Message[]; itemsPerPage: number; total: number; pages: number }> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<{ messages: Message[]; itemsPerPage: number; total: number; pages: number }>(`${this.api}/received/${page}`, {
            headers,
            params: { itemsPerPage }
        });
    }

    getSentMessages(
        page: number = 1,
        itemsPerPage: number = 0
    ): Observable<{ messages: Message[]; itemsPerPage: number; total: number; pages: number }> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<{ messages: Message[]; itemsPerPage: number; total: number; pages: number }>(`${this.api}/sent/${page}`, {
            headers,
            params: { itemsPerPage }
        });
    }
}
