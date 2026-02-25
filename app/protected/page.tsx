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
  const [appointmentsRes, messagesRes] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .order("preferred_date", { ascending: true }),
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false }),
  ])

  return (
    <AdminDashboard
      initialAppointments={appointmentsRes.data ?? []}
      initialMessages={messagesRes.data ?? []}
      userEmail={user.email ?? ""}
    />
  )
}
