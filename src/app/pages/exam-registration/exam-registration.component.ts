import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exam, ExamPeriod } from '../../model/exam.model';

@Component({
  selector: 'app-exam-registration',
  templateUrl: './exam-registration.component.html',
  styleUrls: ['./exam-registration.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ExamRegistrationComponent implements OnInit {
  examPeriods: ExamPeriod[] = [];
  selectedPeriodId: number | null = null;

  availableExams: Exam[] = [];
  selectedExams: number[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  token = 'student-auth-token'; // Normally from AuthService
  useMock = true; // Switch to false to call real backend

  loadingPeriods = false;
  loadingExams = false;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.fetchExamPeriods();
  }

  fetchExamPeriods() {
    this.loadingPeriods = true;
    this.examService.getExamPeriods(this.token).subscribe((periods) => {
      this.examPeriods = periods;
      this.loadingPeriods = false;
    });
  }

  onPeriodChange() {
    if (!this.selectedPeriodId) return;
    this.loadingExams = true;
    this.examService
      .getAvailableExams(this.token, this.selectedPeriodId)
      .subscribe((exams) => {
        this.availableExams = exams;
        this.selectedExams = [];
        this.loadingExams = false;
      });
  }

  toggleExamSelection(examId: number) {
    if (this.selectedExams.includes(examId)) {
      this.selectedExams = this.selectedExams.filter((id) => id !== examId);
    } else {
      this.selectedExams.push(examId);
    }
  }

  registerSelectedExams() {
    if (this.selectedExams.length === 0) return;
    this.examService.registerExams(this.token, this.selectedExams).subscribe({
      next: () => {
        this.successMessage = 'Exams registered successfully!';
        this.errorMessage = '';
        this.selectedExams = [];
      },
      error: () => {
        this.errorMessage = 'Failed to register exams.';
        this.successMessage = '';
      },
    });
  }
}
