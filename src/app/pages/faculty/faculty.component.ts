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
      this.handleError('Nedostaje ID fakulteta u ruti.');
      return;
    }

    // Validacija ID-ja
    if (!/^\d+$/.test(id)) {
      this.handleError('Nevalidan ID fakulteta.');
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
          console.error('Greška pri učitavanju fakulteta:', error);
          if (error.status === 404) {
            this.handleError('Fakultet sa datim ID-jem ne postoji.');
          } else if (error.status === 500) {
            this.handleError('Greška na serveru. Molimo pokušajte ponovo kasnije.');
          } else {
            this.handleError('Greška pri učitavanju podataka o fakultetu.');
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

  // Helper metoda za proveru da li postoji validna email adresa
  isValidEmail(email?: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper metoda za formatiranje kontakt podataka kao HTML
  formatContactAsHtml(contact?: string): string {
    if (!contact) return 'Nije dostupno';
    return contact.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('<br>');
  }
}