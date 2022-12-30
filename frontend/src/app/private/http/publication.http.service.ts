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
    apiPublication: string;
    apiPublicationPublic: string;

    constructor(private http: HttpClient, private userService: UserService) {
        this.apiPublication = `${environment.apiURL}/api/publication`;
        this.apiPublicationPublic = `${environment.apiURL}/api`;
    }

    create(publication: Partial<Publication>): Observable<Publication> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.post<Publication>(`${this.apiPublication}`, publication, { headers });
    }

    uploadImage(publication: Publication, file: File): Observable<Publication> {
        const formData: FormData = new FormData();
        formData.append('image', file, file.name);
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.post<Publication>(`${this.apiPublication}/upload-image/${publication._id}`, formData, { headers });
    }

    getImage(image: string = ''): Observable<{ base64: string }> {
        return this.http.get<{ base64: string }>(`${this.apiPublicationPublic}/image/publication/${image}`);
    }

    remove(id: string = ''): Observable<Publication[]> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.delete<Publication[]>(`${this.apiPublication}/${id}`, { headers });
    }

    getPublications(
        page: number = 1,
        itemsPerPage: number = 0,
        user: string = ''
    ): Observable<{ publications: Publication[]; itemsPerPage: number; total: number; pages: number }> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        const endpoint = `${this.apiPublication}/all-${user !== '' ? 'user' : 'following'}/${page}`;
        return this.http.get<{ publications: Publication[]; itemsPerPage: number; total: number; pages: number }>(endpoint, {
            headers,
            params: { itemsPerPage, user }
        });
    }
}
