import type { CardFlagState } from '../types';

export const STORAGE_KEYS = {
  flags: 'awssaa-card-flags',
  filters: 'awssaa-card-filters',
};

export const defaultFlags = (): CardFlagState => ({
  reviewLater: false,
  unknown: false,
});
