import { UserRoles } from '@/enums/commons';
import { getUserRoleLabel } from '../utils';
import { ALLOWED_ROLES } from '../types';
import { GraduationCap, Users, Briefcase, User } from 'lucide-react';

interface RoleSelectionStepProps {
  selectedRole: UserRoles | null;
  onSelectRole: (role: UserRoles) => void;
}

const RoleSelectionStep = ({ selectedRole, onSelectRole }: RoleSelectionStepProps) => {
  const getRoleIcon = (role: UserRoles) => {
    switch (role) {
      case UserRoles.STUDENTS:
        return <GraduationCap className="w-8 h-8" />;
      case UserRoles.TEACHERS:
        return <Briefcase className="w-8 h-8" />;
      case UserRoles.VISITOR:
        return <User className="w-8 h-8" />;
      default:
        return <Users className="w-8 h-8" />;
    }
  };

  const getRoleDescription = (role: UserRoles): string => {
    switch (role) {
      case UserRoles.STUDENTS:
        return 'Currently enrolled student';
      case UserRoles.TEACHERS:
        return 'Faculty or staff member';
      case UserRoles.VISITOR:
        return 'Guest or external visitor';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Select Your Role
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the category that best describes you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ALLOWED_ROLES.map((role) => {
          const isSelected = selectedRole === role;
          return (
            <button
              key={role}
              onClick={() => onSelectRole(role)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-sky-700 bg-sky-50 dark:bg-sky-950/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-sky-400 hover:shadow-md'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  isSelected
                    ? 'bg-sky-700 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {getRoleIcon(role)}
              </div>
              <h3
                className={`text-lg font-semibold mb-1 ${
                  isSelected
                    ? 'text-sky-900 dark:text-sky-300'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {getUserRoleLabel(role)}
              </h3>
              <p
                className={`text-sm ${
                  isSelected
                    ? 'text-sky-700 dark:text-sky-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {getRoleDescription(role)}
              </p>
            </button>
          );
        })}
      </div>

      {selectedRole !== null && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300 text-center">
            <strong>Selected:</strong> {getUserRoleLabel(selectedRole)} - Click "Next" to continue
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleSelectionStep;
