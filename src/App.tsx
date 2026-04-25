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
  ArrowRight,
  ExternalLink
} from "lucide-react";

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

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-content');
    const options = {
      margin: [0.5, 0.5],
      filename: 'RadyY_Final.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().set(options).from(element).save();
  };

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
        <nav className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
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

          <button 
            onClick={handleDownloadPDF}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-secondary transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Download PDF
          </button>
        </nav>
      </header>

      <main id="pdf-content">
        {/* Hero Section */}
        <section id="hero" className="pt-32 pb-section-gap px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-6"
          >
            <div className="inline-block px-3 py-1 bg-surface-container rounded-full text-secondary font-bold text-xs tracking-widest uppercase">
              SENIOR FRONTEND ENGINEER
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold font-display leading-[1.1] tracking-tighter text-on-surface">
              Rady Y
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Crafting performant and accessible web experiences with 5+ years of expertise in modern JS frameworks. Dedicated to technical rigor and aesthetic sensitivity.
            </p>
            <div className="flex gap-4 pt-4 no-print">
              <a href="#contact" onClick={(e) => scrollToSection(e, "contact")} className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-secondary transition-all">
                Hire Me
              </a>
              <a href="#projects" onClick={(e) => scrollToSection(e, "projects")} className="px-8 py-3 border-2 border-outline-variant text-on-surface font-bold rounded-lg hover:border-primary transition-all">
                View Projects
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative"
          >
            <div className="w-72 h-72 md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-[12px] border-white shadow-2xl relative z-10">
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
        <section id="projects" className="py-section-gap bg-white px-6">
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
                      <div className="flex gap-2 shrink-0">
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
        <section id="skills" className="py-section-gap px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-display text-on-surface">Technical Stack</h2>
              <p className="text-on-surface-variant mt-2">Core competencies and preferred technologies.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-gutter">
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
        <section id="contact" className="bg-slate-950 text-white py-24 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-5xl md:text-6xl font-extrabold font-display leading-tight">
              Let's build something remarkable.
            </h2>
            <p className="text-xl text-slate-400">Currently accepting new projects and opportunities.</p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-10">
              <a href="mailto:rady@y.dev" className="flex items-center gap-3 text-lg font-bold hover:text-secondary transition-colors group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-secondary">
                  <Mail className="w-5 h-5" />
                </div>
                Email
              </a>
              <a href="#" className="flex items-center gap-3 text-lg font-bold hover:text-secondary transition-colors group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-secondary">
                  <Linkedin className="w-5 h-5" />
                </div>
                LinkedIn
              </a>
              <a href="#" className="flex items-center gap-3 text-lg font-bold hover:text-secondary transition-colors group">
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
            <a href="#" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-slate-900 transition-colors">GitHub</a>
            <a href="#" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-slate-900 transition-colors">LinkedIn</a>
            <a href="#" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-slate-900 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>

      <style>{`
        @media print {
          header, footer, #contact, .no-print { display: none !important; }
          body { background: white; }
          main { padding-top: 0; }
          section { border: none !important; box-shadow: none !important; }
          .rounded-3xl { border-radius: 1rem; border: 1px solid #e2e8f0; }
        }
      `}</style>
    </div>
  );
}
