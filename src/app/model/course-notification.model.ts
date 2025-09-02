export interface CourseNotification {
  id: number;
  courseId?: number;      
  courseName?: string;   
  title: string;
  content: string;
  postedAt?: string | null;
}
