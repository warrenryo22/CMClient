"use client"

import type React from "react"

import { useState } from "react"

import { Search, Users, GraduationCap, Briefcase, UserCog } from "lucide-react"
import { Person, PersonType } from "@/types/checkup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card/Card"
import Input from "@/components/input/InputField"
import Button from "@/components/buttons/Button"

interface PersonSelectorProps {
  persons: Person[]
  onSelect: (person: Person) => void
}

const filterTabs: { type: PersonType | "all"; label: string; icon: React.ElementType }[] = [
  { type: "all", label: "All", icon: Users },
  { type: "student", label: "Students", icon: GraduationCap },
  { type: "teacher", label: "Teachers", icon: Briefcase },
  { type: "staff", label: "Staff", icon: UserCog },
]

export function PersonSelector({ persons, onSelect }: PersonSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<PersonType | "all">("all")

  const filteredPersons = persons.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || person.type === activeFilter
    return matchesSearch && matchesFilter
  })

  const getSecondaryInfo = (person: Person) => {
    if (person.type === "student") {
      return `${person.grade} - ${person.section}`
    } else if (person.type === "teacher") {
      return person.position
    } else {
      return person.role
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Users className="h-5 w-5 text-sky-600" />
          Select Patient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <Button
              key={tab.type}
              // variant={activeFilter === tab.type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(tab.type)}
              className={activeFilter === tab.type ? "bg-sky-600 hover:bg-sky-700" : ""}
            >
              <tab.icon className="mr-1.5 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Person List */}
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {filteredPersons.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No results found</p>
          ) : (
            filteredPersons.map((person) => {
              return (
                <button
                  key={person.id}
                  onClick={() => onSelect(person)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-sky-300 hover:bg-sky-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                      <span className="text-sm font-semibold text-slate-600">
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{person.name}</p>
                      <p className="text-sm text-slate-500">{getSecondaryInfo(person)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Badge variant="outline" className="text-xs text-slate-500">
                      {person.id}
                    </Badge>
                    <Badge className={`${config.bgColor} ${config.color} border-0 text-xs capitalize`}>
                      {person.type}
                    </Badge> */}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
