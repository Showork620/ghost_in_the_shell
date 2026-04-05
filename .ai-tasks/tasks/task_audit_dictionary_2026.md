# タスク: カテゴリ階層化の設計と不足サービスの網羅的調査 (SAA-C03 2026対応)

## 概要
現在の AWS SAA 辞書 (`study-memo/AWSSAA_Dictionary_2026.md`) におけるカテゴリ設定を、より詳細な親子階層構造（例: `Networking/Connectivity`, `Database/Relational`）へ再編するための設計案作成と、2026年時点の SAA-C03 試験範囲に照らした不足サービスの調査を行います。

## ステータス
- Status: DONE
- Assigned to: SHELL (Claude CLI)

## 参照
- 計画書: `docs/5449177e-2fbb-4208-a8a2-5a229ebc80b5/implementation_plan.md`
- 辞書ファイル: `study-memo/AWSSAA_Dictionary_2026.md`

## 依頼内容
以下のステップを実行し、結果を `study-memo/investigation_report_categories.md` に出力してください。
着手時、このファイルの Status を `IN_PROGRESS` に更新してください。

### 1. 現状のカテゴリ抽出と整理
- `study-memo/AWSSAA_Dictionary_2026.md` から現在の全サービスの名称とカテゴリを抽出してください。
- 抽出したカテゴリをベースに、主要な親カテゴリ（Networking, Storage, Database, Computing, Analytics, AppIntegration, Management, Migration, Security, AI/ML, IoT 等）を定義してください。

### 2. 親子階層化案の作成
- 各サービスに対し、`親カテゴリ/子カテゴリ` という形式の階層化案を作成してください。
- 既存の「セキュリティ/XXX」形式との整合性を維持してください。
- 同一サービスが複数の役割を持つ場合、SAA 試験で最も問われやすい側面を優先してください。

### 3. 不足サービスの網羅的調査 (SAA-C03 2026対応)
- 2026年時点の SAA-C03 試験範囲に含まれるが、現在の辞書に不足しているサービスをリストアップしてください。
- 特に以下の分野を重点的に調査してください:
    - AI/ML (Amazon Bedrock, SageMaker, Rekognition, Lex, Polly, Transcribe 等)
    - IoT (IoT Core, IoT Greengrass 等)
    - Migration & Transfer (Transfer Family, AppFabric 等)
    - コンテナ・サーバーレスの周辺サービス (App Runner, VPC Lattice 等)

### 4. レポートの出力
- 調査結果を `study-memo/investigation_report_categories.md` に以下の構成で出力してください。
    - カテゴリ階層構造の定義一覧
    - 既存サービスの階層化適用案（全件リスト）
    - 不足サービスと追加推奨の理由
    - その他設計上の懸念点や提案

完了後はプロセスを終了 (exit) してください。

---

## 実行結果 (2026-04-05)

### 完了内容
- `study-memo/AWSSAA_Dictionary_2026.md` から 156 件のサービス・用語を全件抽出
- 11 親カテゴリ / 43 サブカテゴリの階層構造を設計
- 既存 156 件すべてに `親/子` 形式の提案カテゴリを適用
- 不足サービスを AI/ML (10件), IoT (3件), Migration (4件), Container/Serverless 周辺 (4件), その他 (9件) でリストアップ

### 出力先
- `study-memo/investigation_report_categories.md`

### 引き継ぎ事項
- 優先度 ★★★ の 2 件（AWS DMS, Amazon Bedrock）を最初に辞書追加することを推奨
- フロントエンドの UI フィルタが 1 段階のみの場合は、親/子 2 段階フィルタロジックの追加が必要
- 次ステップはユーザーに A/B/C の選択肢（一括変換 / 不足追加のみ / 特定カテゴリ詳細化）を提示して方針を確認すること
