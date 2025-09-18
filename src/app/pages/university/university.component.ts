import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UniversityService } from '../../services/university.service';
import { University } from '../../model/university.model';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-university',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.css'],
})
export class UniversityComponent implements OnInit, OnDestroy {
  university: University | null = null;
  loading = true;
  error: string | null = null;
  
  isEditing = false;
  isAdmin = false;
  editableUniversity: University = {} as University;

  private destroy$ = new Subject<void>();

  constructor(
    private universityService: UniversityService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadUniversityData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  checkAdminRole(): void {
      const userRole = this.authService.getLoggedInUserRole();
      this.isAdmin = userRole === 'ADMIN';
  }

  loadUniversityData(): void {
    const id = '1';

    this.loading = true;
    this.error = null;

    this.universityService
      .getById(id)
      .pipe(takeUntil(this.destroy$), finalize(() => (this.loading = false)))
      .subscribe({
        next: (university) => {
          this.university = university;
          if (university.dateOfEstablishment) {
            university.dateOfEstablishment = new Date(university.dateOfEstablishment);
          }
        },
        error: (error) => {
          console.error('Error loading university:', error);
          if (error.status === 404) {
            this.handleError('A university with the given ID does not exist.');
          } else if (error.status === 500) {
            this.handleError('Server error. Please try again later.');
          } else {
            this.handleError('Failed to load university data.');
          }
        },
      });
  }
  
  onEditClick(): void {
      this.isEditing = true;
      this.editableUniversity = { ...this.university } as University;
  }
  
  onSaveClick(): void {
      if (!this.editableUniversity.id) {
          this.handleError("Cannot save a university without an ID.");
          return;
      }

      this.universityService.updateUniversity(this.editableUniversity)
          .subscribe({
              next: (updatedUniversity) => {
                  this.university = updatedUniversity;
                  this.isEditing = false;
              },
              error: (error) => {
                  this.handleError('Failed to update university data.');
                  console.error('Update error:', error);
              }
          });
  }
  
  onCancelClick(): void {
      this.isEditing = false;
  }

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
    this.university = null;
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}