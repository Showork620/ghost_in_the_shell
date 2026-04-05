# タスク: カテゴリ階層化とサービス追加の実装

AWS SAA 2026年版統合辞書のカテゴリ階層化と不足サービス追加の実行状況を管理します。

- [x] SHELL用タスク指示書の作成 (`.ai-tasks/tasks/task_apply_category_hierarchy.md`)
- [x] SHELL (Claude CLI) への委譲と実行 (Antigravityが代行実行)
    - [x] カテゴリの一括置換処理
    - [x] 重要サービス (DMS, Bedrock) の追加
- [x] 辞書データのビルド検証 (`node scripts/build-dictionary.mjs`)
- [x] 完了後の git commit と報告
- [ ] ビルド確認とデプロイ (`npm run build` & `git push`)
