import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking-form"
import { Shield, Clock, Award, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Prendre Rendez-vous - L.B Ramonage / Fumisterie",
  description:
    "Reservez votre ramonage en ligne. Choisissez votre creneau et nous vous recontactons pour confirmer.",
}

const benefits = [
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
  {
    icon: Star,
    title: "Satisfaction client",
    text: "Un service de qualite reconnu par nos clients.",
  },
]

export default function RendezVousPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="bg-foreground py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
            Reservez en ligne
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-background md:text-5xl">
            Prendre rendez-vous
          </h1>
          <p className="mt-4 max-w-xl text-lg text-background/70">
            Remplissez le formulaire ci-dessous pour demander un rendez-vous. Nous vous recontacterons pour confirmer votre creneau.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <BookingForm />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-card-foreground">{b.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.text}</p>
                  </div>
                </div>
              ))}

              {/* Promo */}
              <div className="rounded-lg bg-secondary p-6 text-center">
                <Star className="mx-auto h-8 w-8 text-secondary-foreground" />
                <p className="mt-3 font-serif text-lg font-bold text-secondary-foreground">
                  Offre speciale
                </p>
                <p className="mt-1 text-sm text-secondary-foreground/80">
                  Un ramonage = verification de toiture OFFERTE
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
