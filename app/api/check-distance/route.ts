import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const MAX_RADIUS_KM = 30

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
    const { date, latitude, longitude } = await request.json()

    if (!date || !latitude || !longitude) {
      return NextResponse.json({ allowed: true })
    }

    const supabase = await createClient()

    // Get all confirmed/pending appointments for this date that have coordinates
    const { data: appointments } = await supabase
      .from("appointments")
      .select("latitude, longitude")
      .eq("preferred_date", date)
      .neq("status", "cancelled")
      .not("latitude", "is", null)
      .not("longitude", "is", null)

    if (!appointments || appointments.length === 0) {
      // No appointments for this day yet - allow booking
      return NextResponse.json({ allowed: true })
    }

    // Calculate center of existing appointments for this day
    const avgLat =
      appointments.reduce((sum, a) => sum + a.latitude, 0) / appointments.length
    const avgLon =
      appointments.reduce((sum, a) => sum + a.longitude, 0) / appointments.length

    // Check distance from average center
    const distance = haversineDistance(latitude, longitude, avgLat, avgLon)

    if (distance > MAX_RADIUS_KM) {
      return NextResponse.json({
        allowed: false,
        distance: Math.round(distance),
        maxRadius: MAX_RADIUS_KM,
        message: `Votre adresse est a ${Math.round(distance)} km du secteur d'intervention prevu ce jour (rayon max: ${MAX_RADIUS_KM} km). Veuillez choisir une autre date.`,
      })
    }

    return NextResponse.json({ allowed: true, distance: Math.round(distance) })
  } catch {
    // In case of error, allow booking (don't block legitimate clients)
    return NextResponse.json({ allowed: true })
  }
}
