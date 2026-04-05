# タスク: AWS SAA 2026 辞書のカテゴリ階層化とサービス追加

## 概要
`study-memo/investigation_report_categories.md` のマッピング案に基づき、`study-memo/AWSSAA_Dictionary_2026.md` のカテゴリを一括置換し、重要サービスを追加します。

## ステータス
- Status: DONE
- Source: `implementation_plan.md` (Phase: Execute)

## 完了条件
1. [x] `AWSSAA_Dictionary_2026.md` の全 156 件の既存カテゴリが、レポート記載の `Parent/Child` 形式に置換されていること。
2. [x] 以下の2つのサービスが `AWSSAA_Dictionary_2026.md` に A-Z 順で追加されていること。
    - **Amazon Bedrock** (Category: AI_ML/GenAI)
    - **AWS Database Migration Service (DMS)** (Category: Migration/Database)
3. [x] 置換後と追加後にそれぞれ `git commit` を実行すること。
4. [x] `node scripts/build-dictionary.mjs` を実行し、パースエラーが出ないことを確認すること。

## 作業指示（SHELL向け）

### 1. カテゴリの一括置換
`study-memo/investigation_report_categories.md` の「2. 既存サービスの階層化適用案（全件リスト）」のテーブルを参照してください。
`AWSSAA_Dictionary_2026.md` 内の各サービスの `- カテゴリ: XXX` 行を、テーブルの「提案カテゴリ」列の値に置換してください。
※一括処理には、適切なスクリプト（sed, awk, または一時的な JS/Python スクリプト）を作成して実行することを推奨します。

### 2. 重要サービスの追加
以下の内容でエントリを追加してください。挿入位置はアルファベット順（A-Z）を維持してください。

**Amazon Bedrock**
- カテゴリ: AI_ML/GenAI
- タグ: `#生成AI` `#サーバーレス` `#基盤モデル`
- 概要: 様々な基盤モデル (FM) を API 経由で利用可能にするマネージドサービス。
- SAA試験でのポイント: サーバーレスで生成 AI アプリを構築する際の中心。モデルのカスタマイズ（ファインチューニングや RAG）と、データプライバシー（入力データがモデル学習に使われない等）が問われる。
- どういう時に使うサービスか: チャットボット、要約、画像生成などの生成 AI 機能の実装。

**AWS Database Migration Service (DMS)**
- カテゴリ: Migration/Database
- タグ: `#移行` `#データベース` `#信頼性`
- 概要: データベースを安全かつ最小限のダウンタイムで AWS へ移行するためのサービス。
- SAA試験でのポイント: 同種 DB 移行だけでなく、異種 DB 移行（SCT との組み合わせ）が頻出。継続的なデータレプリケーション機能により、ダウンタイムを最小化できる点が最大のメリット。
- どういう時に使うサービスか: オンプレ DB の AWS 移行、Aurora への継続的同期、異種エンジンの移行。

### 3. 検証と完了
- `node scripts/build-dictionary.mjs` を実行し、エラーがないことを確認。
- 完了後はプロセスを終了 (exit) してください。
