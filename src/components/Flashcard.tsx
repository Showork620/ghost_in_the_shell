import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import type { CardFlagState, ComparisonPage, DictionaryCard } from '../types';

type FlashcardProps = {
  card: DictionaryCard;
  flags: CardFlagState;
  note: string;
  comparisonPages: Pick<ComparisonPage, 'id' | 'section' | 'title'>[];
  onOpenComparison: (comparisonPageId: string) => void;
  onFlagChange: (cardId: string, nextFlags: CardFlagState) => void;
  onNoteChange: (cardId: string, nextNote: string) => void;
};

const flagMeta = [
  { key: 'reviewLater', label: '後で確認' },
  { key: 'unknown', label: '知らない' },
] as const;

export function Flashcard({
  card,
  flags,
  note,
  comparisonPages,
  onOpenComparison,
  onFlagChange,
  onNoteChange,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedField, setCopiedField] = useState<'title' | 'examPoint' | null>(null);
  const [cardHeight, setCardHeight] = useState<number>(220);
  const shellRef = useRef<HTMLElement | null>(null);
  const frontContentRef = useRef<HTMLSpanElement | null>(null);
  const shouldScrollIntoViewRef = useRef(false);
  const dragStateRef = useRef({ x: 0, y: 0, moved: false });

  function measureFrontHeight() {
    if (!frontContentRef.current) {
      return 220;
    }

    return Math.ceil(frontContentRef.current.scrollHeight + 40);
  }

  function measureBackHeight(frontHeight: number) {
    const topbar = document.querySelector('.topbar-wrap') as HTMLElement | null;
    const topbarHeight = topbar?.getBoundingClientRect().height ?? 0;
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - topbarHeight - 32;

    return Math.max(frontHeight, availableHeight);
  }

  useLayoutEffect(() => {
    const frontHeight = measureFrontHeight();
    setCardHeight(isFlipped ? measureBackHeight(frontHeight) : frontHeight);
  }, [flags.reviewLater, flags.unknown, isFlipped]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !frontContentRef.current || isFlipped) {
      return;
    }

    const updateFrontHeight = () => {
      setCardHeight(measureFrontHeight());
    };

    const resizeObserver = new ResizeObserver(() => updateFrontHeight());
    resizeObserver.observe(frontContentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [flags.reviewLater, flags.unknown, isFlipped]);

  useEffect(() => {
    if (!isFlipped || !shouldScrollIntoViewRef.current || !shellRef.current) {
      return;
    }

    shouldScrollIntoViewRef.current = false;

    const frameId = window.requestAnimationFrame(() => {
      const topbar = document.querySelector('.topbar-wrap') as HTMLElement | null;
      const topbarHeight = topbar?.getBoundingClientRect().height ?? 0;
      const top = window.scrollY + shellRef.current!.getBoundingClientRect().top - topbarHeight - 12;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: 'smooth',
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isFlipped]);

  async function handleCopy(
    event: MouseEvent<HTMLButtonElement>,
    field: 'title' | 'examPoint',
    text: string,
  ) {
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((current) => (current === field ? null : current));
      }, 1200);
    } catch (error) {
      console.error('copy failed', error);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    dragStateRef.current = {
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const deltaX = Math.abs(event.clientX - dragStateRef.current.x);
    const deltaY = Math.abs(event.clientY - dragStateRef.current.y);

    if (deltaX > 8 || deltaY > 8) {
      dragStateRef.current.moved = true;
    }
  }

  function handleCardClick(event: MouseEvent<HTMLDivElement>) {
    if (dragStateRef.current.moved) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest('button, input, textarea, label')) {
      return;
    }

    shouldScrollIntoViewRef.current = !isFlipped;
    setIsFlipped((current) => !current);
  }

  return (
    <article
      ref={shellRef}
      className={`flashcard-shell ${isFlipped ? 'is-flipped' : 'is-front'}`}
      style={{ height: `${cardHeight}px` }}
    >
      <div
        className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('button, input, textarea, label')) {
            return;
          }

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            shouldScrollIntoViewRef.current = !isFlipped;
            setIsFlipped((current) => !current);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
      >
        <span className="sr-only">
          {isFlipped ? 'カード表面へ戻る' : 'カード裏面を開く'}
        </span>

        <span className="flashcard-face flashcard-front">
          <span ref={frontContentRef} className="flashcard-front-content">
            <strong className="card-title">{card.title}</strong>

            <span
              className="card-inline-actions"
              role="group"
              aria-label={`${card.title} のフラグ`}
              onClick={(event) => event.stopPropagation()}
            >
              {flagMeta.map((flag) => (
                <label key={flag.key} className="checkbox-chip">
                  <input
                    type="checkbox"
                    checked={flags[flag.key]}
                    onChange={(event) =>
                      onFlagChange(card.id, {
                        ...flags,
                        [flag.key]: event.target.checked,
                      })
                    }
                  />
                  <span>{flag.label}</span>
                </label>
              ))}
            </span>
          </span>
        </span>

        <span className="flashcard-face flashcard-back">
          <span className="card-detail">
            <span className="detail-header">
              <span className="detail-label">タイトル</span>
              <button
                type="button"
                className="copy-button"
                onClick={(event) => handleCopy(event, 'title', card.title)}
              >
                {copiedField === 'title' ? 'コピー済み' : 'コピー'}
              </button>
            </span>
            <span>{card.title}</span>
          </span>
          <span className="card-detail">
            <span className="detail-label">分類</span>
            <span>{card.type === 'service' ? 'AWS Service' : 'Key Concept'}</span>
          </span>
          <span className="card-detail">
            <span className="detail-label">カテゴリ</span>
            <span>{card.category}</span>
          </span>
          <span className="card-detail">
            <span className="detail-label">タグ</span>
            <span className="card-tags">
              {card.tags.length > 0 ? (
                card.tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag.replace('#', '')}
                  </span>
                ))
              ) : (
                <span>なし</span>
              )}
            </span>
          </span>
          <span className="card-detail">
            <span className="detail-label">概要</span>
            <span>{card.summary}</span>
          </span>
          <span className="card-detail">
            <span className="detail-header">
              <span className="detail-label">試験ポイント</span>
              <button
                type="button"
                className="copy-button"
                onClick={(event) => handleCopy(event, 'examPoint', card.examPoint)}
              >
                {copiedField === 'examPoint' ? 'コピー済み' : 'コピー'}
              </button>
            </span>
            <span>{card.examPoint}</span>
          </span>
          <span className="card-detail">
            <span className="detail-label">使う場面</span>
            <span>{card.useCase}</span>
          </span>
          {comparisonPages.length > 0 && (
            <span className="card-detail comparison-links-detail">
              <span className="detail-header">
                <span className="detail-label">比較チートシート</span>
                <span className="helper-chip">{comparisonPages.length}件</span>
              </span>
              <span className="comparison-link-list">
                {comparisonPages.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    className="comparison-link-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenComparison(page.id);
                    }}
                  >
                    <span className="comparison-link-title">{page.title}</span>
                    <span className="comparison-link-section">{page.section}</span>
                  </button>
                ))}
              </span>
            </span>
          )}
          <label
            className="card-detail note-field"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="detail-label">メモ</span>
            <textarea
              value={note}
              onChange={(event) => onNoteChange(card.id, event.target.value)}
              onKeyDown={(event) => event.stopPropagation()}
              placeholder="自分用メモを保存"
              rows={4}
            />
          </label>
        </span>
      </div>
    </article>
  );
}
