# カテゴリ階層化設計と不足サービス調査レポート

> 作成日: 2026-04-05  
> タスク参照: `.ai-tasks/tasks/task_audit_dictionary_2026.md`  
> 調査対象: `study-memo/AWSSAA_Dictionary_2026.md`

---

## 1. カテゴリ階層構造の定義一覧

現行辞書では「セキュリティ/XXX」形式の 5 サブカテゴリが先行実装されている。
これを全親カテゴリに拡張し、以下の 10 親カテゴリ + サブカテゴリを提案する。

```
Computing/
  Computing/General         # EC2, AMI, Auto Scaling, Spot, Graviton, Beanstalk
  Computing/Container       # ECS, EKS, Fargate, ECR
  Computing/Serverless      # Lambda
  Computing/Batch           # AWS Batch (追加推奨)

Storage/
  Storage/Block             # EBS, EBS Snapshot, DLM
  Storage/Object            # S3, S3 CRR, S3 Intelligent-Tiering, S3 Transfer Acceleration
  Storage/File              # EFS, FSx
  Storage/Hybrid            # Storage Gateway

Database/
  Database/Relational       # RDS, Aurora, Aurora Global Database, RDS Multi-AZ, RDS Proxy
  Database/NoSQL            # DynamoDB, DAX, DynamoDB Global Tables, DynamoDB Streams, DocumentDB
  Database/InMemory         # ElastiCache, ElastiCache Global Datastore
  Database/Warehouse        # Redshift
  Database/Graph            # Neptune (追加推奨)
  Database/TimeSeries       # Timestream (追加推奨)

Networking/
  Networking/Core           # VPC, SG, NACL, Route Table
  Networking/Connectivity   # Direct Connect, Site-to-Site VPN, Transit Gateway, VPN
  Networking/LoadBalancing  # ELB (ALB/NLB/GWLB), ALB Listener Rule
  Networking/DNS            # Route 53, ヘルスチェック, 各ルーティング方式
  Networking/CDN            # CloudFront, CloudFront + WAF
  Networking/Access         # NAT Gateway, Elastic IP, VPC Endpoint, VPC Endpoint Policy, PrivateLink, Global Accelerator

Security/
  Security/IAM              # IAM, STS, ABAC, AssumeRole, Identity Center, KMS Key Policy, Directory Service, SAML
  Security/Identity         # Cognito (User Pool / Identity Pool), IAM Identity Center
  Security/Detection        # GuardDuty, Inspector, Macie, CloudTrail, VPC Flow Logs, IAM Access Analyzer, Detective, Security Hub
  Security/Traffic          # WAF, Shield, Network Firewall, Firewall Manager
  Security/Encryption       # KMS, CloudHSM, ACM, EBS/RDS/S3 暗号化, Secrets Manager, Parameter Store
  Security/Governance       # Organizations, Control Tower, SCP, Config, Config Rules, Service Catalog, Artifact, Service Quotas
  Security/ResourcePolicy   # Resource-based Policy, Bucket Policy, VPC Endpoint Policy

Analytics/
  Analytics/Streaming       # Kinesis Data Streams, Managed Apache Flink, Data Firehose
  Analytics/Query           # Athena, OpenSearch
  Analytics/BigData         # EMR, MSK (追加推奨)
  Analytics/Warehouse       # Redshift (Database/Warehouse と兼任; 主は Database)
  Analytics/Catalog         # Glue, Glue Data Catalog, Lake Formation
  Analytics/Visualization   # QuickSight

AppIntegration/
  AppIntegration/Messaging  # SQS, SNS, MQ, Amazon MQ
  AppIntegration/API        # API Gateway, AppSync (追加推奨)
  AppIntegration/Workflow   # Step Functions, EventBridge
  AppIntegration/DataFlow   # AppFlow

Migration/
  Migration/Data            # DataSync, Snow Family, Transfer Family, S3 Transfer Acceleration
  Migration/Database        # SCT, DMS (追加推奨)
  Migration/Server          # Elastic Disaster Recovery (DRS), Application Migration Service (MGN)(追加推奨)
  Migration/Hub             # Migration Hub (追加推奨)

Management/
  Management/Operations     # Systems Manager, Health Dashboard, Trusted Advisor, Service Quotas
  Management/Monitoring     # CloudWatch, CloudWatch Logs, X-Ray
  Management/Cost           # Budgets, Cost Explorer, Cost Anomaly Detection, CUR, Pricing Calculator, Savings Plans, RI, Cost Allocation Tags, Compute Optimizer
  Management/IaC            # CloudFormation, CloudFormation StackSets, CDK, SAM
  Management/DevOps         # CodeBuild, CodeDeploy, CodePipeline
  Management/Backup         # AWS Backup, EBS Snapshot, DLM

AI_ML/                      # 新設 (不足セクション参照)
  AI_ML/GenAI               # Bedrock
  AI_ML/Platform            # SageMaker
  AI_ML/Vision              # Rekognition
  AI_ML/Language            # Comprehend, Translate, Textract, Kendra
  AI_ML/Speech              # Polly, Transcribe
  AI_ML/Conversational      # Lex
  AI_ML/Recommendation      # Personalize, Forecast

IoT/                        # 新設 (不足セクション参照)
  IoT/Core                  # IoT Core
  IoT/Edge                  # IoT Greengrass
  IoT/Industrial            # IoT SiteWise

DR/                         # 概念カテゴリとして維持
  DR/Strategy               # バックアップ&リストア, パイロットライト, ウォームスタンバイ, マルチサイト
  DR/Metrics                # RPO, RTO
  DR/Concepts               # フェイルオーバー, ヘルスチェック, コントロールプレーン, データプレーン
```

---

## 2. 既存サービスの階層化適用案（全件リスト）

| # | サービス名 | 現行カテゴリ | 提案カテゴリ |
|---|-----------|------------|------------|
| 1 | ABAC | セキュリティ/認証・認可系 | Security/IAM |
| 2 | AWS IAM Access Analyzer | セキュリティ/検知・監査系 | Security/Detection |
| 3 | ALB listener rule | セキュリティ/トラフィック制御系 | Networking/LoadBalancing |
| 4 | AMI | コンピューティング | Computing/General |
| 5 | AWS Managed Service for Apache Flink | 分析 | Analytics/Streaming |
| 6 | Amazon API Gateway | アプリケーション統合 | AppIntegration/API |
| 7 | Amazon AppFlow | アプリケーション統合 | AppIntegration/DataFlow |
| 8 | AWS Application Recovery Controller (ARC) | DR・可用性 | DR/Strategy |
| 9 | ARN | AWS 共通概念 | Management/Operations (概念) |
| 10 | AWS Artifact | セキュリティ/組織ガバナンス・予防統制系 | Security/Governance |
| 11 | Amazon Athena | 分析 | Analytics/Query |
| 12 | Amazon Aurora | データベース | Database/Relational |
| 13 | Aurora Global Database | データベース | Database/Relational |
| 14 | AWS Backup | バックアップ | Management/Backup |
| 15 | AWS Budgets | コスト管理 | Management/Cost |
| 16 | AWS CDK | IaC | Management/IaC |
| 17 | AWS Certificate Manager (ACM) | セキュリティ/暗号化・秘密情報管理系 | Security/Encryption |
| 18 | AWS CloudFormation | IaC | Management/IaC |
| 19 | CloudFormation StackSets | IaC | Management/IaC |
| 20 | Amazon CloudFront | ネットワーク・コンテンツ配信 | Networking/CDN |
| 21 | CloudFront + AWS WAF | セキュリティ/トラフィック制御系 | Security/Traffic |
| 22 | AWS CloudHSM | セキュリティ/暗号化・秘密情報管理系 | Security/Encryption |
| 23 | AWS CloudTrail | セキュリティ/検知・監査系 | Security/Detection |
| 24 | Amazon CloudWatch | モニタリング | Management/Monitoring |
| 25 | CloudWatch Logs | モニタリング | Management/Monitoring |
| 26 | Amazon Cognito | セキュリティ/認証・認可系 | Security/Identity |
| 27 | AWS CodeBuild | DevOps | Management/DevOps |
| 28 | AWS CodeDeploy | DevOps | Management/DevOps |
| 29 | AWS CodePipeline | DevOps | Management/DevOps |
| 30 | AWS Compute Optimizer | 最適化 | Management/Cost |
| 31 | AWS Config | セキュリティ/検知・監査系 | Security/Governance |
| 32 | AWS Config Rules | セキュリティ/組織ガバナンス・予防統制系 | Security/Governance |
| 33 | AWS Control Tower | セキュリティ/組織ガバナンス・予防統制系 | Security/Governance |
| 34 | AWS Cost Anomaly Detection | コスト管理 | Management/Cost |
| 35 | AWS Cost and Usage Report (CUR) | コスト管理 | Management/Cost |
| 36 | AWS Cost Explorer | コスト管理 | Management/Cost |
| 37 | Amazon Data Firehose | データ転送 | Analytics/Streaming |
| 38 | Amazon Data Lifecycle Manager (DLM) | バックアップ | Management/Backup |
| 39 | AWS DataSync | 移行・転送 | Migration/Data |
| 40 | Amazon Detective | セキュリティ/検知・監査系 | Security/Detection |
| 41 | AWS Direct Connect | ネットワーク | Networking/Connectivity |
| 42 | AWS Directory Service | セキュリティ/認証・認可系 | Security/IAM |
| 43 | Amazon DocumentDB | データベース | Database/NoSQL |
| 44 | Amazon DynamoDB | データベース | Database/NoSQL |
| 45 | DynamoDB Accelerator (DAX) | データベース | Database/NoSQL |
| 46 | DynamoDB Global Tables | データベース | Database/NoSQL |
| 47 | DynamoDB Streams | イベント駆動 | AppIntegration/Workflow |
| 48 | Amazon EBS | ストレージ | Storage/Block |
| 49 | EBS Snapshot | バックアップ | Management/Backup |
| 50 | EBS / RDS / S3 暗号化 | セキュリティ/暗号化・秘密情報管理系 | Security/Encryption |
| 51 | Amazon EC2 | コンピューティング | Computing/General |
| 52 | EC2 Auto Scaling | コンピューティング | Computing/General |
| 53 | EC2 Spot Instances | コンピューティング | Computing/General |
| 54 | Amazon ECS | コンテナ | Computing/Container |
| 55 | Amazon EFS | ストレージ | Storage/File |
| 56 | Amazon EKS | コンテナ | Computing/Container |
| 57 | Amazon ElastiCache | データベース | Database/InMemory |
| 58 | ElastiCache Global Datastore | データベース | Database/InMemory |
| 59 | AWS Elastic Beanstalk | PaaS | Computing/General |
| 60 | AWS Elastic Disaster Recovery (DRS) | DR・移行 | Migration/Server |
| 61 | Elastic IP | ネットワーク | Networking/Access |
| 62 | Elastic Load Balancing (ELB) | ネットワーク | Networking/LoadBalancing |
| 63 | Amazon EMR | 分析 | Analytics/BigData |
| 64 | Amazon EventBridge | イベント駆動 | AppIntegration/Workflow |
| 65 | AWS Fargate | コンテナ | Computing/Container |
| 66 | AWS Firewall Manager | セキュリティ/組織ガバナンス・予防統制系 | Security/Traffic |
| 67 | Amazon FSx | ストレージ | Storage/File |
| 68 | AWS Global Accelerator | ネットワーク | Networking/Access |
| 69 | AWS Glue | 分析 | Analytics/Catalog |
| 70 | AWS Glue Data Catalog | 分析 | Analytics/Catalog |
| 71 | AWS Graviton | コンピューティング | Computing/General |
| 72 | Amazon GuardDuty | セキュリティ/検知・監査系 | Security/Detection |
| 73 | AWS Health Dashboard | 運用管理 | Management/Operations |
| 74 | IAM | セキュリティ/認証・認可系 | Security/IAM |
| 75 | IAM Identity Center | 認証・認可 | Security/Identity |
| 76 | Identity Pool (ID プール) | セキュリティ/認証・認可系 | Security/Identity |
| 77 | Amazon Inspector | セキュリティ/検知・監査系 | Security/Detection |
| 78 | Amazon Kinesis Data Streams | ストリーミング | Analytics/Streaming |
| 79 | AWS KMS | セキュリティ/暗号化・秘密情報管理系 | Security/Encryption |
| 80 | KMS Key Policy | セキュリティ/認証・認可系 | Security/IAM |
| 81 | AWS Lake Formation | 分析 | Analytics/Catalog |
| 82 | AWS Lambda | サーバーレス | Computing/Serverless |
| 83 | Amazon Macie | セキュリティ/検知・監査系 | Security/Detection |
| 84 | NAT Gateway | ネットワーク | Networking/Access |
| 85 | Amazon MQ | メッセージング | AppIntegration/Messaging |
| 86 | AWS Network Firewall | セキュリティ/トラフィック制御系 | Security/Traffic |
| 87 | Amazon OpenSearch Service | 分析 | Analytics/Query |
| 88 | AWS Organizations | セキュリティ/組織ガバナンス・予防統制系 | Security/Governance |
| 89 | Systems Manager Parameter Store | セキュリティ/暗号化・秘密情報管理系 | Security/Encryption |
| 90 | AWS Pricing Calculator | コスト管理 | Management/Cost |
| 91 | AWS PrivateLink | セキュリティ/トラフィック制御系 | Networking/Access |
| 92 | Amazon QuickSight | 分析 | Analytics/Visualization |
| 93 | Resource-based Policy | セキュリティ/認証・認可系 | Security/ResourcePolicy |
| 94 | Reserved Instances (RI) | コスト管理 | Management/Cost |
| 95 | Amazon RDS | データベース | Database/Relational |
| 96 | Amazon RDS Multi-AZ DB Cluster | データベース | Database/Relational |
| 97 | Amazon RDS Proxy | データベース | Database/Relational |
| 98 | Amazon Redshift | 分析 | Database/Warehouse |
| 99 | Amazon Route 53 | ネットワーク | Networking/DNS |
| 100 | RPO | DR 指標 | DR/Metrics |
| 101 | RTO | DR 指標 | DR/Metrics |
| 102 | Amazon S3 | ストレージ | Storage/Object |
| 103 | S3 Cross-Region Replication (CRR) | ストレージ | Storage/Object |
| 104 | S3 Intelligent-Tiering | ストレージ | Storage/Object |
| 105 | Amazon S3 Transfer Acceleration | データ転送 | Migration/Data |
| 106 | Savings Plans | コスト管理 | Management/Cost |
| 107 | AWS SAM | IaC | Management/IaC |
| 108 | AWS Schema Conversion Tool (SCT) | 移行 | Migration/Database |
| 109 | AWS Secrets Manager | セキュリティ/暗号化・秘密情報管理系 | Security/Encryption |
| 110 | AWS Security Hub | セキュリティ/検知・監査系 | Security/Detection |
| 111 | AWS Service Catalog | セキュリティ/組織ガバナンス・予防統制系 | Security/Governance |
| 112 | AWS Service Quotas | ガバナンス | Management/Operations |
| 113 | AWS Shield | セキュリティ/トラフィック制御系 | Security/Traffic |
| 114 | AWS Site-to-Site VPN | ネットワーク | Networking/Connectivity |
| 115 | AWS Snow Family | 移行・転送 | Migration/Data |
| 116 | Amazon SNS | メッセージング | AppIntegration/Messaging |
| 117 | Amazon SQS | メッセージング | AppIntegration/Messaging |
| 118 | AWS STS | セキュリティ/認証・認可系 | Security/IAM |
| 119 | AWS Step Functions | アプリケーション統合 | AppIntegration/Workflow |
| 120 | AWS Storage Gateway | ハイブリッドストレージ | Storage/Hybrid |
| 121 | AWS Systems Manager | 運用管理 | Management/Operations |
| 122 | AWS Transfer Family | データ転送 | Migration/Data |
| 123 | AWS Transit Gateway | ネットワーク | Networking/Connectivity |
| 124 | AWS Trusted Advisor | 最適化 | Management/Operations |
| 125 | Amazon VPC | ネットワーク | Networking/Core |
| 126 | VPC Endpoint | セキュリティ/トラフィック制御系 | Networking/Access |
| 127 | VPC Endpoint Policy | セキュリティ/トラフィック制御系 | Security/ResourcePolicy |
| 128 | VPC Flow Logs | セキュリティ/検知・監査系 | Security/Detection |
| 129 | AWS WAF | セキュリティ/トラフィック制御系 | Security/Traffic |
| 130 | AWS X-Ray | 監視 | Management/Monitoring |
| 131 | アシュームロール（AssumeRole） | セキュリティ/認証・認可系 | Security/IAM |
| 132 | ウォームスタンバイ | DR 戦略 | DR/Strategy |
| 133 | 加重ルーティング | DNS・トラフィック制御 | Networking/DNS |
| 134 | キャッシュアサイド（Cache Aside） | キャッシュ設計 | Database/InMemory |
| 135 | クラスタープレイスメントグループ | EC2 設計 | Computing/General |
| 136 | クロスリージョンリードレプリカ | データベース設計 | Database/Relational |
| 137 | コスト配分タグ | コスト管理 | Management/Cost |
| 138 | コントロールプレーン | AWS 共通概念 | DR/Concepts |
| 139 | サービスコントロールポリシー（SCP） | セキュリティ/組織ガバナンス・予防統制系 | Security/Governance |
| 140 | 署名付き URL | 配信制御 | Networking/CDN |
| 141 | セキュリティグループ（SG） | セキュリティ/トラフィック制御系 | Networking/Core |
| 142 | 地理的ルーティング | DNS・トラフィック制御 | Networking/DNS |
| 143 | データプレーン | AWS 共通概念 | DR/Concepts |
| 144 | ネットワーク ACL（NACL） | セキュリティ/トラフィック制御系 | Networking/Core |
| 145 | バケットポリシー (S3 Bucket Policy) | セキュリティ/認証・認可系 | Security/ResourcePolicy |
| 146 | バックアップ & リストア | DR 戦略 | DR/Strategy |
| 147 | パイロットライト | DR 戦略 | DR/Strategy |
| 148 | フェイルオーバー | 可用性設計 | DR/Concepts |
| 149 | フェイルオーバールーティング | DNS・トラフィック制御 | Networking/DNS |
| 150 | ヘルスチェック | 可用性設計 | DR/Concepts |
| 151 | マルチサイト | DR 戦略 | DR/Strategy |
| 152 | ユーザープール | セキュリティ/認証・認可系 | Security/Identity |
| 153 | ライトスルー（Write Through） | キャッシュ設計 | Database/InMemory |
| 154 | リードレプリカ | データベース設計 | Database/Relational |
| 155 | レイテンシールーティング | DNS・トラフィック制御 | Networking/DNS |
| 156 | ロールベースアクセス制御用 SAML | セキュリティ/認証・認可系 | Security/IAM |

---

## 3. 不足サービスと追加推奨の理由

### 3-1. AI/ML カテゴリ（全欠落）

| サービス名 | 優先度 | SAA-C03 での出題理由 |
|-----------|--------|----------------------|
| **Amazon Bedrock** | ★★★ 高 | 2024年 GA 後、生成 AI 活用アーキテクチャの問題が急増。SAA-C03 2026 版の正式範囲。|
| **Amazon SageMaker** | ★★★ 高 | ML モデルのトレーニング・推論基盤。AI/ML ワークロードの典型インフラとして問われやすい。|
| **Amazon Rekognition** | ★★ 中 | 画像・動画分析の代表。「S3 に画像を置いて分析」シナリオで頻出。|
| **Amazon Comprehend** | ★★ 中 | テキスト感情分析・エンティティ抽出。SNS 投稿などの分析シナリオで出題実績あり。|
| **Amazon Polly** | ★ 低 | テキスト→音声変換。コンテンツ配信問題の選択肢として稀に登場。|
| **Amazon Transcribe** | ★★ 中 | 音声→テキスト変換。コールセンターログ分析の文脈で出る。|
| **Amazon Translate** | ★ 低 | 多言語翻訳。グローバルコンテンツ問題の脇役として登場。|
| **Amazon Lex** | ★★ 中 | チャットボット。Lambda との組み合わせで問われやすい。|
| **Amazon Textract** | ★★ 中 | PDF・フォームからのテキスト抽出。ドキュメント処理パイプラインで登場。|
| **Amazon Kendra** | ★ 低 | 機械学習ベースの検索サービス。OpenSearch との差分を問われる可能性。|

### 3-2. IoT カテゴリ（全欠落）

| サービス名 | 優先度 | SAA-C03 での出題理由 |
|-----------|--------|----------------------|
| **AWS IoT Core** | ★★ 中 | MQTT プロトコルでデバイスを接続、ルールエンジンで Kinesis/S3/Lambda へ転送する設計パターン。|
| **AWS IoT Greengrass** | ★ 低 | エッジコンピューティング。Lambda をデバイス側で実行するシナリオで登場。|
| **AWS IoT SiteWise** | ★ 低 | 産業機器データ収集。製造業シナリオで稀に出題。|

### 3-3. Migration & Transfer カテゴリ（一部欠落）

| サービス名 | 優先度 | SAA-C03 での出題理由 |
|-----------|--------|----------------------|
| **AWS Database Migration Service (DMS)** | ★★★ 高 | SCT がスキーマ変換、DMS がデータ移行という役割分担が頻出。現行辞書に SCT のみ存在し DMS が欠落。|
| **AWS Application Migration Service (MGN)** | ★★ 中 | リフト&シフト移行の推奨サービス。DRS（災害復旧）との使い分けが問われる。|
| **AWS Migration Hub** | ★ 低 | 移行状況の一元追跡。移行計画の全体像を問う問題で登場。|
| **AWS AppFabric** | ★ 低 | SaaS アプリのログを正規化し SIEM へ統合。セキュリティ管理問題の新しい選択肢として 2024 以降登場。|

### 3-4. コンテナ・サーバーレス周辺（部分欠落）

| サービス名 | 優先度 | SAA-C03 での出題理由 |
|-----------|--------|----------------------|
| **AWS App Runner** | ★★ 中 | コンテナアプリの簡易デプロイ。Beanstalk・ECS Fargate との使い分け問題で出やすい。|
| **Amazon ECR (Elastic Container Registry)** | ★★ 中 | コンテナイメージのプライベートレジストリ。ECS/EKS パイプラインの必須コンポーネント。|
| **AWS Batch** | ★★ 中 | 大規模バッチジョブ管理。Lambda（短時間） vs Batch（長時間）の切り分けが頻出。|
| **Amazon VPC Lattice** | ★ 低 | マイクロサービス間通信の統合管理。2023 GA の新サービス。SAA-C03 での出題実績は限定的。|

### 3-5. ネットワーク・その他（部分欠落）

| サービス名 | 優先度 | SAA-C03 での出題理由 |
|-----------|--------|----------------------|
| **AWS Resource Access Manager (RAM)** | ★★ 中 | Transit Gateway など共有リソースのクロスアカウント共有で必須。TGW のエントリ内で言及のみ。|
| **Amazon MSK (Managed Streaming for Kafka)** | ★★ 中 | Kinesis Data Streams との比較問題で登場。既存 Kafka との互換性が問われる。|
| **Amazon Neptune** | ★★ 中 | グラフデータベース。「友達の友達」型クエリの典型シナリオで出る。|
| **Amazon MemoryDB for Redis** | ★ 低 | ElastiCache for Redis との差分（永続性）が問われる可能性。|
| **Amazon Timestream** | ★ 低 | IoT センサーデータなど時系列データの分析。IoT パイプラインで出る。|
| **Amazon Pinpoint** | ★ 低 | メール・SMS・プッシュ通知のマーケティング配信。SNS との差分問題で登場。|
| **AWS AppSync** | ★★ 中 | GraphQL API のマネージドサービス。API Gateway との使い分けで 2024 以降増加傾向。|
| **Amazon SES (Simple Email Service)** | ★★ 中 | トランザクションメール送信。SNS（通知）と SES（メール配信基盤）の違いで出る。|
| **Amazon Lightsail** | ★ 低 | EC2 の簡易版 VPS。「最もシンプルな Web ホスティング」問題で稀に登場。|

---

## 4. 設計上の懸念点と提案

### 4-1. 現行カテゴリ名の非統一問題

現在、以下のような不統一が見られる。

| 問題 | 例 | 提案 |
|------|-----|------|
| 英語 / 日本語が混在 | `ネットワーク・コンテンツ配信` vs `Networking/CDN` | 全面英語か全面日本語に統一 |
| 階層なしカテゴリが混在 | `DR・移行`、`移行・転送`、`移行` が別々に使われている | `Migration/Server`・`Migration/Data`・`Migration/Database` に整理 |
| 同一サービスが文脈カテゴリに入っている | Data Firehose が `データ転送` (移行寄り) に分類 | Analytics/Streaming に移動 |

### 4-2. 兼任サービスの扱い

Redshift は分析 DB のため `Database/Warehouse` を主とし、分析文脈では `Analytics/Warehouse` も許容するダブルタグ制を提案する。
同様に、VPC Flow Logs は `Security/Detection` を主としつつ `Networking/Core` との兼任を許容する。

### 4-3. 優先度に基づく追加推奨順

次フェーズで辞書に追加すべき優先順位（★★★ → ★★ の順）:

1. **AWS DMS** — SCT との役割分担が頻出。最優先で追加。
2. **Amazon Bedrock** — SAA-C03 2026 正式範囲。生成 AI 設計の基礎として重要。
3. **Amazon SageMaker** — AI/ML ワークロードの代表。
4. **AWS App Runner** — コンテナ選択問題でBeanstalk・ECS との三択として頻出。
5. **Amazon ECR** — ECS/EKS 問題の前提コンポーネント。
6. **AWS Batch** — Lambda との使い分けが基本論点。
7. **AWS Resource Access Manager (RAM)** — TGW 共有の標準手段として Transit Gateway エントリと対にして追加。
8. **Amazon MSK** — Kinesis との比較問題。既存 Kafka 移行シナリオで頻出。
9. **Amazon Neptune** — グラフ DB の代表。DB 比較問題で登場。
10. **AWS Application Migration Service (MGN)** — DRS との使い分け。
11. **Amazon Rekognition / Lex / Transcribe** — AI/ML 選択問題の選択肢として。
12. **AWS IoT Core** — IoT → Kinesis → S3 パイプラインの起点として重要。
13. **Amazon SES** — SNS との比較問題。
14. **AWS AppSync** — API Gateway との比較問題 (GraphQL)。

### 4-4. フロントエンド実装との互換性

現行の `src/types.ts` では `category: string` で統一されているため、`/` 区切りの `親/子` 形式は技術的に許容される。ただし、UIフィルタリング実装時には:

- `親カテゴリ` でまとめてフィルタ
- `親/子カテゴリ` で詳細フィルタ

の 2 段階フィルタロジックを追加する必要がある点を考慮すること。

---

## 5. 調査サマリー

| 項目 | 件数 |
|------|------|
| 現行エントリ総数 | 156 件 |
| 提案する親カテゴリ数 | 11 |
| 提案するサブカテゴリ数 | 43 |
| 追加推奨サービス（★★★）| 2 件 (Bedrock, DMS) |
| 追加推奨サービス（★★）| 12 件 |
| 追加推奨サービス（★）| 13 件 |
| 完全欠落の主要分野 | AI/ML, IoT |
| 部分欠落の分野 | Migration, Container/Serverless 周辺 |
