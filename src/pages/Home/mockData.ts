import { Announcement } from './types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'System Maintenance Scheduled',
    content: 'The clinic management system will undergo scheduled maintenance on Saturday, February 15, 2026, from 10:00 PM to 2:00 AM. Please save your work before this time.',
    date: new Date('2026-02-08'),
    priority: 'high',
    category: 'maintenance',
    isRead: false,
  },
  {
    id: 2,
    title: 'New Medical Equipment Available',
    content: 'We are pleased to announce that new digital thermometers and blood pressure monitors have been added to our medical inventory. Please familiarize yourself with the new equipment.',
    date: new Date('2026-02-07'),
    priority: 'medium',
    category: 'general',
    isRead: false,
  },
  {
    id: 3,
    title: 'Health and Wellness Seminar',
    content: 'Join us for a health and wellness seminar on February 20, 2026, at 2:00 PM in the school auditorium. Topics include stress management and healthy lifestyle habits.',
    date: new Date('2026-02-06'),
    priority: 'medium',
    category: 'event',
    isRead: true,
  },
  {
    id: 4,
    title: 'Updated Medical Records Protocol',
    content: 'Please note the updated medical records protocol. All doctors and clinic staff must ensure patient records are completed within 24 hours of consultation.',
    date: new Date('2026-02-05'),
    priority: 'high',
    category: 'alert',
    isRead: true,
  },
  {
    id: 5,
    title: 'Flu Vaccination Drive',
    content: 'The annual flu vaccination drive will be held from February 12-14, 2026. Students and staff can visit the clinic during operating hours for free flu shots.',
    date: new Date('2026-02-04'),
    priority: 'medium',
    category: 'event',
    isRead: true,
  },
  {
    id: 6,
    title: 'Clinic Operating Hours Extended',
    content: 'Starting February 10, the clinic will extend its operating hours on Wednesdays and Thursdays until 7:00 PM to better serve students and staff.',
    date: new Date('2026-02-03'),
    priority: 'low',
    category: 'general',
    isRead: true,
  },
];

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};
