import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Syllabus } from '../../../../model/syllabus.model';
import { SyllabusService } from '../../../../services/syllabus.service';

@Component({
  selector: 'app-syllabus-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './syllabus-create.component.html',
  styleUrls: ['./syllabus-create.component.css']
})
export class SyllabusCreateComponent implements OnInit {
  @Input() courseId!: number;         
  @Output() created = new EventEmitter<Syllabus>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private syllabusService: SyllabusService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(4000)]],
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.courseId) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload: Syllabus = {
      id: 0, 
      description: this.form.value.description,
      courseId: this.courseId
    };

    this.loading = true; this.errorMsg = '';
    this.syllabusService.createSyllabus(token, payload).subscribe({
      next: (created) => {
        this.created.emit(created);
        this.onCancel();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to create syllabus.';
        this.loading = false;
      }
    });
  }

  onCancel() { this.cancel.emit(); }
}
