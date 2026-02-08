# Home Page - Professional Welcome & Announcements

A professional welcome page displaying user information and system announcements for the Clinic Management System.

## Features

### 1. **Welcome Section**
- **Dynamic Greeting**: Displays "Good Morning", "Good Afternoon", or "Good Evening" based on current time
- **User Information**: Shows user's full name and role with color-coded badge
- **Beautiful Gradient Design**: Modern gradient background with decorative patterns
- **User Initial Avatar**: Large letter avatar with role-specific colors
- **Last Login Timestamp**: Displays when the user last logged in
- **Responsive Design**: Adapts beautifully to all screen sizes

### 2. **Announcements Section**
- **Categorized Announcements**: 
  - General (blue)
  - Event (purple)
  - Maintenance (orange)
  - Alert (red)
- **Priority Levels**:
  - High (red border, priority badge)
  - Medium (yellow border)
  - Low (blue border)
- **Read/Unread Status**: Visual indicators for unread announcements
- **Filtering System**:
  - All announcements
  - Unread only (with count badge)
  - Priority only (high priority items)
- **Interactive Cards**: Hover effects and click handlers
- **Relative Timestamps**: "2 days ago", "Just now", etc.

### 3. **Role-Based Customization**
Each user role has a unique color scheme:
- **Super User**: Purple
- **Doctors**: Blue
- **Clinic Staff**: Green
- **Students**: Sky Blue
- **Teachers**: Indigo
- **Procurement**: Orange
- **Visitors**: Gray

## File Structure

```
src/pages/Home/
├── components/
│   ├── WelcomeSection.tsx        # Gradient welcome banner
│   ├── AnnouncementCard.tsx      # Individual announcement card
├── types.ts                       # TypeScript interfaces
├── mockData.ts                    # Mock announcements data
├── utils.ts                       # Utility functions (date formatting, role labels)
├── Home.tsx                       # Main page component
├── index.tsx                      # Exports
└── README.md                      # This file
```

## Integration

### Add to Routing

Add the Home page to your routing configuration:

```tsx
import Home from '@/pages/Home';

// In your routes array:
{
  path: '/',
  element: <Home />
}
// or
{
  path: '/home',
  element: <Home />
}
```

### User Data Source

The page automatically pulls user data from Zustand auth store:

```tsx
const userFullName = useAuthStore((state) => state.userFullName);
const userClaims = useAuthStore((state) => state.userClaims);
```

If the user is not logged in, it defaults to:
- Name: "Guest"
- Role: VISITOR

## Customization

### Adding New Announcements

Edit `mockData.ts` to add new announcements:

```tsx
{
  id: 7,
  title: 'Your Title',
  content: 'Your announcement content...',
  date: new Date('2026-02-10'),
  priority: 'high', // 'high' | 'medium' | 'low'
  category: 'general', // 'general' | 'event' | 'maintenance' | 'alert'
  isRead: false,
}
```

### Changing Greeting Times

Edit the `getGreeting()` function in `mockData.ts`:

```tsx
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};
```

### Modifying Role Colors

Edit the `getRoleBadgeColor()` function in `components/WelcomeSection.tsx`:

```tsx
const getRoleBadgeColor = (role: UserRoles) => {
  switch (role) {
    case UserRoles.SUPERUSER:
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    // ... add more cases
  }
};
```

## Backend Integration

To connect with real data:

### 1. Replace Mock Announcements

Create an announcements service:

```tsx
// services/announcementService.ts
export const announcementService = {
  async getAnnouncements() {
    const response = await fetch('/api/announcements');
    return response.json();
  },
  
  async markAsRead(announcementId: number) {
    await fetch(`/api/announcements/${announcementId}/read`, {
      method: 'PATCH'
    });
  }
};
```

### 2. Update Home Component

```tsx
import { useEffect, useState } from 'react';
import { announcementService } from '@/services/announcementService';

const Home = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await announcementService.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Failed to fetch announcements', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // ... rest of component
};
```

### 3. API Endpoints

Expected backend endpoints:

```
GET  /api/announcements           - Fetch all announcements
GET  /api/announcements/unread    - Fetch unread announcements
PATCH /api/announcements/:id/read - Mark announcement as read
```

## Accessibility Features

- **Semantic HTML**: Proper use of headings and landmarks
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Color Contrast**: WCAG AA compliant color combinations
- **Screen Reader Support**: Descriptive labels and ARIA attributes
- **Focus Indicators**: Clear focus states for all interactive elements

## Dark Mode Support

The entire page supports dark mode through Tailwind's dark mode classes:
- Automatic theme detection
- Smooth color transitions
- Optimized contrast ratios

## Responsive Breakpoints

- **Mobile**: < 768px (single column, compact layout)
- **Tablet**: 768px - 1024px (adjusted spacing)
- **Desktop**: > 1024px (full layout with side-by-side elements)

## Future Enhancements

Potential improvements:

1. **Real-time Updates**: WebSocket integration for live announcements
2. **Notification Bell**: Header notification icon with dropdown
3. **Quick Actions**: Role-specific quick action buttons
4. **Recent Activity**: Timeline of recent system activities
5. **Personalized Widgets**: Customizable dashboard widgets
6. **Search & Sort**: Search through announcements, sort by date/priority
7. **Announcement Details Modal**: Full-screen view for detailed announcements
8. **Rich Text Support**: Markdown or HTML content in announcements
9. **Attachments**: Support for file attachments in announcements
10. **Announcement Categories Management**: Admin panel to create categories

## Performance

- **Memoization**: Uses `useMemo` for expensive computations
- **Lazy Loading**: Images and components load on demand
- **Optimized Filters**: Client-side filtering for instant response
- **Minimal Re-renders**: Efficient state management

## Testing

To test the page:

1. **Different User Roles**: Test with each role to see color variations
2. **Filter Functions**: Test all three filters (All, Unread, Priority)
3. **Responsive Design**: Test on mobile, tablet, and desktop
4. **Dark Mode**: Toggle dark mode to verify colors
5. **Empty States**: Test with no announcements, no unread items

## Notes

- The page uses the existing auth store for user data
- Mock data includes 6 sample announcements
- All components are fully typed with TypeScript
- Design follows the existing CMS design system
- Compatible with the existing Card and Button components
