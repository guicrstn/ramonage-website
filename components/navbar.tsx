"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/rendez-vous", label: "Prendre RDV" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="L.B Ramonage / Fumisterie"
            width={50}
            height={50}
            className="h-12 w-auto"
          />
          <div className="hidden sm:block">
            <p className="font-serif text-lg font-extrabold leading-tight text-[#CC0000]">
              L.B RAMONAGE
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-foreground transition-colors hover:text-[#CC0000]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+33651436495" className="flex items-center gap-2 text-sm font-bold text-[#CC0000]">
            <Phone className="h-4 w-4" />
            <span>06 51 43 64 95</span>
          </a>
          <Button asChild className="bg-[#CC0000] font-bold text-white hover:bg-[#B30000]">
            <Link href="/rendez-vous">Prendre RDV</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-foreground md:hidden"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-border py-3 text-sm font-semibold text-foreground transition-colors hover:text-[#CC0000]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+33651436495"
              className="flex items-center gap-2 py-3 text-sm font-bold text-[#CC0000]"
            >
              <Phone className="h-4 w-4" />
              06 51 43 64 95
            </a>
            <Button asChild className="mt-2 bg-[#CC0000] font-bold text-white hover:bg-[#B30000]">
              <Link href="/rendez-vous" onClick={() => setIsOpen(false)}>
                Prendre RDV
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
