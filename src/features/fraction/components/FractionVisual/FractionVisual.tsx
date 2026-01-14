import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ImproperFraction, ShapeType, improperToMixed } from '../../../../types';
import styles from './FractionVisual.module.css';

interface FractionVisualProps {
  fraction: ImproperFraction;
  shapeType: ShapeType;
  showAnimation?: boolean;
  showFractionText?: boolean;
}

// 円形（ピザ型）の単一図形
const CircleShape: FC<{
  denominator: number;
  filledCount: number;
  isComplete: boolean;
  animate: boolean;
}> = ({ denominator, filledCount, isComplete, animate }) => {
  const size = 100;
  const radius = 40;
  const center = size / 2;

  const segments = useMemo(() => {
    const segs = [];
    const anglePerSegment = 360 / denominator;

    for (let i = 0; i < denominator; i++) {
      const startAngle = (i * anglePerSegment - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * anglePerSegment - 90) * (Math.PI / 180);

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

      const pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      const isFilled = i < filledCount;

      segs.push({
        pathData,
        isFilled,
        index: i,
      });
    }
    return segs;
  }, [denominator, filledCount, center, radius]);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`${styles.shape} ${isComplete ? styles.complete : ''}`}
    >
      {segments.map((seg) => (
        <motion.path
          key={seg.index}
          d={seg.pathData}
          className={seg.isFilled ? styles.filled : styles.empty}
          initial={animate ? { opacity: 0, scale: 0.8 } : {}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: seg.index * 0.05, duration: 0.3 }}
        />
      ))}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
    </svg>
  );
};

// 長方形（バー型）の単一図形
const RectangleShape: FC<{
  denominator: number;
  filledCount: number;
  isComplete: boolean;
  animate: boolean;
}> = ({ denominator, filledCount, isComplete, animate }) => {
  const width = 200;
  const height = 40;
  const segmentWidth = width / denominator;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`${styles.shape} ${styles.rectangle} ${isComplete ? styles.complete : ''}`}
    >
      {Array.from({ length: denominator }).map((_, i) => {
        const isFilled = i < filledCount;
        return (
          <motion.rect
            key={i}
            x={i * segmentWidth}
            y={0}
            width={segmentWidth}
            height={height}
            className={isFilled ? styles.filled : styles.empty}
            initial={animate ? { opacity: 0, scaleX: 0 } : {}}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          />
        );
      })}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="2"
      />
      {Array.from({ length: denominator - 1 }).map((_, i) => (
        <line
          key={i}
          x1={(i + 1) * segmentWidth}
          y1={0}
          x2={(i + 1) * segmentWidth}
          y2={height}
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
};

export const FractionVisual: FC<FractionVisualProps> = ({
  fraction,
  shapeType,
  showAnimation = true,
  showFractionText = true,
}) => {
  const { numerator, denominator } = fraction;
  const mixed = improperToMixed(fraction);

  // 図形の数（整数部分 + 余りがあれば1つ追加）
  const wholeShapes = mixed.whole;
  const hasRemainder = mixed.numerator > 0;
  const totalShapes = wholeShapes + (hasRemainder ? 1 : 0);

  // 各図形ごとの塗りつぶし数を計算
  const shapes = useMemo(() => {
    const result = [];
    let remaining = numerator;

    for (let i = 0; i < totalShapes; i++) {
      const filledCount = Math.min(remaining, denominator);
      const isComplete = filledCount === denominator;
      result.push({ filledCount, isComplete, index: i });
      remaining -= filledCount;
    }

    return result;
  }, [numerator, denominator, totalShapes]);

  const ShapeComponent = shapeType === 'circle' ? CircleShape : RectangleShape;

  return (
    <div className={styles.container}>
      <div className={styles.shapesContainer}>
        {shapes.map((shape) => (
          <motion.div
            key={shape.index}
            className={styles.shapeWrapper}
            initial={showAnimation ? { opacity: 0, y: 20 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shape.index * 0.1, duration: 0.3 }}
          >
            <ShapeComponent
              denominator={denominator}
              filledCount={shape.filledCount}
              isComplete={shape.isComplete}
              animate={showAnimation}
            />
          </motion.div>
        ))}
      </div>
      {showFractionText && (
        <div className={styles.fractionDisplay}>
          <span className={styles.numerator}>{numerator}</span>
          <span className={styles.divider}>/</span>
          <span className={styles.denominator}>{denominator}</span>
          {mixed.whole > 0 && (
            <span className={styles.mixedDisplay}>
              {' = '}
              <span className={styles.whole}>{mixed.whole}</span>
              {mixed.numerator > 0 && (
                <>
                  <span className={styles.mixedNumerator}>{mixed.numerator}</span>
                  <span className={styles.mixedDivider}>/</span>
                  <span className={styles.mixedDenominator}>{mixed.denominator}</span>
                </>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
