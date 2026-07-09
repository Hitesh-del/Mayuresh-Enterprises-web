import React, { useState } from 'react';
import { X, Mail, Phone, User, Package, Loader2, CheckCircle } from 'lucide-react';
import { useCreateEnquiry } from '@/hooks/useSupabaseData';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { sendPushNotification } from '@/lib/pushNotifications';

interface EnquiryModalProps {
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

const quantityOptions = [500, 750, 1000, 1500, 2000, 2500, 5000];

const EnquiryModal: React.FC<EnquiryModalProps> = ({ productName, isOpen, onClose }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const createEnquiry = useCreateEnquiry();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    contact: '',
    quantity: 500,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.contact.trim()) e.contact = 'Contact number is required';
    else if (!/^\d{10,15}$/.test(form.contact.replace(/\D/g, ''))) e.contact = 'Invalid contact number';
    if (!form.quantity || form.quantity < 500) e.quantity = 'Minimum quantity is 500';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createEnquiry.mutateAsync({
        product_name: productName,
        full_name: form.fullName,
        email: form.email,
        contact: form.contact,
        quantity: form.quantity,
        user_id: user?.id || null,
      });
      setSubmitted(true);
      toast.success('Enquiry submitted successfully');

    } catch {
      toast.error('Failed to submit enquiry');
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ fullName: '', email: '', contact: '', quantity: 500 });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative w-full max-w-[calc(100%-2rem)] md:max-w-lg bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Product Enquiry</h2>
          <button onClick={handleClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Enquiry Submitted!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              We have received your enquiry for <strong>{productName}</strong>. Our team will contact you shortly.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-4 max-h-[70dvh] overflow-y-auto">
            {/* Product */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <Package className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Product</p>
                <p className="text-sm font-medium text-foreground truncate">{productName}</p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Contact Number</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="tel"
                  placeholder="Enter your contact number"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {errors.contact && <p className="text-xs text-destructive mt-1">{errors.contact}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Quantity (Min: 500)</label>
              <select
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                {quantityOptions.map((q) => (
                  <option key={q} value={q}>
                    {q >= 5000 ? '5000+' : q}
                  </option>
                ))}
              </select>
              {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity}</p>}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={createEnquiry.isPending}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {createEnquiry.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Enquiry'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
