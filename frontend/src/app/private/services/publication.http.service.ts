import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publication } from 'src/app/public/models/publication.model';
import { UserService } from 'src/app/public/services/user.service';
import { environment } from '../../../../environments/env';

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
        itemsPerPage = 0
    ): Observable<{ publications: Publication[]; itemsPerPage: number; total: number; pages: number }> {
        const headers = new HttpHeaders().set('Authorization', this.userService.token);
        return this.http.get<{ publications: Publication[]; itemsPerPage: number; total: number; pages: number }>(
            `${this.api}/all-following/${page}`,
            {
                headers,
                params: { itemsPerPage }
            }
        );
    }
}
