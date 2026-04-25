import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, 
  Mail, 
  Linkedin, 
  Github, 
  Layers, 
  Code2, 
  Palette, 
  SquareCode, 
  Share2, 
  Cloud,
  FileDown,
  Download,
  ArrowRight,
  ExternalLink
} from "lucide-react";

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }

  interface Window {
    html2pdf?: () => {
      set: (options: unknown) => {
        from: (element: HTMLElement) => {
          save: () => Promise<void>;
        };
      };
    };
  }
}

const HTML2PDF_SCRIPT_ID = "html2pdf-cdn";
let html2pdfLoader: Promise<NonNullable<Window["html2pdf"]>> | null = null;

const loadHtml2Pdf = () => {
  if (window.html2pdf) {
    return Promise.resolve(window.html2pdf);
  }

  if (html2pdfLoader) {
    return html2pdfLoader;
  }

  html2pdfLoader = new Promise<NonNullable<Window["html2pdf"]>>((resolve, reject) => {
    const existingScript = document.getElementById(HTML2PDF_SCRIPT_ID) as HTMLScriptElement | null;

    const handleReady = () => {
      if (window.html2pdf) {
        resolve(window.html2pdf);
      } else {
        reject(new Error("html2pdf failed to initialize"));
      }
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleReady, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load html2pdf")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = HTML2PDF_SCRIPT_ID;
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    script.onload = handleReady;
    script.onerror = () => reject(new Error("Failed to load html2pdf"));
    document.head.appendChild(script);
  }).catch((error) => {
    html2pdfLoader = null;
    throw error;
  });

  return html2pdfLoader;
};

const PROJECTS = [
  {
    id: "ecotrack",
    title: "EcoTrack",
    description: "Sustainability dashboard for enterprise carbon monitoring.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCDquta8fjxB6nw_zxcsa3NTtaEtpao-JdGI1_S0hLa1Mv6ruaYYnbOQDb3w31JVIN6o3QTr_ZBuWmgAiw9rTSQYuIOznuvUc78-aXkHA3itWWV3i3q75xsfMvKLec29LoAYG98tMGVBRBHu8CTThNePPZdknlnOpmdrHHMGc2FUKrUO9RNG29oQFl1V9I5ce_lkVTM4zZqcgv3C60GyciuV7gUJeLXlrCqGGOUdcmtanTKnIwC2IiU_Yz308bDFYcc2KHVaqDtMUL",
    tags: ["React", "D3.js"],
    size: "large",
    link: "https://github.com/alexrivera/ecotrack"
  },
  {
    id: "streamline",
    title: "Streamline",
    description: "High-performance task management tool.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCTp1pqjSAPd9jOhK1mBI9do8-bXkWMNW2zMAhKhEKBO71LPiNUaQXRtMIiAC5-hD5nokBfISMjOVtWbbLPUdDw8RE7PCAaclPxnhRGJHzR_hsoO0VtK8iTcaROHcR5qXnZSvAIhnlb0XcbYOPrHao7DZwEggB1vr-GPjNJPCzpkn4FgZP087SBLh64VoEvfuPqrPXZA2nvJ5tMjCUFLQP1kmLVEAjqlzKNvwqZQhThM4BBKJJuSHfsJfgEJowojY-uLh3fzsM6dlx",
    tags: ["TypeScript", "Tailwind"],
    size: "small",
    link: "https://github.com/alexrivera/streamline"
  },
  {
    id: "aura",
    title: "Aura",
    description: "An AI-driven design system that adapts to user behavior in real-time. Built for massive scale and accessibility.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApHPAR6MzrJtWb1oJB_dfxjkoNmRtC7TQrYhYCrfbY6joCD5fgTx5zFTD5MQt9lj4z9Txeif3NdXCUBqtZgfeHjypnHoPv68T4Obxwa4GjULiZX-VOjJLy4ELAFso3wk1JhN9Fr03wlJgXJ4r67_XsYccqGrtcKh1Sjmx1iigmhgsIkSyaCOihXEaleE5tVrJttGDYAAnTiDpFjlmv-B4BluXbp0kQraC4rDYwj-qkukesi2JRfT17oOV9-aj0t0X3duGYYaivnJ-U",
    tags: ["Next.js", "Framer Motion", "AI/ML"],
    size: "full",
    dark: true,
    link: "https://github.com/alexrivera/aura"
  }
];

const SKILLS = [
  { name: "React", icon: <Layers className="w-8 h-8" /> },
  { name: "TypeScript", icon: <Code2 className="w-8 h-8" /> },
  { name: "Tailwind", icon: <Palette className="w-8 h-8" /> },
  { name: "Node.js", icon: <SquareCode className="w-8 h-8" /> },
  { name: "GraphQL", icon: <Share2 className="w-8 h-8" /> },
  { name: "AWS", icon: <Cloud className="w-8 h-8" /> },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isExporting, setIsExporting] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installHelpOpen, setInstallHelpOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const isIos = /iphone|ipad|ipod/i.test(typeof navigator !== "undefined" ? navigator.userAgent : "");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "projects", "skills", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia("(display-mode: standalone)").matches || ((window.navigator as Navigator & { standalone?: boolean }).standalone === true);
      setIsStandalone(standalone);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setInstallHelpOpen(false);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("pdf-export");
    if (!element) return;

    setPdfError(null);
    setIsExporting(true);
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    const options = {
      margin: [0.35, 0.35],
      filename: "Rady_Y_Final.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] }
    };

    try {
      const html2pdf = await loadHtml2Pdf();
      await html2pdf().set(options).from(element).save();
    } catch {
      setPdfError("PDF export is temporarily unavailable. Please refresh and try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleInstallApp = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
      return;
    }

    if (isIos && !isStandalone) {
      setInstallHelpOpen((current) => !current);
    }
  };

  const showInstallButton = !isStandalone && (Boolean(installPrompt) || isIos);

  const navLinks = [
    { name: "Experience", id: "hero" },
    { name: "Projects", id: "projects" },
    { name: "Skills", id: "skills" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:h-16 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center justify-between gap-2">
            <Terminal className="w-6 h-6 text-slate-900" />
            <span className="text-lg font-bold tracking-tight font-display text-slate-900">DevPortfolio</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-display h-full">
            {navLinks.map((link) => (
              <a 
                key={link.id}
                href={`#${link.id}`} 
                onClick={(e) => scrollToSection(e, link.id)}
                className={`h-full flex items-center transition-all relative ${
                  activeSection === link.id ? "text-slate-900 font-bold" : "text-slate-500 font-medium hover:text-slate-900"
                }`}
              >
                {link.name}
                {activeSection === link.id && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 md:items-center">
            {showInstallButton && (
              <button
                onClick={handleInstallApp}
                aria-label="Install portfolio app"
                className="bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:border-secondary hover:text-secondary transition-colors"
              >
                <Download className="w-4 h-4" />
                Install App
              </button>
            )}
            <button 
              onClick={handleDownloadPDF}
              aria-label="Export resume as PDF"
              disabled={isExporting}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
            >
              <FileDown className="w-4 h-4" />
              {isExporting ? "Preparing PDF..." : "Export Resume"}
            </button>
          </div>
        </nav>
      </header>

      {pdfError && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-lg border border-red-200">
          {pdfError}
        </div>
      )}

      {installHelpOpen && (
        <div className="fixed top-24 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
          <p className="text-sm font-bold text-slate-900">Install on iPhone</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Open the browser share menu, then choose <span className="font-semibold text-slate-900">Add to Home Screen</span> to install this portfolio as an app.
          </p>
        </div>
      )}

      <main id="pdf-content">
        {/* Hero Section */}
        <section id="hero" className="pt-40 md:pt-32 pb-16 md:pb-section-gap px-4 sm:px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-6"
          >
            <div className="inline-block px-3 py-1 bg-surface-container rounded-full text-secondary font-bold text-xs tracking-widest uppercase">
              SENIOR FRONTEND ENGINEER
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold font-display leading-[1.1] tracking-tighter text-on-surface">
              Rady Y
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Crafting performant and accessible web experiences with 5+ years of expertise in modern JS frameworks. Dedicated to technical rigor and aesthetic sensitivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 no-print">
              <a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-secondary transition-all">
                Hire Me
              </a>
              <a href="#projects" onClick={(e) => scrollToSection(e, "projects")} className="px-8 py-3 border-2 border-outline-variant text-on-surface font-bold rounded-lg hover:border-primary transition-all">
                View Projects
              </a>
              {showInstallButton && (
                <button
                  onClick={handleInstallApp}
                  className="px-8 py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-lg hover:border-secondary hover:text-secondary transition-all sm:hidden"
                >
                  Install App
                </button>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative"
          >
            <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-[12px] border-white shadow-2xl relative z-10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxATcV4aXNVXYp0jUG_IIwtwvcpwqyODlO2DoV_z0sfaA-nUqfFeAzX27Na4kFL09HXlczWmUwoE5bsCFWx4gllJrH7lrumKokoYNbK3wR6T7ILGwU-Ulh_CPmoeudUm9g335mpfZBoWed4BYEJTktTBjNBx05IudNjOPJS52XZaO1f7dq4Yc51MDVzMQQoXhgocCQrJ7tu_UVlNyMeYpEJdCfSRavrFyOGOBdbwkaPmSv04KJkz86dIDy853TjQXzqHvzEUQdlqGd"
                alt="Rady Y"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Availability Badge */}
            <div className="absolute -bottom-4 -left-4 bg-white p-5 shadow-xl rounded-2xl z-20 hidden md:flex items-center gap-4">
              <div className="p-3 bg-surface-container rounded-lg">
                <Terminal className="text-secondary w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-on-surface">Available for hire</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Remote or Hybrid</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-16 md:py-section-gap bg-white px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-content-gap">
              <h2 className="text-4xl font-bold font-display text-on-surface">Featured Projects</h2>
              <p className="text-on-surface-variant mt-2">A selection of technical solutions and design systems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {PROJECTS.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                    borderColor: "#0058be"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`
                    ${project.size === 'large' ? 'md:col-span-8' : project.size === 'small' ? 'md:col-span-4' : 'md:col-span-12'}
                    ${project.dark ? 'bg-slate-950 text-white' : 'bg-surface-container-lowest border border-slate-100'}
                    rounded-3xl overflow-hidden group transition-all
                    ${project.size === 'full' ? 'flex flex-col md:flex-row' : ''}
                  `}
                >
                  <div className={`
                    overflow-hidden relative
                    ${project.size === 'full' ? 'md:w-1/2 aspect-video md:aspect-auto' : 'h-72'}
                  `}>
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className={`p-8 ${project.size === 'full' ? 'md:w-1/2 flex flex-col justify-center' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold font-display">{project.title}</h3>
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-1.5 rounded-lg border transition-all ${
                              project.dark 
                                ? 'border-white/20 text-white hover:bg-white/10' 
                                : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-900'
                            }`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <p className={`text-sm ${project.dark ? 'text-slate-400' : 'text-on-surface-variant'} leading-relaxed`}>
                          {project.description}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                        {project.tags.slice(0, 2).map(tag => (
                          <span key={tag} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.dark ? 'bg-white/10 text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.size === 'full' && (
                       <div className="mt-8 flex gap-3">
                          {project.tags.map(tag => (
                            <span key={tag} className="px-4 py-2 border border-white/20 rounded-xl text-xs font-bold">
                              {tag}
                            </span>
                          ))}
                       </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-16 md:py-section-gap px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-display text-on-surface">Technical Stack</h2>
              <p className="text-on-surface-variant mt-2">Core competencies and preferred technologies.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-gutter">
              {SKILLS.map((skill) => (
                <motion.div
                  key={skill.name}
                  whileHover={{ y: -5, borderColor: '#0058be' }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col items-center gap-4 group transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                    {skill.icon}
                  </div>
                  <span className="font-bold text-on-surface">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-slate-950 text-white py-20 md:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-5xl md:text-6xl font-extrabold font-display leading-tight">
              Let's build something remarkable.
            </h2>
            <p className="text-xl text-slate-400">Currently accepting new projects and opportunities.</p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
              <a href="mailto:rady.bmcs@gmail.com" className="flex items-center gap-3 text-lg font-bold hover:text-secondary transition-colors group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-secondary">
                  <Mail className="w-5 h-5" />
                </div>
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/rady-y/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-lg font-bold hover:text-secondary transition-colors group"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-secondary">
                  <Linkedin className="w-5 h-5" />
                </div>
                LinkedIn
              </a>
              <a
                href="https://github.com/radytrainer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-lg font-bold hover:text-secondary transition-colors group"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-secondary">
                  <Github className="w-5 h-5" />
                </div>
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">
            © 2024 Developer Portfolio. Built with technical rigor.
          </p>
          <div className="flex gap-8">
            <a
              href="https://github.com/radytrainer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/rady-y/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-slate-900 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:rady.bmcs@gmail.com"
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-slate-900 transition-colors"
            >
              Gmail
            </a>
          </div>
        </div>
      </footer>

      <div
        id="pdf-export"
        aria-hidden="true"
        className={isExporting ? "pdf-export-root exporting" : "pdf-export-root"}
      >
        <div className="pdf-page">
          <div className="pdf-topbar" />
          <header className="pdf-header">
            <div className="pdf-header-main">
              <p className="pdf-kicker">Senior Frontend Engineer</p>
              <h1>Rady Y</h1>
              <p className="pdf-summary">
                Frontend engineer with 5+ years of experience building accessible,
                high-performance digital products. Strong in React, TypeScript,
                design systems, and turning product goals into polished,
                production-ready interfaces.
              </p>
            </div>
            <div className="pdf-contact-card">
              <p>Bangkok, Thailand</p>
              <p>rady.bmcs@gmail.com</p>
              <p>linkedin.com/in/rady-y</p>
              <p>github.com/radytrainer</p>
            </div>
          </header>

          <div className="pdf-layout">
            <aside className="pdf-sidebar">
              <section className="pdf-section pdf-sidebar-section">
                <h2>Core Skills</h2>
                <div className="pdf-pill-grid">
                  {SKILLS.map((skill) => (
                    <span key={skill.name} className="pdf-pill">
                      {skill.name}
                    </span>
                  ))}
                  <span className="pdf-pill">Accessibility</span>
                  <span className="pdf-pill">Design Systems</span>
                  <span className="pdf-pill">Responsive UI</span>
                  <span className="pdf-pill">Performance</span>
                </div>
              </section>

              <section className="pdf-section pdf-sidebar-section">
                <h2>Strengths</h2>
                <ul className="pdf-list pdf-tight-list">
                  <li>Scalable component architecture</li>
                  <li>Cross-functional product collaboration</li>
                  <li>Usability and visual polish</li>
                  <li>Clean handoff from design to code</li>
                </ul>
              </section>

              <section className="pdf-section pdf-sidebar-section">
                <h2>Focus Areas</h2>
                <div className="pdf-meta-stack">
                  <div>
                    <span className="pdf-meta-label">Frontend</span>
                    <p>React, TypeScript, Tailwind</p>
                  </div>
                  <div>
                    <span className="pdf-meta-label">Delivery</span>
                    <p>Accessible, responsive, production-ready UI</p>
                  </div>
                  <div>
                    <span className="pdf-meta-label">Environment</span>
                    <p>Remote, hybrid, product teams</p>
                  </div>
                </div>
              </section>
            </aside>

            <div className="pdf-main">
              <section className="pdf-section">
                <h2>Professional Summary</h2>
            <p>
              I design and build frontend experiences that are fast, intuitive,
              and maintainable. My work centers on thoughtful interaction design,
              reusable systems, and close collaboration with product and design
              partners to deliver interfaces that feel refined in both code and UI.
            </p>
          </section>

          <section className="pdf-section">
            <h2>Selected Projects</h2>
            <div className="pdf-projects">
              {PROJECTS.map((project) => (
                <article key={project.id} className="pdf-project">
                  <div className="pdf-project-heading">
                    <h3>{project.title}</h3>
                    <span>{project.tags.join(" | ")}</span>
                  </div>
                  <p>{project.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pdf-section">
            <h2>Professional Highlights</h2>
            <ul className="pdf-list">
              <li>Built accessible interfaces that balanced product goals, maintainability, and visual quality.</li>
              <li>Created reusable UI systems that improved development speed and consistency across screens.</li>
              <li>Delivered responsive experiences for dashboards, workflows, and collaboration-focused products.</li>
              <li>Contributed strong frontend craftsmanship across interaction, layout, and performance optimization.</li>
            </ul>
          </section>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          header, footer, #contact, .no-print { display: none !important; }
          body { background: white; }
          main { padding-top: 0; }
          section { border: none !important; box-shadow: none !important; }
          .rounded-3xl { border-radius: 1rem; border: 1px solid #e2e8f0; }
        }

        .pdf-export-root {
          position: fixed;
          left: 0;
          top: 0;
          width: 8.5in;
          pointer-events: none;
          opacity: 1;
          z-index: -1;
          transform: translateX(-200vw);
        }

        .pdf-export-root.exporting {
          transform: translateX(0);
        }

        .pdf-page {
          width: 8.5in;
          min-height: 11in;
          background: #ffffff;
          color: #0f172a;
          padding: 0.55in;
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
          box-sizing: border-box;
        }

        .pdf-header {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .pdf-kicker {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0058be;
        }

        .pdf-header h1 {
          margin: 0;
          font-family: "Manrope", sans-serif;
          font-size: 34px;
          line-height: 1.05;
        }

        .pdf-summary {
          margin: 12px 0 0;
          max-width: 4.8in;
          font-size: 13px;
          line-height: 1.65;
          color: #334155;
        }

        .pdf-contact {
          min-width: 2.1in;
          font-size: 12px;
          line-height: 1.7;
          text-align: right;
          color: #334155;
        }

        .pdf-contact p,
        .pdf-section p,
        .pdf-list {
          margin: 0;
        }

        .pdf-section {
          margin-top: 18px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .pdf-section h2 {
          margin: 0 0 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0f172a;
        }

        .pdf-section p,
        .pdf-project p,
        .pdf-list li {
          font-size: 12px;
          line-height: 1.65;
          color: #334155;
        }

        .pdf-pill-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pdf-pill {
          padding: 6px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          color: #0f172a;
          background: #f8fafc;
        }

        .pdf-projects {
          display: grid;
          gap: 12px;
        }

        .pdf-project {
          padding: 12px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .pdf-project-heading {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: baseline;
          margin-bottom: 6px;
        }

        .pdf-project-heading h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .pdf-project-heading span {
          font-size: 11px;
          color: #64748b;
          text-align: right;
        }

        .pdf-list {
          padding-left: 18px;
        }

        .pdf-page {
          padding: 0.42in 0.45in 0.48in;
        }

        .pdf-topbar {
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(90deg, #0f172a 0%, #0058be 55%, #93c5fd 100%);
          margin-bottom: 18px;
        }

        .pdf-header {
          gap: 18px;
          align-items: flex-start;
          border-bottom: 1px solid #dbe4f0;
          padding-bottom: 16px;
          margin-bottom: 18px;
        }

        .pdf-header-main {
          flex: 1;
        }

        .pdf-kicker {
          font-size: 11px;
          letter-spacing: 0.16em;
        }

        .pdf-header h1 {
          font-size: 32px;
          letter-spacing: -0.04em;
        }

        .pdf-summary {
          margin: 10px 0 0;
          max-width: 4.95in;
          font-size: 12px;
          line-height: 1.7;
        }

        .pdf-contact-card {
          min-width: 2.25in;
          padding: 12px 14px;
          border: 1px solid #dbe4f0;
          border-radius: 14px;
          background: #f8fbff;
          font-size: 11px;
          line-height: 1.75;
          color: #334155;
        }

        .pdf-contact-card p {
          margin: 0;
        }

        .pdf-layout {
          display: grid;
          grid-template-columns: 2.1in 1fr;
          gap: 18px;
        }

        .pdf-sidebar {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pdf-main {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pdf-section {
          margin-top: 0;
        }

        .pdf-sidebar-section {
          padding: 12px 12px 14px;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px;
          background: #fbfdff;
        }

        .pdf-section h2 {
          font-size: 11px;
          letter-spacing: 0.16em;
        }

        .pdf-section p,
        .pdf-project p,
        .pdf-list li {
          font-size: 11px;
        }

        .pdf-pill-grid {
          gap: 6px;
        }

        .pdf-pill {
          padding: 5px 9px;
          font-size: 10px;
          background: #ffffff;
        }

        .pdf-projects {
          gap: 10px;
        }

        .pdf-project {
          padding: 12px 14px 13px;
          border: none;
          border-left: 3px solid #0058be;
          border-radius: 0 12px 12px 0;
          background: #f8fbff;
        }

        .pdf-project-heading {
          margin-bottom: 5px;
        }

        .pdf-project-heading h3 {
          font-size: 13px;
        }

        .pdf-project-heading span {
          font-size: 10px;
        }

        .pdf-list {
          padding-left: 16px;
        }

        .pdf-tight-list li + li {
          margin-top: 4px;
        }

        .pdf-meta-stack {
          display: grid;
          gap: 10px;
        }

        .pdf-meta-label {
          display: block;
          margin-bottom: 2px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #64748b;
        }

        .pdf-meta-stack p {
          font-size: 11px;
          line-height: 1.5;
          color: #334155;
        }
      `}</style>
    </div>
  );
}

