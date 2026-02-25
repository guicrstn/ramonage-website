import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CalendarDays, Phone } from "lucide-react"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/fireplace-cozy.jpg"
          alt="Interieur chaleureux avec cheminee"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#CC0000]/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center lg:px-8 lg:py-28">
        <h2 className="font-serif text-3xl font-extrabold text-white md:text-4xl">
          <span className="text-balance">Protegez votre foyer des maintenant</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/85">
          N{"'"}attendez pas qu{"'"}il soit trop tard. Reservez votre ramonage en ligne en quelques clics
          ou appelez-nous directement.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-[#F5A623] px-8 text-lg font-bold text-[#1A1A1A] shadow-lg shadow-[#F5A623]/30 hover:bg-[#E8951A]"
          >
            <Link href="/rendez-vous" className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Prendre rendez-vous
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent px-8 text-lg font-semibold text-white hover:bg-white/10 hover:text-white"
          >
            <a href="tel:+33600000000" className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Nous appeler
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
