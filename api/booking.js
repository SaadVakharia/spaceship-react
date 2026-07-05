export default async function handler(req, res) {
  // We only accept POST requests for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const FORM_ID = '1'
    const API_KEY = process.env.VITE_BITFORM_API_KEY || process.env.BITFORM_API_KEY
    const BITFORM_ENDPOINT = `https://old.escapegamingzone.com/wp-json/bitform/v1/entry/${FORM_ID}`

    // Ensure we have an API key
    if (!API_KEY) {
      console.error("Missing BITFORM_API_KEY environment variable")
      return res.status(500).json({ error: 'Server configuration error (missing API key)' })
    }

    // Grab the JSON body sent from the React frontend
    const body = req.body

    // We must format it exactly as BitForm expects (FormData with correct keys)
    const formData = new FormData()
    formData.append("b1-2", body.name || "")
    formData.append("b1-3", body.phone || "")
    formData.append("b1-4", body.email || "")
    formData.append("b1-5", body.experience || "")
    formData.append("b1-6", body.message || "")
    formData.append("b1-1", "Submit")

    // Forward the request to WordPress
    const response = await fetch(BITFORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Bitform-Api-Key': API_KEY
      },
      body: formData
    })

    const responseText = await response.text()
    
    if (!response.ok) {
      console.error('BitForm API Error:', response.status, responseText)
      return res.status(response.status).json({ 
        error: 'Error from WordPress server', 
        details: responseText 
      })
    }

    // Success! Return the response back to React
    let data
    try {
      data = JSON.parse(responseText)
    } catch(e) {
      data = { message: responseText }
    }

    return res.status(200).json(data)

  } catch (error) {
    console.error('Proxy Server Error:', error)
    return res.status(500).json({ error: 'Internal Server Error', details: error.message })
  }
}
