## マルチサイト
- RPO: ほぼゼロ
- RTO: ほぼゼロ
- コスト最高
- 金融・医療など
- 主な関連サービス
  - Route 53（フェイルオーバー）
  - Aurora Global DB
  - RDS Multi-AZ
  - Global Accelerator
  - S3 クロスリージョンレプリケーション

## ウォームアップ
- RTO: 数分
- RPO: 数秒
- スタンバイ環境のコストがかかる
- 数時間停止は許容できないWEBサービス、業務システムなど
- 主な関連サービス
  - EC2 Auto Scaling
  - RDS リードレプリカ（別リージョン）
  - Route 53 ヘルスチェック
  - Elastic Load Balancer
  - CloudWatch アラーム

## パイロットライト
- RTO: 数十分
- RPO: 数分
- コストは中程度
- 上記を許容できる中規模システム
- 主な関連サービス
  - RDS クロスリージョンレプリカ
  - AMI（最新を常時更新）
  - EC2（停止状態で待機）
  - CloudFormation
  - Route 53

## バックアップ&リストア
- RTO: 数時間〜1日
- RPO: 数時間
- コスト最低
- 開発・検証環境や重要度の低い社内システム
- 主な関連サービス
  - S3（バックアップ保存）
  - RDS 自動スナップショット
  - EBS スナップショット
  - AWS Backup
  - CloudFormation（環境再構築）
  
