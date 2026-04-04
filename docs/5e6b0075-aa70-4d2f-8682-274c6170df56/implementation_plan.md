# 親カテゴリ概念の導入とセキュリティカテゴリ再編の実装計画

ユーザーからの回答に基づき、親カテゴリ（階層構造）の概念を導入し、セキュリティカテゴリの5分割およびサービスカードの拡充を行います。

## 課題と解決策

### 1. カテゴリの階層化 (親カテゴリ概念)
- **データ構造**: `DictionaryCard` 型に `parentCategory?: string` を追加します。
- **データ変換**: `scripts/build-dictionary.mjs` を修正し、MD内のカテゴリ名に `/` が含まれる場合（例：`セキュリティ/トラフィック制御系`）、`/` の前を `parentCategory`、後ろを `category` として分離・保存します。
- **フィルタUI (src/App.tsx)**: 
  - 絞り込みオーバーレイ内で、`parentCategory` を見出しとして表示。
  - その下に、該当する子カテゴリ（タグ形式）をグループ化して並べます。
- **カード表示 (src/components/Flashcard.tsx)**:
  - 親カテゴリ名を子カテゴリの上または横に、小さく薄いスタイルで表示します。

### 2. セキュリティカテゴリの再編
- `study-memo/AWSSAA_Dictionary_2026.md` 内の `- カテゴリ:` 行を以下の5つ（または「親/子」形式）に更新します。
  1. `セキュリティ/トラフィック制御系`
  2. `セキュリティ/認証・認可系`
  3. `セキュリティ/検知・監査系`
  4. `セキュリティ/暗号化・秘密情報管理系`
  5. `セキュリティ/組織ガバナンス・予防統制系`

### 3. 新規サービスカードの追加
ユーザー指定の以下の項目を独立したカードとして `AWSSAA_Dictionary_2026.md` に追記します。
- **追加対象**: VPC Endpoint Policy, CloudFront + WAF, ALB listener rule, IAM Identity Center (既存あり・拡充), IAM Permission Boundary, ABAC, Resource-based Policy, S3 Bucket Policy (既存あり・拡充), KMS Key Policy, EBS/RDS/S3暗号化, Config Rules 等

## 提案する変更内容

### 辞書データの更新 (study-memo/AWSSAA_Dictionary_2026.md)

#### [MODIFY] [AWSSAA_Dictionary_2026.md](file:///Users/rhyolite/practice/awssaa_in_the_ghost/study-memo/AWSSAA_Dictionary_2026.md)
- セキュリティ関連カテゴリの置換。
- 新規サービス用カードセクションの追加（五十音順またはA-Z順の適切な位置）。

---

### 生成スクリプト・型の更新

#### [MODIFY] [types.ts](file:///Users/rhyolite/practice/awssaa_in_the_ghost/src/types.ts)
- `DictionaryCard` インターフェースへの `parentCategory?: string` フィールド追加。

#### [MODIFY] [build-dictionary.mjs](file:///Users/rhyolite/practice/awssaa_in_the_ghost/scripts/build-dictionary.mjs)
- カテゴリ文字列のパースロジック変更 (`split('/')`)。

---

### UIコンポーネントの更新

#### [MODIFY] [App.tsx](file:///Users/rhyolite/practice/awssaa_in_the_ghost/src/App.tsx)
- 絞り込みオーバーレイ内のカテゴリセクションを、親カテゴリごとのグループ表示に書き換え。

#### [MODIFY] [Flashcard.tsx](file:///Users/rhyolite/practice/awssaa_in_the_ghost/src/components/Flashcard.tsx)
- 親カテゴリがある場合、それを控えめに表示するスタイル実装。

## 検証計画

### 自動テスト
- `npm run build-dictionary` を実行し、生成された `dictionary.json` に `parentCategory` が正しく含まれているか確認。

### 手動確認 (ユーザーに依頼)
- 絞り込みオーバーレイで見出し（親カテゴリ）が表示され、その下に子が並んでいることの確認。
- カード内で親カテゴリが小さく薄く表示されていることの確認。

## 重要：セッション分離の提案
本計画の承認後、変更箇所が多岐にわたるため、**「新しい会話（セッション）」に切り替えて実装を開始すること**を推奨します。切り替え時に貼り付ける「引き継ぎ用プロンプト」を、承認後の回答で提供いたします。
