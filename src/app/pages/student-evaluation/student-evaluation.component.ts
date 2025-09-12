import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentEvaluationService } from '../../services/student-evaluation.service';
import { StudentEvaluation } from '../../model/student-evaluation.model';

@Component({
  selector: 'app-student-evaluation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-evaluation.component.html',
  styleUrls: ['./student-evaluation.component.css'],
})
export class StudentEvaluationComponent implements OnInit {
  evaluations: StudentEvaluation[] = [];

  constructor(private evaluationService: StudentEvaluationService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.evaluationService.getByToken(token).subscribe((data) => {
        this.evaluations = data;
      });
    }
  }

  get totalESPB(): number {
    return this.evaluations.reduce((sum, eval_) => sum + eval_.courseESPB, 0);
  }
}
