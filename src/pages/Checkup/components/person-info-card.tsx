
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card/Card"
import { AppointmentReasons, Courses, YearLevels } from "@/enums/commons"
import { GetInitialMedicalRecordsDTO } from "@/types/medicalRecordsType"
import { formatDate, formatStatus } from "@/utilities/helpers"
import { User, GraduationCap, Calendar, Clock, Stethoscope, Briefcase, Building2 } from "lucide-react"

interface PersonInfoCardProps {
  details: GetInitialMedicalRecordsDTO | null;
}


export function PersonInfoCard({ details }: PersonInfoCardProps) {

  const getInfoItems = () => {
    const baseItems = [{ icon: User, label: "Name", value: details?.Name }]

    if (details?.StudentDetails) {
      baseItems.push({ icon: GraduationCap, label: "Grade / Section", value: `${formatStatus(Courses[details.StudentDetails.Course])} - ${formatStatus(YearLevels[details.StudentDetails.Year])}` })
    } else if (details?.TeacherDetails) {
      baseItems.push(
        { icon: Building2, label: "Department", value: "" },
        { icon: Briefcase, label: "Position", value: "" },
      )
    } else if (details?.StaffDetails) {
      baseItems.push(
        { icon: Building2, label: "Department", value: "" },
        { icon: Briefcase, label: "Role", value: "" },
      )
    }

    baseItems.push(
      // { icon: User, label: "Age", value: `${person.age} years old` },
      { icon: Calendar, label: "Visit Date", value: formatDate(details?.VisitDate ?? new Date) },
      { icon: Clock, label: "Visit Time", value: details?.VisitTime },
      { icon: Stethoscope, label: "Reason for Visit", value: formatStatus(AppointmentReasons[details?.Reason ?? AppointmentReasons.OTHER_HEALTH_CONCERNS]) },
    )

    return baseItems
  }

  const infoItems = getInfoItems()

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <User className="h-5 w-5 text-sky-600" />
            Patient Information
          </CardTitle>
          {/* {typeConfig.label} */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <p className="mt-0.5 text-wrap font-medium text-xs text-slate-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
