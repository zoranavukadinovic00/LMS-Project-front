import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TermTopic } from '../../../../model/term-topic.model';
import { TermTopicService } from '../../../../services/term-topic.service';


@Component({
  selector: 'app-term-topic-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './term-topic-create.component.html',
  styleUrls: ['./term-topic-create.component.css']
})
export class TermTopicCreateComponent implements OnInit {
  @Input() courseId!: number;
  @Output() created = new EventEmitter<TermTopic>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private termTopicService: TermTopicService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      termNumber: [1, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.courseId) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload: TermTopic = {
      id: 0,
      termNumber: Number(this.form.value.termNumber),
      description: this.form.value.description,
      courseId: this.courseId
    };

    this.loading = true; this.errorMsg = '';
    this.termTopicService.createTermTopic(token, payload).subscribe({
      next: (created) => {
        this.created.emit(created);
        this.onCancel();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to create term topic.';
        this.loading = false;
      }
    });
  }

  onCancel() { this.cancel.emit(); }
}
