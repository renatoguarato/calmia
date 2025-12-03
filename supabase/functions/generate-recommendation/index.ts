import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { user_id, feeling_description, feeling_log_id } = await req.json()

    if (!feeling_description || !feeling_log_id) {
      return new Response(
        JSON.stringify({
          error: 'Missing feeling_description or feeling_log_id',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single()

    const systemPrompt = `
      Você é um assistente especialista em saúde mental para profissionais expostos a alta pressão.

      Perfil do Usuário:
      - Nome: ${profile?.name || 'Usuário'}
      - Profissão: ${profile?.profession || 'Profissional'}
      - Tempo de empresa: ${profile?.time_in_company || 'Desconhecido'}
      - Gênero: ${profile?.gender || 'Desconhecido'}
      - Condições de saúde: ${profile?.existing_diseases || 'Nenhuma'}
      - Medicamentos: ${profile?.medications || 'Nenhum'}

      Sentimento relatado: "${feeling_description}"

      INSTRUÇÕES DE SAÍDA:
      Retorne APENAS um objeto JSON válido (sem markdown, sem explicações) com esta estrutura:

      {
        "empathy": "1 sentença validando o sentimento relatado",
        "immediate_actions": [
          {
            "title": "Nome curto da ação",
            "category": "Relaxamento|Foco|Movimento|Social|Descanso|Produtividade",
            "estimated_time": "X minutos",
            "steps": ["passo 1", "passo 2", "passo 3"],
            "why_it_helps": "Explicação clara de por que ajuda"
          }
        ],
        "routine_adjustments": [
          {
            "title": "Nome do ajuste",
            "category": "categoria",
            "timeframe": "1-2 semanas",
            "instructions": "Instruções práticas detalhadas"
          }
        ],
        "leader_conversation": {
          "is_appropriate": true ou false,
          "suggested_message": "Modelo de mensagem ou null se não apropriado",
          "context": "Orientação sobre quando/como abordar ou null"
        },
        "risk_assessment": {
          "level": "low|medium|high",
          "requires_emergency": booleano,
          "emergency_instructions": "Instruções de emergência ou null",
          "emergency_consent_request": "Texto pedindo consentimento ou null",
          "referral_needed": booleano,
          "referral_message": "Mensagem de encaminhamento ou null"
        },
        "metadata": {
          "word_count": número aproximado de palavras da resposta,
          "primary_categories": ["array", "de", "categorias"]
        }
      }

      REGRAS:
      - 3 ações imediatas obrigatórias
      - 2 ajustes de rotina obrigatórios
      - Análise de risco SEMPRE presente
      - Se detectar palavras-chave de risco (ideação suicida, desesperança, "quero morrer", etc.), definir level como "high" e requires_emergency como true
      - Tom empático, direto, sem jargões clínicos
      - NÃO diagnosticar condições médicas
      - Total entre 120-300 palavras considerando todos os textos
      - Retornar APENAS o JSON, sem formatação markdown
      - Respostas em português brasileiro
      `

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: feeling_description },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      },
    )

    if (!groqResponse.ok) throw new Error('Groq API Error')
    const groqData = await groqResponse.json()
    const content = groqData.choices[0]?.message?.content
    const recommendation = JSON.parse(content)

    // Update feeling log with AI response
    await supabase
      .from('feelings_log')
      .update({ ai_response: recommendation })
      .eq('id', feeling_log_id)

    // Prepare actions to insert
    const actionsToInsert = []

    // Immediate actions
    if (recommendation.immediate_actions?.length) {
      recommendation.immediate_actions.forEach((action: any) => {
        actionsToInsert.push({
          user_id,
          feeling_log_id,
          title: action.title,
          action_description: action.title, // fallback
          action_category: action.category,
          estimated_time: action.estimated_time,
          steps: action.steps,
          why_it_helps: action.why_it_helps,
          action_type: 'immediate',
        })
      })
    }

    // Routine adjustments
    if (recommendation.routine_adjustments?.length) {
      recommendation.routine_adjustments.forEach((action: any) => {
        actionsToInsert.push({
          user_id,
          feeling_log_id,
          title: action.title,
          action_description: action.instructions, // Use instructions as description
          action_category: action.category,
          estimated_time: action.timeframe,
          why_it_helps: 'Ajuste de rotina para prevenção a longo prazo.',
          action_type: 'routine',
        })
      })
    }

    if (actionsToInsert.length > 0) {
      await supabase.from('suggested_actions').insert(actionsToInsert)
    }

    return new Response(JSON.stringify({ success: true, recommendation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
