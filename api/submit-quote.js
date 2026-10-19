/**
 * Vercel Serverless Function: Quote Request & Lead Ingestion
 * Endpoint: /api/submit-quote
 * Integrates with Supabase PostgreSQL database via standard REST API
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const {
      name,
      company,
      email,
      phone,
      service,
      location,
      message,
      fileName,
      fileData
    } = req.body || {};

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: Name, Corporate Email, and Phone number are mandatory.'
      });
    }

    // Generate reference code e.g. TOMI-202610-8472
    const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `TOMI-${dateStr}-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const leadPayload = {
      reference_id: referenceId,
      full_name: name.trim(),
      company: company ? company.trim() : 'N/A',
      email: email.trim(),
      phone: phone.trim(),
      service_type: service || 'Not specified',
      project_location: location || 'Not specified',
      scope_message: message ? message.trim() : 'None provided',
      floor_plan_name: fileName || null,
      status: 'new',
      created_at: timestamp
    };

    let supabaseSaved = false;
    let databaseNote = '';

    // Check if Supabase environment variables exist in Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/quote_requests`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(leadPayload)
        });

        if (response.ok) {
          supabaseSaved = true;
          databaseNote = 'Recorded in Supabase database.';
        } else {
          const errText = await response.text();
          console.error('Supabase insert failed:', errText);
          databaseNote = 'Supabase connection attempted but returned error: ' + errText;
        }
      } catch (dbErr) {
        console.error('Database connection error:', dbErr);
        databaseNote = 'Database connection error: ' + dbErr.message;
      }
    } else {
      databaseNote = 'Supabase environment variables not configured yet. Lead processed in fallback mode.';
    }

    // Optional email notification hook (e.g. Resend or Webhook)
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'info@tomitechservices.com';
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'TOMITECH Leads <onboarding@resend.dev>',
            to: [notificationEmail],
            subject: `[New Lead ${referenceId}] ${name} - ${leadPayload.service_type}`,
            html: `
              <h2>New Engineering Quote Request</h2>
              <p><strong>Reference ID:</strong> ${referenceId}</p>
              <p><strong>Client:</strong> ${name}</p>
              <p><strong>Company:</strong> ${leadPayload.company}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>Service:</strong> ${leadPayload.service_type}</p>
              <p><strong>Location:</strong> ${leadPayload.project_location}</p>
              <p><strong>Message:</strong> ${leadPayload.scope_message}</p>
              ${fileName ? `<p><strong>Attached File:</strong> ${fileName}</p>` : ''}
              <hr/>
              <p style="font-size:12px;color:#888;">TOMITECH Lead Ingestion Engine</p>
            `
          })
        });
      } catch (mailErr) {
        console.error('Resend email failed:', mailErr);
      }
    }

    return res.status(200).json({
      success: true,
      referenceId,
      message: 'Quote request registered successfully.',
      lead: leadPayload,
      database: {
        saved: supabaseSaved,
        note: databaseNote
      },
      timestamp
    });

  } catch (error) {
    console.error('Server error processing quote:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error processing quote request: ' + error.message
    });
  }
}
