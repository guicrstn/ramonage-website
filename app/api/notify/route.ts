import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Email de l'admin qui recoit les notifications de nouveau RDV
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@lb-ramonage.fr"
// L'adresse d'envoi - par defaut Resend fournit onboarding@resend.dev
// Pour utiliser votre propre domaine, configurez-le dans le dashboard Resend
const FROM_EMAIL = process.env.FROM_EMAIL || "L.B Ramonage <onboarding@resend.dev>"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Only authenticated admin can trigger notifications
    if (!user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const { type, appointment } = await request.json()

    if (!type || !appointment) {
      return NextResponse.json(
        { error: "Parametres manquants" },
        { status: 400 }
      )
    }

    const clientEmail = appointment.email
    const clientName = appointment.full_name
    const date = new Date(appointment.preferred_date).toLocaleDateString(
      "fr-FR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    )
    const time = appointment.preferred_time

    let subject = ""
    let htmlBody = ""

    switch (type) {
      case "confirmed":
        subject = "Votre rendez-vous L.B Ramonage est confirme"
        htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #CC0000; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 20px;">L.B Ramonage / Fumisterie</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #1A1A1A;">Rendez-vous confirme</h2>
              <p>Bonjour <strong>${clientName}</strong>,</p>
              <p>Votre rendez-vous de ramonage a ete <strong style="color: #2E7D32;">confirme</strong> :</p>
              <div style="background: white; border-left: 4px solid #CC0000; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date :</strong> ${date}</p>
                <p style="margin: 5px 0;"><strong>Heure :</strong> ${time}</p>
                <p style="margin: 5px 0;"><strong>Adresse :</strong> ${appointment.address}, ${appointment.city}</p>
                <p style="margin: 5px 0;"><strong>Service :</strong> ${appointment.service_type}</p>
              </div>
              <p>En cas d'empechement, merci de nous contacter au plus vite.</p>
              <p style="color: #F5A623; font-weight: bold;">Rappel : Un ramonage = verification de toiture offerte !</p>
              <p>Cordialement,<br/><strong>L.B Ramonage / Fumisterie</strong></p>
            </div>
          </div>
        `
        break
      case "cancelled":
        subject = "Votre rendez-vous L.B Ramonage a ete annule"
        htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #CC0000; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 20px;">L.B Ramonage / Fumisterie</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #1A1A1A;">Rendez-vous annule</h2>
              <p>Bonjour <strong>${clientName}</strong>,</p>
              <p>Nous sommes desoles, votre rendez-vous du <strong>${date}</strong> a <strong>${time}</strong> a ete annule.</p>
              <p>N'hesitez pas a reprendre rendez-vous sur notre site ou a nous contacter.</p>
              <p>Cordialement,<br/><strong>L.B Ramonage / Fumisterie</strong></p>
            </div>
          </div>
        `
        break
      case "reminder":
        subject = "Rappel : votre rendez-vous L.B Ramonage demain"
        htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #CC0000; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 20px;">L.B Ramonage / Fumisterie</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #1A1A1A;">Rappel de votre rendez-vous</h2>
              <p>Bonjour <strong>${clientName}</strong>,</p>
              <p>Ceci est un rappel pour votre rendez-vous de ramonage prevu <strong>demain</strong> :</p>
              <div style="background: white; border-left: 4px solid #F5A623; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date :</strong> ${date}</p>
                <p style="margin: 5px 0;"><strong>Heure :</strong> ${time}</p>
                <p style="margin: 5px 0;"><strong>Adresse :</strong> ${appointment.address}, ${appointment.city}</p>
              </div>
              <p>A demain !</p>
              <p>Cordialement,<br/><strong>L.B Ramonage / Fumisterie</strong></p>
            </div>
          </div>
        `
        break
      case "new_booking_admin":
        subject = `[Nouveau RDV] ${clientName} - ${date} a ${time}`
        htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #F5A623; padding: 20px; text-align: center;">
              <h1 style="color: #1A1A1A; margin: 0; font-size: 20px;">Nouveau rendez-vous</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #1A1A1A;">Un client vient de reserver</h2>
              <div style="background: white; border-left: 4px solid #F5A623; padding: 15px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Client :</strong> ${clientName}</p>
                <p style="margin: 5px 0;"><strong>Telephone :</strong> ${appointment.phone}</p>
                <p style="margin: 5px 0;"><strong>Email :</strong> ${clientEmail || "Non renseigne"}</p>
                <p style="margin: 5px 0;"><strong>Date :</strong> ${date}</p>
                <p style="margin: 5px 0;"><strong>Heure :</strong> ${time}</p>
                <p style="margin: 5px 0;"><strong>Adresse :</strong> ${appointment.address}, ${appointment.city}</p>
                <p style="margin: 5px 0;"><strong>Service :</strong> ${appointment.service_type}</p>
                ${appointment.message ? `<p style="margin: 5px 0;"><strong>Message :</strong> ${appointment.message}</p>` : ""}
              </div>
              <p>Connectez-vous a l'espace admin pour confirmer ou annuler ce rendez-vous.</p>
            </div>
          </div>
        `
        break
      default:
        return NextResponse.json(
          { error: "Type de notification inconnu" },
          { status: 400 }
        )
    }

    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Notification] RESEND_API_KEY manquante - email non envoye`)
      console.log(`[Notification] Type: ${type}, To: ${clientEmail}`)
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "RESEND_API_KEY non configuree. Ajoutez-la dans .env.local",
      })
    }

    const emailsToSend = []

    // Send to client (if they have an email)
    if (clientEmail && type !== "new_booking_admin") {
      emailsToSend.push(
        resend.emails.send({
          from: FROM_EMAIL,
          to: clientEmail,
          subject,
          html: htmlBody,
        })
      )
    }

    // Send to admin for new bookings or copy admin on confirmations
    if (type === "new_booking_admin" || type === "confirmed") {
      emailsToSend.push(
        resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: type === "new_booking_admin" ? subject : `[Admin] ${subject}`,
          html: htmlBody,
        })
      )
    }

    if (emailsToSend.length > 0) {
      const results = await Promise.allSettled(emailsToSend)
      const failures = results.filter((r) => r.status === "rejected")
      
      if (failures.length > 0) {
        console.error("[Notification] Certains emails ont echoue:", failures)
      }

      console.log(`[Notification] ${results.length - failures.length}/${results.length} emails envoyes`)
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      message: `Notification "${type}" envoyee`,
    })
  } catch (error) {
    console.error("[Notification Error]", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    )
  }
}
