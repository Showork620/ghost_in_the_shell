import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import type { CardFlagState, DictionaryCard } from '../types';

type FlashcardProps = {
  card: DictionaryCard;
  flags: CardFlagState;
  note: string;
  onFlagChange: (cardId: string, nextFlags: CardFlagState) => void;
  onNoteChange: (cardId: string, nextNote: string) => void;
};

const flagMeta = [
  { key: 'reviewLater', label: '後で確認' },
  { key: 'unknown', label: '知らない' },
] as const;

export function Flashcard({ card, flags, note, onFlagChange, onNoteChange }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedField, setCopiedField] = useState<'title' | 'examPoint' | null>(null);
  const shellRef = useRef<HTMLElement | null>(null);
  const dragStateRef = useRef({ x: 0, y: 0, moved: false });

  useEffect(() => {
    if (!isFlipped || !shellRef.current) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const topbar = document.querySelector('.topbar-wrap') as HTMLElement | null;
      const topbarHeight = topbar?.getBoundingClientRect().height ?? 0;
      const top = window.scrollY + shellRef.current!.getBoundingClientRect().top - topbarHeight - 16;

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

    setIsFlipped((current) => !current);
  }

  return (
    <article ref={shellRef} className="flashcard-shell">
      <div
        className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
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
