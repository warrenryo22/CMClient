import { GetUserDetailsDTO } from '@/types/userManagementTypes';
import { formatDate } from '../utils';
import {  User, Calendar, MapPin } from 'lucide-react';
import { formatStatus } from '@/utilities/helpers';
import { Gender, UserRoles } from '@/enums/commons';

interface ProfileSidebarProps {
  user: GetUserDetailsDTO;
}

const ProfileSidebar = ({ user }: ProfileSidebarProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
      {/* Header with background */}
      <div className="relative h-24 bg-gradient-to-r from-sky-700 to-sky-900">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 overflow-hidden">
            {user.AvatarUrl ? (
              <img
                src={user.AvatarUrl}
                alt={user.FullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-sky-100 dark:bg-sky-900">
                <User className="w-12 h-12 text-sky-700 dark:text-sky-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 pb-6 px-6 text-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {user.FullName}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatStatus(UserRoles[user.Role])}
        </p>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex gap-2 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <button className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-sky-700 dark:text-sky-400" />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Message</span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <Mail className="w-5 h-5 text-sky-700 dark:text-sky-400" />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <Phone className="w-5 h-5 text-sky-700 dark:text-sky-400" />
          </div>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Call</span>
        </button>
      </div> */}

      {/* Personal Info */}
      <div className="px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 ">
          Personal Info
        </h3>
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              Email Address:
            </label>
            <p className="text-sm text-gray-900 dark:text-white break-words">
              {user.Email}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              Phone Number:
            </label>
            <p className="text-sm text-gray-900 dark:text-white">
              {user.Phone}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3" />
              Address:
            </label>
            <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
              {user.Address}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3 h-3" />
              Date of Birth:
            </label>
            <p className="text-sm text-gray-900 dark:text-white">
              {formatDate(user.DateOfBirth ?? new Date)}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              Gender:
            </label>
            <p className="text-sm text-gray-900 dark:text-white">
              {Gender[user.Gender ?? Gender.MALE]}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              Role:
            </label>
            <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400">
              {formatStatus(UserRoles[user.Role])}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
