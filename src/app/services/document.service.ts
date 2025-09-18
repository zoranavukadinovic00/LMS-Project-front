import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api';

export interface DocumentRequest {
  id: number;
  studentId?: number;
  studentUsername?: string;
  studentFullName?: string;
  documentType: 'STUDENT_STATUS' | 'TRANSCRIPT' | 'VISA_CONFIRMATION' | 'OTHER';
  purpose: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate?: Date;
  completionDate?: Date;
  downloadLink?: string;
  staffUsername?: string;
}

export interface CreateDocumentRequest {
  documentType: 'STUDENT_STATUS' | 'TRANSCRIPT' | 'VISA_CONFIRMATION' | 'OTHER';
  purpose: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = API_URL;

  constructor(private http: HttpClient) { }

  createDocumentRequest(request: CreateDocumentRequest): Observable<DocumentRequest> {
    return this.http.post<DocumentRequest>(`${this.apiUrl}/student/document-requests`, request);
  }

  getMyDocumentRequests(): Observable<DocumentRequest[]> {
    return this.http.get<DocumentRequest[]>(`${this.apiUrl}/student/document-requests`);
  }

  getPendingDocumentRequests(): Observable<DocumentRequest[]> {
    return this.http.get<DocumentRequest[]>(`${this.apiUrl}/staff/document-requests`);
  }

  approveDocumentRequest(requestId: number): Observable<DocumentRequest> {
    return this.http.put<DocumentRequest>(`${this.apiUrl}/staff/document-requests/${requestId}/approve`, {});
  }

  rejectDocumentRequest(requestId: number): Observable<DocumentRequest> {
    return this.http.put<DocumentRequest>(`${this.apiUrl}/staff/document-requests/${requestId}/reject`, {});
  }
}