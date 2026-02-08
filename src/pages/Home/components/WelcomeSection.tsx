import { Card, CardContent } from '@/components/card/Card';
import { UserRoles } from '@/enums/commons';
import { getUserRoleLabel } from '../utils';
import { Sparkles, Calendar } from 'lucide-react';

interface WelcomeSectionProps {
  userName: string;
  userRole: UserRoles;
  greeting: string;
  lastLogin?: Date;
}

const WelcomeSection = ({ userName, userRole, greeting, lastLogin }: WelcomeSectionProps) => {
  const roleLabel = getUserRoleLabel(userRole);

  const getRoleBadgeColor = (role: UserRoles) => {
    switch (role) {
      case UserRoles.SUPERUSER:
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case UserRoles.DOCTORS:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case UserRoles.CLINIC_STAFF:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case UserRoles.STUDENTS:
        return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400';
      case UserRoles.TEACHERS:
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case UserRoles.PROCUREMENT:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 dark:from-sky-800 dark:via-sky-900 dark:to-blue-950" />
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <CardContent className="relative z-10 py-8 px-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              {/* Greeting */}
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <p className="text-sm font-medium text-sky-100">{greeting}!</p>
              </div>

              {/* User Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 break-words">
                Welcome back, {userName}
              </h1>

              {/* Role Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-semibold text-white">{roleLabel}</span>
              </div>

              {/* Last Login */}
              {lastLogin && (
                <div className="flex items-center gap-2 mt-4 text-sky-100">
                  <Calendar className="w-4 h-4" />
                  <p className="text-sm">
                    Last login: {new Date(lastLogin).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Role-specific Icon/Illustration */}
            <div className="hidden md:block">
              <div className={`w-24 h-24 rounded-2xl ${getRoleBadgeColor(userRole)} flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-xl`}>
                <span className="text-4xl font-bold opacity-50">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default WelcomeSection;
