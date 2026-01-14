// 分数の種類
export type FractionType = 'improper' | 'mixed';

// 図形モデル
export type ShapeType = 'circle' | 'rectangle';

// アプリケーションモード
export type AppMode = 'visualizer' | 'quiz';

// クイズの種類
export type QuizType = 'visual-to-number' | 'conversion';

// 仮分数の型
export interface ImproperFraction {
  numerator: number;   // 分子
  denominator: number; // 分母
}

// 帯分数の型
export interface MixedFraction {
  whole: number;       // 整数部分
  numerator: number;   // 分子
  denominator: number; // 分母
}

// 変換ステップの型
export interface ConversionStep {
  description: string;
  formula?: string;
  result?: string;
  highlight?: 'numerator' | 'denominator' | 'whole' | 'result';
}

// クイズ問題の型
export interface QuizQuestion {
  id: number;
  type: QuizType;
  improperFraction: ImproperFraction;
  mixedFraction: MixedFraction;
  shapeType: ShapeType;
}

// クイズ結果の型
export interface QuizResult {
  questionId: number;
  isCorrect: boolean;
  userAnswer: ImproperFraction | MixedFraction;
  correctAnswer: ImproperFraction | MixedFraction;
}

// 分数のラベル定数
export const FRACTION_TYPE_LABELS: Record<FractionType, string> = {
  improper: '仮分数',
  mixed: '帯分数',
};

// 図形モデルのラベル定数
export const SHAPE_TYPE_LABELS: Record<ShapeType, string> = {
  circle: '円形（ピザ型）',
  rectangle: '長方形（バー型）',
};

// アプリモードのラベル定数
export const APP_MODE_LABELS: Record<AppMode, string> = {
  visualizer: '可視化モード',
  quiz: 'クイズモード',
};

// クイズタイプのラベル定数
export const QUIZ_TYPE_LABELS: Record<QuizType, string> = {
  'visual-to-number': '図形から数値を当てる',
  'conversion': '変換トレーニング',
};

// ユーティリティ関数: 仮分数から帯分数への変換
export const improperToMixed = (fraction: ImproperFraction): MixedFraction => {
  const whole = Math.floor(fraction.numerator / fraction.denominator);
  const numerator = fraction.numerator % fraction.denominator;
  return {
    whole,
    numerator,
    denominator: fraction.denominator,
  };
};

// ユーティリティ関数: 帯分数から仮分数への変換
export const mixedToImproper = (fraction: MixedFraction): ImproperFraction => {
  const numerator = fraction.whole * fraction.denominator + fraction.numerator;
  return {
    numerator,
    denominator: fraction.denominator,
  };
};

// ユーティリティ関数: 仮分数かどうかの判定
export const isImproperFraction = (fraction: ImproperFraction): boolean => {
  return fraction.numerator >= fraction.denominator;
};

// ユーティリティ関数: 分数の値を数値で取得
export const getFractionValue = (fraction: ImproperFraction): number => {
  return fraction.numerator / fraction.denominator;
};
