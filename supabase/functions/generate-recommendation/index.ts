import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

Deno.serve(async (req) => {

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
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

    // Fetch user profile to personalize the recommendation
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
    }

    // Construct the prompt for Groq
    const systemPrompt = `
      Você é um assistente especialista em saúde mental para profissionais chamado CalmIA.
      Seu objetivo é fornecer uma ação única, prática e curta (máximo 2 frases) para ajudar o usuário a lidar com seu sentimento ou situação atual.
      A ação deve ser fácil de implementar imediatamente ou no mesmo dia.
      
      Perfil do Usuário:
      - Nome: ${profile?.name || 'Usuário'}
      - Profissão: ${profile?.profession || 'Profissional'}
      - Tempo de empresa: ${profile?.time_in_company || 'Desconhecido'}
      - Gênero: ${profile?.gender || 'Desconhecido'}
      - Condições de saúde: ${profile?.existing_diseases || 'Nenhuma'}
      - Medicamentos: ${profile?.medications || 'Nenhum'}
      
      A saída deve ser um objeto JSON válido com a seguinte estrutura:
      {
        "action_description": "O texto da ação sugerida",
        "action_category": "Categoria em uma palavra (ex: Relaxamento, Foco, Movimento, Social, Descanso, Produtividade)"
      }
      
      Não inclua formatação markdown ou explicações fora do JSON.
    `

    const userPrompt = `Estou me sentindo: "${feeling_description}". O que devo fazer?`

    // Call Groq API
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
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 300,
          // response_format: { type: 'json_object' }, // Not supported by this model
        }),
      },
    )

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error('Groq API Error:', errorText)
      throw new Error(`Groq API Error: ${groqResponse.statusText}`)
    }

    const groqData = await groqResponse.json()
    const content = groqData.choices[0]?.message?.content

    console.log('Groq response:', groqData)

    if (!content) {
      throw new Error('No content received from Groq')
    }

    // Parse JSON response from AI
    const tryParseTasks = (text: string): any => {
      try {
        return JSON.parse(text)
      } catch (_) {
        // Try to extract JSON block
        const match = text.match(/\{[\s\S]*\}/)
        if (match) {
          return JSON.parse(match[0])
        }
        throw new Error("Resposta da Groq não está em JSON válido")
      }
    }

    const parsed = tryParseTasks(content)
    console.log('Parsed content:', parsed)

    let recommendation
    try {
      // Clean up the content to ensure we have valid JSON
      // This removes markdown code blocks if present (e.g. ```json ... ```)
      const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim()
      recommendation = JSON.parse(jsonStr)
    } catch (e) {
      console.error('Error parsing JSON from Groq:', content)
      throw new Error('Invalid response format from AI')
    }

    // Save the suggested action to the database
    const { data: actionData, error: actionError } = await supabase
      .from('suggested_actions')
      .insert({
        user_id: user_id,
        feeling_log_id: feeling_log_id,
        action_description: recommendation.action_description,
        action_category: recommendation.action_category,
      })
      .select()
      .single()

    if (actionError) {
      console.error('Error saving action:', actionError)
      throw new Error('Failed to save recommendation')
    }

    return new Response(JSON.stringify(actionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
