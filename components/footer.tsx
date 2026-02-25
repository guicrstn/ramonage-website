import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="L.B Ramonage"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <div>
                <p className="font-serif text-lg font-bold text-background">L.B Ramonage</p>
                <p className="text-xs text-background/60">Fumisterie</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-background/70">
              Un ramonage = verification de toiture offerte. Votre specialiste en ramonage et fumisterie.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-secondary">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2">
              {[
                { href: "/", label: "Accueil" },
                { href: "/services", label: "Nos Services" },
                { href: "/rendez-vous", label: "Prendre RDV" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-secondary">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4 shrink-0 text-secondary" />
                06 00 00 00 00
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4 shrink-0 text-secondary" />
                contact@lb-ramonage.fr
              </li>
              <li className="flex items-start gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 shrink-0 text-secondary" />
                Zone d{"'"}intervention: votre region
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="mb-4 font-serif text-sm font-bold uppercase tracking-wider text-secondary">
              Horaires
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Clock className="h-4 w-4 shrink-0 text-secondary" />
                Lun - Ven : 8h - 18h
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Clock className="h-4 w-4 shrink-0 text-secondary" />
                Samedi : 8h - 12h
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-background/10 pt-6 text-center text-xs text-background/50">
          &copy; {new Date().getFullYear()} L.B Ramonage / Fumisterie. Tous droits reserves.
        </div>
      </div>
    </footer>
  )
}
