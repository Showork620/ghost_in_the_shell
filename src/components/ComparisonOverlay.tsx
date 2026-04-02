import type { ComparisonPage } from '../types';

type ComparisonOverlayProps = {
  page: ComparisonPage;
  isServiceNamesHidden: boolean;
  onToggleServiceNames: () => void;
  onClose: () => void;
};

export function ComparisonOverlay({
  page,
  isServiceNamesHidden,
  onToggleServiceNames,
  onClose,
}: ComparisonOverlayProps) {
  const maskTerms = [...new Set(page.guideItems.map((item) => item.name))].sort(
    (left, right) => right.length - left.length,
  );

  return (
    <div
      className="overlay-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <button
        type="button"
        className="overlay-backdrop"
        aria-label="比較ページを閉じる"
        onClick={onClose}
      />
      <section className="overlay-panel comparison-overlay-panel">
        <div className="overlay-header comparison-overlay-header">
          <div className="overlay-title-group">
            <p className="eyebrow">Compare Sheet</p>
            <div className="overlay-title-line">
              <h2 id="comparison-title">{page.title}</h2>
              <span className="result-count-chip">{page.guideItems.length} 項目</span>
            </div>
            <p className="comparison-section-label">{page.section}</p>
          </div>

          <div className="overlay-actions">
            <button
              type="button"
              className={`ghost-button comparison-toggle ${isServiceNamesHidden ? 'is-active' : ''}`}
              onClick={onToggleServiceNames}
              aria-pressed={isServiceNamesHidden}
            >
              {isServiceNamesHidden ? 'サービス名を表示' : 'サービス名を隠す'}
            </button>
            <button
              type="button"
              className="overlay-close"
              aria-label="比較ページを閉じる"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                {page.table.headers.map((header) => (
                  <th key={header} scope="col">
                    {header.replace(/\*\*/g, '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.table.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label.replace(/\*\*/g, '')}</th>
                  {row.values.map((value, index) => (
                    <td key={`${row.label}-${page.table.headers[index + 1]}`}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="comparison-guide-section">
          <div className="comparison-guide-header">
            <div>
              <p className="eyebrow">Quick Test</p>
              <h3>{page.guideTitle}</h3>
              <p className="helper-text" style={{ marginTop: '4px' }}>
                トグルを使うと、サービス名を伏せた状態で見分け方を確認できます。
              </p>
            </div>
          </div>

          <div className="comparison-guide-grid">
            {page.guideItems.map((item) => (
              <article key={item.name} className="comparison-guide-card">
                <div className="comparison-guide-card-header">
                  <span className="comparison-item-name">
                    {isServiceNamesHidden ? '□□□□' : item.name}
                  </span>
                </div>

                <div className="comparison-guide-body">
                  <div className="comparison-guide-block">
                    <span className="detail-label">見分け方</span>
                    <p>{maskText(item.clue, isServiceNamesHidden ? maskTerms : [])}</p>
                  </div>

                  {item.examplePrompt && (
                    <div className="comparison-guide-block">
                      <span className="detail-label">出題例</span>
                      <p>{maskText(item.examplePrompt, isServiceNamesHidden ? maskTerms : [])}</p>
                      <p className="comparison-answer">
                        <span aria-hidden="true">→ </span>
                        <strong>
                          {isServiceNamesHidden
                            ? '□□□□'
                            : maskText(item.exampleAnswer, isServiceNamesHidden ? maskTerms : [])}
                        </strong>
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

function maskText(text: string, terms: string[]) {
  if (terms.length === 0) {
    return text;
  }

  return terms.reduce((currentText, term) => {
    if (!term) {
      return currentText;
    }

    return currentText.replace(new RegExp(escapeRegExp(term), 'g'), '□□□□');
  }, text);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
