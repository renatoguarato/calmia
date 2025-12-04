import { supabase } from '@/lib/supabase/client'
import { FeelingLog, WellbeingGoal } from '@/types/db'

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
      .select(
        `
        *,
        journal_entry_goals (
          wellbeing_goal_id,
          wellbeing_goals (*)
        )
      `,
      )
      .eq('id', id)
      .eq('user_id', session.user.id)
      .eq('log_type', 'journal')
      .single()

    if (error) throw error

    // Transform data to include goals directly
    const entry = data as any
    if (entry.journal_entry_goals) {
      entry.goals = entry.journal_entry_goals
        .map((item: any) => item.wellbeing_goals)
        .filter(Boolean) as WellbeingGoal[]
      delete entry.journal_entry_goals
    }

    return entry as FeelingLog
  },

  async createEntry(content: string, goalIds?: string[]) {
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
      })
      .select()
      .single()

    if (error) throw error

    // 2. Save Goals Links if any
    if (goalIds && goalIds.length > 0) {
      const { error: goalsError } = await supabase
        .from('journal_entry_goals')
        .insert(
          goalIds.map((goalId) => ({
            feeling_log_id: entry.id,
            wellbeing_goal_id: goalId,
          })),
        )

      if (goalsError) console.error('Error linking goals:', goalsError)
    }

    // 3. Trigger AI Analysis asynchronously
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

  async updateEntry(id: string, content: string, goalIds?: string[]) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    // 1. Update Entry
    const { data: entry, error } = await supabase
      .from('feelings_log')
      .update({
        feeling_description: content,
        ai_response: null, // Reset to trigger new analysis
        feeling_category: null,
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    // 2. Update Goals Links
    if (goalIds) {
      // First remove all existing links
      await supabase
        .from('journal_entry_goals')
        .delete()
        .eq('feeling_log_id', id)

      // Then add new ones
      if (goalIds.length > 0) {
        const { error: goalsError } = await supabase
          .from('journal_entry_goals')
          .insert(
            goalIds.map((goalId) => ({
              feeling_log_id: id,
              wellbeing_goal_id: goalId,
            })),
          )
        if (goalsError) console.error('Error relinking goals:', goalsError)
      }
    }

    // 3. Re-trigger AI Analysis
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
