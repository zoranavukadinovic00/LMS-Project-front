import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorNotificationsComponent } from './professor-notifications.component';

describe('ProfessorNotificationsComponent', () => {
  let component: ProfessorNotificationsComponent;
  let fixture: ComponentFixture<ProfessorNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
