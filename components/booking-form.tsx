"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import { AddressAutocomplete, type AddressResult } from "@/components/address-autocomplete"

// 1h30 slots with a lunch break from 12:30 to 13:30.
// Weekdays (Mon-Fri): 08:00-09:30, 09:30-11:00, 11:00-12:30, [pause], 13:30-15:00, 15:00-16:30, 16:30-18:00
const WEEKDAY_SLOTS = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"]
// Saturday: 08:00 to 12:30 only (08:00-09:30, 09:30-11:00, 11:00-12:30)
const SATURDAY_SLOTS = ["08:00", "09:30", "11:00"]

// Returns the bookable slots for a given date (Saturday has a shorter schedule)
function getSlotsForDate(dateStr: string): string[] {
  const day = new Date(dateStr + "T00:00:00").getDay()
  return day === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS
}

const serviceTypes = [
  { value: "forfait-bois-insert", label: "Forfait Ramonage : bois / insert" },
  { value: "forfait-granules", label: "Forfait Ramonage : entretien poele a granules" },
  { value: "forfait-mixte", label: "Forfait Ramonage : entretien poele a granules / bois (mixte)" },
]

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
const MONTHS_FR = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
]

type BookedSlot = {
  preferred_date: string
  preferred_time: string
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

// Bookings open starting March 1st, 2027
const BOOKING_START = new Date(2027, 2, 1)

export function BookingForm() {
  const today = new Date()
  // Earliest bookable day = the later of today and the booking opening date
  const minDate = today > BOOKING_START ? today : BOOKING_START
  const minDateStr = `${minDate.getFullYear()}-${String(minDate.getMonth() + 1).padStart(2, "0")}-${String(minDate.getDate()).padStart(2, "0")}`
  const [currentMonth, setCurrentMonth] = useState(minDate.getMonth())
  const [currentYear, setCurrentYear] = useState(minDate.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set())
  const [isLoadingSlots, setIsLoadingSlots] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [step, setStep] = useState<"calendar" | "form">("calendar")
  const [distanceError, setDistanceError] = useState<string | null>(null)
  const [isCheckingDistance, setIsCheckingDistance] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    service_type: "",
    message: "",
    latitude: 0,
    longitude: 0,
  })

  const fetchBookedSlots = useCallback(async () => {
    setIsLoadingSlots(true)

    // Safety timeout: never let the spinner hang more than 8s
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 8000)
    )

    try {
      const supabase = createClient()
      const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`
      const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${getDaysInMonth(currentYear, currentMonth)}`

      const query = supabase
        .from("appointments")
        .select("preferred_date, preferred_time")
        .gte("preferred_date", startDate)
        .lte("preferred_date", endDate)
        .neq("status", "cancelled")

      const blockedQuery = supabase
        .from("blocked_dates")
        .select("blocked_date")
        .gte("blocked_date", startDate)
        .lte("blocked_date", endDate)

      const [bookedRes, blockedRes] = (await Promise.race([
        Promise.all([query, blockedQuery]),
        timeout,
      ])) as [Awaited<typeof query>, Awaited<typeof blockedQuery>]

      if (bookedRes.error) throw bookedRes.error
      setBookedSlots(bookedRes.data || [])
      setBlockedDates(new Set((blockedRes.data || []).map((b) => b.blocked_date)))
    } catch {
      // On any error/timeout, show the calendar with no booked slots
      // so the client can still see and pick available dates.
      setBookedSlots([])
    } finally {
      setIsLoadingSlots(false)
    }
  }, [currentMonth, currentYear])

  useEffect(() => {
    fetchBookedSlots()
  }, [fetchBookedSlots])

  // Auto-refresh every 30 seconds to catch other bookings
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookedSlots()
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchBookedSlots])

  const isSlotBooked = (date: string, time: string) => {
    return bookedSlots.some(
      (slot) => slot.preferred_date === date && slot.preferred_time === time
    )
  }

  const getBookedCountForDate = (date: string) => {
    return bookedSlots.filter((slot) => slot.preferred_date === date).length
  }

  const getAvailableSlotsForDate = (date: string) => {
    return getSlotsForDate(date).filter((time) => !isSlotBooked(date, time))
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateClick = (dateStr: string) => {
    const available = getAvailableSlotsForDate(dateStr)
    if (available.length === 0) return
    setSelectedDate(dateStr)
    setSelectedTime(null)
    setDistanceError(null)
  }

  const handleTimeClick = (time: string) => {
    setSelectedTime(time)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddressSelect = async (address: AddressResult) => {
    setForm((prev) => ({
      ...prev,
      address: address.street,
      city: address.city,
      postal_code: address.postcode,
      latitude: address.latitude,
      longitude: address.longitude,
    }))
    setDistanceError(null)

    // Check distance if a date and time are selected
    if (selectedDate && selectedTime && address.latitude && address.longitude) {
      setIsCheckingDistance(true)
      try {
        const res = await fetch("/api/check-distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            time: selectedTime,
            latitude: address.latitude,
            longitude: address.longitude,
          }),
        })
        const data = await res.json()
        if (!data.allowed) {
          setDistanceError(data.message)
        }
      } catch {
        // Don't block on error
      } finally {
        setIsCheckingDistance(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    // Validate address has been selected via autocomplete
    if (!form.latitude || !form.longitude) {
      toast.error("Veuillez selectionner une adresse dans la liste de suggestions.")
      return
    }

    if (distanceError) {
      toast.error("Votre adresse est en dehors du rayon d'intervention pour cette date.")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Double-check the date has not been blocked (vacation) in the meantime
      const { data: blocked } = await supabase
        .from("blocked_dates")
        .select("id")
        .eq("blocked_date", selectedDate)

      if (blocked && blocked.length > 0) {
        toast.error("Cette date n'est plus disponible (conges). Veuillez en choisir une autre.")
        await fetchBookedSlots()
        setStep("calendar")
        setSelectedTime(null)
        setIsSubmitting(false)
        return
      }

      // Double-check the slot is still available
      const { data: existing } = await supabase
        .from("appointments")
        .select("id")
        .eq("preferred_date", selectedDate)
        .eq("preferred_time", selectedTime)
        .neq("status", "cancelled")

      if (existing && existing.length > 0) {
        toast.error("Ce creneau vient d'etre reserve par un autre client. Veuillez en choisir un autre.")
        await fetchBookedSlots()
        setStep("calendar")
        setSelectedTime(null)
        setIsSubmitting(false)
        return
      }

      // Final distance check server-side
      const distCheck = await fetch("/api/check-distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          latitude: form.latitude,
          longitude: form.longitude,
        }),
      })
      const distData = await distCheck.json()
      if (!distData.allowed) {
        toast.error(distData.message)
        setDistanceError(distData.message)
        setIsSubmitting(false)
        return
      }

      const { error } = await supabase.from("appointments").insert({
        full_name: form.full_name,
        email: form.email || null,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postal_code: form.postal_code || null,
        service_type: form.service_type,
        preferred_date: selectedDate,
        preferred_time: selectedTime,
        message: form.message || null,
        latitude: form.latitude,
        longitude: form.longitude,
      })

      if (error) throw error

      setIsSuccess(true)
      toast.success("Rendez-vous reserve avec succes !")
    } catch {
      toast.error("Une erreur est survenue. Veuillez reessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const canGoPrev =
    currentYear > minDate.getFullYear() ||
    (currentYear === minDate.getFullYear() && currentMonth > minDate.getMonth())

  if (isSuccess) {
    return (
      <Card className="border-border bg-card shadow-lg">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2E7D32]/10">
            <CheckCircle2 className="h-10 w-10 text-[#2E7D32]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-card-foreground">
            Rendez-vous reserve !
          </h3>
          <p className="max-w-md text-muted-foreground">
            Merci ! Votre creneau du{" "}
            <span className="font-semibold text-card-foreground">
              {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>{" "}
            a{" "}
            <span className="font-semibold text-card-foreground">{selectedTime}</span>{" "}
            est bien enregistre. Nous vous recontacterons pour confirmer.
          </p>
          <Button
            onClick={() => {
              setIsSuccess(false)
              setStep("calendar")
              setSelectedDate(null)
              setSelectedTime(null)
              setDistanceError(null)
              setForm({
                full_name: "", email: "", phone: "", address: "",
                city: "", postal_code: "", service_type: "", message: "",
                latitude: 0, longitude: 0,
              })
              fetchBookedSlots()
            }}
            variant="outline"
            className="mt-2 border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white"
          >
            Nouveau rendez-vous
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setStep("calendar")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            step === "calendar"
              ? "bg-[#CC0000] text-white shadow-md"
              : "bg-[#CC0000]/10 text-[#CC0000]"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          1. Choisir un creneau
        </button>
        <div className="h-px w-6 bg-border" />
        <button
          onClick={() => {
            if (selectedDate && selectedTime) setStep("form")
          }}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            step === "form"
              ? "bg-[#CC0000] text-white shadow-md"
              : selectedDate && selectedTime
                ? "bg-[#CC0000]/10 text-[#CC0000]"
                : "bg-muted text-muted-foreground"
          }`}
        >
          <User className="h-4 w-4" />
          2. Vos informations
        </button>
      </div>

      {step === "calendar" ? (
        <>
          {/* Calendar */}
          <Card className="border-border bg-card shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 font-serif text-xl text-card-foreground">
                  <CalendarDays className="h-5 w-5 text-[#CC0000]" />
                  Planning des disponibilites
                </CardTitle>
                <span className="flex items-center gap-1.5 rounded-full bg-[#2E7D32]/10 px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#2E7D32]" />
                  Temps reel
                </span>
              </div>
              <CardDescription>
                  Creneaux d{"'"}1h30. Les creneaux reserves par d{"'"}autres clients sont automatiquement indisponibles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Month Navigation */}
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={handlePrevMonth}
                  disabled={!canGoPrev}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Mois precedent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-bold text-card-foreground">
                  {MONTHS_FR[currentMonth]} {currentYear}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-card-foreground transition-colors hover:bg-muted"
                  aria-label="Mois suivant"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="mb-2 grid grid-cols-7 gap-1">
                {DAYS_FR.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              {isLoadingSlots ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-[#CC0000]" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells before the 1st */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
                    const isPast = dateStr < minDateStr
                    const dayOfWeek = new Date(currentYear, currentMonth, dayNum).getDay()
                    const isSunday = dayOfWeek === 0
                    const isBlocked = blockedDates.has(dateStr)
                    const bookedCount = getBookedCountForDate(dateStr)
                    const availableCount = getSlotsForDate(dateStr).length - bookedCount
                    const isFull = availableCount === 0
                    const isDisabled = isPast || isSunday || isFull || isBlocked
                    const isSelected = selectedDate === dateStr
                    const isToday = dateStr === minDateStr

                    return (
                      <button
                        key={dateStr}
                        onClick={() => !isDisabled && handleDateClick(dateStr)}
                        disabled={isDisabled}
                        className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-[#CC0000] text-white shadow-lg ring-2 ring-[#CC0000]/30"
                            : isDisabled
                              ? "cursor-not-allowed text-muted-foreground/40"
                              : isToday
                                ? "bg-[#F5A623]/20 font-bold text-[#F5A623] hover:bg-[#F5A623]/30"
                                : "text-card-foreground hover:bg-[#CC0000]/10"
                        }`}
                      >
                        <span className={isSelected ? "font-bold" : ""}>{dayNum}</span>
                        {!isPast && !isSunday && !isBlocked && (
                          <span
                            className={`mt-0.5 text-[10px] font-semibold ${
                              isSelected
                                ? "text-white/80"
                                : isFull
                                  ? "text-muted-foreground/40"
                                  : availableCount <= 4
                                    ? "text-[#F5A623]"
                                    : "text-[#2E7D32]"
                            }`}
                          >
                            {isFull ? "Complet" : `${availableCount} dispo`}
                          </span>
                        )}
                        {isBlocked && !isPast && (
                          <span className="mt-0.5 text-[10px] text-muted-foreground/40">Conges</span>
                        )}
                        {isSunday && !isPast && !isBlocked && (
                          <span className="mt-0.5 text-[10px] text-muted-foreground/40">Ferme</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#2E7D32]" />
                  <span className="text-xs text-muted-foreground">Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#F5A623]" />
                  <span className="text-xs text-muted-foreground">{"Peu de places"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground">Complet / Ferme</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          {selectedDate && (
            <Card className="border-border bg-card shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-lg text-card-foreground">
                  <Clock className="h-5 w-5 text-[#F5A623]" />
                  Creneaux du{" "}
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </CardTitle>
                <CardDescription>
                  Creneaux d{"'"}1h30. Pause de 12h30 a 13h30. Le samedi : 8h a 12h30. Les creneaux gris sont deja pris par d{"'"}autres clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Morning slots */}
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Matin</p>
                <div className="mb-4 grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-8">
                  {getSlotsForDate(selectedDate).filter(t => parseInt(t) < 12).map((time) => {
                    const booked = isSlotBooked(selectedDate, time)
                    const selected = selectedTime === time

                    return (
                      <button
                        key={time}
                        onClick={() => !booked && handleTimeClick(time)}
                        disabled={booked}
                        className={`flex flex-col items-center gap-0.5 rounded-lg border-2 px-2 py-2.5 text-sm font-semibold transition-all ${
                          selected
                            ? "border-[#CC0000] bg-[#CC0000] text-white shadow-lg"
                            : booked
                              ? "cursor-not-allowed border-border bg-muted/50 text-muted-foreground/40 line-through"
                              : "border-border bg-card text-card-foreground hover:border-[#CC0000] hover:bg-[#CC0000]/5"
                        }`}
                      >
                        {time}
                        <span className={`text-[9px] font-normal ${selected ? "text-white/80" : booked ? "text-muted-foreground/30" : "text-[#2E7D32]"}`}>
                          {booked ? "Pris" : "Libre"}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Afternoon slots (none on Saturday) */}
                {getSlotsForDate(selectedDate).some(t => parseInt(t) >= 13) && (
                  <>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Apres-midi</p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-8">
                      {getSlotsForDate(selectedDate).filter(t => parseInt(t) >= 13).map((time) => {
                        const booked = isSlotBooked(selectedDate, time)
                        const selected = selectedTime === time

                        return (
                          <button
                            key={time}
                            onClick={() => !booked && handleTimeClick(time)}
                            disabled={booked}
                            className={`flex flex-col items-center gap-0.5 rounded-lg border-2 px-2 py-2.5 text-sm font-semibold transition-all ${
                              selected
                                ? "border-[#CC0000] bg-[#CC0000] text-white shadow-lg"
                                : booked
                                  ? "cursor-not-allowed border-border bg-muted/50 text-muted-foreground/40 line-through"
                                  : "border-border bg-card text-card-foreground hover:border-[#CC0000] hover:bg-[#CC0000]/5"
                            }`}
                          >
                            {time}
                            <span className={`text-[9px] font-normal ${selected ? "text-white/80" : booked ? "text-muted-foreground/30" : "text-[#2E7D32]"}`}>
                              {booked ? "Pris" : "Libre"}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}

                {selectedTime && (
                  <div className="mt-5 flex justify-end">
                    <Button
                      onClick={() => setStep("form")}
                      className="bg-[#CC0000] px-6 font-semibold text-white hover:bg-[#B30000]"
                      size="lg"
                    >
                      Continuer
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        /* FORM STEP */
        <Card className="border-border bg-card shadow-lg">
          <CardHeader>
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-[#CC0000]/5 px-4 py-3">
              <CalendarDays className="h-5 w-5 text-[#CC0000]" />
              <div>
                <p className="text-sm font-bold text-card-foreground">
                  {selectedDate &&
                    new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Creneau : <span className="font-semibold text-[#CC0000]">{selectedTime}</span>
                </p>
              </div>
              <Button
                onClick={() => setStep("calendar")}
                variant="ghost"
                size="sm"
                className="ml-auto text-[#CC0000] hover:bg-[#CC0000]/10 hover:text-[#CC0000]"
              >
                Modifier
              </Button>
            </div>
            <CardTitle className="flex items-center gap-2 font-serif text-xl text-card-foreground">
              <User className="h-5 w-5 text-[#CC0000]" />
              Vos informations
            </CardTitle>
            <CardDescription>
              Completez vos coordonnees pour finaliser la reservation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="full_name">Nom complet *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Telephone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="06 00 00 00 00"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email (optionnel)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jean@exemple.fr"
                />
              </div>

              {/* Address autocomplete */}
              <div className="flex flex-col gap-2">
                <Label>Adresse d{"'"}intervention *</Label>
                <AddressAutocomplete
                  value={form.address}
                  onChange={handleAddressSelect}
                  placeholder="Tapez votre adresse..."
                />
                {form.city && (
                  <p className="text-xs text-muted-foreground">
                    {form.address}, {form.postal_code} {form.city}
                  </p>
                )}
                {isCheckingDistance && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Verification du secteur d{"'"}intervention...
                  </div>
                )}
                {distanceError && (
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-semibold">Hors secteur d{"'"}intervention</p>
                      <p className="text-xs">{distanceError}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Type de service *</Label>
                <Select
                  value={form.service_type}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, service_type: val }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="message">Message / commentaire</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Informations supplementaires..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => setStep("calendar")}
                  variant="outline"
                  className="border-border text-muted-foreground"
                  size="lg"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !!distanceError || isCheckingDistance}
                  className="flex-1 bg-[#CC0000] font-bold text-white hover:bg-[#B30000] disabled:opacity-50"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reservation en cours...
                    </>
                  ) : (
                    "Confirmer la reservation"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
