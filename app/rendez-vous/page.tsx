import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking-form"
import { Shield, Clock, Award, Star, CalendarDays } from "lucide-react"

export const metadata: Metadata = {
  title: "Prendre Rendez-vous - L.B Ramonage / Fumisterie",
  description:
    "Reservez votre ramonage en ligne. Consultez les creneaux disponibles en temps reel et choisissez celui qui vous convient.",
}

const benefits = [
  {
    icon: CalendarDays,
    title: "Planning en temps reel",
    text: "Consultez les disponibilites et reservez en un clic.",
  },
  {
    icon: Clock,
    title: "Intervention rapide",
    text: "Nous nous engageons a intervenir dans les meilleurs delais.",
  },
  {
    icon: Shield,
    title: "Travail garanti",
    text: "Assurance decennale et certificat de ramonage fourni.",
  },
  {
    icon: Award,
    title: "Toiture verifiee",
    text: "Verification gratuite de votre toiture incluse.",
  },
]

export default function RendezVousPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden bg-foreground py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CC0000]/20 via-transparent to-[#F5A623]/10" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-1.5">
            <CalendarDays className="h-4 w-4 text-[#F5A623]" />
            <span className="text-sm font-semibold text-[#F5A623]">Reservation en ligne</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold text-background md:text-5xl">
            Prendre rendez-vous
          </h1>
          <p className="mt-4 max-w-xl text-lg text-background/70">
            Consultez notre planning en temps reel et reservez le creneau qui vous convient. Les creneaux deja pris sont automatiquement indisponibles.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Planning */}
            <div className="lg:col-span-2">
              <BookingForm />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#CC0000]/10">
                    <b.icon className="h-5 w-5 text-[#CC0000]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-card-foreground">{b.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.text}</p>
                  </div>
                </div>
              ))}

              {/* Promo */}
              <div className="rounded-xl bg-gradient-to-br from-[#F5A623] to-[#E8951A] p-6 text-center shadow-lg">
                <Star className="mx-auto h-8 w-8 text-white" />
                <p className="mt-3 font-serif text-lg font-bold text-white">
                  Offre speciale
                </p>
                <p className="mt-1 text-sm text-white/90">
                  Un ramonage = verification de toiture OFFERTE
                </p>
              </div>

              {/* Info */}
              <div className="rounded-xl border border-[#CC0000]/20 bg-[#CC0000]/5 p-5">
                <h4 className="text-sm font-bold text-card-foreground">Comment ca marche ?</h4>
                <ol className="mt-3 flex flex-col gap-2">
                  <li className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CC0000] text-[10px] font-bold text-white">1</span>
                    Selectionnez une date disponible sur le calendrier
                  </li>
                  <li className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CC0000] text-[10px] font-bold text-white">2</span>
                    Choisissez un creneau horaire libre
                  </li>
                  <li className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CC0000] text-[10px] font-bold text-white">3</span>
                    Remplissez vos informations et confirmez
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
