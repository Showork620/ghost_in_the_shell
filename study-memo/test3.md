1
Auto Scalingグループ

クラスタープレイスメントグループ
- 複数のEC2インスタンスを論理的にグループ化し、インスタンス間での低遅延通信やハード障害影響を軽減する。
- 特にクラスタープレイスメントグループは、グループ内のEC2インスタンスを単一AZ内の近距離に配置し、さらに遅延が少ない

Route 53
- レイテンシールーティングポリシー
  - CDN
- フェイルオーバールーティングポリシー
  - プライマリが落ちたらセカンダリへ

2
AutoScalingへのトリガーは
- 基本: CloudWatch
- 補助: スケジュール、ヘルスチェック（ヘルスチェックは入れ替えのトリガー）
- 拡張: EventBridge + Lambda


4
DailyReportFunction


6
SMBプロコトル
 
NFS（ネットワークファイルシステム）
- Linux系で標準で使われる
- サーバのディレクトリをローカルのようにマウント
- 高速・低オーバーヘッド
- 用途
  - Linuxサーバ同士の共有ストレージに用いる
- AWSとの対応
  - EHSを使う

SMB（Server Message Block）
- Windows系で標準で使われる
- 認証認可が強力
- 用途
  - Windowsファイルサーバ
  - 社内共有フォルダ
  - ユーザー単位アクセス制御が必要な環境
- AWSとの対応
  - FSx for Windows File Server



FSx for NetApp ONTAP

EMR
- ビッグデータ処理・分析（大規模）

OpenSearch Service


7
クラスタープレイスメントグループ
スプレッドプレイスメントグループ
クロスリージョンVPCピアリング

8
Data Firehose
- ストリーミングデータをとりあえず安全に貯めて運ぶサービス

AppFlow
- 様々なSaaSアプリとAWSサービス間でデータを転送するサービス

9
KMS
- KMSキーポリシーでLambda実行ロールによるキーの使用を許可
- Lambda実行ロールのIAMポリシーにKMSの複合権限を付与する
KMSキーへのアクセス制御はKMSキーポリシーで設定する
アクセス制御したいサービスに対してポリシーを設定する

10
Global Accelerator
ユーザーからAQSリソースまでのアクセス経路をAWSグローバルネットワークを利用して最適化するサービス
RTMP（Real Time Messaging Protocol）はTCPベースのストリーミングプロトコル。
ライブ配信（AWSへアップロード）、ゲーム、金融

CloudFront
静的またはキャッシュ可能な動的コンテンツを効率よく配信する

- EFS
  - NFS（Linux）をサポートするファイルストレージサービス
  - 複数EC2から

- EBS
  - 複数のインスタンスからアタッチできない

- ACID（Atomicity, Consistency, Isolation, Durability）
  - 更新処理中に中途半端なデータが書き込まれないことや、並行処理で互いに干渉しないことなど、処理の信頼性を保証する。
  ー EFSは強力な整合性を採用してる
  - 複数のAZで冗長化しており耐久性も高い
