export interface SkillGroup {
  title: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    title: 'Proficient',
    items: ['Python', 'C', 'Microsoft Office Suite', 'LaTeX'],
  },
  {
    title: 'Intermediate',
    items: ['C++', 'Java', 'SQL', 'Git'],
  },
  {
    title: 'Frameworks & Tools',
    items: [
      'Flask',
      'PyTorch',
      'OpenCV',
      'TensorFlow',
      'React',
      'Node.js',
      'Docker',
      'PyQt5',
    ],
  },
  {
    title: 'Domains',
    items: [
      'Machine Learning',
      'Geospatial Analysis',
      'Image Processing',
      'Web Development',
      'Systems Programming',
      'Sentiment Analysis',
    ],
  },
];

export const languages = [
  { level: 'Native', items: ['Greek', 'Armenian'] },
  { level: 'B2', items: ['English'] },
];

export const interests = ['Basketball', 'Chess', 'Hiking'];
