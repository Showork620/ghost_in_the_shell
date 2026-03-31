# VPCメモの更新：ネットワークACL詳細の追加

VPCメモ（`VPC.md`）にネットワークACLの詳細情報を追加し、現在の誤った階層構造（AWS Network Firewall への配置）を修正します。

## 変更内容

### [VPC](file:///Users/rhyolite/practice/awssaa_in_the_ghost/study-memo/VPC.md)

#### [MODIFY] [VPC.md](file:///Users/rhyolite/practice/awssaa_in_the_ghost/study-memo/VPC.md)

- `AWS Network Firewall` の下にある `ネットワークACL` を削除。
- 新しいセクション `## ネットワークACL (NACL)` を作成。
- 以下の内容を追記：
    - サブネットレベルの保護であること。
    - ステートレス（Stateless）な性質。
    - 番号順の評価ルール。
    - 許可・拒否の両方が指定可能であること。
- セキュリティグループとの比較表を作成。

## 確認計画

### 手動確認
- ユーザーによる `VPC.md` の内容確認。階層構造が分かりやすくなっていることを確認する。
