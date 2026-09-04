import { NextRequest, NextResponse } from "next/server"
import { sendNotificationEmail, renderEmail } from "@/lib/email"

export const runtime = "nodejs"

// Human-readable labels for the booking service types
const SERVICE_LABELS: Record<string, string> = {
  "forfait-bois-insert": "Forfait Ramonage : bois / insert",
  "forfait-granules": "Forfait Ramonage : entretien poele a granules",
  "forfait-mixte": "Forfait Ramonage : entretien poele a granules / bois (mixte)",
}

// Public route: notifies the business owner (contact@lbramonage.fr) via SMTP
// whenever a new appointment or contact message is submitted from the site.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type } = body

    if (type === "appointment") {
      const {
        full_name,
        phone,
        email,
        address,
        service_type,
        preferred_date,
        preferred_time,
        message,
      } = body

      const html = renderEmail(
        "Nouvelle demande de rendez-vous",
        [
          { label: "Client", value: full_name },
          { label: "Telephone", value: phone },
          { label: "Email", value: email || "-" },
          { label: "Adresse", value: address },
          { label: "Service", value: SERVICE_LABELS[service_type] || service_type },
          { label: "Date", value: preferred_date },
          { label: "Creneau", value: preferred_time },
        ],
        message
      )

      await sendNotificationEmail({
        subject: `Nouveau RDV - ${full_name} le ${preferred_date} a ${preferred_time}`,
        html,
        replyTo: email || undefined,
      })

      return NextResponse.json({ ok: true })
    }

    if (type === "contact") {
      const { full_name, email, phone, subject, message } = body

      const html = renderEmail(
        "Nouveau message de contact",
        [
          { label: "Nom", value: full_name },
          { label: "Email", value: email },
          { label: "Telephone", value: phone || "-" },
          { label: "Type de service", value: subject },
        ],
        message
      )

      await sendNotificationEmail({
        subject: `Nouveau message - ${full_name}`,
        html,
        replyTo: email || undefined,
      })

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: "Type inconnu" }, { status: 400 })
  } catch (err) {
    console.error("[v0] Erreur envoi notification proprietaire:", err)
    // Return 200 so the form submission still succeeds even if the email fails
    return NextResponse.json({ ok: false, error: "Email non envoye" }, { status: 200 })
  }
}
