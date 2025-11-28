import { supabase } from '@/lib/supabase/client'
import { SuggestedAction } from '@/types/db'

export const feelingsService = {
  async logFeeling(description: string) {
    // Get the current session to ensure we have a valid token
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      throw new Error('Sessão inválida. Por favor, faça login novamente.')
    }

    const user = session.user

    // 1. Log the feeling locally first
    const { data: feelingData, error: feelingError } = await supabase
      .from('feelings_log')
      .insert({
        user_id: user.id,
        feeling_description: description,
        feeling_category: 'general',
      })
      .select()
      .single()

    if (feelingError) throw feelingError

    // 2. Call Edge Function to generate recommendation via Groq AI
    // We rely on the Supabase client to automatically attach the Authorization header
    const { data: actionData, error: actionError } =
      await supabase.functions.invoke('generate-recommendation', {
        body: {
          feeling_log_id: feelingData.id,
          feeling_description: description,
        },
      })

    if (actionError) {
      console.error('Error invoking edge function:', actionError)
      throw new Error('Falha ao gerar recomendação com IA. Tente novamente.')
    }

    if (!actionData) {
      throw new Error('Nenhuma recomendação foi gerada.')
    }

    return actionData as SuggestedAction
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
}
