import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Use Service Role Key to access all data
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 1. Fetch pending actions
    const { data: pendingActions, error: actionsError } = await supabase
      .from('suggested_actions')
      .select('id, user_id, title, action_description')
      .eq('is_completed', false)
      .is('completed_at', null)

    if (actionsError) throw actionsError

    if (!pendingActions || pendingActions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending actions found.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // 2. Prepare notifications
    const notificationsToInsert = pendingActions.map((action: any) => ({
      user_id: action.user_id,
      notification_type: 'reminder',
      title: 'Lembrete de Ação Pendente',
      message: `Não se esqueça da ação: ${action.title || action.action_description}`,
      is_read: false,
      is_dismissed: false,
    }))

    // 3. Insert notifications
    const { error: insertError } = await supabase
      .from('user_notifications')
      .insert(notificationsToInsert)

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${notificationsToInsert.length} notifications.`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
