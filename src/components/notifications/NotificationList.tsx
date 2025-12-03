import { useEffect, useState } from 'react'
import { notificationsService } from '@/services/notifications'
import { UserNotification } from '@/types/db'
import { NotificationItem } from './NotificationItem'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BellOff, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationListProps {
  onUpdate: () => void
}

export function NotificationList({ onUpdate }: NotificationListProps) {
  const [notifications, setNotifications] = useState<UserNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      )
      onUpdate()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      onUpdate()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleDismiss = async (id: string) => {
    try {
      await notificationsService.dismissNotification(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      onUpdate()
    } catch (error) {
      console.error('Error dismissing notification:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-3 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
          <BellOff className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground">
          Sem notificações
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Você está em dia! Novas atualizações aparecerão aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b bg-muted/20">
        <span className="text-xs font-medium text-muted-foreground ml-1">
          Recentes
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-primary"
          onClick={handleMarkAllAsRead}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Marcar tudo como lido
        </Button>
      </div>
      <ScrollArea className="flex-1 h-[300px] sm:h-[400px]">
        <div className="flex flex-col">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={handleMarkAsRead}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
