"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
]

const serviceTypes = [
  { value: "ramonage", label: "Ramonage de cheminee" },
  { value: "entretien-poele", label: "Entretien de poele / insert" },
  { value: "depannage", label: "Depannage / Reparation" },
  { value: "mise-en-conformite", label: "Mise en conformite" },
  { value: "autre", label: "Autre (precisez dans le message)" },
]

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    service_type: "",
    preferred_date: "",
    preferred_time: "",
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
      const { error } = await supabase.from("appointments").insert({
        full_name: form.full_name,
        email: form.email || null,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postal_code: form.postal_code || null,
        service_type: form.service_type,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time,
        message: form.message || null,
      })

      if (error) throw error

      setIsSuccess(true)
      toast.success("Demande envoyee avec succes !")
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chart-3/10">
            <CheckCircle2 className="h-8 w-8 text-chart-3" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-card-foreground">
            Demande envoyee !
          </h3>
          <p className="max-w-md text-muted-foreground">
            Merci pour votre demande de rendez-vous. Nous vous recontacterons dans les plus brefs delais pour confirmer votre creneau.
          </p>
          <Button
            onClick={() => {
              setIsSuccess(false)
              setForm({
                full_name: "", email: "", phone: "", address: "",
                city: "", postal_code: "", service_type: "",
                preferred_date: "", preferred_time: "", message: "",
              })
            }}
            variant="outline"
            className="mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Nouvelle demande
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-xl text-card-foreground">
          <CalendarDays className="h-5 w-5 text-primary" />
          Demande de rendez-vous
        </CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous. Nous vous recontacterons pour confirmer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input
                id="full_name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telephone *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="06 00 00 00 00"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email (optionnel)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jean@exemple.fr"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="12 rue de la Paix"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Paris"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="postal_code">Code postal</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={form.postal_code}
              onChange={handleChange}
              placeholder="75000"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Type de service *</Label>
            <Select
              value={form.service_type}
              onValueChange={(val) => setForm((prev) => ({ ...prev, service_type: val }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un service" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="preferred_date">Date souhaitee *</Label>
              <Input
                id="preferred_date"
                name="preferred_date"
                type="date"
                value={form.preferred_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Heure souhaitee *</Label>
              <Select
                value={form.preferred_time}
                onValueChange={(val) => setForm((prev) => ({ ...prev, preferred_time: val }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un creneau" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message / commentaire</Label>
            <Textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Informations supplementaires..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer la demande"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
