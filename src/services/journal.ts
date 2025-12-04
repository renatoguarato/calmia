import { supabase } from '@/lib/supabase/client'
import { FeelingLog } from '@/types/db'

export const journalService = {
  async getEntries() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('feelings_log')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('log_type', 'journal')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as FeelingLog[]
  },

  async getEntryById(id: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('feelings_log')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .eq('log_type', 'journal')
      .single()

    if (error) throw error
    return data as FeelingLog
  },

  async createEntry(content: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    // 1. Save Entry
    const { data: entry, error } = await supabase
      .from('feelings_log')
      .insert({
        user_id: session.user.id,
        feeling_description: content,
        log_type: 'journal',
        // feeling_category and ai_response start as null
      })
      .select()
      .single()

    if (error) throw error

    // 2. Trigger AI Analysis asynchronously
    // We don't await this to let the UI be responsive,
    // but typically we might want to show loading state.
    // Here we trigger it and let the client poll or refresh.
    supabase.functions.invoke('analyze-journal-entry', {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: {
        user_id: session.user.id,
        feeling_log_id: entry.id,
        feeling_description: content,
      },
    })

    return entry as FeelingLog
  },

  async updateEntry(id: string, content: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    // 1. Update Entry and reset AI fields
    const { data: entry, error } = await supabase
      .from('feelings_log')
      .update({
        feeling_description: content,
        ai_response: null, // Reset to trigger new analysis visual indicator
        feeling_category: null,
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    // 2. Re-trigger AI Analysis
    supabase.functions.invoke('analyze-journal-entry', {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: {
        user_id: session.user.id,
        feeling_log_id: entry.id,
        feeling_description: content,
      },
    })

    return entry as FeelingLog
  },

  async deleteEntry(id: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('feelings_log')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)
      .eq('log_type', 'journal')

    if (error) throw error
  },
}
