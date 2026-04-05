#!/usr/bin/env python3
"""辞書ファイルのカテゴリを一括置換するスクリプト"""

# 見出し(heading)→新カテゴリのマッピング
HEADING_TO_CATEGORY = {
    "ABAC (Attribute-Based Access Control)": "Security/IAM",
    "AWS IAM Access Analyzer": "Security/Detection",
    "ALB listener rule (ALB リスナールール)": "Networking/LoadBalancing",
    "AMI (Amazon Machine Image)": "Computing/General",
    "AWS Managed Service for Apache Flink": "Analytics/Streaming",
    "Amazon API Gateway": "AppIntegration/API",
    "Amazon AppFlow": "AppIntegration/DataFlow",
    "AWS Application Recovery Controller (ARC)": "DR/Strategy",
    "ARN": "Management/Operations (概念)",
    "AWS Artifact": "Security/Governance",
    "Amazon Athena": "Analytics/Query",
    "Amazon Aurora": "Database/Relational",
    "Aurora Global Database": "Database/Relational",
    "AWS Backup": "Management/Backup",
    "AWS Budgets": "Management/Cost",
    "AWS CDK": "Management/IaC",
    "AWS Certificate Manager (ACM)": "Security/Encryption",
    "AWS CloudFormation": "Management/IaC",
    "CloudFormation StackSets": "Management/IaC",
    "Amazon CloudFront": "Networking/CDN",
    "CloudFront + AWS WAF": "Security/Traffic",
    "AWS CloudHSM": "Security/Encryption",
    "AWS CloudTrail": "Security/Detection",
    "Amazon CloudWatch": "Management/Monitoring",
    "CloudWatch Logs": "Management/Monitoring",
    "Amazon Cognito": "Security/Identity",
    "AWS CodeBuild": "Management/DevOps",
    "AWS CodeDeploy": "Management/DevOps",
    "AWS CodePipeline": "Management/DevOps",
    "AWS Compute Optimizer": "Management/Cost",
    "AWS Config": "Security/Governance",
    "AWS Config Rules": "Security/Governance",
    "AWS Control Tower": "Security/Governance",
    "AWS Cost Anomaly Detection": "Management/Cost",
    "AWS Cost and Usage Report (CUR)": "Management/Cost",
    "AWS Cost Explorer": "Management/Cost",
    "Amazon Data Firehose": "Analytics/Streaming",
    "Amazon Data Lifecycle Manager (DLM)": "Management/Backup",
    "AWS DataSync": "Migration/Data",
    "Amazon Detective": "Security/Detection",
    "AWS Direct Connect": "Networking/Connectivity",
    "AWS Directory Service": "Security/IAM",
    "Amazon DocumentDB": "Database/NoSQL",
    "Amazon DynamoDB": "Database/NoSQL",
    "DynamoDB Accelerator (DAX)": "Database/NoSQL",
    "DynamoDB Global Tables": "Database/NoSQL",
    "DynamoDB Streams": "AppIntegration/Workflow",
    "Amazon EBS": "Storage/Block",
    "EBS Snapshot": "Management/Backup",
    "EBS / RDS / S3 暗号化": "Security/Encryption",
    "Amazon EC2": "Computing/General",
    "EC2 Auto Scaling": "Computing/General",
    "EC2 Spot Instances": "Computing/General",
    "Amazon ECS": "Computing/Container",
    "Amazon EFS": "Storage/File",
    "Amazon EKS": "Computing/Container",
    "Amazon ElastiCache": "Database/InMemory",
    "ElastiCache Global Datastore": "Database/InMemory",
    "AWS Elastic Beanstalk": "Computing/General",
    "AWS Elastic Disaster Recovery (DRS)": "Migration/Server",
    "Elastic IP": "Networking/Access",
    "Elastic Load Balancing (ELB)": "Networking/LoadBalancing",
    "Amazon EMR": "Analytics/BigData",
    "Amazon EventBridge": "AppIntegration/Workflow",
    "AWS Fargate": "Computing/Container",
    "AWS Firewall Manager": "Security/Traffic",
    "Amazon FSx": "Storage/File",
    "AWS Global Accelerator": "Networking/Access",
    "AWS Glue": "Analytics/Catalog",
    "AWS Glue Data Catalog": "Analytics/Catalog",
    "AWS Graviton": "Computing/General",
    "Amazon GuardDuty": "Security/Detection",
    "AWS Health Dashboard": "Management/Operations",
    "IAM": "Security/IAM",
    "IAM Identity Center": "Security/Identity",
    "Identity Pool (ID プール)": "Security/Identity",
    "Amazon Inspector": "Security/Detection",
    "Amazon Kinesis Data Streams": "Analytics/Streaming",
    "AWS KMS": "Security/Encryption",
    "KMS Key Policy (キーポリシー)": "Security/IAM",
    "AWS Lake Formation": "Analytics/Catalog",
    "AWS Lambda": "Computing/Serverless",
    "Amazon Macie": "Security/Detection",
    "NAT Gateway": "Networking/Access",
    "Amazon MQ": "AppIntegration/Messaging",
    "AWS Network Firewall": "Security/Traffic",
    "Amazon OpenSearch Service": "Analytics/Query",
    "AWS Organizations": "Security/Governance",
    "Systems Manager Parameter Store": "Security/Encryption",
    "AWS Pricing Calculator": "Management/Cost",
    "AWS PrivateLink": "Networking/Access",
    "Amazon QuickSight": "Analytics/Visualization",
    "Resource-based Policy (リソースベースポリシー)": "Security/ResourcePolicy",
    "Reserved Instances (RI)": "Management/Cost",
    "Amazon RDS": "Database/Relational",
    "Amazon RDS Multi-AZ DB Cluster": "Database/Relational",
    "Amazon RDS Proxy": "Database/Relational",
    "Amazon Redshift": "Database/Warehouse",
    "Amazon Route 53": "Networking/DNS",
    "RPO": "DR/Metrics",
    "RTO": "DR/Metrics",
    "Amazon S3": "Storage/Object",
    "S3 Cross-Region Replication (CRR)": "Storage/Object",
    "S3 Intelligent-Tiering": "Storage/Object",
    "Amazon S3 Transfer Acceleration": "Migration/Data",
    "Savings Plans": "Management/Cost",
    "AWS SAM": "Management/IaC",
    "AWS Schema Conversion Tool (SCT)": "Migration/Database",
    "AWS Secrets Manager": "Security/Encryption",
    "AWS Security Hub": "Security/Detection",
    "AWS Service Catalog": "Security/Governance",
    "AWS Service Quotas": "Management/Operations",
    "AWS Shield": "Security/Traffic",
    "AWS Site-to-Site VPN": "Networking/Connectivity",
    "AWS Snow Family": "Migration/Data",
    "Amazon SNS": "AppIntegration/Messaging",
    "Amazon SQS": "AppIntegration/Messaging",
    "AWS STS": "Security/IAM",
    "AWS Step Functions": "AppIntegration/Workflow",
    "AWS Storage Gateway": "Storage/Hybrid",
    "AWS Systems Manager": "Management/Operations",
    "AWS Transfer Family": "Migration/Data",
    "AWS Transit Gateway": "Networking/Connectivity",
    "AWS Trusted Advisor": "Management/Operations",
    "Amazon VPC": "Networking/Core",
    "VPC Endpoint": "Networking/Access",
    "VPC Endpoint Policy (VPC エンドポイントポリシー)": "Security/ResourcePolicy",
    "VPC Flow Logs": "Security/Detection",
    "AWS WAF": "Security/Traffic",
    "AWS X-Ray": "Management/Monitoring",
    "アシュームロール（AssumeRole）": "Security/IAM",
    "ウォームスタンバイ": "DR/Strategy",
    "加重ルーティング": "Networking/DNS",
    "キャッシュアサイド（Cache Aside）": "Database/InMemory",
    "クラスタープレイスメントグループ": "Computing/General",
    "クロスリージョンリードレプリカ": "Database/Relational",
    "コスト配分タグ": "Management/Cost",
    "コントロールプレーン": "DR/Concepts",
    "サービスコントロールポリシー（SCP）": "Security/Governance",
    "署名付き URL": "Networking/CDN",
    "セキュリティグループ（SG）": "Networking/Core",
    "地理的ルーティング": "Networking/DNS",
    "データプレーン": "DR/Concepts",
    "ネットワーク ACL（NACL）": "Networking/Core",
    "バケットポリシー (S3 Bucket Policy)": "Security/ResourcePolicy",
    "バックアップ & リストア": "DR/Strategy",
    "パイロットライト": "DR/Strategy",
    "フェイルオーバー": "DR/Concepts",
    "フェイルオーバールーティング": "Networking/DNS",
    "ヘルスチェック": "DR/Concepts",
    "マルチサイト": "DR/Strategy",
    "ユーザープール": "Security/Identity",
    "ライトスルー（Write Through）": "Database/InMemory",
    "リードレプリカ": "Database/Relational",
    "レイテンシールーティング": "Networking/DNS",
    "ロールベースアクセス制御用 SAML": "Security/IAM",
}

DICT_PATH = "study-memo/AWSSAA_Dictionary_2026.md"

with open(DICT_PATH, "r", encoding="utf-8") as f:
    lines = f.readlines()

result = []
current_heading = None
category_replaced = False
replaced_count = 0
unmatched = []

for line in lines:
    stripped = line.rstrip("\n")
    if stripped.startswith("### "):
        current_heading = stripped[4:]
        category_replaced = False
        result.append(line)
    elif stripped.startswith("- **カテゴリ**:") and current_heading and not category_replaced:
        new_cat = HEADING_TO_CATEGORY.get(current_heading)
        if new_cat:
            result.append(f"- **カテゴリ**: {new_cat}\n")
            replaced_count += 1
            category_replaced = True
        else:
            unmatched.append(current_heading)
            result.append(line)
    else:
        result.append(line)

with open(DICT_PATH, "w", encoding="utf-8") as f:
    f.writelines(result)

print(f"置換完了: {replaced_count} 件")
if unmatched:
    print(f"マッチしなかった見出し ({len(unmatched)} 件):")
    for h in unmatched:
        print(f"  - {repr(h)}")
