import { Courses, Department, Position, UserRoles, YearLevels } from '@/enums/commons';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card/Card';
import { Building2, Briefcase, GraduationCap, User } from 'lucide-react';
import { GetUserDetailsDTO } from '@/types/userManagementTypes';
import { formatStatus } from '@/utilities/helpers';

interface PersonalInfoTabProps {
  user: GetUserDetailsDTO;
}

const PersonalInfoTab = ({ user }: PersonalInfoTabProps) => {
  const InfoField = ({ label, value }: { label: string; value?: string | number }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}:</dt>
      <dd className="col-span-2 text-sm font-semibold text-gray-900 dark:text-white">
        {value || '--'}
      </dd>
    </div>
  );

  const renderEmployeeInfo = () => {
    if (user.Role !== UserRoles.TEACHERS && user.Role !== UserRoles.CLINIC_STAFF) {
      return null;
    }

    return (
      <>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
              <Briefcase className="w-5 h-5" />
              <CardTitle className="text-lg">Employment Information</CardTitle>
            </div>
            <CardDescription className="dark:text-gray-400">
              Includes role, status, and rate details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl>
              <InfoField label="Employee Number" value={user.EmployeeDetails?.EmployeeNo} />
              <InfoField label="Department" value={formatStatus(Department[user.EmployeeDetails?.Department || 0])} />
              <InfoField label="Job Position" value={formatStatus(Position[user.EmployeeDetails?.Position || 0])} />
            </dl>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderStudentInfo = () => {
    if (user.Role !== UserRoles.STUDENTS || !user.StudentDetails) {
      return null;
    }

    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
            <GraduationCap className="w-5 h-5" />
            <CardTitle className="text-lg">Student Information</CardTitle>
          </div>
          <CardDescription className="dark:text-gray-400">
            Academic details and enrollment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl>
            <InfoField label="Course" value={formatStatus(Courses[user.StudentDetails.Course])} />
            <InfoField label="Year Level" value={formatStatus(YearLevels[user.StudentDetails.YearLevel])} />
            <InfoField label="Adviser" value={user.StudentDetails?.Adviser || '--'} />
            <InfoField label="Academic Year" value={user.StudentDetails?.AcademicYear || '--'} />

          </dl>
        </CardContent>
      </Card>
    );
  };

  const renderBasicInfo = () => {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
            <User className="w-5 h-5" />
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </div>
          <CardDescription className="dark:text-gray-400">
            Personal and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl>
            <InfoField label="First Name" value={user.FirstName} />
            <InfoField label="Last Name" value={user.LastName} />
            <InfoField label="Middle Name" value={user.MiddleName} />
            <InfoField label="Address" value={user.Address} />
            <InfoField label="Emergency Contact Name" value={user.EmergencyContactName} />
            <InfoField label="Emergency Contact Phone" value={user.EmergencyContactPhone} />
          </dl>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {renderBasicInfo()}
      {renderEmployeeInfo()}
      {renderStudentInfo()}

      {!renderEmployeeInfo() && !renderStudentInfo() && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No additional information available for this user role.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalInfoTab;
