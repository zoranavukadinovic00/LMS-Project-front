import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseNotification } from '../../../model/course-notification.model';
import { CourseNotificationService } from '../../../services/course-notification.service';


@Component({
  selector: 'app-student-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-notifications.component.html',
  styleUrls: ['./student-notifications.component.css']
})
export class StudentNotificationsComponent implements OnInit {
  
  notifications: CourseNotification[] = [];

  constructor(private notificationService: CourseNotificationService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.notificationService.getByToken(token).subscribe(data => {
        this.notifications = data;
      });
    }
  }
}
