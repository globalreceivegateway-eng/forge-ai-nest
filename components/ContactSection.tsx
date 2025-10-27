import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-4xl font-bold mb-8 text-white">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Address</h3>
                  <p className="text-slate-300">18, Fatai Kaffo Street Lagos</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                  <p className="text-slate-300">info@aistudio.ng</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg border border-slate-700/50">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
                  <p className="text-slate-300">07040863723</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-4xl font-bold mb-8 text-white">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;