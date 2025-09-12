import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CourseNotification } from '../../../../model/course-notification.model';
import { CourseNotificationService } from '../../../../services/course-notification.service';
import { NotificationCreateComponent } from '../notification-create/notification-create.component';
import { NotificationUpdateComponent } from '../notification-update/notification-update.component';
import { ActivatedRoute } from '@angular/router';

type RightPanel = 'none' | 'create' | 'update';

@Component({
  selector: 'app-professor-notifications',
  standalone: true,
  imports: [CommonModule, NotificationCreateComponent, NotificationUpdateComponent],
  templateUrl: './professor-notifications.component.html',
  styleUrls: ['./professor-notifications.component.css']
})
export class ProfessorNotificationsComponent implements OnInit {

  notifications: CourseNotification[] = [];
  rightPanel: RightPanel = 'none';
  editing?: CourseNotification | null;
  courseId?: number;
  errorMsg = '';
  loading = false;

  constructor(private notificationService: CourseNotificationService, private route: ActivatedRoute) {}



  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId = +idParam;
      this.loadList();
    }

  }

  private loadList(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMsg = 'Not authenticated.';
      return;
    }

    this.loading = true;
    this.notificationService.getNotificationsByCourse(token, this.courseId!).subscribe({
      next: (data) => {
        const list = (data ?? []) as CourseNotification[];

        this.notifications = list.sort((a, b) => {
          const ta = a.postedAt ? new Date(a.postedAt).getTime() : 0;
          const tb = b.postedAt ? new Date(b.postedAt).getTime() : 0;
          return tb - ta;
        });

        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to load notifications.';
        this.loading = false;
      }
    });
  }

  
  openCreate(): void {
    this.rightPanel = 'create';
    this.editing = null;
  }

  openUpdate(note: CourseNotification): void {
    this.rightPanel = 'update';
    this.editing = note;
  }

  closePanel(): void {
    this.rightPanel = 'none';
    this.editing = null;
  }

  
  onCreated(created: CourseNotification): void {
    this.notifications = [created, ...this.notifications];
    this.closePanel();
  }

  onUpdated(updated: CourseNotification): void {
    this.notifications = this.notifications.map(n =>
      n.id === updated.id ? updated : n
    );
    this.closePanel();
  }

  
  delete(note: CourseNotification): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMsg = 'Not authenticated.';
      return;
    }
    if (!confirm('Are you sure you want to delete this notification?')) return;

    this.notificationService.deleteNotification(token, note.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== note.id);
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Failed to delete notification.';
      }
    });
  }

  
  trackById(_index: number, item: CourseNotification): number | string | undefined {
    return item.id;
  }
}
