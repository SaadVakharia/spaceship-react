export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const FORM_ID = '1'
    const API_KEY = process.env.BITFORM_API_KEY || process.env.VITE_BITFORM_API_KEY
    if (!API_KEY) {
      console.error('Missing BITFORM_API_KEY in environment variables')
      return res.status(500).json({ error: 'Server error: BITFORM_API_KEY is not configured in Vercel environment variables' })
    }
    const BITFORM_ENDPOINT = `https://old.escapegamingzone.com/wp-json/bitform/v1/entry/${FORM_ID}`

    const body = req.body || {}

    const timestamp = body.timestamp || new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    })

    const rawMessage = (body.message || '').trim()
    const messageWithTime = rawMessage
      ? `${rawMessage}\n\n[Submission Time: ${timestamp}]`
      : `[Submission Time: ${timestamp}]`

    const params = new URLSearchParams()
    params.append('b1-2', body.name || '')
    params.append('b1-3', body.phone || '')
    params.append('b1-4', body.email || '')
    params.append('b1-5', body.experience || '')
    params.append('b1-6', messageWithTime)
    params.append('b1-1', 'Submit')

    const response = await fetch(BITFORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Bitform-Api-Key': API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })

    const responseText = await response.text()
    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      data = { raw: responseText }
    }

    if (!response.ok) {
      console.error('BitForm API Error:', response.status, responseText)
      return res.status(response.status).json({
        error: 'BitForm API Error',
        details: data
      })
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Proxy Error:', error)
    return res.status(500).json({ error: 'Internal Server Error', details: error.message })
  }
}
