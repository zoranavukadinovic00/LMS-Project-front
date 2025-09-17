import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamPeriodCreateComponent } from '../exam-period-create/exam-period-create.component';
import { ExamPeriodUpdateComponent } from '../exam-period-update/exam-period-update.component';
import { ExamPeriod } from '../../../model/exam.model';
import { ExamPeriodService } from '../../../services/exam-period.service';

type RightPanel = 'none' | 'create' | 'update';

@Component({
  selector: 'app-professor-exam-period',
  standalone: true,
  imports: [CommonModule, ExamPeriodCreateComponent, ExamPeriodUpdateComponent],
  templateUrl: './professor-exam-period.component.html',
  styleUrls: ['./professor-exam-period.component.css']
})
export class ProfessorExamPeriodComponent implements OnInit {
  examPeriods: ExamPeriod[] = [];
  courseName = '';
  rightPanel: RightPanel = 'none';
  editing?: ExamPeriod | null;

  constructor(private examPeriodService: ExamPeriodService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    const nav = history.state;
    if (nav?.courseName) this.courseName = nav.courseName;
    this.loadList();
  }

  private loadList() {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.examPeriodService.getAll(token).subscribe(data => {
      this.examPeriods = data ?? [];
    });
  }

  openCreate() { this.rightPanel = 'create'; this.editing = null; }
  openUpdate(item: ExamPeriod) { this.rightPanel = 'update'; this.editing = item; }
  closePanel() { this.rightPanel = 'none'; this.editing = null; }

  onCreated(created: ExamPeriod) {
    this.examPeriods = [...this.examPeriods, created];
    this.closePanel();
  }

  onUpdated(updated: ExamPeriod) {
    this.examPeriods = this.examPeriods.map(e =>
      e.id === updated.id ? updated : e
    );
    this.closePanel();
  }

  delete(item: ExamPeriod) {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!confirm('Are you sure you want to delete this exam period?')) return;

    this.examPeriodService.deleteExamPeriod(token, item.id!).subscribe(() => {
      this.examPeriods = this.examPeriods.filter(e => e.id !== item.id);
    });
  }
}
