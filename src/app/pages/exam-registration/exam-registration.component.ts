import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StudentCourse } from '../../model/student-course.model';
import { ExamTerm } from '../../model/exam-term.model';
import { ExamPeriod } from '../../model/exam.model'; 
import { StudentCourseService } from '../../services/student-course.service'; 
import { ExamTermService } from '../../services/exam-term.service';
import { ExamPeriodService } from '../../services/exam-period.service';
import { ExamApplicationService } from '../../services/exam-application.service';

@Component({
  selector: 'app-exam-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-registration.component.html',
  styleUrls: ['./exam-registration.component.css']
})
export class ExamRegistrationComponent implements OnInit {
  examPeriods: ExamPeriod[] = [];
  selectedPeriodId?: number;
  
  myCourses: StudentCourse[] = []; 
  allTerms: ExamTerm[] = [];
  
  selectedCourseName?: string; 
  selectedTermId?: number;
  availableTermsForCourse: ExamTerm[] = [];
  
  message = '';
  errorMessage = '';
  loading = false;

  constructor(
    private studentCourseService: StudentCourseService, 
    private examTermService: ExamTermService,
    private examPeriodService: ExamPeriodService,
    private examApplicationService: ExamApplicationService
  ) {}

  ngOnInit(): void {
    this.loadExamPeriods();
    this.loadAllTerms();
    this.loadMyCourses(); 
  }

  loadExamPeriods(): void {
    const token = localStorage.getItem('token') ?? '';
    this.examPeriodService.getAllPeriods(token).subscribe({
      next: (periods) => {
        this.examPeriods = periods; 
        this.filterAvailableTerms();
      },
      error: (err) => console.error('Error loading periods:', err)
    });
  }

  loadMyCourses(): void {
    const token = localStorage.getItem('token') ?? '';
    this.studentCourseService.getMyEnrolledCourses(token).subscribe({
      next: (courses) => {
        this.myCourses = courses;
        this.filterAvailableTerms();
      },
      error: (err) => console.error('Greška pri učitavanju upisanih predmeta:', err)
    });
  }

  loadAllTerms(): void {
    const token = localStorage.getItem('token') ?? '';
    this.examTermService.getAllTerms(token).subscribe({
      next: (terms) => {
        this.allTerms = terms;
        this.filterAvailableTerms();
      },
      error: (err) => console.error('Error loading terms:', err)
    });
  }

  onSelectionChange(): void {
    this.selectedTermId = undefined; 
    this.filterAvailableTerms();
  }

  filterAvailableTerms(): void {
    this.message = '';
    this.errorMessage = '';
    this.availableTermsForCourse = [];

    if (!this.selectedPeriodId || !this.selectedCourseName) {
      return;
    }

    this.availableTermsForCourse = this.allTerms.filter(term => 
      term.courseName === this.selectedCourseName && 
      term.periodId === this.selectedPeriodId
    );
  }

  applyForExam(): void {
    if (!this.selectedTermId) {
      this.errorMessage = 'Molimo odaberite termin za prijavu ispita.';
      this.message = '';
      return;
    }

    this.loading = true;
    const token = localStorage.getItem('token') ?? '';

    this.examApplicationService.applyForExam(token, this.selectedTermId).subscribe({
      next: () => {
        this.message = 'Ispit je uspješno prijavljen!';
        this.errorMessage = '';
        this.loading = false;
        this.selectedTermId = undefined;
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Greška pri prijavi. Mogući razlog: već prijavljen ili niste upisani na taj predmet/rok.';
        this.errorMessage = errorMsg;
        this.message = '';
        this.loading = false;
        console.error('Error applying for exam:', err);
      }
    });
  }
}