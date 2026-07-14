export interface Project {
  slug: string;
  title: string;
  description: string;
  github?: string;
  tags: string[];
  featured: boolean;
  gradient: string;
}

const GITHUB_BASE = 'https://github.com/Rafail-Drakakis';

/** Root-relative path for a project screenshot in `public/images/projects/`. */
export function projectImagePath(slug: string): string {
  return `${import.meta.env.BASE_URL}images/projects/${slug}.webp`;
}

export const projects: Project[] = [
  {
    slug: 'pylearn',
    title: 'PyLearn',
    description:
      'Multi-tenant Python teaching platform for coding schools — curriculum authoring, Monaco-based student workspace, Docker-sandboxed code execution, progress tracking, and Stripe billing.',
    tags: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Docker', 'Stripe'],
    featured: true,
    gradient: 'from-yellow-500 to-amber-800',
  },
  {
    slug: 'finora',
    title: 'Finora',
    description:
      'Personal finance SaaS for tracking accounts, transactions, budgets, bills, goals, and investments — with household sharing, CSV/OFX import, Stripe billing, and a superadmin portal.',
    tags: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Stripe', 'Docker'],
    featured: true,
    gradient: 'from-emerald-600 to-teal-900',
  },
  {
    slug: 'natural-disaster-classifier',
    title: 'Natural Disaster Classifier',
    description:
      'ML web app to classify earthquake, flood, and wildfire events from photos and Sentinel-2 satellite imagery, with map-based before/after change detection.',
    tags: ['Python', 'Flask', 'PyTorch', 'OpenCV', 'Docker'],
    featured: true,
    gradient: 'from-teal-600 to-emerald-800',
  },
  {
    slug: 'media-server',
    title: 'Media Server',
    description:
      'Self-hosted personal streaming service with library scanning, JWT authentication, watch progress, subtitles, and a React frontend.',
    tags: ['Node.js', 'React', 'Express', 'SQLite', 'JWT'],
    featured: true,
    gradient: 'from-violet-600 to-purple-900',
  },
  {
    slug: 'linux-security-suite',
    title: 'Linux Security Suite',
    description:
      'Linux security toolkit with syscall tracing via ptrace, PCAP network analysis, and LD_PRELOAD activity logging.',
    github: `${GITHUB_BASE}/linux-security-suite`,
    tags: ['C', 'Linux', 'libpcap', 'OpenSSL'],
    featured: true,
    gradient: 'from-red-600 to-orange-900',
  },
  {
    slug: 'medical-document-retrieval',
    title: 'Medical Document Retrieval',
    description:
      'Information retrieval system indexing PMC articles with TF-IDF inverted index, VSM retrieval, and TREC-style evaluation GUIs.',
    github: `${GITHUB_BASE}/Medical-document-retrieval`,
    tags: ['Java', 'Swing', 'Information Retrieval'],
    featured: true,
    gradient: 'from-blue-600 to-indigo-900',
  },
  {
    slug: 'coins-collection',
    title: 'Coin Vault',
    description:
      'Full-stack coin collection app with dashboard analytics, CRUD management, filters, and a world choropleth map.',
    tags: ['React', 'TypeScript', 'Express', 'SQLite'],
    featured: true,
    gradient: 'from-amber-500 to-yellow-800',
  },
  {
    slug: 'microtcp',
    title: 'microTCP',
    description:
      'Reliable TCP-like protocol over UDP for IoT, featuring handshake, flow control, congestion control, and retransmissions.',
    github: `${GITHUB_BASE}/microTCP`,
    tags: ['C', 'UDP', 'Networking'],
    featured: true,
    gradient: 'from-cyan-600 to-blue-900',
  },
  {
    slug: 'alpha-compiler',
    title: 'Alpha Compiler',
    description:
      'Educational multi-phase compiler for the Alpha language with lexer, parser, quads, and stack VM code generation.',
    github: `${GITHUB_BASE}/Alpha-compiler`,
    tags: ['C', 'Flex', 'Bison'],
    featured: true,
    gradient: 'from-slate-600 to-slate-900',
  },
  {
    slug: 'to-do-app',
    title: 'To-Do App',
    description:
      'Production-style Flask todo application with dark mode, JSON API, migrations, rate limiting, tests, and Docker deployment.',
    github: `${GITHUB_BASE}/To-do-app`,
    tags: ['Python', 'Flask', 'SQLAlchemy', 'Docker', 'pytest'],
    featured: true,
    gradient: 'from-pink-600 to-rose-900',
  },
  {
    slug: 'event-management-system',
    title: 'Event Management System',
    description:
      'Full-stack booking platform with user authentication, event creation, ticket reservations, and revenue statistics.',
    github: `${GITHUB_BASE}/Event-management-system`,
    tags: ['Python', 'Flask', 'SQLite'],
    featured: false,
    gradient: 'from-green-600 to-teal-900',
  },
  {
    slug: 'reviews-classifier',
    title: 'Reviews Classifier',
    description:
      'IMDb sentiment classification comparing classical ML and deep learning models with a comprehensive LaTeX report.',
    github: `${GITHUB_BASE}/Reviews-classifier`,
    tags: ['Python', 'scikit-learn', 'PyTorch', 'NLTK'],
    featured: false,
    gradient: 'from-lime-600 to-green-900',
  },
  {
    slug: 'linux-shell',
    title: 'Linux Shell',
    description:
      'Custom Unix shell with pipes, redirection, variables, control flow, command history, and built-in commands.',
    github: `${GITHUB_BASE}/linux-shell`,
    tags: ['C', 'Shell'],
    featured: false,
    gradient: 'from-gray-600 to-gray-900',
  },
  {
    slug: 'media-downloader',
    title: 'Media Downloader',
    description:
      'PyQt5 GUI for batch multimedia downloads using yt_dlp with progress tracking and format selection.',
    github: `${GITHUB_BASE}/Media-downloader`,
    tags: ['Python', 'PyQt5', 'yt_dlp'],
    featured: false,
    gradient: 'from-fuchsia-600 to-purple-900',
  },
  {
    slug: 'midus-ordinal-analysis',
    title: 'MIDUS Ordinal Analysis',
    description:
      'Exploratory analysis and ordinal probit modeling of MIDUS loneliness and depression survey data.',
    github: `${GITHUB_BASE}/MIDUS-Ordinal-Analysis`,
    tags: ['Python', 'pandas', 'statsmodels'],
    featured: false,
    gradient: 'from-indigo-600 to-violet-900',
  },
  {
    slug: 'sorry-game',
    title: 'Sorry! Game',
    description:
      'Java Swing implementation of the Sorry! board game using MVC architecture with save/load support.',
    github: `${GITHUB_BASE}/Sorry_game`,
    tags: ['Java', 'Swing', 'MVC'],
    featured: false,
    gradient: 'from-red-500 to-pink-900',
  },
  {
    slug: 'simple-streaming-service',
    title: 'Simple Streaming Service',
    description:
      'C simulation of a streaming service using linked lists and event-driven commands.',
    github: `${GITHUB_BASE}/Simple-streaming-service`,
    tags: ['C', 'Data Structures'],
    featured: false,
    gradient: 'from-orange-600 to-red-900',
  },
  {
    slug: 'useful-scripts',
    title: 'Useful Scripts',
    description:
      'Collection of shell and Python scripts for Git/SSH setup, Linux system configuration, and automation.',
    github: `${GITHUB_BASE}/Useful-scripts`,
    tags: ['Bash', 'Python'],
    featured: false,
    gradient: 'from-stone-600 to-stone-900',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const moreProjects = projects.filter((p) => !p.featured);
