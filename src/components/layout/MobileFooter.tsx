import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram } from 'lucide-react';

const logoUrl = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-cc0cvmcrcxkw/app-cdkoojeqtu69/20260706/mayuresh.jpeg';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Categories', path: '/categories' },
  { label: 'Products', path: '/products' },
  { label: 'Enquiries', path: '/enquiries' },
  { label: 'Contact', path: '/contact' },
  { label: 'About', path: '/about' },
];

const MobileFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="md:hidden bg-card border-t border-border mt-auto">
      <div className="px-4 py-6 space-y-6">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img src={logoUrl} alt="Mayuresh Enterprises" className="w-7 h-7 rounded-lg object-contain bg-white border border-border" />
            <h2 className="text-sm font-bold text-foreground truncate">
              Mayuresh Enterprises
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Premium printing services for businesses. Custom designs, bulk orders, and fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-bold text-foreground mb-2">Quick Links</h3>
          <div className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-left text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-foreground">Contact Us</h3>
          <a href="mailto:mayureshentr2010@gmail.com" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            mayureshentr2010@gmail.com
          </a>
          <a href="tel:+919886323266" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            98863 232 266
          </a>
          <a href="tel:+919704284242" className="flex items-center gap-2 pl-5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            97042 842 842
          </a>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground">
              Shop No. 2, Govind Smruti, Somjai Nagar Road, Khopoli, Taluka Khalapur, District Raigad, Maharashtra – 410203, India
            </span>
          </div>
        </div>

        {/* Social */}
        <div className="flex items-center gap-3">
          <span className="p-1.5 rounded-lg bg-muted">
            <Facebook className="w-3.5 h-3.5 text-foreground" />
          </span>
          <span className="p-1.5 rounded-lg bg-muted">
            <Twitter className="w-3.5 h-3.5 text-foreground" />
          </span>
          <span className="p-1.5 rounded-lg bg-muted">
            <Instagram className="w-3.5 h-3.5 text-foreground" />
          </span>
        </div>

        <div className="border-t border-border pt-4 text-center">
          <p className="text-[10px] text-muted-foreground">
            &copy; 2026 Mayuresh Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
