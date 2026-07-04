import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { CONTACT_AT } from '../../config/scroll'
import '../../styles/contact.css'

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Select an Experience' },
  { value: 'playstation', label: 'PS5 Gaming Lounge — ₹249/hr' },
  { value: 'driving', label: 'Driving Simulators — ₹399/hr' },
  { value: 'vr', label: 'Virtual Reality Zone — ₹299/hr' },
  { value: 'pc', label: 'PC Gaming Suite — ₹120/hr' },
  { value: 'event', label: 'Private Event / Group Booking' },
]

export function ContactOverlay({ scrollProgress }) {
  const offset = scrollProgress - CONTACT_AT
  const opacity = Math.max(0, 1 - Math.abs(offset) * 1.2)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (opacity <= 0.001) return null

  const translateY = -offset * 100

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null) // clear error on typing
  }

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your name."
    
    if (!formData.phone.trim()) return "Please enter your phone number."
    const phoneRegex = /^[+]?[\d\s-]{10,}$/
    if (!phoneRegex.test(formData.phone)) return "Please enter a valid phone number (at least 10 digits)."
    
    if (!formData.email.trim()) return "Please enter your email."
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address."

    if (!formData.experience) return "Please select an experience."

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Enter your WordPress URL, Form ID, and API Key
      // When running locally, we leave the domain blank to trigger the Vite proxy
      const isDev = import.meta.env.DEV
      const WP_DOMAIN = isDev ? '' : 'https://escapegamingzone.com'
      const FORM_ID = '1' // Check BitForm dashboard for your Form ID
      const API_KEY = '59971a5c6213ecbb4e58bf91b4a56962f05311d8' // Go to BitForm > Settings > API to get this

      const cleanDomain = WP_DOMAIN.endsWith('/') ? WP_DOMAIN.slice(0, -1) : WP_DOMAIN
      const BITFORM_ENDPOINT = `${cleanDomain}/wp-json/bitform/v1/entry/${FORM_ID}`

      // 2. Map your form fields to the exact Field Keys in BitForm using FormData
      const dataToSend = new FormData()
      dataToSend.append("b1-2", formData.name)
      dataToSend.append("b1-3", formData.phone)
      dataToSend.append("b1-4", formData.email)
      dataToSend.append("b1-5", formData.experience)
      dataToSend.append("b1-6", formData.message)
      // Sometimes BitForm requires the submit button key too
      dataToSend.append("b1-1", "Submit")

      // DEBUG: Log exactly what we are sending
      console.log('--- DEBUG: Sending to BitForm ---')
      for (let [key, value] of dataToSend.entries()) {
        console.log(`${key}: ${value}`)
      }

      // 3. Send the request
      const response = await fetch(BITFORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Bitform-Api-Key': API_KEY
        },
        body: dataToSend
      })

      // DEBUG: Log the raw response text regardless of success/fail
      const responseText = await response.text()
      console.log('--- DEBUG: Response from BitForm ---')
      console.log('Status:', response.status)
      console.log('Body:', responseText)

      if (!response.ok) {
        console.error('BitForm API Error:', response.status, response.statusText, responseText)
        throw new Error(`Server responded with ${response.status}: ${responseText}`)
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Form submission error:', err)
      setError('Failed to send message. Please try again or call us.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-overlay" style={{ opacity }}>
      <div
        className="contact-inner"
        style={{ transform: `translateY(${translateY}vh)` }}
      >
        {/* Left — branding / info column */}
        <div className="contact-info">
          <span className="contact-label">Get in Touch</span>
          <h2 className="contact-heading">
            BOOK YOUR<br />SESSION
          </h2>
          <p className="contact-subtext">
            Book your spot at Escape Gaming Zone in Bandra. Call us, drop us a
            message, or visit us — we're open daily for bookings, events &amp;
            group sessions!
          </p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <span className="contact-detail-icon"><MapPin size={18} strokeWidth={1.5} /></span>
              <a
                href="https://maps.app.goo.gl/wcyzCkLW1Fjf8gE6A"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-detail-link"
              >
                3rd Floor, 304, Bandra Commercial Wing, Sayba Emrald Building,
                Station Rd, near Bandra Bus Depot, Mumbai 400050
              </a>
            </div>
            <div className="contact-detail-item">
              <span className="contact-detail-icon"><Phone size={18} strokeWidth={1.5} /></span>
              <a href="tel:+919167862341" className="contact-detail-link">
                +91 91678 62341
              </a>
            </div>
            <div className="contact-detail-item">
              <span className="contact-detail-icon"><Mail size={18} strokeWidth={1.5} /></span>
              <a href="mailto:escapegamingbandra@gmail.com" className="contact-detail-link">
                escapegamingbandra@gmail.com
              </a>
            </div>
            <div className="contact-detail-item">
              <span className="contact-detail-icon"><Clock size={18} strokeWidth={1.5} /></span>
              <span>Open Daily · 10 AM – 11 PM</span>
            </div>
          </div>
        </div>

        {/* Right — form column */}
        <div className="contact-form-wrapper">
          {submitted ? (
            <div className="contact-success">
              <div className="contact-success__icon">✓</div>
              <h3 className="contact-success__title">You're Booked In!</h3>
              <p className="contact-success__text">
                We've received your message. Expect a confirmation from us
                shortly.
              </p>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            /* data-wp-endpoint="/wp-json/contact-form-7/v1/contact-forms/1/feedback" */
            >
              <div className="contact-form__row">
                <div className="contact-field">
                  <label className="contact-field__label" htmlFor="cf-name">
                    Name
                  </label>
                  <input
                    id="cf-name"
                    className="contact-field__input"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-field__label" htmlFor="cf-phone">
                    Phone
                  </label>
                  <input
                    id="cf-phone"
                    className="contact-field__input"
                    type="tel"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label className="contact-field__label" htmlFor="cf-email">
                  Email
                </label>
                <input
                  id="cf-email"
                  className="contact-field__input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="contact-field">
                <label className="contact-field__label" htmlFor="cf-experience">
                  Experience
                </label>
                <select
                  id="cf-experience"
                  className="contact-field__input contact-field__select"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-field">
                <label className="contact-field__label" htmlFor="cf-message">
                  Message
                </label>
                <textarea
                  id="cf-message"
                  className="contact-field__input contact-field__textarea"
                  name="message"
                  placeholder="Preferred date, time, group size, anything else..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {error && <div className="contact-error">{error}</div>}

              <button className="contact-submit" type="submit" disabled={isSubmitting}>
                <span className="contact-submit__text">
                  {isSubmitting ? 'Sending...' : 'Send Booking Request'}
                </span>
                {!isSubmitting && <span className="contact-submit__arrow">→</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
