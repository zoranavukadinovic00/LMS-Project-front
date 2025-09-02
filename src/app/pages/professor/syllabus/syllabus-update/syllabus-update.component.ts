import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Syllabus } from '../../../../model/syllabus.model';
import { SyllabusService } from '../../../../services/syllabus.service';

@Component({
  selector: 'app-syllabus-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './syllabus-update.component.html',
  styleUrls: ['./syllabus-update.component.css']
})
export class SyllabusUpdateComponent implements OnInit, OnChanges {
  @Input() item!: Syllabus;                 // { id, description, courseId }
  @Output() updated = new EventEmitter<Syllabus>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private syllabusService: SyllabusService) {}

  private initForm() {
  if (!this.form) {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(4000)]],
    });
  }
  if (this.item) {
    this.form.patchValue({ description: this.item.description });
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

    const payload: Syllabus = {
      id: this.item.id,
      courseId: this.item.courseId,
      description: this.form.value.description
    };

    this.loading = true; this.errorMsg = '';
    this.syllabusService.updateSyllabus(token, payload).subscribe({
      next: (res) => {
        this.updated.emit(res);
        this.onCancel();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to update syllabus.';
        this.loading = false;
      }
    });
  }

  onCancel(): void { this.cancel.emit(); }
}
