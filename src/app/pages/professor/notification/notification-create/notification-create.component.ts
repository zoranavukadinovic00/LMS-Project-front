import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseNotification } from '../../../../model/course-notification.model';
import { CourseNotificationService } from '../../../../services/course-notification.service';

@Component({
  selector: 'app-notification-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification-create.component.html',
  styleUrls: ['./notification-create.component.css']
})
export class NotificationCreateComponent implements OnInit {
  @Input() courseId!: number;
  @Output() created = new EventEmitter<CourseNotification>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private notificationService: CourseNotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.courseId) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload: CourseNotification = {
      id: 0, 
      courseName: '', 
      courseId: this.courseId,
      title: this.form.value.title,
      content: this.form.value.content,
      postedAt: null
    };

    this.loading = true;
    this.errorMsg = '';

    this.notificationService.createNotification(token, payload).subscribe({
      next: (created) => {
        this.created.emit(created);
        this.onCancel();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to create notification.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
