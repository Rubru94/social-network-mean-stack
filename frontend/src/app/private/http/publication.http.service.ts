import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/env';
import { Publication } from '@public/models/publication.model';
import { UserService } from '@public/services/user.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PublicationHttpService {
    api: string;

    constructor(private http: HttpClient, private userService: UserService) {
        this.api = `${environment.apiURL}/api/publication`;
    }

    create(publication: Partial<Publication>): Observable<Publication> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.post<Publication>(`${this.api}`, publication, { headers });
    }

    uploadImage(publication: Publication, file: File): Observable<Publication> {
        const formData: FormData = new FormData();
        formData.append('image', file, file.name);
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.post<Publication>(`${this.api}/upload-image/${publication._id}`, formData, { headers });
    }

    remove(id: string = ''): Observable<Publication[]> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.delete<Publication[]>(`${this.api}/${id}`, { headers });
    }

    getPublications(
        page: number = 1,
        itemsPerPage: number = 0,
        user: string = ''
    ): Observable<{ publications: Publication[]; itemsPerPage: number; total: number; pages: number }> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        const endpoint = `${this.api}/all-${user !== '' ? 'user' : 'following'}/${page}`;
        return this.http.get<{ publications: Publication[]; itemsPerPage: number; total: number; pages: number }>(endpoint, {
            headers,
            params: { itemsPerPage, user }
        });
    }
}
