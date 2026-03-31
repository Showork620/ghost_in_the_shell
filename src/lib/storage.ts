import type { CardFlagState } from '../types';

export const STORAGE_KEYS = {
  flags: 'awssaa-card-flags',
  filters: 'awssaa-card-filters',
  notes: 'awssaa-card-notes',
};

export const defaultFlags = (): CardFlagState => ({
  reviewLater: false,
  unknown: false,
});
