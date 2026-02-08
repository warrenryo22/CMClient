"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card/Card"
import { Student } from "@/types/checkup"
import { User, GraduationCap, Calendar, Clock, Stethoscope } from "lucide-react"

interface StudentInfoCardProps {
  student: Student
  visitDate: Date
  reasonForVisit: string
}

export function StudentInfoCard({ student, visitDate, reasonForVisit }: StudentInfoCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const infoItems = [
    { icon: User, label: "Student Name", value: student.name },
    {
      icon: GraduationCap,
      label: "Grade / Section",
      value: `${student.grade} - ${student.section}`,
    },
    { icon: User, label: "Age", value: `${student.age} years old` },
    { icon: Calendar, label: "Visit Date", value: formatDate(visitDate) },
    { icon: Clock, label: "Visit Time", value: formatTime(visitDate) },
    { icon: Stethoscope, label: "Reason for Visit", value: reasonForVisit },
  ]

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <User className="h-5 w-5 text-sky-600" />
          Student Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <p className="mt-0.5 truncate font-medium text-slate-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
