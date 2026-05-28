export interface Stat {
  value: string;
  label: string;
}

export interface Pillar {
  title: string;
  description: string;
}

export interface Track {
  title: string;
  description: string;
  team: 'red' | 'blue';
}

export interface Certification {
  name: string;
  shortName: string;
  description: string;
  advanced?: boolean;
}

export interface Semester {
  number: number;
  year: number;
  subjects: string[];
}

export interface Phase {
  number: string;
  title: string;
  description: string;
}

export interface Lab {
  name: string;
  description: string;
  team: 'red' | 'blue' | 'neutral';
}

export interface ComparisonRow {
  category: string;
  traditional: string;
  cycraft: string;
}

export interface Role {
  domain: string;
  title: string;
}

export interface PlacementMetric {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface AdmissionStep {
  number: string;
  title: string;
  description: string;
}

export interface CampusFeature {
  title: string;
  description: string;
}

export interface Partner {
  name: string;
  logo: string;
}

export interface Specialization {
  name: string;
  icon: string;
}
