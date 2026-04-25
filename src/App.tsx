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
    jspdf?: {
      jsPDF: new (options: {
        orientation: "portrait" | "landscape";
        unit: "pt" | "mm" | "cm" | "in";
        format: string;
      }) => {
        internal: {
          pageSize: {
            getWidth: () => number;
            getHeight: () => number;
          };
          getNumberOfPages: () => number;
        };
        getNumberOfPages: () => number;
        addImage: (
          imageData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array,
          format: string,
          x: number,
          y: number,
          w: number,
          h: number,
          alias?: string,
          compression?: string,
          rotation?: number
        ) => void;
        addPage: () => void;
        save: (filename: string) => void;
        setFillColor: (r: number, g?: number, b?: number) => void;
        setDrawColor: (r: number, g?: number, b?: number) => void;
        setTextColor: (r: number, g?: number, b?: number) => void;
        setFont: (fontName: string, fontStyle?: string) => void;
        setFontSize: (size: number) => void;
        setLineWidth: (width: number) => void;
        rect: (x: number, y: number, width: number, height: number, style?: string) => void;
        roundedRect: (x: number, y: number, width: number, height: number, rx: number, ry: number, style?: string) => void;
        line: (x1: number, y1: number, x2: number, y2: number) => void;
        text: (text: string | string[], x: number, y: number, options?: { align?: string }) => void;
        getTextWidth: (text: string) => number;
        splitTextToSize: (text: string, size: number) => string[];
      };
    };
  }
}

const JSPDF_SCRIPT_ID = "jspdf-cdn";
let jsPdfLoader: Promise<NonNullable<Window["jspdf"]>> | null = null;

const loadJsPdf = () => {
  if (window.jspdf?.jsPDF) {
    return Promise.resolve(window.jspdf);
  }

  if (jsPdfLoader) {
    return jsPdfLoader;
  }

  jsPdfLoader = new Promise<NonNullable<Window["jspdf"]>>((resolve, reject) => {
    const existingScript = document.getElementById(JSPDF_SCRIPT_ID) as HTMLScriptElement | null;

    const handleReady = () => {
      if (window.jspdf?.jsPDF) {
        resolve(window.jspdf);
      } else {
        reject(new Error("jsPDF failed to initialize"));
      }
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleReady, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load jsPDF")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = JSPDF_SCRIPT_ID;
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    script.onload = handleReady;
    script.onerror = () => reject(new Error("Failed to load jsPDF"));
    document.head.appendChild(script);
  }).catch((error) => {
    jsPdfLoader = null;
    throw error;
  });

  return jsPdfLoader;
};

const PROJECTS = [
  {
    id: "prey-pros-restaurant",
    title: "Prey Pros Restaurant",
    description: "Modern restaurant website experience with polished presentation, responsive layout, and streamlined browsing for menu and brand storytelling.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Responsive UI"],
    size: "large",
    link: "https://prey-pros-restaurant.vercel.app/"
  },
  {
    id: "dach-luy",
    title: "Dach Luy",
    description: "Portfolio-style web experience focused on clean presentation, responsive design, and accessible frontend delivery across devices.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    tags: ["Frontend", "Accessibility"],
    size: "small",
    link: "https://dach-luy.netlify.app/"
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

const CONTACT_DETAILS = [
  "rady.bmcs@gmail.com",
  "linkedin.com/in/rady-y",
  "github.com/radytrainer",
];

const RESUME_STRENGTHS = [
  "Scalable component architecture",
  "Cross-functional product collaboration",
  "Usability and visual polish",
  "Clean handoff from design to code",
];

const RESUME_HIGHLIGHTS = [
  "Built accessible interfaces that balanced product goals, maintainability, and visual quality.",
  "Created reusable UI systems that improved development speed and consistency across screens.",
  "Delivered responsive experiences for dashboards, workflows, and collaboration-focused products.",
  "Contributed strong frontend craftsmanship across interaction, layout, and performance optimization.",
];

const RESUME_FOCUS_AREAS = [
  { label: "Frontend", value: "React, TypeScript, Tailwind" },
  { label: "Delivery", value: "Accessible, responsive, production-ready UI" },
  { label: "Environment", value: "Remote, hybrid, product teams" },
];

const RESUME_SUMMARY =
  "Frontend engineer with 5+ years of experience building accessible, high-performance digital products. Strong in React, TypeScript, design systems, and turning product goals into polished, production-ready interfaces.";

const RESUME_PROFILE =
  "I design and build frontend experiences that are fast, intuitive, and maintainable. My work centers on thoughtful interaction design, reusable systems, and close collaboration with product and design partners to deliver interfaces that feel refined in both code and UI.";

const ensureJsPdf = async () => {
  await loadJsPdf();

  const jsPdf = window.jspdf?.jsPDF;
  if (!jsPdf) {
    throw new Error("jsPDF unavailable");
  }

  return jsPdf;
};

const getBase64Image = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context failed"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = url;
  });
};

const createResumePdf = async () => {
  const JsPDF = await ensureJsPdf();
  const profileImageUrl = `${import.meta.env.BASE_URL}profile-image.png`;
  let profileBase64 = "";
  
  try {
    profileBase64 = await getBase64Image(profileImageUrl);
  } catch (e) {
    console.warn("Could not load profile image for PDF", e);
  }

  const doc = new JsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - 46;
  let cursorY = 52;

  const drawPageChrome = (showCompactHeader = false) => {
    const pageNumber = doc.internal.getNumberOfPages();
    
    // Top Accent Bar
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(margin, 24, contentWidth, 6, "F");
    doc.setFillColor(0, 88, 190); // Blue-600
    doc.rect(margin, 24, contentWidth * 0.4, 6, "F");

    if (showCompactHeader) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text("RADY Y", margin, 46);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("Senior Frontend Engineer", pageWidth - margin, 46, { align: "right" });
      
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 52, pageWidth - margin, 52);
      cursorY = 75;
    } else {
      doc.setTextColor(0, 88, 190);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("SENIOR FRONTEND ENGINEER", margin, 55);

      cursorY = 82;
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text("Rady Y", margin, cursorY);

      // Contact & Links Row
      cursorY += 18;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      
      const contactInfo = CONTACT_DETAILS.join("   •   ");
      doc.text(contactInfo, margin, cursorY);

      // Profile Image
      if (profileBase64) {
        const imgSize = 70;
        const imgX = pageWidth - margin - imgSize;
        const imgY = 42;
        
        // Draw image
        try {
          // Circular clipping is hard in jsPDF manual drawing, so we use a rounded rect if supported or just addImage
          // To make it look nice, we'll draw a border circle
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(1);
          // roundedRect can simulate a circle if radius is half of size
          doc.roundedRect(imgX, imgY, imgSize, imgSize, imgSize / 2, imgSize / 2, "D");
          doc.addImage(profileBase64, "PNG", imgX + 2, imgY + 2, imgSize - 4, imgSize - 4);
        } catch (e) {
          console.error("Failed to add image to PDF", e);
        }
      }

      // Summary
      cursorY += 28;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      const summaryLines = doc.splitTextToSize(RESUME_SUMMARY, contentWidth);
      doc.text(summaryLines, margin, cursorY);
      
      cursorY += (summaryLines.length * 14) + 15;
      
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(1);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 30;
    }

    // Page Number Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 25, { align: "center" });
  };

  const addPage = () => {
    doc.addPage();
    drawPageChrome(true);
  };

  const ensureSpace = (needed: number): boolean => {
    if (cursorY + needed > bottomLimit) {
      addPage();
      return true; // Page was added
    }
    return false;
  };

  const drawSectionTitle = (title: string) => {
    ensureSpace(35);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    
    // Draw heading with a small accent
    doc.setFillColor(0, 88, 190);
    doc.rect(margin, cursorY - 10, 3, 12, "F");
    doc.text(title.toUpperCase(), margin + 10, cursorY);
    
    cursorY += 18;
  };

  const drawParagraph = (text: string, width = contentWidth, fontSize = 10, color = [71, 85, 105]) => {
    const lines = doc.splitTextToSize(text, width) as string[];
    
    lines.forEach((line) => {
      ensureSpace(14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(line, margin, cursorY);
      cursorY += 14;
    });
    cursorY += 4;
  };

  const drawBulletList = (items: string[], width = contentWidth) => {
    items.forEach((item) => {
      const lines = doc.splitTextToSize(item, width - 15) as string[];
      
      // Ensure space for at least the first line and the bullet
      ensureSpace(lines.length * 14 + 2);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(0, 88, 190);
      doc.text("•", margin + 2, cursorY);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      
      lines.forEach((line, idx) => {
        if (idx > 0) ensureSpace(14);
        doc.text(line, margin + 15, cursorY);
        cursorY += 14;
      });
      cursorY += 2;
    });
    cursorY += 6;
  };

  const drawTagRow = (items: string[]) => {
    const paddingX = 10;
    const itemHeight = 18;
    const gap = 6;
    let x = margin;

    items.forEach((item) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const itemWidth = doc.getTextWidth(item) + paddingX * 2;

      if (x + itemWidth > pageWidth - margin) {
        x = margin;
        cursorY += itemHeight + gap;
      }

      const pageChanged = ensureSpace(itemHeight + 8);
      if (pageChanged) {
        x = margin; // Reset X on new page
      }
      
      doc.setFillColor(248, 251, 255);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(x, cursorY - 11, itemWidth, itemHeight, 4, 4, "FD");
      doc.setTextColor(15, 23, 42);
      doc.text(item, x + paddingX, cursorY + 2);
      x += itemWidth + gap;
    });

    cursorY += itemHeight + 15;
  };

  const drawProjectCard = (title: string, tags: string[], description: string, link: string) => {
    const titleLines = doc.splitTextToSize(title, contentWidth - 35) as string[];
    const tagLine = tags.join("  •  ");
    const tagLines = doc.splitTextToSize(tagLine, contentWidth - 35) as string[];
    const descLines = doc.splitTextToSize(description, contentWidth - 35) as string[];
    const linkLines = doc.splitTextToSize(link, contentWidth - 35) as string[];
    
    const blockHeight =
      15 +
      titleLines.length * 14 +
      4 +
      tagLines.length * 11 +
      8 +
      descLines.length * 13 +
      8 +
      linkLines.length * 10 +
      10;

    ensureSpace(blockHeight + 10);

    doc.setFillColor(252, 254, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, cursorY - 12, contentWidth, blockHeight, 8, 8, "FD");
    
    doc.setFillColor(0, 88, 190);
    doc.rect(margin, cursorY - 12, 3, blockHeight, "F");

    let innerY = cursorY + 2;
    const textX = margin + 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    titleLines.forEach(line => {
      doc.text(line, textX, innerY);
      innerY += 14;
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(0, 88, 190);
    tagLines.forEach(line => {
      doc.text(line.toUpperCase(), textX, innerY);
      innerY += 11;
    });
    innerY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    descLines.forEach(line => {
      doc.text(line, textX, innerY);
      innerY += 13;
    });
    innerY += 5;

    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    linkLines.forEach(line => {
      doc.text(line, textX, innerY);
      innerY += 10;
    });

    cursorY += blockHeight + 10;
  };

  drawPageChrome();

  drawSectionTitle("Professional Summary");
  drawParagraph(RESUME_PROFILE);

  drawSectionTitle("Core Skills");
  drawTagRow([
    ...SKILLS.map((skill) => skill.name),
    "Accessibility",
    "Design Systems",
    "Responsive UI",
    "Performance",
  ]);

  drawSectionTitle("Strengths");
  drawBulletList(RESUME_STRENGTHS);

  drawSectionTitle("Focus Areas");
  RESUME_FOCUS_AREAS.forEach((item) => {
    ensureSpace(34);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label.toUpperCase(), margin, cursorY);
    cursorY += 13;
    drawParagraph(item.value, contentWidth, 10);
  });

  drawSectionTitle("Selected Projects");
  PROJECTS.forEach((project) => {
    drawProjectCard(project.title, project.tags, project.description, project.link);
  });

  drawSectionTitle("Professional Highlights");
  drawBulletList(RESUME_HIGHLIGHTS);

  doc.save("Rady_Y_Final.pdf");
};

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isExporting, setIsExporting] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installHelpOpen, setInstallHelpOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [hasDismissedBanner, setHasDismissedBanner] = useState(false);

  const isIos = /iphone|ipad|ipod/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : ""
  );
  const isMobile = /android|iphone|ipad|ipod/i.test(
    typeof navigator !== "undefined" ? navigator.userAgent : ""
  );

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

    // Auto-show install banner after 3 seconds on mobile if not already installed
    if (isMobile && !isStandalone && !hasDismissedBanner) {
      const timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isMobile, isStandalone, hasDismissedBanner]);

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
    setPdfError(null);
    setIsExporting(true);

    try {
      await createResumePdf();
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
          <button 
            onClick={() => setInstallHelpOpen(false)}
            className="mt-4 w-full py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-900"
          >
            Got it
          </button>
        </div>
      )}

      {/* Floating Install Prompt (Mobile Only) */}
      <AnimatePresence>
        {showInstallBanner && !isStandalone && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-[60] md:hidden"
          >
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Install Portfolio App</p>
                  <p className="text-xs text-slate-400">Get the best experience locally</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowInstallBanner(false);
                    setHasDismissedBanner(true);
                  }}
                  className="px-3 py-2 text-xs font-bold text-slate-400"
                >
                  Later
                </button>
                <button
                  onClick={() => {
                    handleInstallApp();
                    setShowInstallBanner(false);
                  }}
                  className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Install
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                src={`${import.meta.env.BASE_URL}profile-image.png`}
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
