import nodemailer from "nodemailer"

// SMTP transporter configured via environment variables.
// For OVH: SMTP_HOST=ssl0.ovh.net, SMTP_PORT=465, SMTP_SECURE=true
function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is missing (SMTP_HOST, SMTP_USER, SMTP_PASSWORD)")
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: { user, pass },
  })
}

type SendArgs = {
  subject: string
  html: string
  replyTo?: string
}

// Sends a notification email FROM the no-reply mailbox TO the owner inbox.
export async function sendNotificationEmail({ subject, html, replyTo }: SendArgs) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@lbramonage.fr"
  const to = process.env.NOTIFICATION_EMAIL || "contact@lbramonage.fr"

  const transporter = getTransporter()

  await transporter.sendMail({
    from: `"L.B Ramonage" <${from}>`,
    to,
    subject,
    html,
    replyTo,
  })
}

// Simple branded HTML wrapper for notification emails.
export function renderEmail(title: string, rows: { label: string; value: string }[], message?: string) {
  const rowsHtml = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:8px 12px;font-weight:bold;color:#1A1A1A;background:#F7F5F1;border:1px solid #E8E4DC;white-space:nowrap;">${r.label}</td>
        <td style="padding:8px 12px;color:#333333;border:1px solid #E8E4DC;">${r.value || "-"}</td>
      </tr>`
    )
    .join("")

  const messageBlock = message
    ? `<div style="margin-top:16px;padding:12px 16px;background:#F7F5F1;border-left:4px solid #CC0000;border-radius:4px;">
         <p style="margin:0 0 4px;font-weight:bold;color:#1A1A1A;">Message :</p>
         <p style="margin:0;color:#333333;white-space:pre-wrap;">${message}</p>
       </div>`
    : ""

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#CC0000;padding:16px 20px;border-radius:8px 8px 0 0;">
      <h1 style="margin:0;color:#ffffff;font-size:18px;">L.B Ramonage</h1>
    </div>
    <div style="padding:20px;border:1px solid #E8E4DC;border-top:none;border-radius:0 0 8px 8px;">
      <h2 style="margin:0 0 16px;color:#1A1A1A;font-size:16px;">${title}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${rowsHtml}</table>
      ${messageBlock}
    </div>
  </div>`
}
