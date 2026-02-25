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
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/95 via-[#1A1A1A]/75 to-[#1A1A1A]/40" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-center px-4 py-24 md:py-32 lg:px-8 lg:py-40">
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
    </section>
  )
}
