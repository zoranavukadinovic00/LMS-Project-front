import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UniversityService } from '../../services/university.service';
import { University } from '../../model/university.model';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-university',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.css'],
})
export class UniversityComponent implements OnInit, OnDestroy {
  university: University | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private universityService: UniversityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUniversityData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
            // Convert incoming date string to a Date object
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

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
    this.university = null;
  }

  // Helper for formatting dates
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
