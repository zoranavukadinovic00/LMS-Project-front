import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculties } from '../model/faculties.model';

@Injectable({ providedIn: 'root' })
export class FacultiesService {
  private apiUrl = 'http://localhost:8080/api/faculties';

  constructor(private http: HttpClient) {}

  private headers(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getAll(): Observable<Faculties[]> {
    return this.http.get<Faculties[]>(`${this.apiUrl}`);
  }
}
