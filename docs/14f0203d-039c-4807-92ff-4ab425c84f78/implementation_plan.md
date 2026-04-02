# AWS SAA 2026 類似サービス比較チートシート 実装計画（確定版）

辞書ファイル（`AWSSAA_Dictionary_2026.md`）と2026年最新のSAA情報を元に、試験で頻出する類似サービス・用語の比較を1ファイルに集約したチートシートを作成します。SHELLの監査指摘およびAD連携系・グローバルDB系の要望をすべて反映した網羅版です。

## 確定した更新内容

### ドキュメント生成
- **[NEW]** `study-memo/AWSSAA_類似サービス比較チートシート.md`
- **[MODIFY]** `study-memo/AWSSAA_Dictionary_2026.md`
   - 辞書に欠落している主要用語（Transit Gateway、CURなど）の補完追加を同時に行います。

### チートシートの構成案（全11グループ＋詳細項目拡充）

1. **コンピューティング・サーバーレス系**
   - EC2 vs Lambda vs Fargate vs Elastic Beanstalk
2. **コンテナ・オーケストレーション系**
   - ECS vs EKS
3. **ストレージ・データ移行系**
   - ブロック・ファイル・オブジェクト: S3 vs EBS vs EFS vs FSx vs インスタンスストア
   - 転送・ハイブリッド: DataSync vs Storage Gateway vs Snow Family vs Transfer Family
4. **データベース・キャッシュ系**
   - RDBとNoSQLの特徴: RDS vs Aurora vs DynamoDB vs DocumentDB
   - グローバルデータ分散・DR: Aurora Global Database vs DynamoDB Global Tables vs ElastiCache Global Datastore
   - インメモリアクセス: ElastiCache (Redis vs Memcached) vs DAX
5. **ネットワーク・配信・ロードバランス系**
   - VPC内外・マルチVPC: VPC Peering vs Transit Gateway vs PrivateLink vs VPCエンドポイント (Gateway/Interface)
   - ロードバランサ: ALB vs NLB vs Gateway Load Balancer
   - グローバル・ハイブリッド: CloudFront vs Global Accelerator, Site-to-Site VPN vs Direct Connect
   - VPCセキュリティ: セキュリティグループ (SG) vs ネットワーク ACL (NACL)
6. **セキュリティ・暗号化・監査系**
   - 脅威と構成管理: GuardDuty vs Inspector vs Macie vs Security Hub vs Detective
   - 暗号化・シークレット: KMS vs CloudHSM, Secrets Manager vs Parameter Store
   - 監査(使い分け): CloudTrail vs Config (※Artifact はコンプライアンスレポート入手として別レイヤー注記)
7. **IAM・認証・AD連携系**
   - 認証・認可: Cognito (User Pool vs Identity Pool), IAM Identity Center vs IAM フェデレーション, STS AssumeRole
   - AD連携: AWS Managed Microsoft AD vs AD Connector vs Simple AD
8. **メッセージング・イベント駆動・アプリ統合系**
   - 疎結合とワークフロー: SQS vs SNS vs EventBridge vs Kinesis Data Streams
9. **コスト・請求管理系**
   - 可視化と詳細分析: Cost Explorer vs AWS Budgets vs Cost Anomaly Detection vs Cost and Usage Report (CUR)
10. **分析系**
    - 用途別データ基盤: Athena vs Redshift vs EMR vs OpenSearch
11. **可用性・DR設計（アーキテクチャ）**
    - DRの4戦略: バックアップ&リストア vs パイロットライト vs ウォームスタンバイ vs マルチサイト
    - バックアップ最適化・自動化: EBS Snapshot (手動・基本) vs Data Lifecycle Manager (EC2/EBS特化自動化) vs AWS Backup (クロスアカウント・複数リソース一元管理)
    - Route 53 ルーティング: フェイルオーバー vs 加重 vs レイテンシ vs 地理的 vs 地理的近接性 vs 複数値回答

## Verification Plan
1. マニュアル確認: 生成された `AWSSAA_類似サービス比較チートシート.md` および更新された辞書ファイルを開き、SAA試験の傾向に基づくキーワードと見分けのポイントが漏れなく記載されているかを人間が確認する。
