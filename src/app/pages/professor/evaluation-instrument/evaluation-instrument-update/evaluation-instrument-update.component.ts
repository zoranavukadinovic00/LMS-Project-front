import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EvaluationInstrument } from '../../../../model/evaluation-instrument.model';
import { EvaluationInstrumentService } from '../../../../services/evaluation-instrument.service';

@Component({
  selector: 'app-evaluation-instrument-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evaluation-instrument-update.component.html',
  styleUrls: ['./evaluation-instrument-update.component.css']
})
export class EvaluationInstrumentUpdateComponent implements OnInit, OnChanges {
  @Input() item!: EvaluationInstrument; 
  @Output() updated = new EventEmitter<EvaluationInstrument>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationInstrumentService
  ) {}

  private initForm() {
    if (!this.form) {
      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(200)]],
        points: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      });
    }
    if (this.item) {
      this.form.patchValue({
        name: this.item.name ?? '',
        points: this.item.points ?? null,
      });
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    this.initForm();
  }

  onSubmit(): void {
    if (this.form.invalid || !this.item) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload: EvaluationInstrument = {
      id: this.item.id,
      courseId: this.item.courseId,
      name: this.form.value.name,
      points: Number(this.form.value.points),
    };

    this.loading = true; this.errorMsg = '';
    this.evaluationService.updateEvaluationInstrument(token, payload).subscribe({
      next: (res) => {
        this.updated.emit(res);
        this.onCancel();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to update evaluation instrument.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
