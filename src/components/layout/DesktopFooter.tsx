import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const logoUrl = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-cc0cvmcrcxkw/app-cdkoojeqtu69/20260706/mayuresh.jpeg';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Categories', path: '/categories' },
  { label: 'Products', path: '/products' },
  { label: 'Enquiries', path: '/enquiries' },
  { label: 'Contact', path: '/contact' },
  { label: 'About', path: '/about' },
];

const DesktopFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="hidden md:block bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-12">
        <div className="grid grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src={logoUrl} alt="Mayuresh Enterprises" className="w-8 h-8 rounded-lg object-contain bg-white border border-border" />
              <h2 className="text-base font-bold text-foreground">
                Mayuresh Enterprises
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium printing services for businesses. Custom designs, bulk orders, and fast delivery.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <Facebook className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <Twitter className="w-4 h-4 text-foreground" />
              </button>
              <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <Instagram className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Customer Service</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <button onClick={() => navigate('/contact')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/enquiries')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Send Enquiry
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Services
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Contact Us</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <a href="mailto:mayureshentr2010@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  mayureshentr2010@gmail.com
                </a>
              </li>
              <li className="flex flex-col gap-0.5">
                <a href="tel:+919886323266" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  98863 232 266
                </a>
                <a href="tel:+919704284242" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pl-6">
                  97042 842 842
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Shop No. 2, Govind Smruti, Somjai Nagar Road, Khopoli, Taluka Khalapur, District Raigad, Maharashtra – 410203, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Mayuresh Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
