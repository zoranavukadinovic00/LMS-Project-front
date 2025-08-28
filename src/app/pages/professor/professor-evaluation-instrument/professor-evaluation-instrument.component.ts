import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationInstrument } from '../../../model/evaluation-instrument.model';
import { EvaluationInstrumentService } from '../../../services/evaluation-instrument.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profesor-evaluation-instrument',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professor-evaluation-instrument.component.html',
  styleUrl: './professor-evaluation-instrument.component.css'
})
export class ProfesorEvaluationInstrumentComponent implements OnInit {

  evaluationInstruments: EvaluationInstrument[] = [];
  
  constructor(
    private evaluationInstrumentService: EvaluationInstrumentService,
    private route: ActivatedRoute
  ) {}
  
  
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(!token){
      return;
    }
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.evaluationInstrumentService.getEvaluationByCourse(token, +courseId).subscribe(data => {
        this.evaluationInstruments = data;
      });
    }
  }



}
