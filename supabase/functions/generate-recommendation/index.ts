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

    // Create a Supabase client with the Auth context of the user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // Get the user from the token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request body
    const { feeling_description, feeling_log_id } = await req.json()

    if (!feeling_description || !feeling_log_id) {
      throw new Error('Missing feeling_description or feeling_log_id')
    }

    // Fetch user profile to personalize the recommendation
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      // Continue without profile if it fails, but ideally we want it
    }

    // Construct the prompt for Groq
    const systemPrompt = `
      You are an expert mental health assistant for professionals named CalmIA.
      Your goal is to provide a single, practical, and short action (max 2 sentences) to help the user manage their current feeling or situation.
      The action should be easy to implement immediately or within the same day.
      
      User Profile:
      - Name: ${profile?.name || 'User'}
      - Profession: ${profile?.profession || 'Professional'}
      - Time in company: ${profile?.time_in_company || 'Unknown'}
      - Gender: ${profile?.gender || 'Unknown'}
      - Health conditions: ${profile?.existing_diseases || 'None'}
      - Medications: ${profile?.medications || 'None'}
      
      Output must be a valid JSON object with the following structure:
      {
        "action_description": "The suggested action text",
        "action_category": "One word category (e.g., Relaxamento, Foco, Movimento, Social, Descanso, Produtividade)"
      }
      
      Do not include any markdown formatting or explanations outside the JSON.
    `

    const userPrompt = `I am feeling: "${feeling_description}". What should I do?`

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
          model: 'llama3-70b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 300,
          response_format: { type: 'json_object' },
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

    if (!content) {
      throw new Error('No content received from Groq')
    }

    let recommendation
    try {
      recommendation = JSON.parse(content)
    } catch (e) {
      console.error('Error parsing JSON from Groq:', content)
      throw new Error('Invalid response format from AI')
    }

    // Save the suggested action to the database
    const { data: actionData, error: actionError } = await supabase
      .from('suggested_actions')
      .insert({
        user_id: user.id,
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
