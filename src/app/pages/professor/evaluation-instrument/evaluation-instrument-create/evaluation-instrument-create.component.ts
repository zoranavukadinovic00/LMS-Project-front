import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EvaluationInstrument } from '../../../../model/evaluation-instrument.model';
import { EvaluationInstrumentService } from '../../../../services/evaluation-instrument.service';

@Component({
  selector: 'app-evaluation-instrument-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evaluation-instrument-create.component.html',
  styleUrls: ['./evaluation-instrument-create.component.css']
})
export class EvaluationInstrumentCreateComponent implements OnInit {
  @Input() courseId!: number;
  @Output() created = new EventEmitter<EvaluationInstrument>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationInstrumentService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      points: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.courseId) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload: EvaluationInstrument = {
      id: 0, 
      name: this.form.value.name,
      points: Number(this.form.value.points),
      courseId: this.courseId
    };

    this.loading = true; this.errorMsg = '';
    this.evaluationService.createEvaluationInstrument(token, payload).subscribe({
      next: (created) => {
        this.created.emit(created);
        this.onCancel();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to create evaluation instrument.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}