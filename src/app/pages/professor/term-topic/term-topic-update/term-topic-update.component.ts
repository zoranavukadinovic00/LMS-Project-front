import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TermTopic } from '../../../../model/term-topic.model';
import { TermTopicService } from '../../../../services/term-topic.service';


@Component({
  selector: 'app-term-topic-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './term-topic-update.component.html',
  styleUrls: ['./term-topic-update.component.css']
})
export class TermTopicUpdateComponent implements OnInit, OnChanges {
  @Input() item!: TermTopic; 
  @Output() updated = new EventEmitter<TermTopic>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private termTopicService: TermTopicService) {}

  private initForm() {
    if (!this.form) {
      this.form = this.fb.group({
        termNumber: [1, [Validators.required, Validators.min(1)]],
        description: ['', [Validators.required, Validators.maxLength(2000)]],
      });
    }
    if (this.item) {
      this.form.patchValue({
        termNumber: this.item.termNumber ?? 1,
        description: this.item.description ?? '',
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

    const payload: TermTopic = {
      id: this.item.id,
      courseId: this.item.courseId,
      termNumber: Number(this.form.value.termNumber),
      description: this.form.value.description
    };

    this.loading = true; this.errorMsg = '';
    this.termTopicService.updateTermTopic(token, payload).subscribe({
      next: (res) => {
        this.updated.emit(res);
        this.onCancel();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to update term topic.';
        this.loading = false;
      }
    });
  }

  onCancel(): void { this.cancel.emit(); }
}
