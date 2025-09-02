import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EvaluationInstrument } from '../../../../model/evaluation-instrument.model';
import { EvaluationInstrumentService } from '../../../../services/evaluation-instrument.service';
import { EvaluationInstrumentCreateComponent } from '../evaluation-instrument-create/evaluation-instrument-create.component';
import { EvaluationInstrumentUpdateComponent } from '../evaluation-instrument-update/evaluation-instrument-update.component';

type RightPanel = 'none' | 'create' | 'update';

@Component({
  selector: 'app-professor-evaluation-instrument',
  standalone: true,
  imports: [CommonModule, EvaluationInstrumentCreateComponent, EvaluationInstrumentUpdateComponent],
  templateUrl: './professor-evaluation-instrument.component.html',
  styleUrls: ['./professor-evaluation-instrument.component.css']
})
export class ProfessorEvaluationInstrumentComponent implements OnInit {

  evaluationInstruments: EvaluationInstrument[] = [];
  courseName = '';
  courseId?: number;

  rightPanel: RightPanel = 'none';
  editing?: EvaluationInstrument | null;

  constructor(
    private evaluationInstrumentService: EvaluationInstrumentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.courseId = +idParam;
      this.loadList();
    }

    const nav = history.state;
    if (nav?.courseName) this.courseName = nav.courseName;
  }

  private loadList() {
    const token = localStorage.getItem('token');
    if (!token || !this.courseId) return;

    this.evaluationInstrumentService.getByCourse(token, this.courseId).subscribe(data => {
      this.evaluationInstruments = data ?? [];
    });
  }

  // UI
  openCreate() { this.rightPanel = 'create'; this.editing = null; }
  openUpdate(item: EvaluationInstrument) { this.rightPanel = 'update'; this.editing = item; }
  closePanel() { this.rightPanel = 'none'; this.editing = null; }

  // Events from children
  onCreated(created: EvaluationInstrument) {
    this.evaluationInstruments = [...this.evaluationInstruments, created];
    this.closePanel();
  }

  onUpdated(updated: EvaluationInstrument) {
    this.evaluationInstruments = this.evaluationInstruments.map(e =>
      e.id === updated.id ? updated : e
    );
    this.closePanel();
  }

  // Delete
  delete(item: EvaluationInstrument) {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!confirm('Are you sure you want to delete this evaluation instrument?')) return;

    this.evaluationInstrumentService.deleteEvaluationInstrument(token, item.id).subscribe(() => {
      this.evaluationInstruments = this.evaluationInstruments.filter(e => e.id !== item.id);
    });
  }
}
