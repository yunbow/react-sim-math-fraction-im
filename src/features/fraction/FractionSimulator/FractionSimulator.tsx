import { FC, useState, useCallback, useEffect } from 'react';
import {
  FractionType,
  ShapeType,
  ImproperFraction,
  MixedFraction,
  SHAPE_TYPE_LABELS,
  improperToMixed,
  mixedToImproper,
} from '../../../types';
import { Select } from '../../../components/Select';
import { FractionVisual } from '../components/FractionVisual';
import { FractionInput } from '../components/FractionInput';
import { ConversionSteps } from '../components/ConversionSteps';
import styles from './FractionSimulator.module.css';

interface FractionSimulatorProps {
  shapeType: ShapeType;
  onShapeTypeChange: (type: ShapeType) => void;
}

export const FractionSimulator: FC<FractionSimulatorProps> = ({
  shapeType,
  onShapeTypeChange,
}) => {
  const [fractionType, setFractionType] = useState<FractionType>('improper');
  const [improperFraction, setImproperFraction] = useState<ImproperFraction>({
    numerator: 7,
    denominator: 4,
  });
  const [mixedFraction, setMixedFraction] = useState<MixedFraction>({
    whole: 1,
    numerator: 3,
    denominator: 4,
  });
  const [conversionDirection, setConversionDirection] = useState<
    'improperToMixed' | 'mixedToImproper'
  >('improperToMixed');
  const [currentStep, setCurrentStep] = useState(0);

  const shapeTypeOptions = Object.entries(SHAPE_TYPE_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  // 仮分数が変更されたら、対応する帯分数も更新
  const handleImproperChange = useCallback((fraction: ImproperFraction) => {
    setImproperFraction(fraction);
    const converted = improperToMixed(fraction);
    setMixedFraction(converted);
    setCurrentStep(0);
  }, []);

  // 帯分数が変更されたら、対応する仮分数も更新
  const handleMixedChange = useCallback((fraction: MixedFraction) => {
    setMixedFraction(fraction);
    const converted = mixedToImproper(fraction);
    setImproperFraction(converted);
    setCurrentStep(0);
  }, []);

  // 分数タイプが変わったら変換方向も更新
  useEffect(() => {
    if (fractionType === 'improper') {
      setConversionDirection('improperToMixed');
    } else {
      setConversionDirection('mixedToImproper');
    }
    setCurrentStep(0);
  }, [fractionType]);

  const handleNextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleResetStep = useCallback(() => {
    setCurrentStep(0);
  }, []);

  // 表示する分数（入力タイプに基づく）
  const displayFraction = improperFraction;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>分数可視化モード</h2>
        <Select
          label="図形の種類"
          options={shapeTypeOptions}
          value={shapeType}
          onChange={(e) => onShapeTypeChange(e.target.value as ShapeType)}
        />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.visualSection}>
          <FractionVisual
            fraction={displayFraction}
            shapeType={shapeType}
            showAnimation
          />
        </div>

        <div className={styles.controlSection}>
          <FractionInput
            fractionType={fractionType}
            onFractionTypeChange={setFractionType}
            improperFraction={improperFraction}
            mixedFraction={mixedFraction}
            onImproperChange={handleImproperChange}
            onMixedChange={handleMixedChange}
          />
        </div>
      </div>

      <div className={styles.conversionSection}>
        <ConversionSteps
          conversionDirection={conversionDirection}
          improperFraction={improperFraction}
          mixedFraction={mixedFraction}
          currentStep={currentStep}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onReset={handleResetStep}
        />
      </div>
    </div>
  );
};
