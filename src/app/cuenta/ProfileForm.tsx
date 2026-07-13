'use client'

import { useState } from 'react'
import { updateProfile } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Check, X } from 'lucide-react'

export default function ProfileForm({
  userId,
  name: initialName,
  email,
}: {
  userId: string
  name: string
  email: string
}) {
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await updateProfile(userId, { name, phone: phone || undefined })

    if (result.success) {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Error al actualizar.' })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-[#888]">Nombre completo</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="bg-[#0D0D0D] border-[#222] text-white text-sm h-10 focus:border-[#E35205]"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-[#888]">Email</Label>
          <Input
            value={email}
            disabled
            className="bg-[#0D0D0D] border-[#222] text-[#555] text-sm h-10 cursor-not-allowed"
          />
          <p className="text-[10px] text-[#555]">El email no se puede cambiar</p>
        </div>
      </div>

      <div className="space-y-1.5 max-w-sm">
        <Label className="text-xs text-[#888]">Teléfono</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+51 999 999 999"
          className="bg-[#0D0D0D] border-[#222] text-white text-sm h-10 focus:border-[#E35205]"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#E35205] hover:bg-[#CC3300] text-white text-sm font-semibold h-10 px-6 rounded-xl transition-colors"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Guardar Cambios
        </Button>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
          {message.text}
        </div>
      )}
    </form>
  )
}