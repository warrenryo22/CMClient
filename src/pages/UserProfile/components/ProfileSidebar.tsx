import { GetUserDetailsDTO } from "@/types/userManagementTypes";
import { formatDate } from "../utils";
import { User, Calendar, MapPin } from "lucide-react";
import { formatStatus } from "@/utilities/helpers";
import { Courses, Department, Gender, Position, UserRoles, YearLevels } from "@/enums/commons";

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
                alt={user.FullName || "Patient"}
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
        {user.FullName && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {user.FullName}
          </h2>
        )}
        {user.Role !== undefined && UserRoles[user.Role] && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatStatus(UserRoles[user.Role])}
          </p>
        )}
      </div>

      {/* Personal Info */}
      <div className="px-6 py-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 ">
          Personal Info
        </h3>
        <div className="space-y-3.5">
          {user.Email && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Email Address:
              </label>
              <p className="text-sm text-gray-900 dark:text-white break-words">
                {user.Email}
              </p>
            </div>
          )}

          {user.Phone && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Phone Number:
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {user.Phone}
              </p>
            </div>
          )}

          {user.Address && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3" />
                Address:
              </label>
              <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                {user.Address}
              </p>
            </div>
          )}

          {user.DateOfBirth && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3" />
                Date of Birth:
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(user.DateOfBirth)}
              </p>
            </div>
          )}

          {user.Gender !== undefined && Gender[user.Gender] && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Gender:
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {Gender[user.Gender]}
              </p>
            </div>
          )}

          {user.StudentDetails && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                  Student No:
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {user.StudentDetails.StudentNo}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                  Program:
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatStatus(Courses[user.StudentDetails.Course])}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                  Year Level:
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatStatus(YearLevels[user.StudentDetails.YearLevel])}
                </p>
              </div>
            </>
          )}

          {user.TeacherDetails && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                  Department:
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatStatus(Department[user.TeacherDetails.Department])}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                  Position:
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {formatStatus(Position[user.TeacherDetails.Position])}
                </p>
              </div>
            </>
          )}

          {user.Role !== undefined && UserRoles[user.Role] && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Role:
              </label>
              <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400">
                {formatStatus(UserRoles[user.Role])}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
