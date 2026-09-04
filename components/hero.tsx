import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Shield, Star, Award, ArrowUpRight } from "lucide-react"

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
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/95 via-[#1A1A1A]/75 to-[#1A1A1A]/40" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-24 md:py-32 lg:grid-cols-[1.5fr_1fr] lg:px-8 lg:py-40">
        {/* Left: main content */}
        <div className="flex flex-col items-start">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5A623]/40 bg-[#F5A623]/15 px-4 py-2 backdrop-blur-sm">
            <Award className="h-4 w-4 text-[#F5A623]" />
            <span className="text-sm font-bold text-[#F5A623]">Professionnel certifie</span>
          </div>

          <h1 className="max-w-2xl font-serif text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
            <span className="text-balance">Votre expert en</span>{" "}
            <span className="text-[#F5A623]">ramonage</span>{" "}
            <span className="text-balance">et fumisterie</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Assurez la securite de votre foyer avec un ramonage professionnel.
            Intervention rapide, travail soigne et certificat de conformite.
          </p>

          {/* Promo Banner */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#F5A623]/40 bg-[#F5A623]/15 px-5 py-3 backdrop-blur-sm">
            <Star className="h-5 w-5 text-[#F5A623]" />
            <p className="text-sm font-bold text-[#F5A623]">
              Un ramonage = verification de toiture OFFERTE
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#CC0000] px-8 text-lg font-bold text-white shadow-lg shadow-[#CC0000]/30 hover:bg-[#B30000]"
            >
              <Link href="/rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent px-8 text-lg font-semibold text-white hover:bg-white/10 hover:text-white"
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
                <item.icon className="h-5 w-5 text-[#F5A623]" />
                <span className="text-sm font-semibold text-white/80">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: partner company link */}
        <div className="w-full">
          <Link
            href="https://lefevresas.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all hover:border-[#F5A623]/60 hover:bg-white/15"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#F5A623]">
              Notre autre activite
            </p>
            <div className="rounded-xl bg-white p-5">
              <Image
                src="/images/logo-lefevre.png"
                alt="LEFEVRE - Charpente, Couverture, Zinguerie"
                width={320}
                height={213}
                className="mx-auto h-20 w-auto sm:h-24"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Un besoin en toiture, charpente ou zinguerie ? La meme equipe gere egalement LEFEVRE.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#CC0000] px-5 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-[#B30000]">
              Visiter le site
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
