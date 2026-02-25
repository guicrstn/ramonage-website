import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact - L.B Ramonage / Fumisterie",
  description:
    "Contactez L.B Ramonage / Fumisterie pour toute demande d'information ou devis gratuit.",
}

const contactInfo = [
  {
    icon: Phone,
    label: "Telephone",
    value: "06 00 00 00 00",
    href: "tel:+33600000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@lb-ramonage.fr",
    href: "mailto:contact@lb-ramonage.fr",
  },
  {
    icon: MapPin,
    label: "Zone d'intervention",
    value: "Votre region et alentours",
    href: null,
  },
  {
    icon: Clock,
    label: "Horaires",
    value: "Lun-Ven: 8h-18h | Sam: 8h-12h",
    href: null,
  },
]

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="bg-foreground py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[#F5A623]">
            Contactez-nous
          </p>
          <h1 className="mt-2 font-serif text-4xl font-extrabold text-white md:text-5xl">
            Nous sommes a votre ecoute
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">
            Une question, un devis, un renseignement ? N{"'"}hesitez pas a nous contacter par telephone, email ou via le formulaire.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Sidebar Info */}
            <div className="flex flex-col gap-6">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#CC0000]/10">
                    <info.icon className="h-5 w-5 text-[#CC0000]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-card-foreground">{info.label}</h3>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="mt-1 text-sm text-[#CC0000] hover:underline"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
