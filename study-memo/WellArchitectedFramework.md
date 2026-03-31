
## セキュリティ
- IAMで最小権限の原則を徹底する
- データの転送中、保存時を暗号化（KMS/SSL/TLS）
- CloudTrailで全操作ログを記録・監査
- VPC/SG/WAF/Shieldで多層防御
- セキュリティイベントへの自動対応（Event Bridge + Lambda）

## 信頼性
- マルチAZ、マルチリージョンで冗長化
- AutoScaringで需要変動に自動対応
- RDSスナップショットなどで定期バックアップ
- CloudWatch Alerm＋Lambdaで自動検知・自動復旧
- SQS/SNSで素結合アーキテクチャを実現

## パフォーマンス効率
- 用途にあった適切なインスタンスタイプ・ファミリーを選択
- サーバーレス（Lambda／Fargate）でオーバーヘッド削減
- CloudFront（CDN）でレイテンシを低減
- ElastiCacheでキャッシュを活用
- ベンチマークと負荷テストで定期的に最適化

## コスト最適化
- リザーブドインスタンスで最高72%割引
- スポットインスタンスで中断可能なワークロードを安価に処理
- 未使用のEBS／Elastic IP／NATゲートウェイを定期的に削除
- S3ライフサイクルポリシーで低コストストレージ層に移行
- Cost Explorer / Budgets でコストを可視化・アラート設定

## 運用上の優秀性
- CloudFormation / CDKで環境を再現可能に
- CodePipelineで小さく頻繁なデプロイを実現
- CloudWatchでメトリクス・ログ・トレースを一元管理
    - メトリクス：CPU使用率とかの数値データまとめ（どのくらい動いていたか）
    - ログ：何が起きた
    - トレース：どうリクエストが流れた（根本原因調査）
- 運用ランブックをSystems Managerで自動化

## 持続可能性
- アイドルリソースを削除し、使用率を最大化
- Fargate / Aurora Serverless でサーバー管理をAWSに委譲
- 再生可能エネルギー使用率が高いリージョンを優先選択
- 不要なデータをGlacierへアーカイブ or 削除
- Graviton（ARM）プロセッサで電力効率を向上
