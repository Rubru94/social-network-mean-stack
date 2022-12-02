import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    logout() {
        localStorage.clear();
    }

    get identity(): User {
        return new User(JSON.parse((localStorage.getItem('identity') as string) ?? null));
    }

    get token(): string {
        return localStorage.getItem('token') as string;
    }
}
