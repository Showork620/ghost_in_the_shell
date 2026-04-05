# カテゴリ階層化の一括適用と不足サービスの追加実装

AWS SAA 2026年版統合辞書のカテゴリ構造を整理し、最新の試験範囲を網羅するため、カテゴリの階層化（「親/子」形式）への一括置換と、調査レポートで指摘された重要サービスの追加を行います。

## ユーザーレビューが必要な事項

- **カテゴリ形式**: 調査レポートに基づき、すべて `Parent/Child` 形式に変更します。既存の「セキュリティ/XXX」も `Security/XXX` に合わせます。
- **追加サービス**: 優先度「★★★」の以下のサービスを追加します。
    - **AWS Database Migration Service (DMS)**
    - **Amazon Bedrock**
- **自動コミット**: 各段階（階層化置換後、サービス追加後）で git commit を実行します。

## 提案する変更内容

### [辞書データ] [AWSSAA_Dictionary_2026.md](file:///Users/rhyolite/practice/awssaa_in_the_ghost/study-memo/AWSSAA_Dictionary_2026.md)

- **カテゴリ一括置換**: `investigation_report_categories.md` の 104行目〜261行目にあるマッピング案に基づき、全 156 件のカテゴリを更新。
- **新規サービス追加**: 
    - `Amazon Bedrock`: AI/ML カテゴリとして追加。生成 AI 設計のポイントを記述。
    - `AWS DMS`: Migration カテゴリとして追加。SCT との使い分けを明記。

### [タスク管理] [.ai-tasks/tasks/task_apply_category_hierarchy.md](file:///Users/rhyolite/practice/awssaa_in_the_ghost/.ai-tasks/tasks/task_apply_category_hierarchy.md) [NEW]

- SHELL (Claude CLI) への具体的な作業指示書を作成します。
- ステップ 1: カテゴリの一括置換。
- ステップ 2: 重要サービスの追加。
- ステップ 3: 辞書ビルド確認 (`npm run build-dict` 等)。

## オープンな質問

> [!NOTE]
> 特になし。調査レポートの合意事項に基づき実行します。

## 検証プラン

### 自動テスト
- `node scripts/build-dictionary.mjs`: パースエラーが発生しないことを確認。
- フロントエンドでの表示確認（ユーザーによる最終確認を推奨）。

### 手動検証
- 置換後の Markdown 構造が崩れていないか、数件をサンプリング確認。
