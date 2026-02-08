import { UserRoles } from '@/enums/commons';

export const getUserRoleLabel = (role: UserRoles): string => {
  const labels: Record<UserRoles, string> = {
    [UserRoles.SUPERUSER]: 'Super User',
    [UserRoles.STUDENTS]: 'Student',
    [UserRoles.DOCTORS]: 'Doctor',
    [UserRoles.CLINIC_STAFF]: 'Clinic Staff',
    [UserRoles.TEACHERS]: 'Teacher',
    [UserRoles.PROCUREMENT]: 'Procurement Officer',
    [UserRoles.VISITOR]: 'Visitor',
  };
  return labels[role];
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return formatDate(date);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};
