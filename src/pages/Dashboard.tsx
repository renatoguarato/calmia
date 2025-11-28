import { useState } from 'react'
import { FeelingInput } from '@/components/dashboard/FeelingInput'
import { ActionList } from '@/components/dashboard/ActionList'
import { SuggestedAction } from '@/types/db'
import { useAuth } from '@/hooks/use-auth'

export default function Dashboard() {
  const { user } = useAuth()
  const [newAction, setNewAction] = useState<SuggestedAction | null>(null)

  return (
    <div className="min-h-screen bg-muted/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Olá, {user?.user_metadata?.name?.split(' ')[0] || 'Visitante'}
          </h1>
          <p className="text-muted-foreground text-lg">
            Vamos cuidar da sua mente hoje?
          </p>
        </div>

        <FeelingInput onActionGenerated={setNewAction} />

        <div className="pt-8">
          <ActionList newAction={newAction} />
        </div>
      </div>
    </div>
  )
}
