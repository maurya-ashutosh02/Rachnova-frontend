import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Youtube, MessageCircle } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function Footer() {
  const { settings } = useSite();
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Services', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  const projectLinks = [
    { label: 'Completed Projects', path: '/completed-projects' },
    { label: 'Ongoing Projects', path: '/ongoing-projects' },
    { label: 'Upcoming Projects', path: '/upcoming-projects' },
    { label: 'Education', path: '/education' },
    { label: 'Achievements', path: '/achievements' },
  ];

  return (
    <footer className="bg-dark-950 border-t border-dark-800">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center transform rotate-45">
                <span className="font-heading text-white text-lg transform -rotate-45">R</span>
              </div>
              <div>
                <div className="font-heading text-white text-xl tracking-widest leading-none">RACHNOVA</div>
                <div className="text-primary-500 text-[9px] tracking-[0.35em] uppercase font-mono">PROJECTS</div>
              </div>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-5">
              Engineering Excellence, Structural Precision, Project Mastery. Building tomorrow's infrastructure today.
            </p>
            {/* Social */}
            <div className="flex gap-3 flex-wrap">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-dark-700 hover:border-primary-600 hover:bg-primary-600/10 flex items-center justify-center text-dark-400 hover:text-primary-400 transition-all">
                  <Facebook size={16} />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-dark-700 hover:border-primary-600 hover:bg-primary-600/10 flex items-center justify-center text-dark-400 hover:text-primary-400 transition-all">
                  <Instagram size={16} />
                </a>
              )}
              {settings.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-dark-700 hover:border-primary-600 hover:bg-primary-600/10 flex items-center justify-center text-dark-400 hover:text-primary-400 transition-all">
                  <Linkedin size={16} />
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-dark-700 hover:border-primary-600 hover:bg-primary-600/10 flex items-center justify-center text-dark-400 hover:text-primary-400 transition-all">
                  <Twitter size={16} />
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-dark-700 hover:border-primary-600 hover:bg-primary-600/10 flex items-center justify-center text-dark-400 hover:text-primary-400 transition-all">
                  <Youtube size={16} />
                </a>
              )}
              {settings.whatsappNumber && (
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer"
                  className="w-9 h-9 border border-dark-700 hover:border-green-600 hover:bg-green-600/10 flex items-center justify-center text-dark-400 hover:text-green-400 transition-all">
                  <MessageCircle size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-white text-lg tracking-widest mb-5 uppercase">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-dark-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-600 group-hover:w-3 transition-all duration-200"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h4 className="font-heading text-white text-lg tracking-widest mb-5 uppercase">Projects</h4>
            <ul className="space-y-2.5">
              {projectLinks.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-dark-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-primary-600 group-hover:w-3 transition-all duration-200"></span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-white text-lg tracking-widest mb-5 uppercase">Contact</h4>
            <ul className="space-y-3">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-start gap-3 text-dark-400 hover:text-primary-400 text-sm transition-colors group">
                    <Mail size={16} className="mt-0.5 shrink-0 text-primary-600" />
                    <span>{settings.email}</span>
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone}`} className="flex items-start gap-3 text-dark-400 hover:text-primary-400 text-sm transition-colors">
                    <Phone size={16} className="mt-0.5 shrink-0 text-primary-600" />
                    <span>{settings.phone}</span>
                  </a>
                </li>
              )}
              {(settings.address || settings.city) && (
                <li className="flex items-start gap-3 text-dark-400 text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-primary-600" />
                  <span>{[settings.address, settings.city, settings.state, settings.country].filter(Boolean).join(', ')}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-dark-500 text-xs">
            {settings.footerText || `© ${year} Rachnova Projects. All rights reserved.`}
          </p>
          <div className="flex items-center gap-1 text-dark-500 text-xs">
            <span>Designed & Built with</span>
            <span className="text-primary-500">♦</span>
            <span>precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
