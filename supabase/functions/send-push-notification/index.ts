import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID') || '87186c32-6096-4cb9-af25-efe8b11078e9';
const ONESIGNAL_REST_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY') || 'REDACTED';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { user_ids, title, message, data, url } = body;

    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_KEY) {
      return new Response(JSON.stringify({ error: 'OneSignal not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    let playerIds: string[] = [];

    if (Array.isArray(user_ids) && user_ids.length > 0) {
      const { data: tokens } = await supabase
        .from('user_push_tokens')
        .select('player_id')
        .in('user_id', user_ids)
        .eq('is_active', true);
      playerIds = (tokens || []).map((t: { player_id: string }) => t.player_id).filter(Boolean);
    }

    if (playerIds.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No active push tokens found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: Record<string, unknown> = {
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: playerIds,
      headings: { en: title || 'Notification' },
      contents: { en: message || '' },
      data: data || {},
    };

    if (url) {
      payload.url = url;
    }

    const res = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONESIGNAL_REST_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    return new Response(JSON.stringify({ sent: playerIds.length, result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
