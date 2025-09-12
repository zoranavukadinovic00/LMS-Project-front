import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TermTopicCreateComponent } from '../term-topic-create/term-topic-create.component';
import { TermTopicUpdateComponent } from '../term-topic-update/term-topic-update.component';
import { TermTopic } from '../../../../model/term-topic.model';
import { TermTopicService } from '../../../../services/term-topic.service';


type RightPanel = 'none' | 'create' | 'update';

@Component({
  selector: 'app-professor-term-topics',
  standalone: true,
  imports: [CommonModule, TermTopicCreateComponent, TermTopicUpdateComponent],
  templateUrl: './professor-term-topic.component.html',
  styleUrls: ['./professor-term-topic.component.css']
})
export class ProfessorTermTopicComponent implements OnInit {

  termTopics: TermTopic[] = [];
  courseName = '';
  courseId?: number;

  rightPanel: RightPanel = 'none';
  editing?: TermTopic | null;

  constructor(private termTopicService: TermTopicService, private route: ActivatedRoute) {}

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

  private sortTopics(list: TermTopic[]) {
    return [...list].sort((a, b) => {
      const ta = a.termNumber ?? 0;
      const tb = b.termNumber ?? 0;
      if (ta !== tb) return ta - tb;
      return (a.id ?? 0) - (b.id ?? 0);
    });
  }

  private loadList() {
    const token = localStorage.getItem('token');
    if (!token || !this.courseId) return;

    this.termTopicService.getByCourse(token, this.courseId).subscribe(list => {
      this.termTopics = this.sortTopics(list ?? []);
    });
  }

 
  openCreate() { this.rightPanel = 'create'; this.editing = null; }
  openUpdate(item: TermTopic) { this.rightPanel = 'update'; this.editing = item; }
  closePanel() { this.rightPanel = 'none'; this.editing = null; }

 
  onCreated(created: TermTopic) {
    this.termTopics = this.sortTopics([...this.termTopics, created]);
    this.closePanel();
  }

  onUpdated(updated: TermTopic) {
    this.termTopics = this.sortTopics(
      this.termTopics.map(t => t.id === updated.id ? updated : t)
    );
    this.closePanel();
  }

  
  delete(item: TermTopic) {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!confirm('Are you sure you want to delete this term topic?')) return;

    this.termTopicService.deleteTermTopic(token, item.id).subscribe(() => {
      this.termTopics = this.termTopics.filter(t => t.id !== item.id);
    });
  }
}
