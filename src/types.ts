export type UserRole = 'student' | 'teacher' | 'admin';

export type EducationalGrade = '1prep' | '2prep' | '3prep' | '1sec' | '2sec';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  xp: number;
  streak: number;
  level: number;
  completedCourses: string[];
  grade?: EducationalGrade;
  password?: string;
  isOwner?: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
}

export interface MatchingPair {
  id: string;
  term: string;
  definition: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content: string;
  flashcards?: FlashcardItem[];
  matchingPairs?: MatchingPair[];
  quiz?: Question[];
  completed?: boolean;
  pdfPage?: number;
  pdfUrl?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'programming' | 'languages' | 'design' | 'business' | 'science';
  level: 'beginner' | 'intermediate' | 'advanced';
  grade: EducationalGrade;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  rating: number;
  reviewsCount: number;
  enrolledCount: number;
  durationHours: number;
  image: string;
  modules: CourseModule[];
  price?: number;
  isPopular?: boolean;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  level: number;
  rank: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate?: string;
  unlocked: boolean;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  studentName: string;
  issueDate: string;
  instructorName: string;
  credentialId: string;
}

export interface DiscussionComment {
  id: string;
  lessonId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  likes: number;
}

export type StudentGradeKey = '4prim' | '5prim' | '6prim' | '1prep' | '2prep' | '3prep';

export type BookletStatus = 'كتاب سلاح التلميذ' | 'المذكرة' | 'غير مشترك' | '-';

export type DeliveryStatus = 'استلم' | 'مطلوب' | '-';

export interface MonthPayments {
  m8: string;
  m9: string;
  m10: string;
  m11: string;
  m12: string;
}

export interface StudentRecord {
  id: string;
  code: number;
  grade: StudentGradeKey;
  name: string;
  booklet: BookletStatus;
  deliveryStatus: DeliveryStatus;
  phone: string;
  parentPhone: string;
  bookingDate: string;
  payments: MonthPayments;
  /** 14 weeks, each with 2 session checkboxes [session1, session2] */
  weeks: [boolean, boolean][];
  notes?: string;
  updatedAt?: string;
}

