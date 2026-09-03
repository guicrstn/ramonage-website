import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CtaSection } from "@/components/cta-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Wind, Layers, Wrench, CalendarDays, Info, CreditCard, Clock, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Grille tarifaire - L.B Ramonage / Fumisterie",
  description:
    "Consultez nos tarifs : forfait ramonage bois/insert, entretien poele a granules, poele mixte, debistrage et fumisterie. Tarifs clairs et transparents.",
}

const forfaits = [
  {
    icon: Flame,
    title: "Forfait Ramonage Bois / Insert",
    detail: "Ramonage du conduit par le haut ou le bas, nettoyage du foyer.",
    price: "80€",
    highlight: false,
  },
  {
    icon: Wind,
    title: "Ramonage + Entretien poele a granules (AIR)",
    detail:
      "Ramonage complet + nettoyage complet du corps de chauffe, extracteur fumees, ventilateur air chaud, echangeurs et remise a zero du compteur.",
    price: "215€",
    highlight: true,
  },
  {
    icon: Layers,
    title: "Ramonage + Entretien poele granules/bois (MIXTE)",
    detail:
      "Ramonage complet + nettoyage complet du corps de chauffe, extracteur fumees, ventilateur air chaud, echangeurs et remise a zero du compteur.",
    price: "235€",
    highlight: false,
  },
  {
    icon: Wrench,
    title: "Debistrage / Fumisterie",
    detail: "Elimination des goudrons, diagnostics, installation de conduits.",
    price: "Sur devis",
    highlight: false,
  },
]

const conditions = [
  {
    icon: MapPin,
    text: "Tarif indique pour une intervention a 20 km maximum. Au-dela, un forfait de 0,90€/kilometre est applique.",
  },
  {
    icon: Info,
    text: "Dans le departement de l'Ain, l'obligation legale est de 2 ramonages par an.",
  },
  {
    icon: CreditCard,
    text: "Reglement accepte : carte bancaire (privilegie), virement ou cheque.",
  },
  {
    icon: Clock,
    text: "Creneaux d'1 heure par intervention. Premier RDV a 8h, dernier RDV de la journee entre 16h30 et 17h30. Plage indisponible entre 12h et 13h30.",
  },
  {
    icon: Info,
    text: "En cas d'impossibilite d'intervenir (oubli du RDV, appareil en fonctionnement ou conduit encore chaud), un forfait de 50€ TTC sera facture.",
  },
]

export default function TarifsPage() {
  return (
    <main>
      <Navbar />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#1A1A1A]">
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-wider text-[#F5A623]">Nos tarifs</p>
          <h1 className="mt-2 max-w-2xl font-serif text-4xl font-extrabold text-white md:text-5xl">
            <span className="text-balance">Grille tarifaire</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">
            Des tarifs clairs et transparents pour l{"'"}entretien de vos installations. Tous nos prix sont indiques en TTC.
          </p>
        </div>
      </section>

      {/* Forfaits */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {forfaits.map((forfait) => (
              <Card
                key={forfait.title}
                className={`relative overflow-hidden border-2 ${
                  forfait.highlight ? "border-[#CC0000]" : "border-border"
                } bg-card`}
              >
                {forfait.highlight && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#CC0000] px-3 py-1 text-xs font-bold text-white">
                    Populaire
                  </span>
                )}
                <CardContent className="flex flex-col gap-4 p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#CC0000]/10">
                    <forfait.icon className="h-7 w-7 text-[#CC0000]" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-card-foreground text-balance">
                    {forfait.title}
                  </h2>
                  <p className="flex-1 leading-relaxed text-sm text-muted-foreground">{forfait.detail}</p>
                  <div className="flex items-baseline gap-1 border-t border-border pt-4">
                    <span className="font-serif text-3xl font-extrabold text-[#CC0000]">{forfait.price}</span>
                    {forfait.price !== "Sur devis" && (
                      <span className="text-sm font-semibold text-muted-foreground">TTC</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Offer banner */}
          <div className="mt-8 rounded-2xl bg-[#F5A623] px-6 py-6 text-center">
            <p className="font-serif text-xl font-extrabold text-[#1A1A1A] text-balance">
              Un ramonage = verification de toiture OFFERTE
            </p>
          </div>

          {/* Conditions */}
          <div className="mt-12">
            <h3 className="font-serif text-2xl font-bold text-foreground">Bon a savoir</h3>
            <ul className="mt-6 flex flex-col gap-4">
              {conditions.map((condition, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#CC0000]/10">
                    <condition.icon className="h-4 w-4 text-[#CC0000]" />
                  </div>
                  <p className="pt-1.5 text-sm leading-relaxed text-muted-foreground">{condition.text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              className="bg-[#CC0000] px-8 text-lg font-bold text-white shadow-lg shadow-[#CC0000]/20 hover:bg-[#B30000]"
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
