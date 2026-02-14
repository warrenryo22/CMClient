import { GetUserDetailsDTO } from "@/types/userManagementTypes";
import { formatStatus } from "@/utilities/helpers";
import { UserRoles } from "@/enums/commons";

interface ProfileSidebarProps {
  user: GetUserDetailsDTO;
}

const ProfileSidebar = ({ user }: ProfileSidebarProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
      {/* Header with background */}
      <div
        className="relative h-24 bg-cover bg-center"
        style={{ backgroundImage: "url(/photos/logo/bg.jpg)" }}
      >
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 overflow-hidden">
            {user.AvatarUrl ? (
              <img
                src={user.AvatarUrl}
                alt={user.FirstName || "Patient"}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={"/photos/commons/no-img.png"}
                alt={user.FirstName || "Patient"}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="pt-14 pb-6 px-6 text-center border-b border-gray-200 dark:border-gray-700">
        {user.FirstName && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {user.FirstName} {user.MiddleName || ""} {user.LastName || ""}
          </h2>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {user.StudentDetails &&
            `Student No: ${user.StudentDetails.StudentNo}`}
          {user.EmployeeDetails &&
            `Employee No: ${user.EmployeeDetails.EmployeeNo}`}
        </p>
      </div>

      {/* Personal Info */}
      <div className="px-6 py-5">
        <div className="space-y-3.5">
          {user.Email && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Personal Info
              </h3>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                  Email Address:
                </label>
                <p className="text-sm text-gray-900 dark:text-white break-words">
                  {user.Email}
                </p>
              </div>
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
