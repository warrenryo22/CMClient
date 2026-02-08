import { Announcement } from '../types';
import { getRelativeTime } from '../utils';
import { AlertCircle, Calendar as CalendarIcon, Megaphone, Wrench, Info } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
  onClick?: () => void;
}

const AnnouncementCard = ({ announcement, onClick }: AnnouncementCardProps) => {
  const getCategoryIcon = () => {
    switch (announcement.category) {
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      case 'event':
        return <CalendarIcon className="w-5 h-5" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5" />;
      case 'general':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getPriorityColor = () => {
    switch (announcement.priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20';
      case 'low':
      default:
        return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20';
    }
  };

  const getCategoryColor = () => {
    switch (announcement.category) {
      case 'alert':
        return 'text-red-600 dark:text-red-400';
      case 'event':
        return 'text-purple-600 dark:text-purple-400';
      case 'maintenance':
        return 'text-orange-600 dark:text-orange-400';
      case 'general':
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        border-l-4 ${getPriorityColor()}
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        rounded-lg p-4 
        transition-all duration-200
        hover:shadow-md hover:scale-[1.01]
        cursor-pointer
        ${!announcement.isRead ? 'ring-2 ring-sky-500/20' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div className={`flex-shrink-0 ${getCategoryColor()}`}>
          {getCategoryIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-semibold text-gray-900 dark:text-white ${!announcement.isRead ? 'flex items-center gap-2' : ''}`}>
              {announcement.title}
              {!announcement.isRead && (
                <span className="inline-flex items-center justify-center w-2 h-2 bg-sky-600 rounded-full" />
              )}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {announcement.content}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Megaphone className="w-3 h-3" />
              {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {getRelativeTime(announcement.date)}
            </span>
            {announcement.priority === 'high' && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full font-medium">
                Priority
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
