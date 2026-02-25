import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ServicesPreview } from "@/components/services-preview"
import { Testimonials } from "@/components/testimonials"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesPreview />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  )
}
