/**
 * Vercel Serverless Function: Fetch Leads
 * Endpoint: /api/leads
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(200).json({
      success: true,
      configured: false,
      message: 'Supabase credentials not configured in environment. Using local storage mode.',
      leads: []
    });
  }

  try {
    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, '')}/rest/v1/quote_requests?select=*&order=created_at.desc`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ success: false, error: err });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      configured: true,
      leads: data
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
