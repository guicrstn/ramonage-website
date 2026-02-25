import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Wind, Wrench, Home, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Flame,
    title: "Ramonage de cheminees",
    description:
      "Nettoyage complet de vos conduits de cheminee pour garantir un fonctionnement optimal et securise. Certificat de ramonage fourni.",
  },
  {
    icon: Wind,
    title: "Entretien de poeles",
    description:
      "Maintenance et entretien de vos poeles a bois, granules et inserts. Verification et nettoyage complet.",
  },
  {
    icon: Wrench,
    title: "Depannage et reparation",
    description:
      "Intervention rapide pour tout probleme de tirage, fissure de conduit ou dysfonctionnement de votre installation.",
  },
  {
    icon: Home,
    title: "Verification de toiture",
    description:
      "Inspection gratuite de votre toiture incluse avec chaque ramonage. Detectez les problemes avant qu'ils ne s'aggravent.",
  },
]

export function ServicesPreview() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-[#CC0000]">
            Nos prestations
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl">
            <span className="text-balance">Des services complets pour votre securite</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            De l{"'"}entretien courant aux interventions d{"'"}urgence, nous couvrons tous vos besoins en ramonage et fumisterie.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#CC0000]/5"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CC0000]/10">
                  <service.icon className="h-6 w-6 text-[#CC0000]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-card-foreground">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            className="border-[#CC0000] font-bold text-[#CC0000] hover:bg-[#CC0000] hover:text-white"
          >
            <Link href="/services" className="flex items-center gap-2">
              Voir tous nos services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
