import { FC, useCallback } from 'react';
import {
  FractionType,
  ImproperFraction,
  MixedFraction,
  FRACTION_TYPE_LABELS,
} from '../../../../types';
import { Slider } from '../../../../components/Slider';
import { Select } from '../../../../components/Select';
import styles from './FractionInput.module.css';

interface FractionInputProps {
  fractionType: FractionType;
  onFractionTypeChange: (type: FractionType) => void;
  improperFraction: ImproperFraction;
  mixedFraction: MixedFraction;
  onImproperChange: (fraction: ImproperFraction) => void;
  onMixedChange: (fraction: MixedFraction) => void;
}

export const FractionInput: FC<FractionInputProps> = ({
  fractionType,
  onFractionTypeChange,
  improperFraction,
  mixedFraction,
  onImproperChange,
  onMixedChange,
}) => {
  const fractionTypeOptions = Object.entries(FRACTION_TYPE_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  const handleImproperNumeratorChange = useCallback(
    (value: number) => {
      onImproperChange({ ...improperFraction, numerator: value });
    },
    [improperFraction, onImproperChange]
  );

  const handleImproperDenominatorChange = useCallback(
    (value: number) => {
      onImproperChange({ ...improperFraction, denominator: Math.max(1, value) });
    },
    [improperFraction, onImproperChange]
  );

  const handleMixedWholeChange = useCallback(
    (value: number) => {
      onMixedChange({ ...mixedFraction, whole: value });
    },
    [mixedFraction, onMixedChange]
  );

  const handleMixedNumeratorChange = useCallback(
    (value: number) => {
      onMixedChange({ ...mixedFraction, numerator: value });
    },
    [mixedFraction, onMixedChange]
  );

  const handleMixedDenominatorChange = useCallback(
    (value: number) => {
      onMixedChange({ ...mixedFraction, denominator: Math.max(1, value) });
    },
    [mixedFraction, onMixedChange]
  );

  return (
    <div className={styles.container}>
      <div className={styles.typeSelector}>
        <Select
          label="入力モード"
          options={fractionTypeOptions}
          value={fractionType}
          onChange={(e) => onFractionTypeChange(e.target.value as FractionType)}
        />
      </div>

      {fractionType === 'improper' ? (
        <div className={styles.inputGroup}>
          <div className={styles.fractionDisplay}>
            <div className={styles.numeratorSection}>
              <span className={styles.inputLabel}>分子</span>
              <input
                type="number"
                className={styles.numberInput}
                value={improperFraction.numerator}
                onChange={(e) =>
                  handleImproperNumeratorChange(parseInt(e.target.value) || 0)
                }
                min={0}
                max={99}
              />
            </div>
            <div className={styles.fractionLine} />
            <div className={styles.denominatorSection}>
              <input
                type="number"
                className={styles.numberInput}
                value={improperFraction.denominator}
                onChange={(e) =>
                  handleImproperDenominatorChange(parseInt(e.target.value) || 1)
                }
                min={1}
                max={12}
              />
              <span className={styles.inputLabel}>分母</span>
            </div>
          </div>

          <div className={styles.sliders}>
            <Slider
              label="分子"
              value={improperFraction.numerator}
              onChange={(e) =>
                handleImproperNumeratorChange(parseInt(e.target.value))
              }
              min={0}
              max={99}
              showValue
            />
            <Slider
              label="分母"
              value={improperFraction.denominator}
              onChange={(e) =>
                handleImproperDenominatorChange(parseInt(e.target.value))
              }
              min={1}
              max={12}
              showValue
            />
          </div>
        </div>
      ) : (
        <div className={styles.inputGroup}>
          <div className={styles.mixedDisplay}>
            <div className={styles.wholeSection}>
              <span className={styles.inputLabel}>整数</span>
              <input
                type="number"
                className={styles.numberInput}
                value={mixedFraction.whole}
                onChange={(e) =>
                  handleMixedWholeChange(parseInt(e.target.value) || 0)
                }
                min={0}
                max={10}
              />
            </div>
            <div className={styles.fractionPart}>
              <div className={styles.numeratorSection}>
                <span className={styles.inputLabel}>分子</span>
                <input
                  type="number"
                  className={styles.numberInput}
                  value={mixedFraction.numerator}
                  onChange={(e) =>
                    handleMixedNumeratorChange(parseInt(e.target.value) || 0)
                  }
                  min={0}
                  max={mixedFraction.denominator - 1}
                />
              </div>
              <div className={styles.fractionLine} />
              <div className={styles.denominatorSection}>
                <input
                  type="number"
                  className={styles.numberInput}
                  value={mixedFraction.denominator}
                  onChange={(e) =>
                    handleMixedDenominatorChange(parseInt(e.target.value) || 1)
                  }
                  min={1}
                  max={12}
                />
                <span className={styles.inputLabel}>分母</span>
              </div>
            </div>
          </div>

          <div className={styles.sliders}>
            <Slider
              label="整数"
              value={mixedFraction.whole}
              onChange={(e) => handleMixedWholeChange(parseInt(e.target.value))}
              min={0}
              max={10}
              showValue
            />
            <Slider
              label="分子"
              value={mixedFraction.numerator}
              onChange={(e) =>
                handleMixedNumeratorChange(parseInt(e.target.value))
              }
              min={0}
              max={mixedFraction.denominator - 1}
              showValue
            />
            <Slider
              label="分母"
              value={mixedFraction.denominator}
              onChange={(e) =>
                handleMixedDenominatorChange(parseInt(e.target.value))
              }
              min={1}
              max={12}
              showValue
            />
          </div>
        </div>
      )}
    </div>
  );
};
