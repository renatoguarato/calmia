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
      Você é um assistente especialista em saúde mental para profissionais.
      
      Perfil: ${profile?.name || 'Usuário'}, ${profile?.profession || 'Profissional'}.
      Sentimento: "${feeling_description}"

      Retorne APENAS um JSON válido:
      {
        "empathy": "Validar sentimento",
        "immediate_actions": [
          {
            "title": "Ação",
            "category": "Foco|Relaxamento|...",
            "estimated_time": "X min",
            "steps": ["passo 1"],
            "why_it_helps": "Explicação"
          }
        ],
        "routine_adjustments": [
          {
            "title": "Ajuste",
            "category": "Rotina",
            "timeframe": "1 semana",
            "instructions": "Detalhes"
          }
        ],
        "leader_conversation": {
          "is_appropriate": boolean,
          "suggested_message": "texto ou null",
          "context": "texto ou null"
        },
        "risk_assessment": {
          "level": "low|medium|high",
          "requires_emergency": boolean,
          "emergency_instructions": "texto ou null",
          "emergency_consent_request": "texto ou null",
          "referral_needed": boolean,
          "referral_message": "texto ou null"
        },
        "metadata": {
          "word_count": number,
          "primary_categories": ["cat1"]
        }
      }
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
          model: 'llama3-70b-8192',
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
