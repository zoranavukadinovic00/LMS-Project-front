import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseNotification } from '../../../../model/course-notification.model';
import { CourseNotificationService } from '../../../../services/course-notification.service';

@Component({
  selector: 'app-notification-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notification-update.component.html',
  styleUrls: ['./notification-update.component.css']
})
export class NotificationUpdateComponent implements OnInit, OnChanges {
  @Input() item!: CourseNotification;   
  @Input() courseId!: number;          
  @Output() updated = new EventEmitter<CourseNotification>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private notificationService: CourseNotificationService
  ) {}

  private initForm() {
    if (!this.form) {
      this.form = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(200)]],
        content: ['', [Validators.required, Validators.maxLength(1000)]],
      });
    }
    if (this.item) {
      this.form.patchValue({
        title: this.item.title ?? '',
        content: this.item.content ?? '',
      });
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initForm();
  }

  onSubmit(): void {
    
    if (this.form.invalid || !this.item) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    
    const resolvedCourseId = this.courseId ?? this.item.courseId;
    if (!resolvedCourseId) return;

    const payload: CourseNotification = {
      id: this.item.id,
      courseId: resolvedCourseId,
      title: this.form.value.title,
      content: this.form.value.content,
      
    };

    this.loading = true; 
    this.errorMsg = '';

    this.notificationService.updateNotification(token, payload).subscribe({
      next: (res) => {
        this.updated.emit(res);
        this.onCancel();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to update notification.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
