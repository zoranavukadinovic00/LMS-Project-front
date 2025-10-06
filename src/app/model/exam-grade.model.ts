export interface ExamGrade {
  id?: number;
  studentId: number;
  studentName: string;  
  courseId: number;
  courseName: string;
  termId: number;
  grade: number;
  dateGraded: string;
}