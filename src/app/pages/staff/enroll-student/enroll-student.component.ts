import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentOnYearService } from '../../../services/student-on-year.service';
import { EnrollmentRequest } from '../../../model/enrollment-request.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StudyProgram } from '../../../model/study-program.model';
import { StudyProgramService } from '../../../services/study-program.service';

@Component({
  selector: 'app-enroll-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enroll-student.component.html',
  styleUrls: ['./enroll-student.component.css']
})
export class EnrollStudentComponent implements OnInit {
  enrollmentForm: FormGroup;
  studyPrograms: StudyProgram[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private studentOnYearService: StudentOnYearService,
    private studyProgramService: StudyProgramService,
    private router: Router,
    private authService: AuthService
  ) {
    this.enrollmentForm = this.fb.group({
      studentIndex: ['', [Validators.required]],
      studyProgramIds: [[], [Validators.required]],
      year: ['', [Validators.required, Validators.min(1), Validators.max(4)]]
    });
  }

  ngOnInit(): void {
    this.loadStudyPrograms();
  }

  private loadStudyPrograms(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Nema tokena za autentifikaciju. Molimo prijavite se ponovo.';
      return;
    }

    this.studyProgramService.getAllStudyProgramsAsStaff(token).subscribe({
      next: (programs) => {
        console.log('Učitani studijski programi:', programs);
        this.studyPrograms = programs;
      },
      error: (error) => {
        this.errorMessage = 'Greška pri učitavanju studijskih programa.';
        console.error('Failed to load study programs', error);
      }
    });
  }

  enroll(): void {
    if (this.enrollmentForm.invalid) {
      this.errorMessage = 'Molimo popunite sva obavezna polja ispravno.';
      this.successMessage = '';
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    const request: EnrollmentRequest = this.enrollmentForm.value;
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'Nema tokena za autentifikaciju. Molimo prijavite se ponovo.';
      return;
    }

    if (!request.studyProgramIds || request.studyProgramIds.length === 0) {
        this.errorMessage = 'Molimo odaberite bar jedan studijski program.';
        return;
    }

    this.studentOnYearService.enrollStudent(request, token).subscribe({
      next: (response) => {
        this.successMessage = 'Student uspešno upisan!';
        console.log('Enrollment successful', response);
        this.enrollmentForm.reset();
        this.enrollmentForm.get('studyProgramIds')?.setValue([]);
      },
      error: (error) => {
        console.error('Enrollment failed', error);
        // Poboljšana poruka o grešci
        this.errorMessage = `Greška pri upisu: ${error.error || 'Molimo proverite unete podatke.'}`;
      }
    });
  }
}