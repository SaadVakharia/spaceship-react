import { useState } from 'react'
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

  if (opacity <= 0.001) return null

  const translateY = -offset * 100

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // TODO: Replace action with your WordPress REST API endpoint
  // e.g. POST /wp-json/contact-form-7/v1/contact-forms/{id}/feedback
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form data (wire to WP):', formData)
    setSubmitted(true)
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
              <span className="contact-detail-icon">📍</span>
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
              <span className="contact-detail-icon">📞</span>
              <a href="tel:+919167862341" className="contact-detail-link">
                +91 91678 62341
              </a>
            </div>
            <div className="contact-detail-item">
              <span className="contact-detail-icon">✉️</span>
              <a href="mailto:escapegamingbandra@gmail.com" className="contact-detail-link">
                escapegamingbandra@gmail.com
              </a>
            </div>
            <div className="contact-detail-item">
              <span className="contact-detail-icon">🕐</span>
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

              <button className="contact-submit" type="submit">
                <span className="contact-submit__text">Send Booking Request</span>
                <span className="contact-submit__arrow">→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
