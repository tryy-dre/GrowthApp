'use client'

import { useState } from 'react'
import { changeUserRole } from '../adminActions'
import { Loader2 } from 'lucide-react'

interface RoleSelectProps {
  userId: string
  initialRole: string
  disabled?: boolean
}

export default function RoleSelect({ userId, initialRole, disabled }: RoleSelectProps) {
  const [role, setRole] = useState(initialRole)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    setLoading(true)
    setError(null)

    try {
      const result = await changeUserRole(userId, newRole)
      if (result?.error) {
        setError(result.error)
        // Revert select value
        e.target.value = role
      } else {
        setRole(newRole)
      }
    } catch {
      setError('Failed to update role')
      e.target.value = role
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        onChange={handleChange}
        disabled={disabled || loading}
        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 text-slate-700 font-medium cursor-pointer"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />}
      {error && <span className="text-[10px] text-red-500 font-medium">{error}</span>}
    </div>
  )
}
