import { Injectable } from '@angular/core';
import { environment } from 'environments/env';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    api: string;

    constructor() {
        this.api = `${environment.apiURL}`;
    }

    get hasAuth(): boolean {
        return !!localStorage.getItem('token');
    }
}
