import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Faculty } from '../model/faculty.model';
import { University } from '../model/university.model';



@Injectable({
  providedIn: 'root',
})
export class FacultyService {
  private apiUrl = 'http://localhost:8080/api/faculty';

  constructor(private http: HttpClient) {}

    getById(id:string): Observable<Faculty> {
      return this.http.get<Faculty>(`${this.apiUrl}/${id}`);
    }
   getUniversityData(): Observable<University> {
    return this.http.get<Faculty>(`${this.apiUrl}`);
   }
 

   getByUniversityId(universityId: string): Observable<Faculty[]> {
     return this.http.get<Faculty[]>(
       `${this.apiUrl}/university/${universityId}`
     );
   }

  
}
