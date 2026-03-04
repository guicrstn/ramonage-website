import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

function escapeICS(text: string): string {
  return text.replace(/[\\;,\n]/g, (match) => {
    if (match === "\n") return "\\n"
    return "\\" + match
  })
}

function formatICSDate(dateStr: string, timeStr: string): string {
  const [year, month, day] = dateStr.split("-")
  const [hours, minutes] = timeStr.split(":")
  return `${year}${month}${day}T${hours}${minutes}00`
}

function addMinutesToTime(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(":").map(Number)
  const totalMinutes = h * 60 + m + minutes
  const newH = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0")
  const newM = (totalMinutes % 60).toString().padStart(2, "0")
  return `${newH}:${newM}`
}

export async function GET() {
  const supabase = await createClient()

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("status", "confirmed")
    .order("preferred_date", { ascending: true })

  const events = (appointments ?? [])
    .map((appt) => {
      const dtStart = formatICSDate(appt.preferred_date, appt.preferred_time)
      const endTime = addMinutesToTime(appt.preferred_time, 60)
      const dtEnd = formatICSDate(appt.preferred_date, endTime)
      const summary = escapeICS(
        `Ramonage - ${appt.full_name}`
      )
      const description = escapeICS(
        `Client: ${appt.full_name}\\nTel: ${appt.phone}\\nAdresse: ${appt.address}, ${appt.city}${appt.postal_code ? " " + appt.postal_code : ""}\\nService: ${appt.service_type}${appt.message ? "\\nNote: " + appt.message : ""}`
      )
      const location = escapeICS(
        `${appt.address}, ${appt.city}${appt.postal_code ? " " + appt.postal_code : ""}`
      )

      return [
        "BEGIN:VEVENT",
        `UID:${appt.id}@lb-ramonage`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        `STATUS:CONFIRMED`,
        "END:VEVENT",
      ].join("\r\n")
    })
    .join("\r\n")

  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//L.B Ramonage//Calendrier RDV//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:L.B Ramonage - RDV",
    "X-WR-TIMEZONE:Europe/Paris",
    events,
    "END:VCALENDAR",
  ].join("\r\n")

  return new NextResponse(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="lb-ramonage-rdv.ics"',
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  })
}
