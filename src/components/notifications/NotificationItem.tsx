import { UserNotification } from '@/types/db'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Check, X, Bell, Info, AlertCircle } from 'lucide-react'

interface NotificationItemProps {
  notification: UserNotification
  onRead: (id: string) => void
  onDismiss: (id: string) => void
}

export function NotificationItem({
  notification,
  onRead,
  onDismiss,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.notification_type) {
      case 'reminder':
        return <Bell className="h-4 w-4 text-primary" />
      case 'system':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-4 border-b last:border-0 hover:bg-accent/50 transition-colors',
        !notification.is_read && 'bg-secondary/10',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1 p-1.5 bg-background rounded-full border shadow-sm shrink-0">
            {getIcon()}
          </div>
          <div className="space-y-1">
            <p
              className={cn(
                'text-sm font-medium leading-none',
                !notification.is_read && 'font-semibold text-foreground',
              )}
            >
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:text-primary"
              title="Marcar como lida"
              onClick={() => onRead(notification.id)}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:text-destructive"
            title="Remover"
            onClick={() => onDismiss(notification.id)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
