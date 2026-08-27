"use client"

import Image from "next/image"
import { Phone, Globe, CheckCircle2, CalendarCheck, Printer, Flame, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const prestations = [
  "Ramonage de cheminee et conduit",
  "Entretien de poele a bois et granules",
  "Nettoyage d'insert et foyer ferme",
  "Certificat de ramonage remis",
]

export function Flyer() {
  return (
    <div className="min-h-screen bg-[#F5F3EF] py-8">
      {/* Barre d'actions - masquee a l'impression */}
      <div className="no-print mx-auto mb-8 flex max-w-[210mm] flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-[#1A1A1A]">Flyer L.B Ramonage</h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Format A4 pret a imprimer. Utilisez {'"'}Enregistrer au format PDF{'"'} pour l{"'"}envoyer a l{"'"}imprimeur.
          </p>
        </div>
        <Button
          onClick={() => window.print()}
          size="lg"
          className="min-h-11 shrink-0 bg-[#CC0000] font-bold text-white hover:bg-[#B30000]"
        >
          <Printer className="mr-2 h-5 w-5" />
          Imprimer / PDF
        </Button>
      </div>

      {/* Zone scrollable sur mobile */}
      <div className="overflow-x-auto px-4 pb-4">
        {/* FEUILLE A4 */}
        <div
          className="print-sheet mx-auto flex flex-col bg-white shadow-2xl"
          style={{ width: "210mm", minHeight: "297mm" }}
        >
          {/* ---------- EN-TETE ---------- */}
          <header className="flex items-center justify-between gap-6 bg-[#1A1A1A] px-10 py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-28 items-center justify-center rounded-xl bg-white p-2.5">
                <Image
                  src="/images/logo.png"
                  alt="Logo L.B Ramonage / Fumisterie"
                  width={140}
                  height={120}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="font-serif text-2xl font-extrabold leading-none text-[#F5A623]">
                  L.B RAMONAGE
                </p>
                <p className="mt-1 font-serif text-lg font-bold leading-none text-white">
                  FUMISTERIE
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                Artisan local
              </p>
              <p className="mt-1 text-sm font-extrabold text-white">DORTAN (01590)</p>
              <p className="text-xs text-white/60">et communes alentours</p>
            </div>
          </header>

          {/* Filet rouge/or */}
          <div className="flex h-2">
            <div className="w-2/3 bg-[#CC0000]" />
            <div className="w-1/3 bg-[#F5A623]" />
          </div>

          {/* ---------- CORPS : 2 COLONNES ---------- */}
          <section className="flex flex-1 gap-8 px-10 pb-9 pt-9">
            {/* Colonne texte */}
            <div className="flex flex-1 flex-col">
              <span className="self-start rounded-full bg-[#FFF3E0] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#CC0000]">
                Notre entreprise evolue
              </span>
              <h2 className="mt-4 font-serif text-[42px] font-extrabold uppercase leading-[0.92] tracking-tight text-[#1A1A1A]">
                Du nouveau
                <br />
                <span className="text-[#CC0000]">sur Dortan</span>
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[#3A3A3A]">
                Vous pouvez des a present prendre votre rendez-vous pour le{" "}
                <strong className="font-extrabold text-[#1A1A1A]">
                  ramonage et l{"'"}entretien de votre poele ou cheminee
                </strong>
                , directement en ligne ou par telephone.
              </p>

              <h3 className="mt-7 flex items-center gap-2 font-serif text-[15px] font-extrabold uppercase tracking-wide text-[#1A1A1A]">
                <Flame className="h-5 w-5 text-[#CC0000]" />
                Nos prestations
              </h3>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {prestations.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#CC0000]" />
                    <span className="text-[13.5px] font-medium leading-snug text-[#3A3A3A]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-start gap-3 rounded-xl border-2 border-[#E8E4DC] bg-[#FAFAF8] p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#F5A623]" />
                <p className="text-[12.5px] font-semibold leading-snug text-[#3A3A3A]">
                  Intervention soignee, materiel professionnel et respect de votre interieur.
                </p>
              </div>
            </div>

            {/* Colonne visuel */}
            <div className="flex w-[78mm] shrink-0 flex-col">
              <div className="relative mb-4 min-h-[92mm] w-full flex-1 overflow-hidden rounded-xl">
                <Image
                  src="/images/hero-chimney.jpg"
                  alt="Ramoneur professionnel en intervention sur une toiture"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-auto flex items-start gap-2.5 rounded-xl bg-[#1A1A1A] p-4">
                <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#F5A623]" />
                <div>
                  <p className="text-[13px] font-extrabold leading-tight text-white">
                    Planning ouvert des le 1er mars 2027
                  </p>
                  <p className="mt-1 text-[11.5px] leading-snug text-white/70">
                    Reservez votre creneau des maintenant en ligne, 24h/24.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ---------- OFFRE (element signature) ---------- */}
          <section className="bg-[#F5A623] px-10 py-7">
            <div className="flex items-center justify-center gap-5">
              <p className="text-center font-serif text-[27px] font-extrabold uppercase leading-none tracking-tight text-[#1A1A1A]">
                1 ramonage
              </p>
              <span className="font-serif text-[34px] font-extrabold leading-none text-white">=</span>
              <p className="text-center font-serif text-[27px] font-extrabold uppercase leading-none tracking-tight text-[#CC0000]">
                verification
                <br />
                toiture offerte
              </p>
            </div>
            <p className="mt-3 text-center text-[12px] font-bold uppercase tracking-[0.18em] text-[#1A1A1A]/70">
              Pour chaque ramonage effectue
            </p>
          </section>

          {/* ---------- CONTACT ---------- */}
          <section className="bg-[#CC0000] px-10 py-8">
            <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.25em] text-white/70">
              Prenez rendez-vous
            </p>
            <div className="mt-5 flex items-stretch justify-center gap-6">
              <div className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-white px-5 py-4">
                <Globe className="h-7 w-7 shrink-0 text-[#CC0000]" />
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                    Sur notre site
                  </p>
                  <p className="font-serif text-[21px] font-extrabold leading-tight text-[#1A1A1A]">
                    lbramonage.fr
                  </p>
                </div>
              </div>
              <div className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-white px-5 py-4">
                <Phone className="h-7 w-7 shrink-0 text-[#CC0000]" />
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                    Par telephone
                  </p>
                  <p className="font-serif text-[21px] font-extrabold leading-tight text-[#1A1A1A]">
                    06 51 43 64 95
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-[#1A1A1A] px-10 py-3">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
              L.B Ramonage / Fumisterie &middot; Dortan 01590 &middot; Ramonage &middot; Fumisterie &middot; Entretien
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          html,
          body {
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
          .print-sheet {
            box-shadow: none !important;
            margin: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  )
}
