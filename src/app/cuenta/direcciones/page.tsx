'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/lib/actions/addresses'
import type { AddressItem } from '@/lib/actions/addresses'
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  Loader2,
  Check,
  X,
  Home,
  Building2,
  Warehouse,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const labelIcons: Record<string, React.ElementType> = {
  casa: Home,
  hogar: Home,
  oficina: Building2,
  trabajo: Building2,
  almacen: Warehouse,
}

const labelOptions = ['Casa', 'Oficina', 'Almacén', 'Otro']

interface AddressForm {
  label: string
  street: string
  city: string
  state: string
  zip: string
}

const emptyForm: AddressForm = { label: '', street: '', city: '', state: '', zip: '' }

export default function DireccionesPage() {
  const { data: session, status: authStatus } = useSession()
  const [addresses, setAddresses] = useState<AddressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AddressForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Fetch addresses when authenticated
  useEffect(() => {
    if (authStatus === 'loading' || !session?.user?.id) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    getAddresses(session.user.id).then((data) => {
      if (cancelled) return
      setAddresses(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [authStatus, session?.user?.id])

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(addr: AddressItem) {
    setEditingId(addr.id)
    setForm({
      label: addr.label || '',
      street: addr.street,
      city: addr.city,
      state: addr.state || '',
      zip: addr.zip || '',
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!session?.user?.id) return
    if (!form.street.trim() || !form.city.trim()) {
      setMessage({ type: 'error', text: 'La dirección y ciudad son obligatorias.' })
      return
    }

    setSaving(true)
    setMessage(null)

    if (editingId) {
      const result = await updateAddress(editingId, session.user.id, {
        label: form.label || undefined,
        street: form.street,
        city: form.city,
        state: form.state || undefined,
        zip: form.zip || undefined,
      })
      if (result.success) {
        setMessage({ type: 'success', text: 'Dirección actualizada.' })
        setDialogOpen(false)
        fetchAddresses()
      } else {
        setMessage({ type: 'error', text: result.error || 'Error al actualizar.' })
      }
    } else {
      const result = await addAddress(session.user.id, {
        label: form.label || undefined,
        street: form.street,
        city: form.city,
        state: form.state || undefined,
        zip: form.zip || undefined,
      })
      if (result.success) {
        setMessage({ type: 'success', text: 'Dirección agregada.' })
        setDialogOpen(false)
        fetchAddresses()
      } else {
        setMessage({ type: 'error', text: result.error || 'Error al agregar.' })
      }
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!session?.user?.id) return
    const result = await deleteAddress(id, session.user.id)
    if (result.success) {
      setDeleteConfirmId(null)
      fetchAddresses()
    }
  }

  async function handleSetDefault(id: string) {
    if (!session?.user?.id) return
    await setDefaultAddress(id, session.user.id)
    fetchAddresses()
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Mis Direcciones</h1>
          <p className="text-xs text-[#666] mt-0.5">Cargando...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-[#111] rounded-xl border border-[#1A1A1A] p-5 animate-pulse space-y-3">
              <div className="h-4 bg-[#1A1A1A] rounded w-1/3" />
              <div className="h-3 bg-[#1A1A1A] rounded w-full" />
              <div className="h-3 bg-[#1A1A1A] rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Mis Direcciones</h1>
          <p className="text-xs text-[#666] mt-0.5">
            {addresses.length} dirección{addresses.length !== 1 && 'es'}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="bg-[#E35205] hover:bg-[#CC3300] text-white text-xs font-semibold h-9 px-4 rounded-xl gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111] border-[#1A1A1A] text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                {editingId ? 'Editar Dirección' : 'Nueva Dirección'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {/* Label selector */}
              <div className="space-y-1.5">
                <Label className="text-xs text-[#888]">Etiqueta</Label>
                <div className="flex gap-2 flex-wrap">
                  {labelOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, label: opt })}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                        form.label === opt
                          ? 'bg-[#E35205]/10 text-[#E35205] border-[#E35205]/30'
                          : 'bg-[#0D0D0D] text-[#888] border-[#222] hover:border-[#444] hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#888]">Dirección *</Label>
                <Input
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  placeholder="Av. Ejemplo 123, Dpto 4B"
                  className="bg-[#0D0D0D] border-[#222] text-white text-sm h-10 focus:border-[#E35205]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#888]">Ciudad *</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Lima"
                    className="bg-[#0D0D0D] border-[#222] text-white text-sm h-10 focus:border-[#E35205]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#888]">Departamento</Label>
                  <Input
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="Lima"
                    className="bg-[#0D0D0D] border-[#222] text-white text-sm h-10 focus:border-[#E35205]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 max-w-[160px]">
                <Label className="text-xs text-[#888]">Código Postal</Label>
                <Input
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  placeholder="15001"
                  className="bg-[#0D0D0D] border-[#222] text-white text-sm h-10 focus:border-[#E35205]"
                />
              </div>

              {message && (
                <div
                  className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {message.type === 'success' ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  {message.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#888] bg-[#0D0D0D] border border-[#222] hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#E35205] hover:bg-[#CC3300] text-white text-xs font-semibold h-9 px-5 rounded-xl transition-colors"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                  {editingId ? 'Guardar' : 'Agregar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Message */}
      {message && dialogOpen === false && (
        <div
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {message.type === 'success' ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
          {message.text}
        </div>
      )}

      {/* Addresses list */}
      {addresses.length === 0 ? (
        <div className="bg-[#111] rounded-xl border border-[#1A1A1A] p-12 text-center">
          <MapPin className="h-12 w-12 text-[#333] mx-auto mb-3" />
          <p className="text-sm text-[#666] mb-1">No tienes direcciones guardadas</p>
          <p className="text-xs text-[#555] mb-4">Agrega una dirección para tus envíos.</p>
          <button
            onClick={openNew}
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, #E35205, #CC3300)' }}
          >
            Agregar Dirección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const Icon = labelIcons[(addr.label || '').toLowerCase()] || MapPin

            return (
              <div
                key={addr.id}
                className={`bg-[#111] rounded-xl border p-5 transition-colors ${
                  addr.isDefault
                    ? 'border-[#E35205]/30 ring-1 ring-[#E35205]/10'
                    : 'border-[#1A1A1A]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
                      <Icon className="h-4 w-4 text-[#E35205]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {addr.label || 'Sin etiqueta'}
                      </p>
                      {addr.isDefault && (
                        <span className="inline-block px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-[#E35205]/10 text-[#E35205] border border-[#E35205]/20">
                          Predeterminada
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address details */}
                <div className="bg-[#0D0D0D] rounded-lg p-3 mb-3">
                  <p className="text-xs text-[#CCC]">{addr.street}</p>
                  <p className="text-[11px] text-[#888] mt-1">
                    {[addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex-1 py-2 rounded-lg text-[11px] font-semibold text-[#888] bg-[#0D0D0D] border border-[#222] hover:border-[#E35205]/30 hover:text-[#E35205] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Star className="h-3 w-3" />
                      Principal
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(addr)}
                    className="flex-1 py-2 rounded-lg text-[11px] font-semibold text-[#888] bg-[#0D0D0D] border border-[#222] hover:border-[#333] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="h-3 w-3" />
                    Editar
                  </button>
                  {deleteConfirmId === addr.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="px-3 py-2 rounded-lg text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-2 rounded-lg text-[11px] font-semibold text-[#888] bg-[#0D0D0D] border border-[#222] transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(addr.id)}
                      className="py-2 px-3 rounded-lg text-[11px] text-[#888] bg-[#0D0D0D] border border-[#222] hover:border-red-500/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}