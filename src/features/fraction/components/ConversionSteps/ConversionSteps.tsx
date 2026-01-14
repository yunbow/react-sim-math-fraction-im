import { FC, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ImproperFraction,
  MixedFraction,
  ConversionStep,
} from '../../../../types';
import { Button } from '../../../../components/Button';
import styles from './ConversionSteps.module.css';

interface ConversionStepsProps {
  conversionDirection: 'improperToMixed' | 'mixedToImproper';
  improperFraction: ImproperFraction;
  mixedFraction: MixedFraction;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
}

const generateImproperToMixedSteps = (
  fraction: ImproperFraction
): ConversionStep[] => {
  const { numerator, denominator } = fraction;
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;

  const steps: ConversionStep[] = [
    {
      description: '仮分数を帯分数に変換します。',
      formula: `${numerator}/${denominator}`,
    },
    {
      description: '分子を分母で割って、整数部分（商）を求めます。',
      formula: `${numerator} ÷ ${denominator} = ${whole} あまり ${remainder}`,
      highlight: 'whole',
    },
    {
      description: '商が整数部分になります。',
      result: `整数部分 = ${whole}`,
      highlight: 'whole',
    },
    {
      description: '余りが新しい分子になります。分母はそのままです。',
      result: `分数部分 = ${remainder}/${denominator}`,
      highlight: 'numerator',
    },
    {
      description: '変換完了！',
      result:
        remainder > 0
          ? `${numerator}/${denominator} = ${whole} と ${remainder}/${denominator}`
          : `${numerator}/${denominator} = ${whole}`,
      highlight: 'result',
    },
  ];

  return steps;
};

const generateMixedToImproperSteps = (
  fraction: MixedFraction
): ConversionStep[] => {
  const { whole, numerator, denominator } = fraction;
  const newNumerator = whole * denominator + numerator;

  const steps: ConversionStep[] = [
    {
      description: '帯分数を仮分数に変換します。',
      formula:
        numerator > 0
          ? `${whole} と ${numerator}/${denominator}`
          : `${whole}`,
    },
    {
      description: '整数部分と分母を掛けます。',
      formula: `${whole} × ${denominator} = ${whole * denominator}`,
      highlight: 'whole',
    },
    {
      description: 'その結果に元の分子を足します。',
      formula: `${whole * denominator} + ${numerator} = ${newNumerator}`,
      highlight: 'numerator',
    },
    {
      description: 'これが新しい分子になります。分母はそのままです。',
      result: `新しい分子 = ${newNumerator}`,
      highlight: 'numerator',
    },
    {
      description: '変換完了！',
      result:
        numerator > 0
          ? `${whole} と ${numerator}/${denominator} = ${newNumerator}/${denominator}`
          : `${whole} = ${newNumerator}/${denominator}`,
      highlight: 'result',
    },
  ];

  return steps;
};

export const ConversionSteps: FC<ConversionStepsProps> = ({
  conversionDirection,
  improperFraction,
  mixedFraction,
  currentStep,
  onNextStep,
  onPrevStep,
  onReset,
}) => {
  const steps = useMemo(() => {
    if (conversionDirection === 'improperToMixed') {
      return generateImproperToMixedSteps(improperFraction);
    } else {
      return generateMixedToImproperSteps(mixedFraction);
    }
  }, [conversionDirection, improperFraction, mixedFraction]);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const title =
    conversionDirection === 'improperToMixed'
      ? '仮分数 → 帯分数'
      : '帯分数 → 仮分数';

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title} の変換手順</h3>

      <div className={styles.progressBar}>
        {steps.map((_, index) => (
          <div
            key={index}
            className={`${styles.progressDot} ${
              index <= currentStep ? styles.active : ''
            } ${index === currentStep ? styles.current : ''}`}
          />
        ))}
      </div>

      <div className={styles.stepCounter}>
        ステップ {currentStep + 1} / {steps.length}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className={styles.stepContent}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <p className={styles.description}>{currentStepData.description}</p>

          {currentStepData.formula && (
            <div className={styles.formula}>{currentStepData.formula}</div>
          )}

          {currentStepData.result && (
            <div
              className={`${styles.result} ${
                currentStepData.highlight === 'result' ? styles.highlighted : ''
              }`}
            >
              {currentStepData.result}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className={styles.controls}>
        <Button
          variant="secondary"
          onClick={onPrevStep}
          disabled={isFirstStep}
        >
          前へ
        </Button>
        {isLastStep ? (
          <Button variant="primary" onClick={onReset}>
            最初から
          </Button>
        ) : (
          <Button variant="primary" onClick={onNextStep}>
            次へ
          </Button>
        )}
      </div>
    </div>
  );
};
