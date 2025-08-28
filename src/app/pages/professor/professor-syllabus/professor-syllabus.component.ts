import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyllabusService } from '../../../services/syllabus.service';
import { Syllabus } from '../../../model/syllabus.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-professor-syllabus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professor-syllabus.component.html',
  styleUrls: ['./professor-syllabus.component.css']
})
export class ProfessorSyllabusComponent implements OnInit {

  syllabuses: Syllabus[] = [];

  constructor(private syllabusService: SyllabusService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(!token){
      return;
    }
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.syllabusService.getSyllabusByCourse(token, +courseId).subscribe(data => {
        this.syllabuses = data;
      });
    }
  }
}
