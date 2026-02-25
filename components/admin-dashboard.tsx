"use client"

import { useState } from "react"
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
  pending: "bg-secondary text-secondary-foreground",
  confirmed: "bg-chart-3/20 text-chart-3",
  cancelled: "bg-destructive/20 text-destructive",
  completed: "bg-primary/20 text-primary",
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
  const router = useRouter()

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

  return (
    <div className="min-h-svh bg-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
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
              <p className="font-serif text-sm font-bold text-foreground">Administration</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-border text-muted-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Deconnexion
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{appointments.length}</p>
                <p className="text-xs text-muted-foreground">Total RDV</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                <AlertCircle className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                <CheckCircle2 className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {appointments.filter((a) => a.status === "confirmed").length}
                </p>
                <p className="text-xs text-muted-foreground">Confirmes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{unreadCount}</p>
                <p className="text-xs text-muted-foreground">Messages non lus</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="appointments">
          <TabsList className="mb-6 bg-card">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Rendez-vous
              {pendingCount > 0 && (
                <Badge className="ml-2 bg-secondary text-secondary-foreground text-xs">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Messages
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-secondary text-secondary-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            {appointments.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground">Aucun rendez-vous pour le moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {appointments.map((appt) => (
                  <Card key={appt.id} className="border-border bg-card">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-card-foreground">{appt.full_name}</h3>
                            <Badge className={statusColors[appt.status] || "bg-muted text-muted-foreground"}>
                              {statusLabels[appt.status] || appt.status}
                            </Badge>
                            <Badge variant="outline" className="border-border text-muted-foreground">
                              {serviceLabels[appt.service_type] || appt.service_type}
                            </Badge>
                          </div>
                          <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
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
                              <a href={`tel:${appt.phone}`} className="text-primary hover:underline">
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
                            <p className="mt-2 rounded bg-muted p-2 text-sm text-muted-foreground">
                              {appt.message}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
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
                            className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
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

          {/* Messages Tab */}
          <TabsContent value="messages">
            {messages.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground">Aucun message pour le moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <Card
                    key={msg.id}
                    className={`border-border bg-card ${!msg.is_read ? "border-l-4 border-l-primary" : ""}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {msg.is_read ? (
                              <MailOpen className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Mail className="h-4 w-4 text-primary" />
                            )}
                            <h3 className="font-semibold text-card-foreground">{msg.subject}</h3>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
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
                          <p className="mt-2 rounded bg-muted p-3 text-sm text-muted-foreground">
                            {msg.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleMessageRead(msg.id, msg.is_read)}
                            className="border-border text-muted-foreground"
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
                            className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
