"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2 } from "lucide-react"

export type AddressResult = {
  label: string
  city: string
  postcode: string
  street: string
  latitude: number
  longitude: number
}

type Props = {
  value: string
  onChange: (address: AddressResult) => void
  placeholder?: string
}

export function AddressAutocomplete({ value, onChange, placeholder }: Props) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<AddressResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const searchAddress = async (q: string) => {
    if (q.length < 3) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/address-search?q=${encodeURIComponent(q)}`)
      const data = await res.json()

      const mapped: AddressResult[] = (data.features || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (f: any) => ({
          label: f.properties.label,
          city: f.properties.city || "",
          postcode: f.properties.postcode || "",
          street: f.properties.name || "",
          latitude: f.geometry.coordinates[1],
          longitude: f.geometry.coordinates[0],
        })
      )

      setResults(mapped)
      setIsOpen(mapped.length > 0)
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchAddress(val), 300)
  }

  const handleSelect = (addr: AddressResult) => {
    setQuery(addr.label)
    setIsOpen(false)
    onChange(addr)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder || "Commencez a taper votre adresse..."}
          className="pl-10"
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-xl">
          {results.map((addr, i) => (
            <button
              key={`${addr.label}-${i}`}
              onClick={() => handleSelect(addr)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-muted"
            >
              <MapPin className="h-4 w-4 shrink-0 text-[#CC0000]" />
              <div>
                <p className="font-medium text-card-foreground">{addr.street}</p>
                <p className="text-xs text-muted-foreground">
                  {addr.postcode} {addr.city}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
