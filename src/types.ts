export type DictionaryCard = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  examPoint: string;
  useCase: string;
  section: string;
  type: 'service' | 'concept';
};

export type CardFlagState = {
  reviewLater: boolean;
  unknown: boolean;
};

export type FlagKey = keyof CardFlagState;
export type FilterFlagKey = FlagKey | 'hasNote' | 'unmarked';

export type FilterMode = 'and' | 'or';
export type MatchMode = 'any' | 'all';
