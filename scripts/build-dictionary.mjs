import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(workspaceRoot, 'study-memo', 'AWSSAA_Dictionary_2026.md');
const outputPath = path.join(workspaceRoot, 'src', 'data', 'generated', 'dictionary.json');
const comparisonSourcePath = path.join(
  workspaceRoot,
  'study-memo',
  'AWSSAA_類似サービス比較チートシート.md',
);
const comparisonOutputPath = path.join(
  workspaceRoot,
  'src',
  'data',
  'generated',
  'comparison-pages.json',
);

const CATEGORY_MAP = {
  'AWS 共通概念': '運用・ガバナンス',
  DevOps: '運用・ガバナンス',
  'DNS・トラフィック制御': 'ネットワーク',
  'DR 指標': 'DR・可用性',
  'DR 戦略': 'DR・可用性',
  'DR・移行': '移行・ハイブリッド',
  'DR・可用性': 'DR・可用性',
  'EC2 設計': 'コンピューティング',
  IaC: '運用・ガバナンス',
  PaaS: 'コンピューティング',
  'アプリケーション統合': 'アプリ統合',
  'イベント駆動': 'アプリ統合',
  'ガバナンス': '運用・ガバナンス',
  'キャッシュ設計': 'データベース',
  'コスト管理': '運用・ガバナンス',
  'コンテナ': 'コンピューティング',
  'コンピューティング': 'コンピューティング',
  'サーバーレス': 'コンピューティング',
  'ストリーミング': 'アプリ統合',
  'ストレージ': 'ストレージ',
  'ストレージセキュリティ': 'ストレージ',
  'セキュリティ': 'セキュリティ',
  'セキュリティ・コンプライアンス': 'セキュリティ',
  'データベース': 'データベース',
  'データベース設計': 'データベース',
  'データ転送': 'アプリ統合',
  'ネットワーク': 'ネットワーク',
  'ネットワーク・コンテンツ配信': 'ネットワーク',
  'ネットワークセキュリティ': 'ネットワーク',
  'ハイブリッドストレージ': '移行・ハイブリッド',
  'バックアップ': 'ストレージ',
  'メッセージング': 'アプリ統合',
  'モニタリング': '運用・ガバナンス',
  '移行': '移行・ハイブリッド',
  '移行・転送': '移行・ハイブリッド',
  '運用管理': '運用・ガバナンス',
  '可用性設計': 'DR・可用性',
  '監査': 'セキュリティ',
  '監視': '運用・ガバナンス',
  '構成管理': '運用・ガバナンス',
  '最適化': '運用・ガバナンス',
  '認可': 'セキュリティ',
  '認証': 'セキュリティ',
  '認証・ディレクトリ': 'セキュリティ',
  '認証・認可': 'セキュリティ',
  '認証連携': 'セキュリティ',
  '配信制御': 'ネットワーク',
  '分析': '分析',
};

const ALLOWED_TAGS = [
  '#運用上の優秀性',
  '#セキュリティ',
  '#信頼性',
  '#パフォーマンス効率',
  '#コスト最適化',
  '#持続可能性',
  '#Backup&Restore',
  '#Pilot Light',
  '#Warm Standby',
  '#Multi Site',
];

const TAG_NORMALIZATION_MAP = {
  '#Warmup Standby': '#Warm Standby',
};

const ITEM_ALIAS_MAP = {
  ALB: ['Application Load Balancer'],
  Artifact: ['AWS Artifact'],
  Athena: ['Amazon Athena'],
  Aurora: ['Amazon Aurora'],
  Budgets: ['AWS Budgets'],
  CloudFront: ['Amazon CloudFront'],
  CloudHSM: ['AWS CloudHSM'],
  CloudTrail: ['AWS CloudTrail'],
  CloudWatch: ['Amazon CloudWatch'],
  'Cognito Identity Pool': ['Identity Pool', 'ID プール', 'Identity Pool (ID プール)'],
  'Cognito User Pool': ['Amazon Cognito', 'Cognito'],
  'Cost Anomaly Detection': ['AWS Cost Anomaly Detection'],
  'Cost Explorer': ['AWS Cost Explorer'],
  CUR: ['AWS Cost and Usage Report', 'Cost and Usage Report'],
  DAX: ['DynamoDB Accelerator', 'DynamoDB Accelerator (DAX)'],
  DataSync: ['AWS DataSync'],
  Detective: ['Amazon Detective'],
  'Direct Connect': ['AWS Direct Connect'],
  DocumentDB: ['Amazon DocumentDB'],
  DLM: ['Amazon Data Lifecycle Manager', 'Data Lifecycle Manager'],
  DynamoDB: ['Amazon DynamoDB'],
  ECS: ['Amazon ECS'],
  EFS: ['Amazon EFS'],
  EKS: ['Amazon EKS'],
  EBS: ['Amazon EBS'],
  EC2: ['Amazon EC2'],
  EMR: ['Amazon EMR'],
  EventBridge: ['Amazon EventBridge'],
  Fargate: ['AWS Fargate'],
  FSx: ['Amazon FSx'],
  GuardDuty: ['Amazon GuardDuty'],
  'Global Accelerator': ['AWS Global Accelerator'],
  'IAM Identity Center': ['Identity Center'],
  Inspector: ['Amazon Inspector'],
  KMS: ['AWS KMS'],
  Lambda: ['AWS Lambda'],
  Macie: ['Amazon Macie'],
  NACL: ['Network ACL', 'ネットワーク ACL'],
  NLB: ['Network Load Balancer'],
  'NAT Gateway': ['NAT'],
  OpenSearch: ['Amazon OpenSearch Service'],
  'Parameter Store': ['Systems Manager Parameter Store', 'SSM Parameter Store'],
  'PrivateLink': ['AWS PrivateLink'],
  RDS: ['Amazon RDS'],
  'Redis/Valkey': ['ElastiCache for Redis', 'Valkey', 'Amazon ElastiCache'],
  'Route 53': ['Amazon Route 53'],
  S3: ['Amazon S3'],
  'Security Group': ['セキュリティグループ'],
  'Security Hub': ['AWS Security Hub'],
  'Secrets Manager': ['AWS Secrets Manager'],
  SNS: ['Amazon SNS'],
  SQS: ['Amazon SQS'],
  STS: ['AWS STS', 'AssumeRole', 'アシュームロール'],
  'Storage Gateway': ['AWS Storage Gateway'],
  'Snow Family': ['AWS Snow Family'],
  'Site-to-Site VPN': ['AWS Site-to-Site VPN'],
  'Transfer Family': ['AWS Transfer Family'],
  'VPC Endpoint': ['VPC エンドポイント', 'Gateway Endpoint', 'Interface Endpoint'],
};

const raw = await readFile(sourcePath, 'utf8');
const lines = raw.split(/\r?\n/);

const cards = [];
let currentSection = 'A-Z のサービス・英字用語';
let currentCard = null;

const pushCurrentCard = () => {
  if (!currentCard) {
    return;
  }

  if (
    !currentCard.category ||
    !currentCard.summary ||
    !currentCard.examPoint ||
    !currentCard.useCase
  ) {
    throw new Error(`Incomplete card detected: ${currentCard.title}`);
  }

  const { category, parentCategory } = normalizeCategory(currentCard.category);
  cards.push({
    ...currentCard,
    category,
    parentCategory,
    tags: normalizeTags(currentCard.tags),
    id: createHash('sha1').update(currentCard.title).digest('hex').slice(0, 12),
  });
};

function normalizeCategory(category) {
  const normalized = CATEGORY_MAP[category] ?? category;
  if (normalized.includes('/')) {
    const [parent, child] = normalized.split('/');
    return { parentCategory: parent.trim(), category: child.trim() };
  }
  return { category: normalized.trim() };
}

function normalizeTags(tags) {
  const normalized = tags
    .map((tag) => TAG_NORMALIZATION_MAP[tag] ?? tag)
    .filter((tag) => ALLOWED_TAGS.includes(tag));

  return [...new Set(ALLOWED_TAGS.filter((tag) => normalized.includes(tag)))];
}

for (const line of lines) {
  const sectionMatch = line.match(/^##\s+(.+)$/);
  if (sectionMatch) {
    currentSection = sectionMatch[1].trim();
    continue;
  }

  const titleMatch = line.match(/^###\s+(.+)$/);
  if (titleMatch) {
    pushCurrentCard();
    currentCard = {
      title: titleMatch[1].trim(),
      category: '',
      tags: [],
      summary: '',
      examPoint: '',
      useCase: '',
      section: currentSection,
      type: currentSection.includes('重要用語') ? 'concept' : 'service',
    };
    continue;
  }

  if (!currentCard) {
    continue;
  }

  const categoryMatch = line.match(/^- \*\*カテゴリ\*\*: (.+)$/);
  if (categoryMatch) {
    currentCard.category = categoryMatch[1].trim();
    continue;
  }

  const tagsMatch = line.match(/^- \*\*タグ\*\*: (.+)$/);
  if (tagsMatch) {
    currentCard.tags = [...tagsMatch[1].matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    continue;
  }

  const summaryMatch = line.match(/^- \*\*概要\*\*: (.+)$/);
  if (summaryMatch) {
    currentCard.summary = summaryMatch[1].trim();
    continue;
  }

  const examMatch = line.match(/^- \*\*SAA試験でのポイント\*\*: (.+)$/);
  if (examMatch) {
    currentCard.examPoint = examMatch[1].trim();
    continue;
  }

  const useCaseMatch = line.match(/^- \*\*どういう時に使うサービスか\*\*: (.+)$/);
  if (useCaseMatch) {
    currentCard.useCase = useCaseMatch[1].trim();
  }
}

pushCurrentCard();

const comparisonRaw = await readFile(comparisonSourcePath, 'utf8');
const comparisonPages = parseComparisonPages(comparisonRaw, cards);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(cards, null, 2), 'utf8');
await writeFile(comparisonOutputPath, JSON.stringify(comparisonPages, null, 2), 'utf8');

console.log(`Generated ${cards.length} cards at ${outputPath}`);
console.log(`Generated ${comparisonPages.length} comparison pages at ${comparisonOutputPath}`);

function parseComparisonPages(markdown, dictionaryCards) {
  const pages = [];
  const mdLines = markdown.split(/\r?\n/);
  const cardAliasIndex = buildCardAliasIndex(dictionaryCards);
  let currentSection = '';
  let currentPage = null;
  let currentTableLines = [];
  let currentGuideTitle = '';
  let currentGuideItems = [];

  const finalizePage = () => {
    if (!currentPage) {
      return;
    }

    if (currentTableLines.length < 2 || currentGuideItems.length === 0) {
      currentPage = null;
      currentTableLines = [];
      currentGuideTitle = '';
      currentGuideItems = [];
      return;
    }

    const guideItems = currentGuideItems.map((item) => {
      const relatedCardIds = resolveRelatedCardIds(item.name, item.aliases, cardAliasIndex);

      return {
        ...item,
        relatedCardIds,
      };
    });

    const page = {
      id: createHash('sha1')
        .update(`${currentSection}:${currentPage.title}`)
        .digest('hex')
        .slice(0, 12),
      section: currentSection,
      title: currentPage.title,
      table: parseMarkdownTable(currentTableLines),
      guideTitle: currentGuideTitle,
      guideItems,
      relatedCardIds: [...new Set(guideItems.flatMap((item) => item.relatedCardIds))],
    };

    pages.push(page);
    currentPage = null;
    currentTableLines = [];
    currentGuideTitle = '';
    currentGuideItems = [];
  };

  for (const line of mdLines) {
    const trimmed = line.trim();
    const sectionMatch = line.match(/^##\s+(.+)$/);
    if (sectionMatch) {
      finalizePage();
      currentSection = sectionMatch[1].trim();
      continue;
    }

    const titleMatch = line.match(/^###\s+(.+)$/);
    if (titleMatch) {
      finalizePage();
      currentPage = { title: titleMatch[1].trim() };
      currentTableLines = [];
      currentGuideTitle = '';
      currentGuideItems = [];
      continue;
    }

    if (!currentPage) {
      continue;
    }

    const guideTitleMatch = line.match(/^####\s+(.+)$/);
    if (guideTitleMatch) {
      currentGuideTitle = guideTitleMatch[1].trim();
      continue;
    }

    if (!currentGuideTitle && trimmed.startsWith('|')) {
      currentTableLines.push(line);
      continue;
    }

    if (currentGuideTitle) {
      const guideItem = parseGuideItem(line);
      if (guideItem) {
        currentGuideItems.push(guideItem);
      }
    }
  }

  finalizePage();
  return pages;
}

function parseMarkdownTable(lines) {
  const rows = lines.map((line) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim()),
  );

  return {
    headers: rows[0],
    rows: rows.slice(2).map((cells) => ({
      label: cells[0],
      values: cells.slice(1),
    })),
  };
}

function parseGuideItem(line) {
  const match = line.match(/^- \*\*(.+?)\*\*: (.+)$/);
  if (!match) {
    return null;
  }

  const name = match[1].trim();
  const body = match[2].trim();
  const exampleStart = body.indexOf('出題例:');
  const clue = exampleStart === -1 ? body : body.slice(0, exampleStart).trim();
  const example = exampleStart === -1 ? '' : body.slice(exampleStart + '出題例:'.length).trim();
  const answerIndex = example.indexOf('→');
  const examplePrompt = answerIndex === -1 ? example : example.slice(0, answerIndex).trim();
  const exampleAnswer = answerIndex === -1 ? '' : example.slice(answerIndex + 1).trim();

  return {
    name,
    aliases: ITEM_ALIAS_MAP[name] ?? [],
    clue,
    examplePrompt,
    exampleAnswer,
  };
}

function buildCardAliasIndex(dictionaryCards) {
  return dictionaryCards.map((card) => {
    const aliases = new Set([card.title]);

    if (card.title.startsWith('Amazon ')) {
      aliases.add(card.title.replace(/^Amazon /, ''));
    }

    if (card.title.startsWith('AWS ')) {
      aliases.add(card.title.replace(/^AWS /, ''));
    }

    if (card.title.startsWith('Amazon ') || card.title.startsWith('AWS ')) {
      aliases.add(card.title.replace(/^(Amazon|AWS)\s+/, ''));
    }

    if (card.title.includes('(') && card.title.includes(')')) {
      aliases.add(card.title.replace(/\s*\([^)]*\)/g, '').trim());
    }

    if (card.title === 'Elastic Load Balancing (ELB)') {
      aliases.add('ALB');
      aliases.add('NLB');
      aliases.add('Gateway Load Balancer');
    }

    if (card.title === 'Amazon ElastiCache') {
      aliases.add('Redis/Valkey');
      aliases.add('Memcached');
    }

    if (card.title === 'AWS Directory Service') {
      aliases.add('AWS Managed Microsoft AD');
      aliases.add('AD Connector');
      aliases.add('Simple AD');
    }

    if (card.title === 'Amazon VPC') {
      aliases.add('Internet Gateway');
      aliases.add('Egress-only Internet Gateway');
      aliases.add('セキュリティグループ');
      aliases.add('ネットワーク ACL');
      aliases.add('VPC Peering');
      aliases.add('Transit Gateway');
    }

    if (card.title === 'Amazon Cognito') {
      aliases.add('Cognito User Pool');
      aliases.add('Cognito Identity Pool');
    }

    if (card.title === 'AWS STS') {
      aliases.add('STS AssumeRole');
    }

    if (card.title === 'AWS Budgets') {
      aliases.add('Budgets');
    }

    if (card.title === 'Amazon Data Lifecycle Manager (DLM)') {
      aliases.add('DLM');
      aliases.add('Data Lifecycle Manager');
    }

    if (card.title === 'AWS Cost and Usage Report (CUR)') {
      aliases.add('CUR');
    }

    if (card.title === 'Amazon Route 53') {
      aliases.add('Route 53');
      aliases.add('Weighted');
      aliases.add('Latency');
      aliases.add('Geolocation');
      aliases.add('Geoproximity');
      aliases.add('Multivalue Answer');
      aliases.add('フェイルオーバー');
      aliases.add('加重');
    }

    return {
      id: card.id,
      normalizedAliases: [...aliases].map(normalizeLookup),
    };
  });
}

function resolveRelatedCardIds(name, aliases, cardAliasIndex) {
  const candidates = [name, ...aliases].map(normalizeLookup).filter(Boolean);

  return cardAliasIndex
    .filter((card) =>
      card.normalizedAliases.some((cardAlias) =>
        candidates.some(
          (candidate) =>
            cardAlias === candidate ||
            cardAlias.includes(candidate) ||
            candidate.includes(cardAlias),
        ),
      ),
    )
    .map((card) => card.id);
}

function normalizeLookup(value) {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\bamazon\b/g, '')
    .replace(/\baws\b/g, '')
    .replace(/\bfor\b/g, '')
    .replace(/\bservice\b/g, '')
    .replace(/\bservices\b/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '');
}
