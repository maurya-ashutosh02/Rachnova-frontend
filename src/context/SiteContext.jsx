import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'Rachnova Projects',
    siteTagline: 'Engineering Excellence',
    email: 'info@rachnovaprojects.com',
    phone: '+91 98765 43210',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    whatsappNumber: '',
    footerText: '© 2024 Rachnova Projects. All rights reserved.',
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    api.get('/content/settings')
      .then(res => setSettings(res.data.data))
      .catch(() => {})
      .finally(() => setLoadingSettings(false));
  }, []);

  return (
    <SiteContext.Provider value={{ settings, setSettings, loadingSettings }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
};
