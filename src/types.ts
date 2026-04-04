export type DictionaryCard = {
  id: string;
  title: string;
  category: string;
  parentCategory?: string;
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

export type ComparisonTableRow = {
  label: string;
  values: string[];
};

export type ComparisonGuideItem = {
  name: string;
  aliases: string[];
  clue: string;
  examplePrompt: string;
  exampleAnswer: string;
  relatedCardIds: string[];
};

export type ComparisonPage = {
  id: string;
  section: string;
  title: string;
  table: {
    headers: string[];
    rows: ComparisonTableRow[];
  };
  guideTitle: string;
  guideItems: ComparisonGuideItem[];
  relatedCardIds: string[];
};
