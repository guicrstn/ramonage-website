import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { AdminDashboard } from "@/components/admin-dashboard"

export const metadata: Metadata = {
  title: "Tableau de bord - L.B Ramonage Admin",
  description: "Gestion des rendez-vous et messages.",
}

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch data server-side
  const [appointmentsRes, messagesRes, blockedRes] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .order("preferred_date", { ascending: true }),
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("blocked_dates")
      .select("*")
      .order("blocked_date", { ascending: true }),
  ])

  return (
    <AdminDashboard
      initialAppointments={appointmentsRes.data ?? []}
      initialMessages={messagesRes.data ?? []}
      initialBlockedDates={blockedRes.data ?? []}
      userEmail={user.email ?? ""}
    />
  )
}
