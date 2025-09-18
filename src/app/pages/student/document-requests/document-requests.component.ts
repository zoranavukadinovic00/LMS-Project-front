import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentRequest, DocumentService, CreateDocumentRequest } from '../../../services/document.service';

@Component({
  selector: 'app-document-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-requests.component.html',
  styleUrls: ['./document-requests.component.css']
})
export class DocumentRequestsComponent implements OnInit {
  documentRequests: DocumentRequest[] = [];
  newRequest: CreateDocumentRequest = {
    documentType: 'STUDENT_STATUS',
    purpose: ''
  };
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.fetchMyRequests();
  }

  fetchMyRequests(): void {
    this.documentService.getMyDocumentRequests().subscribe({
      next: (requests: DocumentRequest[]) => {
        this.documentRequests = requests;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to fetch document requests.';
        console.error(err);
      }
    });
  }

  submitRequest(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (!this.newRequest.purpose) {
      this.errorMessage = 'Purpose is required.';
      return;
    }

    this.documentService.createDocumentRequest(this.newRequest).subscribe({
      next: () => {
        this.successMessage = 'Document request submitted successfully!';
        this.newRequest.purpose = ''; 
        this.fetchMyRequests(); 
      },
      error: (err) => {
        this.errorMessage = 'Failed to submit document request.';
        console.error(err);
      }
    });
  }
}