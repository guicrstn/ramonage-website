import type { Metadata } from "next"
import { Flyer } from "@/components/flyer"

export const metadata: Metadata = {
  title: "Flyer - L.B Ramonage / Fumisterie",
  description: "Flyer imprimable A4 de L.B Ramonage / Fumisterie a Dortan (01590).",
  robots: { index: false, follow: false },
}

export default function FlyerPage() {
  return (
    <main>
      <Flyer />
    </main>
  )
}
