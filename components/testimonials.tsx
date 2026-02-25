import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Marie Dupont",
    location: "Particulier",
    text: "Tres professionnel et ponctuel. Le ramonage a ete fait rapidement et proprement. Je recommande vivement L.B Ramonage !",
    rating: 5,
  },
  {
    name: "Pierre Martin",
    location: "Proprietaire",
    text: "Excellent service ! La verification de toiture offerte m'a permis de detecter un probleme que je n'avais pas vu. Merci !",
    rating: 5,
  },
  {
    name: "Sophie Bernard",
    location: "Particulier",
    text: "Ramonage impeccable de mes deux cheminees. Travail propre, explications claires et certificat delivre sur place. Au top !",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-[#CC0000]">
            Temoignages
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold text-foreground md:text-4xl">
            <span className="text-balance">Ce que disent nos clients</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border bg-card">
              <CardContent className="flex flex-col gap-4 p-6">
                <Quote className="h-8 w-8 text-[#F5A623]/40" />
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#F5A623] text-[#F5A623]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {`"${t.text}"`}
                </p>
                <div className="mt-auto border-t border-border pt-4">
                  <p className="text-sm font-bold text-card-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
