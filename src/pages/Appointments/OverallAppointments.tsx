import CustomTabs, { TabItem } from '@/components/tabs/CustomTabs'
import OverallAppointmentCalendar from './OverallAppointmentCalendar'
import OverallAppointmentTable from './OverallAppointmentTable'
const OverallAppointments = () => {

  const appoitmentTabs: TabItem[] = [
     {
      key: 'tabled-view',
      title: 'Tabled View',
      content: <OverallAppointmentTable />
    },
    {
      key: 'calendar',
      title: 'Calendar View',
      content: <OverallAppointmentCalendar/>
    },
  ]

  return (
    <div>
      <CustomTabs variant='floating' tabs={appoitmentTabs} />
    </div>
  )
}

export default OverallAppointments