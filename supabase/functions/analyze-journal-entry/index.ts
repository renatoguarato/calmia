import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const { feeling_description, feeling_log_id, user_id } = await req.json()

    if (!feeling_description || !feeling_log_id) {
      throw new Error('Missing required fields')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const systemPrompt = `
      Você é um analista emocional empático e perspicaz.
      Analise a seguinte entrada de diário do usuário.
      
      Retorne APENAS um JSON válido com a seguinte estrutura:
      {
        "summary": "Um resumo conciso e empático do que foi escrito (máximo 2 frases)",
        "emotional_trends": ["tendência 1", "tendência 2", "tendência 3"],
        "category": "Uma palavra que melhor descreve a emoção predominante (ex: Ansiedade, Gratidão, Frustração, Esperança)"
      }
      
      O campo "emotional_trends" deve listar de 1 a 3 padrões ou sentimentos identificados.
      Responda em Português do Brasil.
    `

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b', // or another available model
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: feeling_description },
          ],
          temperature: 0.5,
          response_format: { type: 'json_object' },
        }),
      },
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Groq API error: ${error}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content
    const analysis = JSON.parse(content)

    // Update the log entry
    const { error: updateError } = await supabase
      .from('feelings_log')
      .update({
        ai_response: analysis,
        feeling_category: analysis.category,
      })
      .eq('id', feeling_log_id)
      .eq('user_id', user_id)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing journal entry:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
