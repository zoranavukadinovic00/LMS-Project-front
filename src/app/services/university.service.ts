import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { University } from '../model/university.model';



@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  private apiUrl = 'http://localhost:8080/api/university';

  constructor(private http: HttpClient) {}

  getById(id:string): Observable<University> {
   return this.http.get<University>(`${this.apiUrl}/${id}`);
  }
  
}
