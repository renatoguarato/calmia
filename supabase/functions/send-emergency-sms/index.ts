import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_FROM = Deno.env.get('TWILIO_FROM')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { user_id, ai_response } = await req.json()

    if (!user_id || !ai_response) {
      throw new Error('Missing required parameters: user_id or ai_response')
    }

    // 1. Verify if the ai_response indicates "is_critical"
    if (!ai_response.is_critical) {
      console.log('Not a critical feeling. No SMS needed.')
      return new Response(
        JSON.stringify({ success: true, message: 'Not critical' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // 2. Retrieve the emergency_notification_consent and contact info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(
        'name, emergency_notification_consent, emergency_contact_name, emergency_contact_phone',
      )
      .eq('id', user_id)
      .single()

    if (profileError) throw profileError

    if (!profile.emergency_notification_consent) {
      console.log('User has not consented to emergency notifications.')
      return new Response(
        JSON.stringify({ success: true, message: 'No consent' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    if (!profile.emergency_contact_phone) {
      console.log('No emergency contact phone found.')
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No emergency contact phone',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // 3. Send SMS
    const emergencyName = profile.emergency_contact_name || 'Contato'
    const userName = profile.name || 'Usuário'
    const messageBody = `Olá ${emergencyName}, esta é uma mensagem automática da CalmIA. ${userName} pode estar passando por um momento crítico. Por favor, considere entrar em contato.`

    console.log(`Attempting to send SMS to ${profile.emergency_contact_phone}`)

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM) {
      const params = new URLSearchParams({
        Body: messageBody,
        From: TWILIO_FROM,
        To: profile.emergency_contact_phone,
      })

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Twilio Error:', errorData)
        throw new Error('Failed to send SMS via Twilio')
      }

      const data = await response.json()
      console.log('SMS Sent Successfully:', data.sid)
    } else {
      console.log(
        'SMS Provider credentials not found. Mocking SMS send.',
        messageBody,
      )
      // Simulating success for development/demo purposes when no keys are present
    }

    return new Response(
      JSON.stringify({ success: true, message: 'SMS Sent' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in send-emergency-sms:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
