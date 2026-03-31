import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(workspaceRoot, 'study-memo', 'AWSSAA_Dictionary_2026.md');
const outputPath = path.join(workspaceRoot, 'src', 'data', 'generated', 'dictionary.json');

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

  cards.push({
    ...currentCard,
    category: normalizeCategory(currentCard.category),
    tags: normalizeTags(currentCard.tags),
    id: createHash('sha1').update(currentCard.title).digest('hex').slice(0, 12),
  });
};

function normalizeCategory(category) {
  return CATEGORY_MAP[category] ?? category;
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

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(cards, null, 2), 'utf8');

console.log(`Generated ${cards.length} cards at ${outputPath}`);
