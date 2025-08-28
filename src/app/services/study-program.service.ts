import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { StudyProgram } from '../model/study-program.model';
import { Course } from '../model/course.model';



@Injectable({
  providedIn: 'root',
})
export class StudyProgramService {
  private apiUrl = 'http://localhost:8080/api/studyPrograms';

  constructor(private http: HttpClient) {}

  getById(id: number | string): Observable<StudyProgram | null> {
    return this.http.get<StudyProgram>(`${this.apiUrl}/${id}`);
  }

  
  getByFacultyId(facultyId: number | string): Observable<StudyProgram[]> {
    return this.http.get<StudyProgram[]>(`${this.apiUrl}/faculty/${facultyId}`);
  }

  
}
