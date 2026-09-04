import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export function PartnerLink() {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="mb-8 text-center">
          <p className="mb-2 font-serif text-sm font-bold uppercase tracking-wider text-[#F5A623]">
            Notre autre activite
          </p>
          <h2 className="text-balance font-serif text-2xl font-extrabold text-foreground sm:text-3xl">
            Un besoin en toiture ou charpente ?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            La meme equipe gere egalement LEFEVRE, specialiste en charpente, couverture et zinguerie.
            Decouvrez tous nos services de toiture sur leur site.
          </p>
        </div>

        <Link
          href="https://lefevresas.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="group mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-2xl border border-border bg-white p-8 shadow-sm transition-all hover:border-[#F5A623] hover:shadow-md sm:flex-row sm:justify-between sm:p-10"
        >
          <Image
            src="/images/logo-lefevre.png"
            alt="LEFEVRE - Charpente, Couverture, Zinguerie"
            width={320}
            height={213}
            className="h-24 w-auto sm:h-28"
          />
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-[#CC0000]">
            Visiter le site
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </div>
    </section>
  )
}
