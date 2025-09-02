import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SyllabusCreateComponent } from '../syllabus-create/syllabus-create.component';
import { SyllabusUpdateComponent } from '../syllabus-update/syllabus-update.component';
import { Syllabus } from '../../../../model/syllabus.model';
import { SyllabusService } from '../../../../services/syllabus.service';

type RightPanel = 'none' | 'create' | 'update';

@Component({
  selector: 'app-professor-syllabus',
  standalone: true,
  imports: [CommonModule, SyllabusCreateComponent, SyllabusUpdateComponent],
  templateUrl: './professor-syllabus.component.html',
  styleUrls: ['./professor-syllabus.component.css']
})
export class ProfessorSyllabusComponent implements OnInit {

  syllabuses: Syllabus[] = [];
  courseName = '';
  courseId?: number;

  rightPanel: RightPanel = 'none';
  editing?: Syllabus | null;

  constructor(private syllabusService: SyllabusService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const courseIdParam = this.route.snapshot.paramMap.get('id');
    if (courseIdParam) {
      this.courseId = +courseIdParam;
      this.loadList();
    }

    const nav = history.state;
    if (nav?.courseName) this.courseName = nav.courseName;
  }

  private loadList() {
    const token = localStorage.getItem('token');
    if (!token || !this.courseId) return;
    this.syllabusService.getSyllabusByCourse(token, this.courseId).subscribe(list => {
      this.syllabuses = list ?? [];
    });
  }

  // UI
  openCreate() { this.rightPanel = 'create'; this.editing = null; }
  openUpdate(item: Syllabus) { this.rightPanel = 'update'; this.editing = item; }
  closePanel() { this.rightPanel = 'none'; this.editing = null; }

  // event handlers iz child-a
  onCreated(created: Syllabus) {
    this.syllabuses = [...this.syllabuses, created];
    this.closePanel();
  }
  onUpdated(updated: Syllabus) {
    this.syllabuses = this.syllabuses.map(s => s.id === updated.id ? updated : s);
    this.closePanel();
  }

  // Delete ostaje ovde
  delete(item: Syllabus) {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!confirm('Are you sure you want to delete this syllabus?')) return;

    this.syllabusService.deleteSyllabus(token, item.id).subscribe(() => {
      this.syllabuses = this.syllabuses.filter(s => s.id !== item.id);
    });
  }
}
