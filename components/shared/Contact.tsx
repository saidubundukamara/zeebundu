'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  hours?: Array<{
    days: string;
    hours: string;
  }>;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

export interface ContactProps {
  title?: string;
  description?: string;
  contactInfo: ContactInfo;
  socialLinks?: SocialLink[];
  showContactForm?: boolean;
  theme?: string;
  mapEmbedUrl?: string;
}

export function Contact({
  title = 'Get In Touch',
  description = 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
  contactInfo,
  socialLinks = [],
  showContactForm = true,
  theme = 'from-blue-500 to-cyan-500',
  mapEmbedUrl
}: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Phone */}
                {contactInfo.phone && (
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${theme} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <a 
                        href={`tel:${contactInfo.phone}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {contactInfo.email && (
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${theme} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <a 
                        href={`mailto:${contactInfo.email}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Address */}
                {contactInfo.address && (
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${theme} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>
                )}

                {/* Hours */}
                {contactInfo.hours && contactInfo.hours.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${theme} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Business Hours</h4>
                      <div className="space-y-1">
                        {contactInfo.hours.map((schedule, index) => (
                          <div key={index} className="flex justify-between text-gray-600">
                            <span className="font-medium">{schedule.days}</span>
                            <span>{schedule.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gradient-to-r ${theme} rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {mapEmbedUrl && (
              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
          </div>

          {/* Contact Form */}
          {showContactForm && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h4>
                  <p className="text-gray-600">
                    Your message has been sent successfully. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="services">Services</option>
                        <option value="support">Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full px-8 py-4 bg-gradient-to-r ${theme} text-white font-semibold rounded-lg
                      transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      flex items-center justify-center gap-2
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}