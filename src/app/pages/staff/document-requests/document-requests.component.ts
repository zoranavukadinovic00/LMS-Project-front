import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentRequest, DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-staff-document-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-requests.component.html',
  styleUrls: ['./document-requests.component.css']
})
export class StaffDocumentRequestsComponent implements OnInit {
  pendingRequests: DocumentRequest[] = [];
  errorMessage: string | null = null;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.fetchPendingRequests();
  }

  fetchPendingRequests(): void {
    this.documentService.getPendingDocumentRequests().subscribe({
      next: (requests) => {
        this.pendingRequests = requests;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch pending requests.';
        console.error(err);
      }
    });
  }

  approveRequest(requestId: number): void {
    this.documentService.approveDocumentRequest(requestId).subscribe({
      next: () => {
        this.fetchPendingRequests();
      },
      error: (err) => {
        this.errorMessage = 'Failed to approve request.';
        console.error(err);
      }
    });
  }

  rejectRequest(requestId: number): void {
    this.documentService.rejectDocumentRequest(requestId).subscribe({
      next: () => {
        this.fetchPendingRequests();
      },
      error: (err) => {
        this.errorMessage = 'Failed to reject request.';
        console.error(err);
      }
    });
  }
}