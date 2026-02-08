import {
  DashboardMetrics,
  ChartDataPoint,
  AppointmentItem,
  LowStockItem,
  PeriodFilter,
} from './types';

export const getMockDashboardMetrics = (
  period: PeriodFilter,
): DashboardMetrics => {
  // Adjust metrics slightly based on period
  const multiplier = {
    daily: 1,
    weekly: 1.15,
    monthly: 1.3,
    yearly: 1.5,
  }[period];

  return {
    inventoryCost: {
      current: Math.round(125430.5 * multiplier),
      previous: Math.round(118250.0 * multiplier * 0.95),
      percentageChange: 6.1,
    },
    appointments: {
      today: 23,
      total: Math.round(487 * multiplier),
      percentageChange: 12.5,
    },
    products: {
      total: 342,
      lowStock: 15,
    },
    stockAlerts: {
      critical: 5,
      warning: 10,
    },
    medicalRecords: {
      total: 2847,
      thisMonth: 156,
    },
  };
};

export const getMockInventoryCostData = (
  period: PeriodFilter,
): ChartDataPoint[] => {
  const now = new Date();
  const data: ChartDataPoint[] = [];

  switch (period) {
    case 'daily':
      // Last 24 hours
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          date: hour.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          value: Math.round(3000 + Math.random() * 2000),
        });
      }
      break;

    case 'weekly':
      // Last 7 days
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.push({
          date: daysOfWeek[day.getDay()],
          value: Math.round(15000 + Math.random() * 10000),
        });
      }
      break;

    case 'monthly':
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.push({
          date: `${day.getMonth() + 1}/${day.getDate()}`,
          value: Math.round(3000 + Math.random() * 5000),
        });
      }
      break;

    case 'yearly':
      // Last 12 months
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      for (let i = 11; i >= 0; i--) {
        const month = new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1,
        );
        data.push({
          date: months[month.getMonth()],
          value: Math.round(80000 + Math.random() * 50000),
        });
      }
      break;
  }

  return data;
};

export const getMockAppointmentsData = (
  period: PeriodFilter,
): ChartDataPoint[] => {
  const now = new Date();
  const data: ChartDataPoint[] = [];

  switch (period) {
    case 'daily':
      // Last 24 hours
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          date: hour.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          value: Math.round(Math.random() * 5),
        });
      }
      break;

    case 'weekly':
      // Last 7 days
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.push({
          date: daysOfWeek[day.getDay()],
          value: Math.round(15 + Math.random() * 20),
        });
      }
      break;

    case 'monthly':
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.push({
          date: `${day.getMonth() + 1}/${day.getDate()}`,
          value: Math.round(10 + Math.random() * 25),
        });
      }
      break;

    case 'yearly':
      // Last 12 months
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      for (let i = 11; i >= 0; i--) {
        const month = new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1,
        );
        data.push({
          date: months[month.getMonth()],
          value: Math.round(300 + Math.random() * 200),
        });
      }
      break;
  }

  return data;
};

export const getMockRecentAppointments = (): AppointmentItem[] => {
  const statuses: AppointmentItem['status'][] = [
    'pending',
    'completed',
    'cancelled',
  ];
  const reasons = [
    'Annual Checkup',
    'Fever & Flu',
    'Dental Consultation',
    'Follow-up Visit',
    'Lab Results Review',
    'Vaccination',
    'Minor Injury',
    'Prescription Refill',
  ];

  const appointments: AppointmentItem[] = [];

  for (let i = 0; i < 8; i++) {
    const hour = 8 + i;
    const minute = Math.random() > 0.5 ? '00' : '30';
    appointments.push({
      id: i + 1,
      patientName: `Patient ${String.fromCharCode(65 + i)}`,
      time: `${hour}:${minute} ${hour < 12 ? 'AM' : 'PM'}`,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return appointments;
};

export const getMockLowStockItems = (): LowStockItem[] => {
  const products = [
    { name: 'Paracetamol 500mg', current: 45, min: 100 },
    { name: 'Amoxicillin 250mg', current: 12, min: 50 },
    { name: 'Ibuprofen 200mg', current: 8, min: 75 },
    { name: 'Surgical Gloves (Box)', current: 3, min: 20 },
    { name: 'Face Masks (Pack)', current: 25, min: 100 },
    { name: 'Antiseptic Solution', current: 6, min: 30 },
    { name: 'Bandages (Roll)', current: 15, min: 50 },
    { name: 'Thermometer', current: 4, min: 15 },
  ];

  return products.map((product, index) => ({
    id: index + 1,
    productName: product.name,
    currentStock: product.current,
    minStock: product.min,
    urgency:
      product.current < product.min * 0.3 ? 'critical' : 'warning',
  }));
};
