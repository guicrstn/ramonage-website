import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// This API sends email notifications
// For production, integrate with Resend (resend.com) - 3000 emails/month free
// For now, this logs the notification and returns success
// To enable real emails: pnpm add resend, then uncomment the Resend code below

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
    let body = ""

    switch (type) {
      case "confirmed":
        subject = "Votre rendez-vous L.B Ramonage est confirme"
        body = `Bonjour ${clientName},\n\nVotre rendez-vous de ramonage a ete confirme pour le ${date} a ${time}.\n\nAdresse d'intervention : ${appointment.address}, ${appointment.city}\n\nEn cas d'empechement, merci de nous contacter au plus vite.\n\nCordialement,\nL.B Ramonage / Fumisterie`
        break
      case "cancelled":
        subject = "Votre rendez-vous L.B Ramonage a ete annule"
        body = `Bonjour ${clientName},\n\nNous sommes desoles, votre rendez-vous du ${date} a ${time} a ete annule.\n\nN'hesitez pas a reprendre rendez-vous sur notre site ou a nous contacter.\n\nCordialement,\nL.B Ramonage / Fumisterie`
        break
      case "reminder":
        subject = "Rappel : votre rendez-vous L.B Ramonage demain"
        body = `Bonjour ${clientName},\n\nCeci est un rappel pour votre rendez-vous de ramonage prevu demain, ${date} a ${time}.\n\nAdresse d'intervention : ${appointment.address}, ${appointment.city}\n\nA demain !\n\nCordialement,\nL.B Ramonage / Fumisterie`
        break
      default:
        return NextResponse.json(
          { error: "Type de notification inconnu" },
          { status: 400 }
        )
    }

    // ============================================================
    // POUR ACTIVER LES EMAILS REELS :
    // 1. Creer un compte sur https://resend.com (gratuit)
    // 2. Ajouter la variable RESEND_API_KEY dans .env.local
    // 3. pnpm add resend
    // 4. Decommenter le code ci-dessous :
    // ============================================================
    //
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    //
    // if (clientEmail) {
    //   await resend.emails.send({
    //     from: 'L.B Ramonage <noreply@votredomaine.fr>',
    //     to: clientEmail,
    //     subject,
    //     text: body,
    //   })
    // }
    //
    // // Notify admin too
    // await resend.emails.send({
    //   from: 'L.B Ramonage <noreply@votredomaine.fr>',
    //   to: 'admin@lb-ramonage.fr',
    //   subject: `[Admin] ${subject}`,
    //   text: body,
    // })

    console.log(`[Notification] Type: ${type}, To: ${clientEmail}`)
    console.log(`[Notification] Subject: ${subject}`)
    console.log(`[Notification] Body: ${body}`)

    return NextResponse.json({
      success: true,
      message: `Notification "${type}" preparee pour ${clientName}`,
      email: clientEmail,
      // Set to true once Resend is configured
      emailSent: false,
      subject,
    })
  } catch (error) {
    console.error("[Notification Error]", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi" },
      { status: 500 }
    )
  }
}
