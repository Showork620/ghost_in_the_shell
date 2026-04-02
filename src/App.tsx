import { useEffect, useState } from 'react';
import dictionaryData from './data/generated/dictionary.json';
import comparisonPagesData from './data/generated/comparison-pages.json';
import { Flashcard } from './components/Flashcard';
import { ComparisonOverlay } from './components/ComparisonOverlay';
import { STORAGE_KEYS, defaultFlags } from './lib/storage';
import './styles.css';
import type {
  CardFlagState,
  ComparisonPage,
  DictionaryCard,
  FilterFlagKey,
  FilterMode,
  FlagKey,
  MatchMode,
} from './types';

type PersistedFilters = {
  query: string;
  categories: string[];
  tags: string[];
  flags: FilterFlagKey[];
  groupMode: FilterMode;
  tagMode: MatchMode;
  flagMode: MatchMode;
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const cards = dictionaryData as DictionaryCard[];
const comparisonPages = comparisonPagesData as ComparisonPage[];
const allCategories = [...new Set(cards.map((card) => card.category))].sort((left, right) =>
  left.localeCompare(right, 'ja'),
);
const allTags = [...new Set(cards.flatMap((card) => card.tags))].sort((left, right) =>
  left.localeCompare(right, 'ja'),
);
const comparisonPagesByCardId = comparisonPages.reduce<Record<string, ComparisonPage[]>>(
  (accumulator, page) => {
    page.relatedCardIds.forEach((cardId) => {
      accumulator[cardId] ??= [];
      accumulator[cardId].push(page);
    });

    return accumulator;
  },
  {},
);
const defaultFilters: PersistedFilters = {
  query: '',
  categories: [],
  tags: [],
  flags: [],
  groupMode: 'and',
  tagMode: 'any',
  flagMode: 'any',
};

function App() {
  const [flagState, setFlagState] = useState<Record<string, CardFlagState>>({});
  const [noteState, setNoteState] = useState<Record<string, string>>({});
  const [query, setQuery] = useState(defaultFilters.query);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(defaultFilters.categories);
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultFilters.tags);
  const [selectedFlags, setSelectedFlags] = useState<FilterFlagKey[]>(defaultFilters.flags);
  const [groupMode, setGroupMode] = useState<FilterMode>(defaultFilters.groupMode);
  const [tagMode, setTagMode] = useState<MatchMode>(defaultFilters.tagMode);
  const [flagMode, setFlagMode] = useState<MatchMode>(defaultFilters.flagMode);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installStatus, setInstallStatus] = useState<'ready' | 'dismissed' | 'accepted'>('ready');
  const [isHydrated, setIsHydrated] = useState(false);
  const [isHeroOpen, setIsHeroOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeComparisonPageId, setActiveComparisonPageId] = useState<string | null>(null);
  const [isComparisonNamesHidden, setIsComparisonNamesHidden] = useState(true);
  const activeComparisonPage =
    comparisonPages.find((page) => page.id === activeComparisonPageId) ?? null;

  useEffect(() => {
    const savedFlags = window.localStorage.getItem(STORAGE_KEYS.flags);
    const savedFilters = window.localStorage.getItem(STORAGE_KEYS.filters);
    const savedNotes = window.localStorage.getItem(STORAGE_KEYS.notes);

    if (savedFlags) {
      setFlagState(JSON.parse(savedFlags) as Record<string, CardFlagState>);
    }

    if (savedNotes) {
      setNoteState(JSON.parse(savedNotes) as Record<string, string>);
    }

    if (savedFilters) {
      const parsed = JSON.parse(savedFilters) as Partial<PersistedFilters>;
      setQuery(parsed.query ?? defaultFilters.query);
      setSelectedCategories(parsed.categories ?? defaultFilters.categories);
      setSelectedTags(parsed.tags ?? defaultFilters.tags);
      setSelectedFlags(parsed.flags ?? defaultFilters.flags);
      setGroupMode(parsed.groupMode ?? defaultFilters.groupMode);
      setTagMode(parsed.tagMode ?? defaultFilters.tagMode);
      setFlagMode(parsed.flagMode ?? defaultFilters.flagMode);
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.flags, JSON.stringify(flagState));
  }, [flagState, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(noteState));
  }, [isHydrated, noteState]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const filters: PersistedFilters = {
      query,
      categories: selectedCategories,
      tags: selectedTags,
      flags: selectedFlags,
      groupMode,
      tagMode,
      flagMode,
    };

    window.localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(filters));
  }, [flagMode, groupMode, isHydrated, query, selectedCategories, selectedFlags, selectedTags, tagMode]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsHeroOpen(false);
        setIsFiltersOpen(false);
        setActiveComparisonPageId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isHeroOpen || isFiltersOpen || activeComparisonPageId ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [activeComparisonPageId, isFiltersOpen, isHeroOpen]);

  useEffect(() => {
    setIsComparisonNamesHidden(true);
  }, [activeComparisonPageId]);

  const filteredCards = cards.filter((card) => {
    const cardFlags = flagState[card.id] ?? defaultFlags();
    const hasNote = (noteState[card.id] ?? '').trim().length > 0;
    const isUnmarked = !cardFlags.reviewLater && !cardFlags.unknown && !hasNote;
    const searchableText = [
      card.title,
      card.category,
      card.section,
      card.summary,
      card.examPoint,
      card.useCase,
      ...card.tags,
    ]
      .join(' ')
      .toLowerCase();

    const queryMatches =
      query.trim().length === 0 || searchableText.includes(query.trim().toLowerCase());

    if (!queryMatches) {
      return false;
    }

    const activeResults: boolean[] = [];

    if (selectedCategories.length > 0) {
      activeResults.push(selectedCategories.includes(card.category));
    }

    if (selectedTags.length > 0) {
      activeResults.push(
        tagMode === 'all'
          ? selectedTags.every((tag) => card.tags.includes(tag))
          : selectedTags.some((tag) => card.tags.includes(tag)),
      );
    }

    if (selectedFlags.length > 0) {
      const matchesFlag = (flag: FilterFlagKey) =>
        flag === 'hasNote' ? hasNote : flag === 'unmarked' ? isUnmarked : cardFlags[flag];

      activeResults.push(
        flagMode === 'all'
          ? selectedFlags.every((flag) => matchesFlag(flag))
          : selectedFlags.some((flag) => matchesFlag(flag)),
      );
    }

    if (activeResults.length === 0) {
      return true;
    }

    return groupMode === 'and'
      ? activeResults.every(Boolean)
      : activeResults.some(Boolean);
  });

  const stats = {
    total: cards.length,
    filtered: filteredCards.length,
    reviewLater: cards.filter((card) => (flagState[card.id] ?? defaultFlags()).reviewLater).length,
    unknown: cards.filter((card) => (flagState[card.id] ?? defaultFlags()).unknown).length,
  };
  const activeFilterCount =
    selectedCategories.length + selectedTags.length + selectedFlags.length + (query.trim() ? 1 : 0);

  function toggleValue<T extends string>(currentValues: T[], value: T) {
    return currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
  }

  const resetFilters = () => {
    setQuery(defaultFilters.query);
    setSelectedCategories(defaultFilters.categories);
    setSelectedTags(defaultFilters.tags);
    setSelectedFlags(defaultFilters.flags);
    setGroupMode(defaultFilters.groupMode);
    setTagMode(defaultFilters.tagMode);
    setFlagMode(defaultFilters.flagMode);
  };

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    setInstallStatus(result.outcome);
    setInstallPrompt(null);
  };

  return (
    <div className="app-shell">
      <div className="topbar-wrap">
        <header className="topbar">
          <button
            type="button"
            className={`topbar-button ${isHeroOpen ? 'is-active' : ''}`}
            onClick={() => {
              setIsHeroOpen((current) => !current);
              setIsFiltersOpen(false);
            }}
            aria-expanded={isHeroOpen}
            aria-controls="hero-overlay"
          >
            Hero
          </button>
          <div className="topbar-title">
            <span className="eyebrow">AWS SAA 2026</span>
            <strong>ポケット単語帳</strong>
          </div>
          <button
            type="button"
            className={`topbar-button ${isFiltersOpen ? 'is-active' : ''}`}
            onClick={() => {
              setIsFiltersOpen((current) => !current);
              setIsHeroOpen(false);
            }}
            aria-expanded={isFiltersOpen}
            aria-controls="filters-overlay"
          >
            絞り込み
            {activeFilterCount > 0 && <span className="topbar-badge">{activeFilterCount}</span>}
          </button>
        </header>

        {isHeroOpen && (
          <div className="overlay-screen" role="dialog" aria-modal="true" aria-labelledby="hero-title">
            <button
              type="button"
              className="overlay-backdrop"
              aria-label="Hero を閉じる"
              onClick={() => setIsHeroOpen(false)}
            />
            <section className="overlay-panel hero-overlay-panel" id="hero-overlay">
              <button
                type="button"
                className="overlay-close overlay-close-corner"
                aria-label="Hero を閉じる"
                onClick={() => setIsHeroOpen(false)}
              >
                ×
              </button>
              <div className="overlay-header">
                <div>
                  <p className="eyebrow">Overview</p>
                  <h2 id="hero-title">Hero</h2>
                </div>
              </div>

              <div className="hero">
                <div className="hero-copy">
                  <p className="eyebrow">AWS SAA 2026</p>
                  <h1>ポケット単語帳</h1>
                  <p className="hero-text">
                    <code>study-memo/AWSSAA_Dictionary_2026.md</code> をカード化し、スマホで反復できるようにした学習用PWAです。
                  </p>
                </div>

                <div className="hero-stats">
                  <div className="stat-card">
                    <span className="stat-label">全カード</span>
                    <strong>{stats.total}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">表示中</span>
                    <strong>{stats.filtered}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">後で確認</span>
                    <strong>{stats.reviewLater}</strong>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">知らない</span>
                    <strong>{stats.unknown}</strong>
                  </div>
                </div>

                {comparisonPages.length > 0 && (
                  <div className="hero-comparisons">
                    <h3 style={{ marginTop: '8px', marginBottom: '12px', fontSize: '1.1rem' }}>
                      比較チートシート一覧
                    </h3>
                    <div className="comparison-link-list">
                      {comparisonPages.map((page) => (
                        <button
                          key={page.id}
                          type="button"
                          className="comparison-link-button"
                          onClick={() => {
                            setIsHeroOpen(false);
                            setActiveComparisonPageId(page.id);
                          }}
                        >
                          <span className="comparison-link-title">{page.title}</span>
                          <span className="comparison-link-section">{page.section}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {installPrompt && installStatus === 'ready' && (
                  <button type="button" className="install-button" onClick={handleInstall}>
                    ホーム画面に追加
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {isFiltersOpen && (
          <div className="overlay-screen" role="dialog" aria-modal="true" aria-labelledby="filters-title">
            <button
              type="button"
              className="overlay-backdrop"
              aria-label="絞り込みを閉じる"
              onClick={() => setIsFiltersOpen(false)}
            />
            <aside className="overlay-panel filters-overlay-panel filters-panel" id="filters-overlay">
          <div className="overlay-header filters-overlay-header">
            <div className="overlay-title-group">
              <p className="eyebrow">Filter Studio</p>
              <div className="overlay-title-line">
                <h2 id="filters-title">絞り込み</h2>
              </div>
            </div>
            <div className="overlay-actions">
              <span className="result-count-chip">表示 {stats.filtered} 件</span>
              <button type="button" className="ghost-button" onClick={resetFilters}>
                リセット
              </button>
              <button
                type="button"
                className="overlay-close"
                aria-label="絞り込みを閉じる"
                onClick={() => setIsFiltersOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          <label className="search-field">
            <span>検索</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="サービス名、タグ、説明文で検索"
            />
          </label>

          <section className="filter-group">
            <div className="group-header">
              <h3>グループ結合</h3>
              <div className="segmented-control">
                <button
                  type="button"
                  className={groupMode === 'and' ? 'is-active' : ''}
                  onClick={() => setGroupMode('and')}
                >
                  AND
                </button>
                <button
                  type="button"
                  className={groupMode === 'or' ? 'is-active' : ''}
                  onClick={() => setGroupMode('or')}
                >
                  OR
                </button>
              </div>
            </div>
            <p className="helper-text">
              カテゴリ・タグ・フラグの各グループを、すべて満たすか、どれかを満たすかで切り替えます。
            </p>
          </section>

          <section className="filter-group">
            <div className="group-header">
              <h3>フラグ</h3>
              <div className="segmented-control compact">
                <button
                  type="button"
                  className={flagMode === 'any' ? 'is-active' : ''}
                  onClick={() => setFlagMode('any')}
                >
                  OR
                </button>
                <button
                  type="button"
                  className={flagMode === 'all' ? 'is-active' : ''}
                  onClick={() => setFlagMode('all')}
                >
                  AND
                </button>
              </div>
            </div>
            <div className="chip-grid">
              {[
                ['reviewLater', '後で確認'],
                ['unknown', '知らない'],
                ['hasNote', 'メモあり'],
                ['unmarked', 'ノーマーク'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={selectedFlags.includes(key as FilterFlagKey) ? 'chip is-active' : 'chip'}
                  onClick={() =>
                    setSelectedFlags(toggleValue(selectedFlags, key as FilterFlagKey))
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="filter-group">
            <div className="group-header">
              <h3>タグ</h3>
              <div className="segmented-control compact">
                <button
                  type="button"
                  className={tagMode === 'any' ? 'is-active' : ''}
                  onClick={() => setTagMode('any')}
                >
                  OR
                </button>
                <button
                  type="button"
                  className={tagMode === 'all' ? 'is-active' : ''}
                  onClick={() => setTagMode('all')}
                >
                  AND
                </button>
              </div>
            </div>
            <div className="chip-grid">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={selectedTags.includes(tag) ? 'chip is-active' : 'chip'}
                  onClick={() => setSelectedTags(toggleValue(selectedTags, tag))}
                >
                  {tag.replace('#', '')}
                </button>
              ))}
            </div>
          </section>

          <section className="filter-group">
            <div className="group-header">
              <h3>カテゴリ</h3>
              <span className="helper-chip">{selectedCategories.length}件選択</span>
            </div>
            <div className="chip-grid">
              {allCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={selectedCategories.includes(category) ? 'chip is-active' : 'chip'}
                  onClick={() => setSelectedCategories(toggleValue(selectedCategories, category))}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        </aside>
          </div>
        )}
      </div>

      <main className="layout is-full">
        <section className="cards-area" aria-live="polite">
          {filteredCards.length === 0 ? (
            <div className="empty-state">
              <h2>一致するカードがありません</h2>
              <p>検索語かフィルタ条件を緩めてください。</p>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredCards.map((card) => (
                <Flashcard
                  key={card.id}
                  card={card}
                  comparisonPages={comparisonPagesByCardId[card.id] ?? []}
                  flags={flagState[card.id] ?? defaultFlags()}
                  note={noteState[card.id] ?? ''}
                  onOpenComparison={(comparisonPageId) =>
                    setActiveComparisonPageId(comparisonPageId)
                  }
                  onFlagChange={(cardId, nextFlags) =>
                    setFlagState((current) => ({ ...current, [cardId]: nextFlags }))
                  }
                  onNoteChange={(cardId, nextNote) =>
                    setNoteState((current) => ({ ...current, [cardId]: nextNote }))
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {activeComparisonPage && (
        <ComparisonOverlay
          page={activeComparisonPage}
          isServiceNamesHidden={isComparisonNamesHidden}
          onToggleServiceNames={() => setIsComparisonNamesHidden((current) => !current)}
          onClose={() => setActiveComparisonPageId(null)}
        />
      )}
    </div>
  );
}

export default App;
