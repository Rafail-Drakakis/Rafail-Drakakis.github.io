export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
  type: 'work' | 'volunteer';
}

export const experience: ExperienceItem[] = [
  {
    company: 'FORTH-SPL',
    role: 'Software Developer',
    location: 'Heraklion, Crete',
    period: 'April 2024 – September 2026',
    type: 'work',
    bullets: [
      'Engineered an end-to-end dataset pipeline that assembles MEDIC, ECCV M1, and supplemental web imagery into earthquake, flood, and wildfire train/val splits using multithreaded downloads, gdown/aria2, and Pillow-based integrity checks.',
      'Developed a Flask web application with an EfficientNet-B0 classifier for upload-based disaster prediction and map-driven Sentinel-2 before/after change detection, fusing OpenCV diff with patch-level classification and confidence thresholds.',
      'Automated geospatial workflows with Sentinel Hub OAuth, tiled imagery retrieval for large map areas, SQLite/PostgreSQL response caching, and Docker Compose deployment for repeatable analyst workflows.',
    ],
  },
  {
    company: 'Algorithmics Greece',
    role: 'Python Programming Instructor',
    location: 'Remote',
    period: 'November 2024 – Present',
    type: 'work',
    bullets: [
      'Teaching Python to student groups (ages 12–16), focusing on algorithmic thinking and problem-solving.',
      'Supporting hands-on programming projects while adapting content to diverse learning styles and paces.',
    ],
  },
  {
    company: 'University of Crete, Computer Science Department',
    role: 'Teaching Assistant',
    location: 'Heraklion, Greece',
    period: 'October 2023 – June 2024',
    type: 'work',
    bullets: [
      'Supported instruction for CS108, CS109, CS208, and CS209 (English I–IV).',
      'Managed course materials and platforms, and provided feedback on student assignments.',
    ],
  },
  {
    company: 'Region of Crete',
    role: 'Software Developer',
    location: 'Heraklion, Crete',
    period: 'April 2024 – September 2024',
    type: 'volunteer',
    bullets: [
      'Collaborated with a team of three students to design and develop a user-friendly website for "Youth Crete" using HTML, JavaScript, and CSS.',
    ],
  },
  {
    company: 'Career Fair, University of Crete',
    role: 'Main Organizer',
    location: 'Heraklion, Greece',
    period: 'December 2024',
    type: 'volunteer',
    bullets: [
      'Led the organization of the Computer Science Career Fair at Voutes Campus, coordinating a team of twenty students in collaboration with the UoC Career and Liaison Office.',
    ],
  },
  {
    company: 'University of Crete, Computer Science Department',
    role: 'Guide',
    location: 'Heraklion, Greece',
    period: 'January 2024, January 2025',
    type: 'volunteer',
    bullets: [
      "Assisted in welcoming school groups during the Department's School Visits Week.",
      "Guided visitors through activities and presentations, showcasing the department's programs and research.",
    ],
  },
];
