import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const MAX_RADIUS_KM = 1

// A slot belongs to the morning if its time is before 12:00, otherwise afternoon
function getPeriod(time: string): "morning" | "afternoon" {
  const hour = Number.parseInt(time.split(":")[0], 10)
  return hour < 12 ? "morning" : "afternoon"
}

// Haversine formula to calculate distance between two points
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function POST(request: NextRequest) {
  try {
    const { date, time, latitude, longitude } = await request.json()

    if (!date || !latitude || !longitude) {
      return NextResponse.json({ allowed: true })
    }

    const supabase = await createClient()

    // Get all confirmed/pending appointments for this date that have coordinates
    const { data: appointments } = await supabase
      .from("appointments")
      .select("latitude, longitude, preferred_time")
      .eq("preferred_date", date)
      .neq("status", "cancelled")
      .not("latitude", "is", null)
      .not("longitude", "is", null)

    if (!appointments || appointments.length === 0) {
      // No appointments for this day yet - allow booking
      return NextResponse.json({ allowed: true })
    }

    // Only compare with appointments in the same half-day (morning or afternoon)
    const period = time ? getPeriod(time) : null
    const relevant = period
      ? appointments.filter((a) => getPeriod(a.preferred_time) === period)
      : appointments

    if (relevant.length === 0) {
      // No appointments in this half-day yet - allow booking
      return NextResponse.json({ allowed: true })
    }

    const periodLabel = period === "morning" ? "la matinee" : "l'apres-midi"

    // Calculate center of existing appointments for this half-day
    const avgLat = relevant.reduce((sum, a) => sum + a.latitude, 0) / relevant.length
    const avgLon = relevant.reduce((sum, a) => sum + a.longitude, 0) / relevant.length

    // Check distance from the half-day's center
    const distance = haversineDistance(latitude, longitude, avgLat, avgLon)

    if (distance > MAX_RADIUS_KM) {
      const distanceStr =
        distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`
      return NextResponse.json({
        allowed: false,
        distance,
        maxRadius: MAX_RADIUS_KM,
        message: `Votre adresse est a ${distanceStr} du secteur deja prevu pour ${periodLabel} de cette date (rayon max : ${MAX_RADIUS_KM} km). Veuillez choisir un autre creneau.`,
      })
    }

    return NextResponse.json({ allowed: true, distance })
  } catch {
    // In case of error, allow booking (don't block legitimate clients)
    return NextResponse.json({ allowed: true })
  }
}
