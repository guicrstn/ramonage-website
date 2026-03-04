"use client"

import { useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CalendarDays,
  Mail,
  MailOpen,
  LogOut,
  Phone,
  MapPin,
  Clock,
  User,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Download,
  Calendar as CalendarIcon,
  Send,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

type Appointment = {
  id: string
  full_name: string
  email: string | null
  phone: string
  address: string
  city: string
  postal_code: string | null
  service_type: string
  preferred_date: string
  preferred_time: string
  message: string | null
  status: string
  created_at: string
}

type Message = {
  id: string
  full_name: string
  email: string
  phone: string | null
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

const statusColors: Record<string, string> = {
  pending: "bg-[#F5A623]/20 text-[#F5A623]",
  confirmed: "bg-emerald-500/20 text-emerald-600",
  cancelled: "bg-red-500/20 text-red-600",
  completed: "bg-[#CC0000]/20 text-[#CC0000]",
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirme",
  cancelled: "Annule",
  completed: "Termine",
}

const serviceLabels: Record<string, string> = {
  ramonage: "Ramonage",
  "entretien-poele": "Entretien poele",
  depannage: "Depannage",
  "mise-en-conformite": "Conformite",
  autre: "Autre",
}

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const MONTHS_FR = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export function AdminDashboard({
  initialAppointments,
  initialMessages,
  userEmail,
}: {
  initialAppointments: Appointment[]
  initialMessages: Message[]
  userEmail: string
}) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [messages, setMessages] = useState(initialMessages)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const router = useRouter()

  // Group appointments by date for calendar
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    for (const appt of appointments) {
      if (appt.status !== "cancelled") {
        if (!map[appt.preferred_date]) map[appt.preferred_date] = []
        map[appt.preferred_date].push(appt)
      }
    }
    return map
  }, [appointments])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("appointments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      toast.error("Erreur lors de la mise a jour")
      return
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
    toast.success(`Rendez-vous ${statusLabels[status]?.toLowerCase() || status}`)

    // Send notification when confirming or cancelling
    const appt = appointments.find((a) => a.id === id)
    if (appt && (status === "confirmed" || status === "cancelled")) {
      sendNotification(status, { ...appt, status })
    }
  }

  const sendNotification = async (type: string, appointment: Appointment) => {
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, appointment }),
      })
      const data = await res.json()
      if (data.success) {
        if (data.emailSent) {
          toast.success(`Email envoye a ${appointment.email || "l'admin"}`)
        } else {
          toast.info(`Notification preparee (configurez Resend pour envoyer les emails)`)
        }
      }
    } catch {
      // Silently fail notification - don't block the status update
    }
  }

  const sendReminder = async (appointment: Appointment) => {
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reminder", appointment }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Rappel envoye pour ${appointment.full_name}`)
      }
    } catch {
      toast.error("Erreur lors de l'envoi du rappel")
    }
  }

  const deleteAppointment = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("appointments").delete().eq("id", id)
    if (error) {
      toast.error("Erreur lors de la suppression")
      return
    }
    setAppointments((prev) => prev.filter((a) => a.id !== id))
    toast.success("Rendez-vous supprime")
  }

  const toggleMessageRead = async (id: string, currentRead: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: !currentRead })
      .eq("id", id)
    if (error) {
      toast.error("Erreur lors de la mise a jour")
      return
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: !currentRead } : m))
    )
  }

  const deleteMessage = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("contact_messages").delete().eq("id", id)
    if (error) {
      toast.error("Erreur lors de la suppression")
      return
    }
    setMessages((prev) => prev.filter((m) => m.id !== id))
    toast.success("Message supprime")
  }

  const pendingCount = appointments.filter((a) => a.status === "pending").length
  const unreadCount = messages.filter((m) => !m.is_read).length
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length

  // Calendar helpers
  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const todayStr = formatDateKey(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  )

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11)
      setCalYear(calYear - 1)
    } else {
      setCalMonth(calMonth - 1)
    }
  }

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0)
      setCalYear(calYear + 1)
    } else {
      setCalMonth(calMonth + 1)
    }
  }

  // Get selected day appointments
  const selectedDayAppointments = selectedDate
    ? appointments.filter(
        (a) => a.preferred_date === selectedDate && a.status !== "cancelled"
      )
    : []

  // Calendar URL for Google Calendar / iPhone
  const calendarUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/calendar`
    : "/api/calendar"
  const googleCalSyncUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(calendarUrl.replace("https://", "webcal://").replace("http://", "webcal://"))}`

  return (
    <div className="min-h-svh bg-[#F5F3EF]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#E8E4DC] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="L.B Ramonage"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div>
              <p className="font-serif text-sm font-bold text-[#1A1A1A]">Administration</p>
              <p className="text-xs text-[#6B6B6B]">{userEmail}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {/* ICS Download */}
            <a
              href="/api/calendar"
              download="lb-ramonage-rdv.ics"
              className="hidden sm:inline-flex"
            >
              <Button variant="outline" size="sm" className="border-[#E8E4DC] text-[#6B6B6B]">
                <Download className="mr-2 h-4 w-4" />
                Exporter ICS
              </Button>
            </a>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-[#E8E4DC] text-[#6B6B6B]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Deconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Stats */}
        <div className="mb-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card className="border-[#E8E4DC] bg-white">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#CC0000]/10">
                <CalendarDays className="h-5 w-5 text-[#CC0000]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{appointments.length}</p>
                <p className="text-xs text-[#6B6B6B]">Total RDV</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E8E4DC] bg-white">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5A623]/10">
                <AlertCircle className="h-5 w-5 text-[#F5A623]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{pendingCount}</p>
                <p className="text-xs text-[#6B6B6B]">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E8E4DC] bg-white">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{confirmedCount}</p>
                <p className="text-xs text-[#6B6B6B]">Confirmes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#E8E4DC] bg-white">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#CC0000]/10">
                <Mail className="h-5 w-5 text-[#CC0000]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{unreadCount}</p>
                <p className="text-xs text-[#6B6B6B]">Messages non lus</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Sync Info */}
        <Card className="mb-6 border-[#F5A623]/30 bg-[#FFF8EC]">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CalendarIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#F5A623]" />
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">Synchroniser vos RDV confirmes</p>
                <p className="text-xs text-[#6B6B6B]">
                  Ajoutez les RDV confirmes a votre Google Calendar ou Calendrier iPhone.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={calendarUrl.replace("https://", "webcal://").replace("http://", "webcal://")} className="inline-flex">
                <Button size="sm" variant="outline" className="border-[#E8E4DC] text-sm">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  iPhone / Mac
                </Button>
              </a>
              <a href={googleCalSyncUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
                <Button size="sm" variant="outline" className="border-[#E8E4DC] text-sm">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Google Calendar
                </Button>
              </a>
              <a href="/api/calendar" download="lb-ramonage-rdv.ics" className="inline-flex sm:hidden">
                <Button size="sm" variant="outline" className="border-[#E8E4DC] text-sm">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Telecharger .ics
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="calendar">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-[#CC0000] data-[state=active]:text-white">
              Calendrier
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-[#CC0000] data-[state=active]:text-white">
              Tous les RDV
              {pendingCount > 0 && (
                <Badge className="ml-2 bg-[#F5A623] text-[#1A1A1A] text-xs">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-[#CC0000] data-[state=active]:text-white">
              Messages
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-[#F5A623] text-[#1A1A1A] text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ===================== CALENDAR TAB ===================== */}
          <TabsContent value="calendar">
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {/* Calendar Grid */}
              <Card className="border-[#E8E4DC] bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <CardTitle className="font-serif text-lg font-bold text-[#1A1A1A]">
                    {MONTHS_FR[calMonth]} {calYear}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="px-3 pb-4">
                  {/* Day headers */}
                  <div className="mb-2 grid grid-cols-7 text-center">
                    {DAYS_FR.map((d) => (
                      <span key={d} className="py-2 text-xs font-semibold text-[#6B6B6B]">
                        {d}
                      </span>
                    ))}
                  </div>
                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for first week offset */}
                    {Array.from({ length: firstDay }, (_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1
                      const dateKey = formatDateKey(calYear, calMonth, day)
                      const dayAppts = appointmentsByDate[dateKey] || []
                      const isToday = dateKey === todayStr
                      const isSelected = dateKey === selectedDate
                      const hasPending = dayAppts.some((a) => a.status === "pending")
                      const hasConfirmed = dayAppts.some((a) => a.status === "confirmed")

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(dateKey)}
                          className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-all ${
                            isSelected
                              ? "bg-[#CC0000] font-bold text-white shadow-md"
                              : isToday
                                ? "bg-[#CC0000]/10 font-semibold text-[#CC0000] ring-1 ring-[#CC0000]/30"
                                : "text-[#1A1A1A] hover:bg-[#F5F3EF]"
                          }`}
                        >
                          <span>{day}</span>
                          {dayAppts.length > 0 && (
                            <div className="mt-0.5 flex gap-0.5">
                              {hasPending && (
                                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-[#F5A623]" : "bg-[#F5A623]"}`} />
                              )}
                              {hasConfirmed && (
                                <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-emerald-300" : "bg-emerald-500"}`} />
                              )}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {/* Legend */}
                  <div className="mt-4 flex flex-wrap gap-4 border-t border-[#E8E4DC] pt-3 text-xs text-[#6B6B6B]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#F5A623]" />
                      En attente
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      Confirme
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Day Details */}
              <div className="flex flex-col gap-4">
                {selectedDate ? (
                  <>
                    <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                      {new Date(selectedDate + "T12:00:00").toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h3>
                    {selectedDayAppointments.length === 0 ? (
                      <Card className="border-[#E8E4DC] bg-white">
                        <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
                          <CalendarDays className="h-10 w-10 text-[#E8E4DC]" />
                          <p className="text-sm text-[#6B6B6B]">Aucun RDV ce jour</p>
                        </CardContent>
                      </Card>
                    ) : (
                      selectedDayAppointments
                        .sort((a, b) => a.preferred_time.localeCompare(b.preferred_time))
                        .map((appt) => (
                          <Card key={appt.id} className="border-[#E8E4DC] bg-white">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded bg-[#CC0000]/10 px-2 py-0.5 text-xs font-bold text-[#CC0000]">
                                      {appt.preferred_time}
                                    </span>
                                    <Badge className={statusColors[appt.status]}>
                                      {statusLabels[appt.status]}
                                    </Badge>
                                  </div>
                                  <p className="mt-2 font-semibold text-[#1A1A1A]">{appt.full_name}</p>
                                  <div className="mt-1 flex flex-col gap-1 text-xs text-[#6B6B6B]">
                                    <span className="flex items-center gap-1.5">
                                      <Phone className="h-3 w-3" />
                                      <a href={`tel:${appt.phone}`} className="text-[#CC0000]">
                                        {appt.phone}
                                      </a>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate">{appt.address}, {appt.city}</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <CalendarDays className="h-3 w-3" />
                                      {serviceLabels[appt.service_type] || appt.service_type}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions row */}
                              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#E8E4DC] pt-3">
                                <Select
                                  value={appt.status}
                                  onValueChange={(val) => updateAppointmentStatus(appt.id, val)}
                                >
                                  <SelectTrigger className="h-8 w-28 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="confirmed">Confirme</SelectItem>
                                    <SelectItem value="completed">Termine</SelectItem>
                                    <SelectItem value="cancelled">Annule</SelectItem>
                                  </SelectContent>
                                </Select>
                                {appt.status === "confirmed" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-[#F5A623]/30 text-xs text-[#F5A623] hover:bg-[#F5A623]/10"
                                    onClick={() => sendReminder(appt)}
                                  >
                                    <Bell className="mr-1 h-3 w-3" />
                                    Rappel
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="ml-auto h-8 w-8 shrink-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => deleteAppointment(appt.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </>
                ) : (
                  <Card className="border-[#E8E4DC] bg-white">
                    <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                      <CalendarDays className="h-12 w-12 text-[#E8E4DC]" />
                      <p className="text-sm text-[#6B6B6B]">
                        Cliquez sur un jour du calendrier pour voir les RDV.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ===================== ALL APPOINTMENTS TAB ===================== */}
          <TabsContent value="appointments">
            {appointments.length === 0 ? (
              <Card className="border-[#E8E4DC] bg-white">
                <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                  <CalendarDays className="h-12 w-12 text-[#E8E4DC]" />
                  <p className="text-[#6B6B6B]">Aucun rendez-vous pour le moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {appointments.map((appt) => (
                  <Card key={appt.id} className="border-[#E8E4DC] bg-white">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-[#1A1A1A]">{appt.full_name}</h3>
                            <Badge className={statusColors[appt.status] || "bg-gray-100 text-gray-600"}>
                              {statusLabels[appt.status] || appt.status}
                            </Badge>
                            <Badge variant="outline" className="border-[#E8E4DC] text-[#6B6B6B]">
                              {serviceLabels[appt.service_type] || appt.service_type}
                            </Badge>
                          </div>
                          <div className="mt-3 grid gap-2 text-sm text-[#6B6B6B] sm:grid-cols-2">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {new Date(appt.preferred_date).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5" />
                              {appt.preferred_time}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5" />
                              <a href={`tel:${appt.phone}`} className="text-[#CC0000] hover:underline">
                                {appt.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5" />
                              {appt.address}, {appt.city} {appt.postal_code || ""}
                            </div>
                            {appt.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5" />
                                {appt.email}
                              </div>
                            )}
                          </div>
                          {appt.message && (
                            <p className="mt-2 rounded bg-[#F5F3EF] p-2 text-sm text-[#6B6B6B]">{appt.message}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {appt.status === "confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10"
                              onClick={() => sendReminder(appt)}
                              title="Envoyer un rappel au client"
                            >
                              <Bell className="mr-1.5 h-3.5 w-3.5" />
                              Rappel
                            </Button>
                          )}
                          <Select
                            value={appt.status}
                            onValueChange={(val) => updateAppointmentStatus(appt.id, val)}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="confirmed">Confirme</SelectItem>
                              <SelectItem value="completed">Termine</SelectItem>
                              <SelectItem value="cancelled">Annule</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => deleteAppointment(appt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===================== MESSAGES TAB ===================== */}
          <TabsContent value="messages">
            {messages.length === 0 ? (
              <Card className="border-[#E8E4DC] bg-white">
                <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                  <Mail className="h-12 w-12 text-[#E8E4DC]" />
                  <p className="text-[#6B6B6B]">Aucun message pour le moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <Card
                    key={msg.id}
                    className={`border-[#E8E4DC] bg-white ${!msg.is_read ? "border-l-4 border-l-[#CC0000]" : ""}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {msg.is_read ? (
                              <MailOpen className="h-4 w-4 text-[#6B6B6B]" />
                            ) : (
                              <Mail className="h-4 w-4 text-[#CC0000]" />
                            )}
                            <h3 className="font-semibold text-[#1A1A1A]">{msg.subject}</h3>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#6B6B6B]">
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {msg.full_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" />
                              {msg.email}
                            </span>
                            {msg.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" />
                                {msg.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(msg.created_at).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="mt-2 rounded bg-[#F5F3EF] p-3 text-sm text-[#6B6B6B]">{msg.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleMessageRead(msg.id, msg.is_read)}
                            className="border-[#E8E4DC] text-[#6B6B6B]"
                          >
                            {msg.is_read ? (
                              <>
                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                Non lu
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                Lu
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => deleteMessage(msg.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
