# AWS 分析レイヤー構造と主要サービス (aws_analytics_flow.md)

AWS SAA 試験および実務における、エンドツーエンドの分析パイプラインを 6 つのレイヤーで整理します。

## 1. 収集 (Collection)
データの発生源から AWS 環境へデータを取り込むフェーズ。
- **Amazon Kinesis Data Streams**: ミリ秒単位のリアルタイム性が求められる独自処理用。
- **Amazon Data Firehose**: S3, Redshift, OpenSearch 等への自動搬送（ニアリアルタイム）。
- **AWS DataSync / Snow Family**: オンプレミス等からの大規模データ移行。

## 2. 保存 (Storage)
分析の起点となるデータレイク。
- **Amazon S3**: 全ての分析のハブ。高耐久・低コスト。
    - **ベストプラクティス**: 分析効率化のため、Glue 等（ETL）で Parquet/ORC 形式に変換して保存する。

## 3. ガバナンス・メタデータ管理 (Governance)
データのカタログ化とアクセス制御。
- **AWS Glue Data Catalog**: 中央メタデータリポジトリ。S3 上のデータを「テーブル」として他サービスに認識させる。
- **AWS Lake Formation**: テーブル、カラム、行レベルでの、タグベース/リソースベースの権限制御。

## 4. 加工・変換 (ETL / Processing)
生データを分析に適した形式へ変換するフェーズ。
- **AWS Glue**: サーバーレス ETL。Python/Spark ジョブを実行。
- **Amazon EMR**: 極めて大規模またはカスタムな Hadoop/Spark ワークロード用。
- **AWS Managed Service for Apache Flink**: ストリーミングデータのリアルタイム集計・加工。

## 5. 分析 (Analysis / Data Warehouse)
データに対して検索やクエリ、集計を行うフェーズ。
- **Amazon Athena**: S3 上のデータに対する ad-hoc な SQL 分析（サーバーレス）。
- **Amazon Redshift**: 大規模・複雑な結合（JOIN）を伴うデータウェアハウス（計算リソース専有）。
- **Amazon OpenSearch Service**: ログ分析、全文検索、トラブルシューティング。

## 6. 可視化 (Visualization)
分析結果を人間が理解しやすい形にするフェーズ。
- **Amazon QuickSight**: BI ツール。ダッシュボード作成、ML Insights による傾向予測。

---
## 試験での判断軸（ログ分析シナリオ）
1. **「即座に検索・可視化したい」** -> Firehose -> OpenSearch Service (OpenSearch Dashboards)
2. **「S3 にある大量のログを安く SQL 分析したい」** -> Athena (+ Glue Catalog)
3. **「既存の BI レポートと統合し、複雑な集計を高速化したい」** -> Redshift
4. **「データのスキーマを自動で検出・管理したい」** -> Glue Crawler -> Glue Data Catalog
