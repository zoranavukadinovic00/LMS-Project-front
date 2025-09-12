import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FacultyService } from '../../services/faculty.service';
import { Faculty } from '../../model/faculty.model';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-faculty',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit, OnDestroy {
  faculty: Faculty | null = null;
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private facultyService: FacultyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadFacultyData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFacultyData(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.handleError('Faculty ID is missing in the route.');
      return;
    }

    if (!/^\d+$/.test(id)) {
      this.handleError('Invalid faculty ID.');
      return;
    }

    this.loading = true;
    this.error = null;

    this.facultyService.getById(id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (faculty) => {
          this.faculty = faculty;
        },
        error: (error) => {
          console.error('Error loading faculty:', error);
          if (error.status === 404) {
            this.handleError('Faculty with the given ID does not exist.');
          } else if (error.status === 500) {
            this.handleError('Server error. Please try again later.');
          } else {
            this.handleError('Error loading faculty data.');
          }
        }
      });
  }

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
    this.faculty = null;
  }

  formatContact(contact?: string): string[] {
    if (!contact) return [];
    return contact.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  isValidEmail(email?: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  formatContactAsHtml(contact?: string): string {
    if (!contact) return 'Not available';
    return contact.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('<br>');
  }
}
