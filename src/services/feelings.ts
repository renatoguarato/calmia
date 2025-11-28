import { supabase } from '@/lib/supabase/client'
import { SuggestedAction } from '@/types/db'

// Simple keyword-based "AI" for demonstration purposes
const generateSuggestion = (
  feeling: string,
): { description: string; category: string } => {
  const lowerFeeling = feeling.toLowerCase()

  if (
    lowerFeeling.includes('cansado') ||
    lowerFeeling.includes('exausto') ||
    lowerFeeling.includes('sono')
  ) {
    return {
      description:
        "Faça uma pausa de 10 minutos longe das telas. Beba um copo d'água e respire fundo.",
      category: 'Descanso',
    }
  }
  if (
    lowerFeeling.includes('estressado') ||
    lowerFeeling.includes('nervoso') ||
    lowerFeeling.includes('tensão')
  ) {
    return {
      description:
        'Pratique a técnica de respiração 4-7-8: inspire por 4s, segure por 7s, expire por 8s.',
      category: 'Relaxamento',
    }
  }
  if (lowerFeeling.includes('ansioso') || lowerFeeling.includes('preocupado')) {
    return {
      description:
        'Anote as 3 principais coisas que estão te preocupando e defina uma pequena ação para cada uma.',
      category: 'Organização',
    }
  }
  if (lowerFeeling.includes('desmotivado') || lowerFeeling.includes('triste')) {
    return {
      description:
        'Saia para uma breve caminhada de 5 minutos ou ouça uma música que você gosta.',
      category: 'Bem-estar',
    }
  }

  return {
    description:
      'Tire um momento para organizar seu ambiente de trabalho e priorizar suas tarefas do dia.',
    category: 'Produtividade',
  }
}

export const feelingsService = {
  async logFeeling(description: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // 1. Log the feeling
    const { data: feelingData, error: feelingError } = await supabase
      .from('feelings_log')
      .insert({
        user_id: user.id,
        feeling_description: description,
        feeling_category: 'general', // Could be analyzed by AI too
      })
      .select()
      .single()

    if (feelingError) throw feelingError

    // 2. Generate "AI" suggestion
    const suggestion = generateSuggestion(description)

    // 3. Save suggestion
    const { data: actionData, error: actionError } = await supabase
      .from('suggested_actions')
      .insert({
        user_id: user.id,
        feeling_log_id: feelingData.id,
        action_description: suggestion.description,
        action_category: suggestion.category,
      })
      .select()
      .single()

    if (actionError) throw actionError

    return actionData as SuggestedAction
  },

  async getRecentActions() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('suggested_actions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data as SuggestedAction[]
  },

  async completeAction(actionId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('suggested_actions')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', actionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data as SuggestedAction
  },
}
