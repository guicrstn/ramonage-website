import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Shield, Star, Award } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-chimney.jpg"
          alt="Ramonage professionnel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-center px-4 py-24 md:py-32 lg:px-8 lg:py-40">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 backdrop-blur-sm">
          <Award className="h-4 w-4 text-secondary" />
          <span className="text-sm font-medium text-secondary">Professionnel certifie</span>
        </div>

        <h1 className="max-w-2xl font-serif text-4xl font-bold leading-tight text-background md:text-5xl lg:text-6xl">
          <span className="text-balance">Votre expert en</span>{" "}
          <span className="text-secondary">ramonage</span>{" "}
          <span className="text-balance">et fumisterie</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/80">
          Assurez la securite de votre foyer avec un ramonage professionnel.
          Intervention rapide, travail soigne et certificat de conformite.
        </p>

        {/* Promo Banner */}
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-secondary/30 bg-secondary/10 px-5 py-3 backdrop-blur-sm">
          <Star className="h-5 w-5 text-secondary" />
          <p className="text-sm font-semibold text-secondary">
            Un ramonage = verification de toiture OFFERTE
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-primary px-8 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/rendez-vous">Prendre rendez-vous</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-background/30 bg-transparent px-8 text-lg text-background hover:bg-background/10 hover:text-background"
          >
            <Link href="/services">Nos services</Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap gap-8">
          {[
            { icon: Shield, text: "Assurance decennale" },
            { icon: Award, text: "Certificat de ramonage" },
            { icon: Star, text: "Satisfaction client" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <item.icon className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium text-background/80">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
