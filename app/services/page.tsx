import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CtaSection } from "@/components/cta-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Flame,
  Wind,
  Wrench,
  Home,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Nos Services - L.B Ramonage / Fumisterie",
  description:
    "Decouvrez tous nos services : ramonage, entretien de poeles, depannage, reparation et verification de toiture offerte.",
}

const services = [
  {
    icon: Flame,
    title: "Ramonage de cheminees",
    description:
      "Le ramonage est obligatoire au moins une fois par an. Nous nettoyons en profondeur vos conduits pour eliminer la suie, le goudron et les risques d'incendie. Un certificat de ramonage est delivre a chaque intervention.",
    features: [
      "Nettoyage complet du conduit",
      "Certificat de conformite",
      "Verification du tirage",
      "Conseils d'entretien personnalises",
    ],
  },
  {
    icon: Wind,
    title: "Entretien de poeles et inserts",
    description:
      "Vos poeles a bois, a granules et inserts necessitent un entretien regulier pour fonctionner de maniere optimale et securisee. Nous assurons leur maintenance complete.",
    features: [
      "Nettoyage du foyer et des vitres",
      "Verification des joints",
      "Controle de la combustion",
      "Remplacement de pieces si necessaire",
    ],
  },
  {
    icon: Wrench,
    title: "Depannage et reparation",
    description:
      "Probleme de tirage, fissure de conduit, fumee dans la piece ? Notre equipe intervient rapidement pour diagnostiquer et reparer tout dysfonctionnement de votre installation.",
    features: [
      "Diagnostic complet",
      "Reparation de conduits",
      "Amelioration du tirage",
      "Intervention rapide",
    ],
  },
  {
    icon: Home,
    title: "Verification de toiture offerte",
    description:
      "Avec chaque ramonage, nous effectuons une verification gratuite de votre toiture. Nous detectons les tuiles cassees, les infiltrations potentielles et les points de faiblesse.",
    features: [
      "Inspection visuelle complete",
      "Detection de fuites",
      "Verification des sortie de toit",
      "Rapport d'inspection",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Mise en conformite",
    description:
      "Nous verifions que votre installation respecte les normes en vigueur et vous accompagnons dans les eventuelles mises en conformite necessaires pour votre securite.",
    features: [
      "Audit de conformite",
      "Mise aux normes",
      "Documentation complete",
      "Accompagnement assurance",
    ],
  },
]

export default function ServicesPage() {
  return (
    <main>
      <Navbar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/chimney-tools.jpg"
            alt="Outils de ramonage professionnels"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-foreground/80" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
            Nos prestations
          </p>
          <h1 className="mt-2 max-w-2xl font-serif text-4xl font-bold text-background md:text-5xl">
            <span className="text-balance">Services professionnels de ramonage et fumisterie</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-background/70">
            Des interventions de qualite pour assurer votre securite et le bon fonctionnement de vos installations.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-10">
            {services.map((service, index) => (
              <Card
                key={service.title}
                className="overflow-hidden border-border bg-card"
              >
                <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-start md:gap-8">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                        {index + 1}
                      </span>
                      <h2 className="font-serif text-xl font-bold text-card-foreground">
                        {service.title}
                      </h2>
                    </div>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-card-foreground">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/rendez-vous" className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Prendre rendez-vous
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </main>
  )
}
