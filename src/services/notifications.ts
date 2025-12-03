import { supabase } from '@/lib/supabase/client'
import { UserNotification } from '@/types/db'

export const notificationsService = {
  async getNotifications() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data as UserNotification[]
  },

  async getUnreadCount() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return 0

    const { count, error } = await supabase
      .from('user_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('is_read', false)
      .eq('is_dismissed', false)

    if (error) throw error
    return count || 0
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', id)

    if (error) throw error
  },

  async markAllAsRead() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('user_id', session.user.id)
      .eq('is_read', false)

    if (error) throw error
  },

  async dismissNotification(id: string) {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_dismissed: true })
      .eq('id', id)

    if (error) throw error
  },
}
