import { useState } from 'react';
import type { CardFlagState, DictionaryCard } from '../types';

type FlashcardProps = {
  card: DictionaryCard;
  flags: CardFlagState;
  onFlagChange: (cardId: string, nextFlags: CardFlagState) => void;
};

const flagMeta = [
  { key: 'reviewLater', label: '後で確認' },
  { key: 'unknown', label: '知らない' },
] as const;

export function Flashcard({ card, flags, onFlagChange }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <article className="flashcard-shell">
      <div
        className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
        onClick={() => setIsFlipped((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsFlipped((current) => !current);
          }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
      >
        <span className="sr-only">
          {isFlipped ? 'カード表面へ戻る' : 'カード裏面を開く'}
        </span>

        <span className="flashcard-face flashcard-front">
          <strong className="card-title">{card.title}</strong>
          {(flags.reviewLater || flags.unknown) && (
            <span className="card-flags">
              {flags.reviewLater && <span className="flag-badge">後で確認</span>}
              {flags.unknown && <span className="flag-badge">知らない</span>}
            </span>
          )}

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
              {card.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag.replace('#', '')}
                </span>
              ))}
            </span>
          </span>
          <span className="card-detail">
            <span className="detail-label">概要</span>
            <span>{card.summary}</span>
          </span>
          <span className="card-detail">
            <span className="detail-label">試験ポイント</span>
            <span>{card.examPoint}</span>
          </span>
          <span className="card-detail">
            <span className="detail-label">使う場面</span>
            <span>{card.useCase}</span>
          </span>
        </span>
      </div>
    </article>
  );
}
