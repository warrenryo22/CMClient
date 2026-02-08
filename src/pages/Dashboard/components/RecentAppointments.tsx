import { Card, CardHeader, CardTitle, CardContent } from '@/components/card/Card';
import Badge from '@/components/badge/Badge';
import { AppointmentItem } from '../types';
import { Clock } from 'lucide-react';
import { BadgeColor } from '@/components/badge/Badge';

interface RecentAppointmentsProps {
  appointments: AppointmentItem[];
}

const getStatusColor = (status: AppointmentItem['status']): BadgeColor => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'light';
  }
};

const RecentAppointments = ({ appointments }: RecentAppointmentsProps) => {
  return (
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4">
        {appointments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No appointments today
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-start justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {appointment.patientName}
                    </h4>
                    <Badge color={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {appointment.reason}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
