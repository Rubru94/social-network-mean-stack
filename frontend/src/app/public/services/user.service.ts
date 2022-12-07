import { Injectable } from '@angular/core';
import { CounterSet } from '../models/counter-set.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    get identity(): User {
        return new User(JSON.parse((localStorage.getItem('identity') as string) ?? null));
    }

    get token(): string {
        return localStorage.getItem('token') as string;
    }

    get counterSet(): CounterSet {
        return new CounterSet(JSON.parse((localStorage.getItem('counterSet') as string) ?? null));
    }

    logout() {
        localStorage.clear();
    }
}
