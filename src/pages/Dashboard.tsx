import { useState, useEffect } from 'react'
import { FeelingInput } from '@/components/dashboard/FeelingInput'
import { ActionList } from '@/components/dashboard/ActionList'
import { useAuth } from '@/hooks/use-auth'
import { profileService } from '@/services/profile'

export default function Dashboard() {
  const { user } = useAuth()
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const fetchProfileName = async () => {
      if (!user) return
      try {
        const profile = await profileService.getProfile()
        if (profile?.name) {
          setUserName(profile.name)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchProfileName()
  }, [user])

  const displayName = userName
    ? userName.split(' ')[0]
    : user?.user_metadata?.name?.split(' ')[0] || 'Visitante'

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Olá, {displayName}
          </h1>
          <p className="text-muted-foreground text-lg">
            Vamos cuidar da sua mente hoje?
          </p>
        </div>

        <FeelingInput />

        <div className="pt-8">
          <ActionList />
        </div>
      </div>
    </div>
  )
}
