# れいほくちゃん

Astroによる静的サイト。Node.js 22.23.4以上とnpmを使用します。

```sh
npm install
npm run dev
```

- `npm run check` — Astro / TypeScriptの診断
- `npm run build` — 公開用ファイルを `dist/` に出力
- `npm run preview` — ビルド結果をローカルで確認

## 構成

- `src/pages/index.astro`: ページの組み立て
- `src/layouts/BaseLayout.astro`: HTML、メタ情報、共通読み込み
- `src/components/`: セクション、カード、プロフィール、紙芝居の部品
- `src/data/`: 紙芝居とプロフィールのコンテンツ
- `src/scripts/`: メニュー、紙芝居操作、ダイアログ、まばたき、表示アニメーション
- `src/styles/`: 共通基盤、セクション別CSS、レスポンシブ・アクセシビリティ設定
- `public/img/`: 写真とキャラクター画像（URLは `/img/...`）

スタイルは `global.css` で順序を管理します。既存のレスポンシブ設定を保つため、各部品の基本スタイルの後に共通の上書きを読み込みます。紙芝居の本文はビルド時にHTMLへ出力し、ブラウザのJSはスクロール・スワイプ操作を追加します。

公開には `dist/` を静的ホスティングへ配置します。画像の出典・利用条件は `STORY-ASSETS.md` を参照してください。
