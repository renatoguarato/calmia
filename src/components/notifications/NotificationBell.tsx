import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { notificationsService } from '@/services/notifications'
import { NotificationList } from './NotificationList'
import { cn } from '@/lib/utils'

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationsService.getUnreadCount()
      setUnreadCount(count)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    // Poll every minute for new notifications
    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground hover:text-primary hover:bg-secondary/20 rounded-full"
          aria-label={`Notificações (${unreadCount} não lidas)`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className={cn(
                'absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full border-2 border-background',
                unreadCount > 9 ? 'w-auto px-1.5' : 'w-5',
              )}
              variant="default"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-semibold leading-none">Notificações</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Seus alertas e lembretes.
          </p>
        </div>
        <NotificationList onUpdate={fetchUnreadCount} />
      </PopoverContent>
    </Popover>
  )
}
