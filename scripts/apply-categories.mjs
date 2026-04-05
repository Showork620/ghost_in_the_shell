import fs from 'fs';
import path from 'path';

const DICTIONARY_PATH = 'study-memo/AWSSAA_Dictionary_2026.md';
const REPORT_PATH = 'study-memo/investigation_report_categories.md';

function applyConversion() {
  const content = fs.readFileSync(DICTIONARY_PATH, 'utf-8');
  const report = fs.readFileSync(REPORT_PATH, 'utf-8');

  // Extract mapping table from report
  // Table format: | # | サービス名 | 現行カテゴリ | 提案カテゴリ |
  const lines = report.split('\n');
  const mapping = {};
  
  let inTable = false;
  for (const line of lines) {
    if (line.includes('| # | サービス名 | 現行カテゴリ | 提案カテゴリ |')) {
      inTable = true;
      continue;
    }
    if (inTable) {
      if (!line.includes('|')) {
        if (line.trim() !== '' && !line.startsWith('|---')) continue;
        inTable = false;
        continue;
      }
      const parts = line.split('|').map(s => s.trim());
      if (parts.length < 5 || parts[1] === '#') continue;
      
      const serviceName = parts[2];
      const newCategory = parts[4];
      if (serviceName && newCategory) {
        mapping[serviceName] = newCategory;
      }
    }
  }

  console.log(`Found ${Object.keys(mapping).length} mappings.`);

  // Perform replacements
  let updatedContent = content;
  const serviceBlocks = content.split('\n### ');
  
  const newBlocks = serviceBlocks.map((block, index) => {
    if (index === 0) return block; // Header
    
    const lines = block.split('\n');
    const titleLine = lines[0];
    // Find service title (remove stuff in parentheses)
    const title = titleLine.split('(')[0].trim();
    
    const newCat = mapping[title];
    if (newCat) {
      return block.replace(/- \*\*カテゴリ\*\*: .*/, `- **カテゴリ**: ${newCat}`);
    } else {
        // Try fuzzy match or part match
        const matchingKey = Object.keys(mapping).find(k => title.includes(k) || k.includes(title));
        if (matchingKey) {
            return block.replace(/- \*\*カテゴリ\*\*: .*/, `- **カテゴリ**: ${mapping[matchingKey]}`);
        }
    }
    return block;
  });

  updatedContent = newBlocks.join('\n### ');
  fs.writeFileSync(DICTIONARY_PATH, updatedContent);
  console.log('Conversion applied to AWSSAA_Dictionary_2026.md');
}

applyConversion();
