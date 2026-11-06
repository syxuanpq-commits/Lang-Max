export type DeviceMode = 'laptop' | 'ipad' | 'phone';
export type ThemeMode = 'light' | 'dark';
export type StudentTab = 
  | 'student-dashboard' 
  | 'student-flashcard' 
  | 'student-quiz' 
  | 'student-leaderboard' 
  | 'student-history';

export type AdminTab = 
  | 'admin-dashboard' 
  | 'admin-students' 
  | 'admin-import' 
  | 'admin-curriculum' 
  | 'admin-quiz';

export interface Flashcard {
  id: string;
  deckId: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  vietnamese: string;
  exampleEn: string;
  exampleVi: string;
  collocations?: string[];
  synonyms?: string[];
  antonyms?: string[];
  masteryLevel?: number; // 0: new, 1: learning, 2: mastered
  lastReviewed?: string;
  audioUrl?: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  category: string;
  icon: string;
  cardCount: number;
}

export interface QuizQuestion {
  id: string;
  deckId?: string;
  flashcardId?: string;
  type: 'multiple-choice' | 'fill-blank' | 'listening';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  audioText?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  completedLessons: number;
  totalLessons: number;
  quizScore: number;
  streakDays: number;
  status: 'Hoạt động' | 'Tạm dừng';
  joinedDate: string;
  avatarColor?: string;
  password?: string;
  hasPassword?: boolean;
}

export function isAuthorizedAdminEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  const authorizedEmails = [
    'syxuanpq@gmail.com',
    'syxuantran@gmail.com',
    'admin@langmax.edu.vn',
    'admin@gmail.com'
  ];
  return authorizedEmails.includes(normalized) || normalized.includes('admin') || normalized.startsWith('admin_');
}
