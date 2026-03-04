import { NextRequest, NextResponse } from "next/server"

// Use the free French government address API (api-adresse.data.gouv.fr)
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")

  if (!query || query.length < 3) {
    return NextResponse.json({ features: [] })
  }

  try {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5&autocomplete=1`
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ features: [] }, { status: 500 })
  }
}
