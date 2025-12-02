import { supabase } from '@/lib/supabase/client'
import { FeelingLog, SuggestedAction } from '@/types/db'

export const feelingsService = {
  async logFeeling(description: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('Sessão inválida.')

    // 1. Log feeling
    const { data: feelingData, error: feelingError } = await supabase
      .from('feelings_log')
      .insert({
        user_id: session.user.id,
        feeling_description: description,
        feeling_category: 'general',
      })
      .select()
      .single()

    if (feelingError) throw feelingError

    // 2. Call AI
    const { error: actionError } = await supabase.functions.invoke(
      'generate-recommendation',
      {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: {
          user_id: session.user.id,
          feeling_log_id: feelingData.id,
          feeling_description: description,
        },
      },
    )

    if (actionError) throw new Error('Falha ao gerar recomendação.')

    return { feelingLogId: feelingData.id }
  },

  async getRecentActions() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('suggested_actions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data as SuggestedAction[]
  },

  async completeAction(actionId: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('suggested_actions')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', actionId)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error
    return data as SuggestedAction
  },

  async getHistory() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('feelings_log')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as FeelingLog[]
  },

  async getFeelingDetails(id: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    // Fetch log with AI response
    const { data: log, error: logError } = await supabase
      .from('feelings_log')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (logError) throw logError

    // Fetch related actions
    const { data: actions, error: actionsError } = await supabase
      .from('suggested_actions')
      .select('*')
      .eq('feeling_log_id', id)
      .order('action_type', { ascending: true }) // immediate first

    if (actionsError) throw actionsError

    return { log: log as FeelingLog, actions: actions as SuggestedAction[] }
  },

  async deleteFeeling(id: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('feelings_log')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },
}
