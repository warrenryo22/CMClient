import { UserProfileData } from '../types';
import { UserRoles } from '@/enums/commons';
import { getCourseLabel, getYearLevelLabel, formatDate } from '../utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/card/Card';
import { Building2, Briefcase, Calendar, DollarSign, GraduationCap } from 'lucide-react';

interface PersonalInfoTabProps {
  user: UserProfileData;
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
    if (user.role !== UserRoles.TEACHERS && user.role !== UserRoles.CLINIC_STAFF) {
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
              <InfoField label="Employee Number" value={user.employeeNumber} />
              <InfoField label="Department" value={user.department} />
              <InfoField label="Employment Type" value={user.employmentType} />
              <InfoField label="Employee Status" value={user.employeeStatus} />
              <InfoField label="Job Position" value={user.position} />
              <InfoField label="Job Title" value={user.jobTitle} />
            </dl>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
              <Calendar className="w-5 h-5" />
              <CardTitle className="text-lg">Employment Timeline</CardTitle>
            </div>
            <CardDescription className="dark:text-gray-400">
              Employment dates and shift schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl>
              <InfoField label="Start Date" value={user.startDate ? formatDate(user.startDate) : undefined} />
              <InfoField label="End Date" value={user.endDate ? formatDate(user.endDate) : '--'} />
              <InfoField label="Start Shift" value={user.startShift} />
              <InfoField label="End Shift" value={user.endShift} />
            </dl>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
              <DollarSign className="w-5 h-5" />
              <CardTitle className="text-lg">Employee Rate Breakdown</CardTitle>
            </div>
            <CardDescription className="dark:text-gray-400">
              Shows hourly/monthly rate and applicable compensation rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl>
              <InfoField label="Rate Type" value={user.rateType} />
              <InfoField 
                label="Daily Rate" 
                value={user.dailyRate !== undefined ? `₱ ${user.dailyRate.toFixed(2)}` : undefined} 
              />
              <InfoField 
                label="Hourly Rate" 
                value={user.hourlyRate !== undefined ? `₱ ${user.hourlyRate.toFixed(2)}` : undefined} 
              />
            </dl>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderStudentInfo = () => {
    if (user.role !== UserRoles.STUDENTS || !user.studentDetails) {
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
            <InfoField label="Course" value={getCourseLabel(user.studentDetails.Course)} />
            <InfoField label="Year Level" value={getYearLevelLabel(user.studentDetails.Year)} />
          </dl>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
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
