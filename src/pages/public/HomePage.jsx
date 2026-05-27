import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, ChevronDown } from "lucide-react";
import api from "../../utils/api";
import PublicLayout from "../../components/public/PublicLayout";
import {
  CountUp,
  SectionLabel,
  SkeletonCard,
  StatusBadge,
  ProjectImage,
} from "../../components/public/UI";

export default function HomePage() {
  const [home, setHome] = useState(null);
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/content/home"),
      api.get("/content/about"),
      api.get("/portfolio?limit=6"),
      api.get("/services"),
      api.get("/testimonials"),
    ])
      .then(([h, a, p, s, t]) => {
        setHome(h.data.data);
        setAbout(a.data.data);
        setProjects(p.data.data || []);
        setServices(s.data.data || []);
        setTestimonials(t.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <PublicLayout>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {home?.heroImage ? (
            <img
              src={home.heroImage}
              alt="Hero"
              className="w-full h-full object-cover opacity-25"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)",
                  backgroundSize: "80px 80px",
                }}
              ></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-950/60 via-dark-950/40 to-dark-950"></div>
        </div>

        {/* Accent elements */}
        <div className="absolute top-1/4 right-10 w-px h-40 bg-gradient-to-b from-transparent via-primary-600 to-transparent opacity-60"></div>
        <div className="absolute bottom-1/3 left-10 w-px h-32 bg-gradient-to-b from-transparent via-primary-600 to-transparent opacity-40"></div>
        <div className="absolute top-1/3 left-1/4 w-40 h-px bg-gradient-to-r from-transparent via-primary-600 to-transparent opacity-30"></div>

        {/* Content */}
        <div className="relative container-custom text-center pt-24">
          {/* Pre-label */}
          <div
            className="section-label justify-center mb-8 opacity-0 animate-fade-up"
            style={{ animationFillMode: "forwards" }}
          >
            <span className="w-8 h-px bg-primary-600 inline-block"></span>
            Rachnova Projects
            <span className="w-8 h-px bg-primary-600 inline-block"></span>
          </div>

          {/* Main Heading */}
          <h1
            className="font-heading text-6xl md:text-8xl lg:text-9xl text-white tracking-widest uppercase leading-none mb-6 opacity-0 animate-fade-up animate-delay-100"
            style={{ animationFillMode: "forwards" }}
          >
            <span className="block">
              {home?.heroTitle?.split(" ").slice(0, 2).join(" ") || "BUILDING"}
            </span>
            <span className="block gradient-text">
              {home?.heroTitle?.split(" ").slice(2, 4).join(" ") ||
                "TOMORROW'S"}
            </span>
            <span className="block text-dark-200 text-4xl md:text-5xl lg:text-6xl font-display font-normal italic">
              {home?.heroTitle?.split(" ").slice(4).join(" ") ||
                "Infrastructure Today"}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-dark-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-4 opacity-0 animate-fade-up animate-delay-200"
            style={{ animationFillMode: "forwards" }}
          >
            {home?.heroSubtitle ||
              "Engineering Excellence, Structural Precision, Project Mastery"}
          </p>
          <p
            className="text-primary-500 font-mono text-sm tracking-widest uppercase mb-12 opacity-0 animate-fade-up animate-delay-300"
            style={{ animationFillMode: "forwards" }}
          >
            {home?.heroTagline ||
              "Transforming visions into landmark structures"}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up animate-delay-400"
            style={{ animationFillMode: "forwards" }}
          >
            <Link
              to="/portfolio"
              className="btn-primary flex items-center gap-2 group"
            >
              {home?.heroCTA1 || "View Projects"}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link to="/contact" className="btn-outline flex items-center gap-2">
              {home?.heroCTA2 || "Contact Us"}
            </Link>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={scrollToNext}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-500 hover:text-primary-500 transition-colors opacity-0 animate-fade-in animate-delay-600"
            style={{ animationFillMode: "forwards" }}
          >
            <span className="font-mono text-xs tracking-widest uppercase">
              Scroll
            </span>
            <ChevronDown size={18} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 bg-dark-900 border-y border-dark-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                value: home?.statsProjects || 50,
                suffix: "+",
                label: "Projects Delivered",
              },
              {
                value: home?.statsYears || 10,
                suffix: "+",
                label: "Years Experience",
              },
              {
                value: home?.statsClients || 30,
                suffix: "+",
                label: "Happy Clients",
              },
              {
                value: home?.statsTeam || 20,
                suffix: "+",
                label: "Team Members",
              },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="font-heading text-5xl md:text-6xl text-primary-500 leading-none mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-dark-400 text-sm font-mono tracking-widest uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      {about && (
        <section className="section-padding bg-dark-950">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel>About Rachnova</SectionLabel>
                <h2 className="section-heading text-4xl md:text-5xl mb-6 leading-tight">
                  {about.subtitle || "A Legacy of Engineering Excellence"}
                </h2>
                <p className="text-dark-300 leading-relaxed mb-6">
                  {about.introduction}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {(about.coreValues || []).slice(0, 4).map((val, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-dark-900 border border-dark-800"
                    >
                      <span className="text-2xl">{val.icon}</span>
                      <div>
                        <div className="text-white font-semibold text-sm mb-1">
                          {val.title}
                        </div>
                        <div className="text-dark-400 text-xs leading-relaxed">
                          {val.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/about"
                  className="btn-primary inline-flex items-center gap-2 group"
                >
                  Learn More
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
              <div className="relative">
                <div className="relative z-10">
                  {about.aboutImage ? (
                    <div className="w-full h-96 bg-dark-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={about.aboutImage}
                        alt="About Rachnova"
                        className="max-w-full max-h-full object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-96 bg-dark-900 border border-dark-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="font-heading text-8xl text-primary-600/30 mb-2">
                          R
                        </div>
                        <div className="text-dark-600 font-mono text-xs tracking-widest">
                          RACHNOVA PROJECTS
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Accent box */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-600 flex flex-col items-center justify-center z-20">
                    <div className="font-heading text-white text-4xl leading-none">
                      {about.yearsOfExperience || 10}+
                    </div>
                    <div className="text-primary-100 text-xs text-center font-mono tracking-wider mt-1">
                      YEARS
                      <br />
                      EXPERIENCE
                    </div>
                  </div>
                </div>
                {/* Decorative border */}
                <div className="absolute top-6 left-6 right-6 bottom-6 border border-primary-600/20 pointer-events-none z-0"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="text-center mb-14">
            <SectionLabel>Our Work</SectionLabel>
            <h2 className="section-heading text-4xl md:text-5xl mb-4">
              {home?.featuredSectionTitle || "Featured Projects"}
            </h2>
            <p className="section-subheading max-w-xl mx-auto">
              {home?.featuredSectionSubtitle ||
                "Explore our landmark projects across structural engineering"}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-dark-500">
              <div className="font-heading text-2xl tracking-wider mb-2">
                No Projects Yet
              </div>
              <p className="text-sm">
                Projects will appear here once added by the admin.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <Link
                  key={project._id}
                  to={`/portfolio`}
                  className="card card-hover group block"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="img-zoom h-52">
                    <ProjectImage
                      src={project.images?.[0]?.url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary-500 font-mono text-xs tracking-wider uppercase">
                        {project.category}
                      </span>
                      <StatusBadge status={project.status} />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-primary-400 transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-dark-400 text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                    {project.location && (
                      <div className="mt-3 text-dark-500 text-xs font-mono">
                        📍 {project.location}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="btn-outline inline-flex items-center gap-2 group"
            >
              View All Projects
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      {services.length > 0 && (
        <section className="section-padding bg-dark-950">
          <div className="container-custom">
            <div className="text-center mb-14">
              <SectionLabel>What We Do</SectionLabel>
              <h2 className="section-heading text-4xl md:text-5xl mb-4">
                Our Services
              </h2>
              <p className="section-subheading max-w-xl mx-auto">
                Comprehensive engineering and construction services tailored to
                your needs
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service, i) => (
                <div key={service._id} className="card card-hover p-6 group">
                  <div className="text-4xl mb-4">{service.icon || "🏗️"}</div>
                  <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-primary-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-dark-400 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  {service.features?.length > 0 && (
                    <ul className="space-y-1.5">
                      {service.features.slice(0, 3).map((f, fi) => (
                        <li
                          key={fi}
                          className="flex items-center gap-2 text-dark-400 text-xs"
                        >
                          <CheckCircle
                            size={12}
                            className="text-primary-500 shrink-0"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/services"
                className="btn-outline inline-flex items-center gap-2 group"
              >
                All Services
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-dark-900">
          <div className="container-custom">
            <div className="text-center mb-14">
              <SectionLabel>Client Testimonials</SectionLabel>
              <h2 className="section-heading text-4xl md:text-5xl mb-4">
                What Clients Say
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t._id} className="card p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < t.rating ? "text-gold-500" : "text-dark-700"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-dark-300 text-sm leading-relaxed mb-5 italic">
                    "{t.feedback}"
                  </p>
                  <div className="flex items-center gap-3">
                    {t.photo ? (
                      <img
                        src={t.photo}
                        alt={t.clientName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-600 flex items-center justify-center rounded-full">
                        <span className="text-white font-semibold text-sm">
                          {t.clientName?.[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="text-white font-semibold text-sm">
                        {t.clientName}
                      </div>
                      {(t.designation || t.company) && (
                        <div className="text-dark-500 text-xs">
                          {[t.designation, t.company]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 bg-primary-700 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="container-custom text-center relative">
          <h2 className="font-heading text-4xl md:text-5xl text-white tracking-widest uppercase mb-4">
            Ready to Build Something Great?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-lg mx-auto">
            Let's discuss your next project. Our team of experts is ready to
            bring your vision to life.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-4 transition-all duration-300 uppercase tracking-widest text-sm group"
          >
            Start a Project
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
