# AWS SAA Cards Frontend構成メモ

この文書は、`AWS SAA Cards` のフロントエンド改修を別エージェントへ委譲するための引き継ぎ資料です。実装済みの構成、責務分割、状態管理、データ生成、UIの現在形をまとめています。

## 1. 技術スタック

- フレームワーク: React
- ビルドツール: Vite
- 言語: TypeScript
- スタイリング: 単一のグローバルCSS (`src/styles.css`)
- データ入力: `study-memo/AWSSAA_Dictionary_2026.md`
- データ変換: `scripts/build-dictionary.mjs`
- PWA: `public/manifest.webmanifest`, `public/sw.js`
- デプロイ想定: GitHub Pages

## 2. 現在のファイル構成

```text
src/
├── App.tsx
├── main.tsx
├── styles.css
├── types.ts
├── vite-env.d.ts
├── components/
│   └── Flashcard.tsx
├── data/
│   └── generated/
│       └── dictionary.json
└── lib/
    └── storage.ts

public/
├── manifest.webmanifest
├── pwa-icon.svg
└── sw.js

scripts/
└── build-dictionary.mjs
```

## 3. エントリポイントと責務

### `src/main.tsx`

- Reactのマウント処理を担当
- `App` を描画
- Service Worker の登録を担当
- `import.meta.env.BASE_URL` を使って Pages 配下でも `sw.js` を正しく登録する

### `src/App.tsx`

アプリ全体のオーケストレーションを担当する親コンポーネント。責務はかなり集約されている。

- 生成済み辞書JSONの読み込み
- フィルタ状態の保持
- フラグ状態の保持
- localStorage との同期
- Heroポップオーバーの開閉
- 絞り込みポップオーバーの開閉
- インストールボタンの表示制御
- 絞り込み済みカード一覧の計算
- 統計値の算出

### `src/components/Flashcard.tsx`

個別カードの表示と反転動作を担当。

- 表面: サービス名または用語名のみ
- 表面内に `後で確認` / `知らない` のチェックボックスを内包
- 裏面: 分類、カテゴリ、タグ、概要、試験ポイント、使う場面
- カード全体クリックで反転
- チェックボックス操作時は反転イベントを止めている

### `src/styles.css`

UI全体の見た目を1ファイルで管理している。

- アプリ背景
- sticky topbar
- hero / filter の popover 表現
- フラッシュカードのサイズと反転アニメーション
- レスポンシブ調整
- reduced motion 対応

現時点では CSS Modules や Tailwind ではなく、グローバルクラスベース。

## 4. データフロー

### 入力元

元データは `study-memo/AWSSAA_Dictionary_2026.md`。

このMarkdownは、各項目が次のような構造を持つことを前提にしている。

```md
### サービス名
- **カテゴリ**: ...
- **タグ**: ...
- **概要**: ...
- **SAA試験でのポイント**: ...
- **どういう時に使うサービスか**: ...
```

### 生成処理

`scripts/build-dictionary.mjs` が Markdown をパースして `src/data/generated/dictionary.json` を生成する。

生成時のルール:

- `##` 見出しを section として扱う
- `###` 見出しごとに1カード生成
- title から sha1 ベースの短い `id` を生成
- `section` に `重要用語` を含む場合は `type: "concept"`、それ以外は `type: "service"`
- 必須フィールド欠落時は throw して生成失敗

### アプリ実行時

1. `App.tsx` が `dictionary.json` を静的 import
2. カテゴリ一覧とタグ一覧を起動時に導出
3. UI操作に応じてフィルタ条件を state に保持
4. `cards.filter(...)` で毎描画時に表示カードを算出

データ量は 143 カードなので、現状はメモ化なしの単純フィルタで十分。

## 5. 状態管理

グローバルな状態管理ライブラリは使っていない。`App.tsx` に `useState` で集約している。

主な state:

- `flagState`: カードIDごとの `reviewLater` / `unknown`
- `query`: 検索文字列
- `selectedCategories`: 選択中カテゴリ
- `selectedTags`: 選択中タグ
- `selectedFlags`: 選択中フラグ
- `groupMode`: カテゴリ/タグ/フラグのグループ間を `and` / `or` で結合
- `tagMode`: タググループ内を `any` / `all` で評価
- `flagMode`: フラググループ内を `any` / `all` で評価
- `isHeroOpen`: Heroポップオーバー開閉
- `isFiltersOpen`: 絞り込みポップオーバー開閉
- `installPrompt`: PWAインストールイベント保持
- `isHydrated`: localStorage 読み込み完了フラグ

### localStorage

保存キーは `src/lib/storage.ts` に定義。

- `awssaa-card-flags`
- `awssaa-card-filters`

初回マウント時に読み込み、その後の保存は `isHydrated` 後だけ走るようにしている。これは、初回描画時に空状態で既存保存を上書きしないため。

## 6. UI構成

### Topbar

画面上部に sticky で固定。

- 左: `Hero` ボタン
- 中央: タイトル
- 右: `絞り込み` ボタン

ボタン押下で、それぞれ下方向にポップオーバーを表示する。

現在の仕様:

- `Hero` と `絞り込み` は同時に開かない
- 外側クリックで閉じる
- `Escape` で閉じる
- `絞り込み` ボタンにはアクティブフィルタ数をバッジ表示

### Hero Popover

内容:

- アプリの説明
- カード総数
- 表示中件数
- `後で確認` 件数
- `知らない` 件数
- PWAインストールボタン

### Filter Popover

内容:

- 検索
- グループ結合 `AND/OR`
- カテゴリ選択
- タグ選択
- フラグ選択
- リセットボタン

挙動:

- タグ内は `OR/AND` 切替
- フラグ内も `OR/AND` 切替
- カテゴリ/タグ/フラグの各グループ同士も `AND/OR` 切替

### Cards Area

メインのカード一覧。現在は以下のグリッド設定。

- `repeat(auto-fill, minmax(320px, 1fr))`
- モバイルでは1列、横幅に応じて複数列

### Flashcard

現状の表示方針:

- 表: キーワードのみ
- 表の下部: `後で確認` / `知らない` のチェックUI
- 裏: 詳細説明

カードは縦長で、裏面の文字は表より少し大きい。

## 7. デザインの現在地

今の見た目は以下の方向性。

- 暖色寄りの淡い背景グラデーション
- クリーム色 + 緑系のガラス風パネル
- 丸みの強いカード
- Hero / Topbar / Filter が同系統の表現
- フラッシュカードは表が明るく、裏が濃い緑

改善余地が大きい箇所:

- Topbar と Popover の情報密度整理
- Popover の開閉アニメーション
- Hero と Filter の視覚的差別化
- カード一覧の縦スクロール時の没入感
- モバイルでのポップオーバー最大高さと閉じやすさ

## 8. PWA構成

### `public/manifest.webmanifest`

- アプリ名
- short_name
- standalone 表示
- portrait orientation
- テーマカラー
- SVGアイコン

### `public/sw.js`

簡易キャッシュ戦略を実装している。

- install 時にベースURLと manifest と icon をキャッシュ
- activate 時に旧キャッシュ削除
- fetch 時に cache-first で返却

現状は最低限の実装で、オフライン学習用途としてはシンプル寄り。

## 9. ビルドとデプロイ

### 開発

```bash
npm run dev
```

### 本番ビルド

```bash
npm run build
```

`build` 前に `npm run sync:dictionary` が走るため、辞書Markdownを編集したらそのままビルドすれば生成物も更新される。

### GitHub Pages

- `vite.config.ts` で Actions 実行時だけ `base` を `/awssaa_in_the_ghost/` に変更
- `.github/workflows/deploy-pages.yml` で Pages へデプロイ

## 10. 委譲先エージェント向けの注意点

- UIロジックの中核は `App.tsx` に集中しているので、デザイン改修でも触る範囲は広くなりやすい
- フィルタ仕様はすでに少し複雑なので、見た目だけの修正でもロジックを壊さないこと
- `Flashcard.tsx` はクリック反転と checkbox 操作が干渉しないようにしてある
- `styles.css` はグローバルスコープなので、クラス名衝突や副作用に注意
- `dictionary.json` は生成物なので、手編集しない前提
- `study-memo/AWSSAA_Dictionary_2026.md` の構造変更は `build-dictionary.mjs` に影響する

## 11. 改修しやすい順の候補

デザイン専任エージェントに渡すなら、次の順で進めると安全。

1. `styles.css` だけで完結する視覚改修
2. `Hero` / `絞り込み` ポップオーバーのレイアウト改善
3. `Flashcard.tsx` の表裏レイアウト見直し
4. `App.tsx` の構造整理とコンポーネント分割
5. PWA体験の改善

## 12. 重要参照ファイル

- `src/App.tsx`
- `src/components/Flashcard.tsx`
- `src/styles.css`
- `src/lib/storage.ts`
- `src/types.ts`
- `scripts/build-dictionary.mjs`
- `public/manifest.webmanifest`
- `public/sw.js`
