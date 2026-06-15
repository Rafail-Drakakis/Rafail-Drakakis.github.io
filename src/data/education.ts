export interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  period: string;
}

export interface AwardItem {
  title: string;
  subtitle: string;
  period: string;
  description: string;
}

export const education: EducationItem[] = [
  {
    institution: 'University of Crete, Department of Computer Science',
    degree: 'BSc in Computer Science',
    location: 'Herakleion, Crete',
    period: '2022 – 2026',
  },
];

export const awards: AwardItem[] = [
  {
    title: 'DEPROFOIT Distinction — University of Crete',
    subtitle: 'Computer Science Department',
    period: '2025',
    description:
      'Praise awarded for successfully undertaking teaching assistantship duties during the academic year. Related courses included CS108, CS109, CS208, and CS209.',
  },
  {
    title: 'F.O.R.T.H. Undergraduate Student Scholarship',
    subtitle: 'Foundation for Research and Technology (Signal Processing Laboratory)',
    period: 'July 2025 – September 2026',
    description:
      'Merit-based scholarship awarded to undergraduate students actively contributing to SPL research. Valid through continued productivity and engagement until graduation.',
  },
];
