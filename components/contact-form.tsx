"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Send, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("contact_messages").insert({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message,
      })

      if (error) throw error

      setIsSuccess(true)
      toast.success("Message envoye avec succes !")
    } catch {
      toast.error("Une erreur est survenue. Veuillez reessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2E7D32]/10">
            <CheckCircle2 className="h-8 w-8 text-[#2E7D32]" />
          </div>
          <h3 className="font-serif text-2xl font-extrabold text-card-foreground">
            Message envoye !
          </h3>
          <p className="max-w-md text-muted-foreground">
            Merci pour votre message. Nous vous repondrons dans les plus brefs delais.
          </p>
          <Button
            onClick={() => {
              setIsSuccess(false)
              setForm({ full_name: "", email: "", phone: "", subject: "", message: "" })
            }}
            variant="outline"
            className="mt-2 border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white"
          >
            Envoyer un autre message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-xl text-card-foreground">
          <Send className="h-5 w-5 text-[#CC0000]" />
          Nous contacter
        </CardTitle>
        <CardDescription>
          Posez-nous vos questions, nous vous repondrons rapidement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact_name">Nom complet *</Label>
              <Input
                id="contact_name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact_email">Email *</Label>
              <Input
                id="contact_email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jean@exemple.fr"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact_phone">Telephone</Label>
              <Input
                id="contact_phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="06 00 00 00 00"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact_subject">Sujet *</Label>
              <Input
                id="contact_subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Demande d'information"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact_message">Message *</Label>
            <Textarea
              id="contact_message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Ecrivez votre message ici..."
              rows={5}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#CC0000] font-bold text-white hover:bg-[#B30000]"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le message"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
