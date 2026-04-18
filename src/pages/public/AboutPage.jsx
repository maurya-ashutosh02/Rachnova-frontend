// AboutPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import PublicLayout from '../../components/public/PublicLayout';
import { SectionLabel, PageLoader } from '../../components/public/UI';

export function AboutPage() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/content/about')
      .then(r => setAbout(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-dark-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        <div className="container-custom relative">
          <SectionLabel>Who We Are</SectionLabel>
          <h1 className="section-heading text-5xl md:text-7xl mb-6">{about?.title || 'About Rachnova'}</h1>
          <p className="section-subheading max-w-2xl">{about?.subtitle}</p>
        </div>
      </section>

      {/* Introduction */}
      {about?.introduction && (
        <section className="section-padding bg-dark-900">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel>Our Story</SectionLabel>
                <h2 className="font-heading text-4xl text-white tracking-wider mb-6">The Rachnova Journey</h2>
                <p className="text-dark-300 leading-relaxed mb-6">{about.introduction}</p>
                {about.companyStory && <p className="text-dark-300 leading-relaxed">{about.companyStory}</p>}
              </div>
              <div className="relative">
                {about.aboutImage ? (
                  <img src={about.aboutImage} alt="About" className="w-full h-80 object-cover" />
                ) : (
                  <div className="w-full h-80 bg-dark-800 border border-dark-700 flex items-center justify-center">
                    <div className="font-heading text-7xl text-primary-600/20">R</div>
                  </div>
                )}
                {about.yearsOfExperience && (
                  <div className="absolute -bottom-5 -right-5 w-28 h-28 bg-primary-600 flex flex-col items-center justify-center">
                    <div className="font-heading text-white text-3xl">{about.yearsOfExperience}+</div>
                    <div className="text-primary-100 text-xs text-center font-mono mt-1">YRS EXP</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vision & Mission */}
      {(about?.vision || about?.mission) && (
        <section className="section-padding bg-dark-950">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              {about.vision && (
                <div className="border border-dark-800 p-8 relative overflow-hidden group hover:border-primary-700/50 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/5 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="text-5xl mb-4">🔭</div>
                  <h3 className="font-heading text-2xl text-white tracking-wider mb-4">Our Vision</h3>
                  <p className="text-dark-300 leading-relaxed">{about.vision}</p>
                </div>
              )}
              {about.mission && (
                <div className="border border-dark-800 p-8 relative overflow-hidden group hover:border-primary-700/50 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/5 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="font-heading text-2xl text-white tracking-wider mb-4">Our Mission</h3>
                  <p className="text-dark-300 leading-relaxed">{about.mission}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Core Values */}
      {about?.coreValues?.length > 0 && (
        <section className="section-padding bg-dark-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <SectionLabel>What We Stand For</SectionLabel>
              <h2 className="font-heading text-4xl text-white tracking-wider">Core Values</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {about.coreValues.map((val, i) => (
                <div key={i} className="card p-6 text-center hover:border-primary-700/50 transition-colors">
                  <div className="text-4xl mb-4">{val.icon}</div>
                  <h4 className="text-white font-semibold mb-2">{val.title}</h4>
                  <p className="text-dark-400 text-sm leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {about?.whyChooseUs?.length > 0 && (
        <section className="section-padding bg-dark-950">
          <div className="container-custom">
            <div className="text-center mb-12">
              <SectionLabel>Why Rachnova</SectionLabel>
              <h2 className="font-heading text-4xl text-white tracking-wider">Why Choose Us</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {about.whyChooseUs.map((item, i) => (
                <div key={i} className="flex gap-5 p-6 border border-dark-800 hover:border-primary-700/50 transition-colors group">
                  <div className="text-3xl shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 group-hover:text-primary-400 transition-colors">{item.title}</h4>
                    <p className="text-dark-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Founder Section */}
      {about?.founderName && (
        <section className="section-padding bg-dark-900">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                {about.founderImage ? (
                  <img src={about.founderImage} alt={about.founderName} className="w-full h-80 object-cover object-top" />
                ) : (
                  <div className="w-full h-80 bg-dark-800 border border-dark-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-heading text-7xl text-primary-600/20">{about.founderName?.[0]}</div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <SectionLabel>Leadership</SectionLabel>
                <h2 className="font-heading text-4xl text-white tracking-wider mb-2">{about.founderName}</h2>
                <p className="text-primary-500 font-mono text-sm tracking-widest uppercase mb-6">Founder & Managing Director</p>
                {about.founderBio && <p className="text-dark-300 leading-relaxed mb-4">{about.founderBio}</p>}
                {about.professionalSummary && <p className="text-dark-400 text-sm leading-relaxed">{about.professionalSummary}</p>}
                {about.expertise?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {about.expertise.map((e, i) => (
                      <span key={i} className="text-xs font-mono px-3 py-1.5 border border-primary-800 text-primary-400 uppercase tracking-wider">{e}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-dark-950 border-t border-dark-800">
        <div className="container-custom text-center">
          <h3 className="font-heading text-3xl text-white tracking-wider mb-4">Ready to Work Together?</h3>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 group">
            Contact Us <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
