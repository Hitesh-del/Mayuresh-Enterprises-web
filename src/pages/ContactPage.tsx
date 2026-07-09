import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { SEO } from '@/components/SEO';
import { pageSEO, buildLocalBusinessSchema, buildWebPageSchema, buildBreadcrumbSchema, siteUrl } from '@/lib/seo';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate sending - in production this would go to an edge function
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message sent successfully');
    }, 1000);
  };

  const contactSEO = pageSEO.contact;

  return (
    <Layout>
      <SEO
        title={contactSEO.title}
        description={contactSEO.description}
        keywords={contactSEO.keywords}
        canonical={`${siteUrl}/contact`}
        ogType={contactSEO.ogType}
        schema={[
          buildLocalBusinessSchema(),
          buildWebPageSchema('/contact', contactSEO.title, contactSEO.description),
          buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]),
        ]}
      />
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1">Contact Us</h1>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Contact Us</h1>
        <p className="text-muted-foreground mt-2">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
      </div>

      <div className="px-4 py-4 pb-6 md:px-0 md:py-0 md:pb-12 lg:pb-16 space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 lg:gap-10">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border border-border bg-card shadow-sm">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">Phone</p>
              <p className="text-sm md:text-base font-medium text-foreground">98863 232 266</p>
              <p className="text-sm md:text-base font-medium text-foreground">97042 842 842</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border border-border bg-card shadow-sm">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">Email</p>
              <p className="text-sm md:text-base font-medium text-foreground break-words">mayureshentr2010@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border border-border bg-card shadow-sm">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">Address</p>
              <p className="text-sm md:text-base font-medium text-foreground">Shop No. 2, Govind Smruti, Somjai Nagar Road, Khopoli, Taluka Khalapur, District Raigad, Maharashtra – 410203, India</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl border border-border bg-card shadow-sm">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">Business Hours</p>
              <p className="text-sm md:text-base font-medium text-foreground">Mon - Sat: 9:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        {submitted ? (
          <div className="flex flex-col items-center text-center py-8 md:p-8 md:rounded-2xl md:border md:border-border md:bg-card md:shadow-sm md:h-full md:justify-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Message Sent!</h3>
            <p className="text-sm md:text-base text-muted-foreground">We will get back to you shortly.</p>
          </div>
        ) : (
          <div className="p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl border border-border bg-card shadow-sm space-y-4 md:space-y-5">
            <h3 className="text-sm md:text-lg font-bold text-foreground">Send us a Message</h3>
            <div>
              <label className="block text-xs md:text-sm font-medium text-muted-foreground mb-1.5 md:mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-border bg-background text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-muted-foreground mb-1.5 md:mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-border bg-background text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-muted-foreground mb-1.5 md:mb-2">Message</label>
              <textarea
                placeholder="How can we help you?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-border bg-background text-sm md:text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full md:w-auto md:self-start inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 md:px-8 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ContactPage;
