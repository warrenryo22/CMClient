import { useState, useMemo } from 'react';
import PageMeta from '@/components/common/PageMeta';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card/Card';
import { useAuthStore } from '@/zustand/authStore';
import { UserRoles } from '@/enums/commons';
import WelcomeSection from './components/WelcomeSection';
import AnnouncementCard from './components/AnnouncementCard';
import { mockAnnouncements, getGreeting } from './mockData';
import { Announcement } from './types';
import { Bell, Filter } from 'lucide-react';
import Button from '@/components/buttons/Button';

const Home = () => {
  const userFullName = useAuthStore((state) => state.userFullName);
  const userClaims = useAuthStore((state) => state.userClaims);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'priority'>('all');
  const [announcements] = useState<Announcement[]>(mockAnnouncements);

  const greeting = useMemo(() => getGreeting(), []);
  
  // Default values if user is not logged in (fallback)
  const userName = userFullName || 'Guest';
  const userRole = userClaims?.role ? UserRoles[userClaims.role as keyof typeof UserRoles] : UserRoles.VISITOR;

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    switch (selectedFilter) {
      case 'unread':
        return announcements.filter(a => !a.isRead);
      case 'priority':
        return announcements.filter(a => a.priority === 'high');
      case 'all':
      default:
        return announcements;
    }
  }, [announcements, selectedFilter]);

  const unreadCount = announcements.filter(a => !a.isRead).length;

  const handleAnnouncementClick = (announcement: Announcement) => {
    // In a real app, this would mark the announcement as read
    console.log('Announcement clicked:', announcement);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
      <PageMeta
        title="CMS | Home"
        description="Clinic Management System - Welcome"
      />

      <div className="space-y-6">
        {/* Welcome Section */}
        <WelcomeSection
          userName={userName}
          userRole={userRole}
          greeting={greeting}
          lastLogin={new Date()} // In real app, this would come from auth
        />

        {/* Quick Stats (Optional - can be added later) */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard ... />
        </div> */}

        {/* Announcements Section */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Announcements</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Stay updated with the latest news
                    {unreadCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 rounded-full text-xs font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedFilter === 'all' ? 'primary' : 'outline'}
                    onClick={() => setSelectedFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedFilter === 'unread' ? 'primary' : 'outline'}
                    onClick={() => setSelectedFilter('unread')}
                    count={unreadCount}
                  >
                    Unread
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedFilter === 'priority' ? 'primary' : 'outline'}
                    onClick={() => setSelectedFilter('priority')}
                  >
                    Priority
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedFilter === 'unread' 
                    ? 'No unread announcements' 
                    : selectedFilter === 'priority'
                    ? 'No priority announcements'
                    : 'No announcements available'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    onClick={() => handleAnnouncementClick(announcement)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Sections (can be added later) */}
        {/* <QuickActions userRole={userRole} /> */}
        {/* <RecentActivity /> */}
      </div>
    </div>
  );
};

export default Home;
