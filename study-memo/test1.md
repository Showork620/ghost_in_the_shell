
1
RDS MySQL
DR問題
ElasticCache: パフォーマンス改善

2
Glue: ETL（抽出・変換・書き出し）特化サービス
Athena: S3データに対してSQLクエリを実行できる
EMR: ビッグデータ処理・分析（大規模）
Data Firehose: リアルタイムに宛先に送信するサービス
Redshift: データ分析用のSQL専用データベース

3
Strage Gateway: オンプレとAWSを連携させるサービス
DataSync: オンプレとAWSを連携させるサービス
Snowball: 物理的にデバイスを送ってS3に保存するサービス
S3の種類

4
プライマリからセカンダリに自動で切り替え裏仕組み: フェイルオーバー
Route53の種類

5
Direct Connect: インターネットを介さず繋げる。セキュア・安定。
リクエストの急増時: AutoScaring
ELB: 総称
 - ALB: 振り分ける（UDP非対応）
 - NLB: とにかく早く流す（TCPとUDPに対応）
AMI: EC2の設計図

- ヘルスチェックについて
  - ALB
    - EC2単位のチェック
    - 死んだEC2に送らないようにするだけ
    - CloudeWatch

  - Route 53
    - サービスやリージョン単位で生きてるか
    - プライマリが死んだらセカンダリへ（別リージョンが一般的）
  - 

6
Network Firewall: SGやネットワークACLより高度。I/Oトラフィックを検査できる。（ファイアウォールエンドポイントとプライベートサブネットを接続、ファイワウォールサブネットとNATゲートウェイが接続）
Firewall Manager: 複数のAWSアカウントやサービスを対象にfirewallルールを設定・一元管理する。ネットワークトラフィックを制御する機能はない。
Shield: DDoS攻撃から保護するサービス。APIとの通信以外をブロックする。
 
- SG: EC2に直接につける
- NACL: サブネットに適用
- Network Firewall: ファイアウォールサブネットに配置
- WAF（Web Application Firewall）: HTTPリクエストの中身を見て何を通すか決める。Web入口に配置。

WAF
- WEB ACLが分析するWebリクエストの詳細をログとして記録できます。
- このログを Data Firehose を使用して分析用のS3バケットに配信可能。

アウト/インバウンド通信: 誰がリクエストを送ってるかに着目

7
Schema Conversion Tool: データベースのスキーマを別のデータベースエンジンに変換する無料ツール

8
Security Hub: サードーティ含む各種セキュリティサービスからのアラートやデータを自動集約・管理
Systems Manager Patch Manager: EC2やオンプレのOSパッチを管理する
cron: Linuxで使える、決まった時間に自動で処理を実行する仕組み。
Elastic Beanstalk: アプリのデプロイ用の環境構築サービス。EC2やELB、AutoScaringなどを自動で構築してくれる。（0→1用）

9
VPCエンドポイント: プライベートサブネット内のAWSリソースから、インターネットゲートウェイを経由せず、VPC外のAWSサービスにアクセスできるようにする
NATゲートウェイ: プライベートサブネットからインターネットにアクセスできるようにする
IAM Identity Center: 
ユーザープール: 認証。
IDプール: 認可。STS（一時的な認証情報）を付与したり。

10
ARN: 
IAMポリシー
 - Effect: 許可または拒否
 - Action: AWSリソースに対して実行できる操作
 - Resource: Action対象となるリソース
 - Condition: ポリシー適用される条件（特定のIPアドレス範囲からのアクセス）

ARN（Amazon Resource Name）: 記述形式

ECS主要要素
 - クラスター: 
 - タスク: コンテナの実行単位
 - サービス

ECS
- コンテナを提供する
- マイクロサービスはコンテナで動かすのが適してる


IAMロール
tskRoleArn: コンテナが他のAWSサービスを利用する際に設定するロール
executonRoleArn: ECSがタスクを起動・管理するためのロール