import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UniversityComponent } from './pages/university/university.component';
import { FacultyComponent } from './pages/faculty/faculty.component';
import { StudyProgramComponent } from './pages/study-program/study-program.component';
import { CourseComponent } from './pages/course/course.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { StudentEvaluationComponent } from './pages/student-evaluation/student-evaluation.component';
import { ExamRegistrationComponent } from './pages/exam-registration/exam-registration.component';
import { StudentNotificationsComponent } from './pages/student/student-notifications/student-notifications.component';
import { StudentCourseComponent } from './pages/student/student-courses/student-courses.component';
import { StudentHistoryComponent } from './pages/student/student-history/student-history.component';
import { ProfesorCoursesComponent } from './pages/professor/professor-courses/professor-courses.component';
import { ProfessorSyllabusComponent } from './pages/professor/syllabus/professor-syllabus/professor-syllabus.component';
import { ProfessorNotificationsComponent } from './pages/professor/notification/professor-notifications/professor-notifications.component';
import { ProfessorEvaluationInstrumentComponent } from './pages/professor/evaluation-instrument/professor-evaluation-instrument/professor-evaluation-instrument.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'university/:id', component: UniversityComponent },
  { path: 'faculty/:id', component: FacultyComponent },
  { path: 'study-program/:id', component: StudyProgramComponent },
  { path: 'course/:id', component: CourseComponent },
  { path: 'my-profile', component: UpdateProfileComponent },
  { path: 'my-history', component: StudentHistoryComponent },
  { path: 'my-notifications', component: StudentNotificationsComponent },
  { path: 'my-courses', component: StudentCourseComponent},
  { path: 'manage-courses', component: ProfesorCoursesComponent},
  { path: 'exam-registration', component: ExamRegistrationComponent},
  { path: 'professor-evaluations/:id', component: ProfessorEvaluationInstrumentComponent },
  { path: 'professor-syllabus/:id', component: ProfessorSyllabusComponent },
  { path: 'professor-notifications/:id', component: ProfessorNotificationsComponent }
  

];
