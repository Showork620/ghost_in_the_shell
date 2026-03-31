# AWS SAA Cards UIリファクタリング（Linearライク・ソリッドスタイル）

AWS SAAポケット単語帳のフロントエンドデザインを、Linearアプリに影響を受けた「ソリッド＆シャープなライトモード」へ変更します。

## 背景と目的
現在の丸みを帯びたポップなグラデーションベースのUIから、プロフェッショナルなツール感のある洗練されたUIへと刷新します。
指定されたカラーテーマ（アイボリー背景、渋いグリーンのアクセント）に従い、以下のデザイン原則を適用します。

- **Solid Ivory Backgrounds**: グラデーションを避け、均一でクリーンなアイボリー（#FDFCF8等）を基調色とします。
- **Sharp Typography & Contrast**: メインテキストは濃いグレーグリーン（#1E2A25）とし、可読性を最大化します。
- **Micro-borders & Layered Shadows**: 極微細な枠線（1px rgba(0,0,0,0.08)）と滑らかな多層シャドウを用いて、要素間の浮き出しを表現します。
- **Precise Structure**: カプセル状の強すぎる角丸を引き締め、用途ごとに適切なRadius（4px〜12px）を設定します。

## Proposed Changes

### `styles.css`

#### [MODIFY] src/styles.css
- **Variables / Root (`:root`)**
  - 背景グラデーションを削除し、ソリッドなアイボリー（`#FDFCF8`）を設定。
  - テキスト色を `#1E2A25` に変更。
  - `prefers-reduced-motion` のアクセシビリティ対応は既存のまま維持。
  - フォーカスリングを新配色のグリーン（例: `rgba(74, 107, 93, 0.4)`）に調整。

- **Layout & Shadow**
  - トップバーやポップオーバーは完全に不透明な背景にし、不要な `backdrop-filter` を削除してGPU負荷とノイズを削減。
  - Linear特有の滑らかで多階層なシャドウ（例: `box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)`）を適用。

- **Cards (`.flashcard`, `.flashcard-front`, `.flashcard-back`)**
  - 角丸を `28px` から `12px` へ変更。
  - 裏面のダークグリーン背景を廃止し、両面とも明るいアイボリー背景で統一。
  - **【最重要】** 裏面の基本テキスト色を白系から `#1E2A25` へ変更し、詳細ラベル (`.detail-label`) も黒系のアクセントカラーにしてコントラストを確保する。
  - 枠線を `1px solid rgba(0,0,0,0.08)` に統一し、くっきりとした境界を引く。

- **Buttons & Tags (`.topbar-button`, `.chip`, `.tag-pill`, `.flag-badge`)**
  - 丸みをシャープ化し機能に応じて細分化（例: `.segmented-control button` 類は 4px、タグチップは 6px、トップバーは 8px）。
  - `.chip.is-active` などのアクティブ要素からグラデーションを廃止。
  - 選択時・アクティブ状態では単色の渋いグリーン（`#4A6B5D`）を背景色に使用し、白文字（`#FFFFFF`）との高いコントラストを確保。裏面のチップ背景もソリッドモードに合わせて色を微調整。

### PWA設定

#### [MODIFY] public/manifest.webmanifest
- 背景色設定を整合させる。
  - `background_color`: `#FDFCF8`（新しいアイボリーベース）
  - `theme_color`: `#FAF9F6`（トップバー周辺と馴染むアイボリー）

## Verification Plan

### Manual Verification
- 実装完了後、ユーザーにローカルサーバー（`npm run dev`）で起動していただき、以下の点を確認依頼する。
  1. シャープな角丸や影などの「ソリッド感・Linear感」の確認。
  2. ライトモード化したカード裏面の可読性・コントラストが崩れていないかの確認。
