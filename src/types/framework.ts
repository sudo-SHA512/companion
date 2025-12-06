export interface FrameworkControl {
  id: string;
  clause: string;
  title: string;
  isoText: string;
  description: string;
  purpose: string;
  questions: string[];
  correctiveAction?: string;
}

export interface FrameworkSection {
  id: string;
  title: string;
  controls: FrameworkControl[];
}

export interface FrameworkGroup {
  id: string;
  title: string;
  sections: FrameworkSection[];
}

export interface Framework {
  id: string;
  name: string;
  shortName: string;
  description: string;
  version: string;
  groups: FrameworkGroup[];
}

export type SupportedLanguage = 'de' | 'en';

export interface FrameworkMeta {
  id: string;
  name: string;
  shortName: string;
  description: string;
  version: string;
}
