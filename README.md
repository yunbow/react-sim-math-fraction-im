# 分数シミュレーター

React 18とTypeScript、Atomic Designパターンで構築された仮分数と帯分数の可視化・相互変換アプリケーションです。

## デモプレイ
https://yunbow.github.io/react-sim-math-fraction-im/demo/

## 主要機能

### 1. 可視化機能
- **図形モデル選択**
  - 円形（ピザ型）
  - 長方形（バー型）
- **分割の明示**
  - 分母に合わせて図形を等分
  - 分子の数だけ色を塗る
- **整数の分離**
  - 1つの図形が満タン（例：4/4）になったら、次の図形へ移行することを視覚的に表示

### 2. 相互変換入力機能
- **仮分数モード**
  - 分母と分子をそれぞれ入力
- **帯分数モード**
  - 整数、分母、分子を入力
- **スライダー操作**
  - 数字を直接打つだけでなく、スライダーで分母や分子を増減させて図形の変化を観察

### 3. 計算プロセスの解説表示
- **仮分数 → 帯分数**
  - 割り算のプロセスをステップバイステップで表示
- **帯分数 → 仮分数**
  - 掛け算と足し算のプロセスをステップバイステップで表示
- **「次へ」ボタン**
  - ステップを順番に進行

### 4. クイズ・練習モード
- **図形から数値を当てる**
  - 表示された図形を見て、仮分数と帯分数の両方で回答
- **変換トレーニング**
  - ランダムに出題される問題を解く
- **スコア管理**
  - 正解数と総問題数を表示

## 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - プログラミング言語
- **Storybook 7** - コンポーネント開発・ドキュメント
- **CSS Modules** - スタイリング
- **Vite** - ビルドツール
- **Framer Motion** - アニメーション

## プロジェクト構造

```
src/
├── features/                        # 機能別モジュール
│   └── fraction/                    # 分数機能
│       ├── components/              # 機能専用コンポーネント
│       │   ├── FractionVisual/      # 分数可視化
│       │   ├── FractionInput/       # 分数入力
│       │   ├── ConversionSteps/     # 変換ステップ解説
│       │   └── QuizMode/            # クイズモード
│       └── FractionSimulator/       # メインシミュレーター
├── components/                      # 共通UIコンポーネント
│   ├── Button/                      # ボタン
│   ├── Select/                      # セレクトボックス
│   ├── Slider/                      # スライダー
│   └── Input/                       # テキスト入力
├── types/                           # 汎用的な型定義
│   └── index.ts
├── App.tsx                          # メインアプリ
├── main.tsx                         # エントリーポイント
└── theme.css                        # テーマカラー定義
```

## スクリプト

```bash
# セットアップ
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# Storybook起動
npm run storybook

# Storybook ビルド
npm run build-storybook
```

## ライセンス

MIT License
