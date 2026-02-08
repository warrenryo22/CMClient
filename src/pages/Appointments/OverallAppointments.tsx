import CustomTabs, { TabItem } from '@/components/tabs/CustomTabs'
import OverallAppointmentCalendar from './OverallAppointmentCalendar'
import OverallAppointmentTable from './OverallAppointmentTable'
import { AppointmentType } from '@/enums/commons'
const OverallAppointments = () => {

  const appoitmentTabs: TabItem[] = [
     {
      key: 'tabled-view',
      title: 'Tabled View',
      content: <OverallAppointmentTable type={AppointmentType.SCHEDULED}/>
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