export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: Date;
  priority: 'high' | 'medium' | 'low';
  category: 'general' | 'event' | 'maintenance' | 'alert';
  isRead?: boolean;
}

export interface WelcomeData {
  greeting: string;
  userName: string;
  userRole: string;
  lastLogin?: Date;
}
