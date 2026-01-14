import { FC, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QuizType,
  ShapeType,
  ImproperFraction,
  MixedFraction,
  QuizQuestion,
  QUIZ_TYPE_LABELS,
  SHAPE_TYPE_LABELS,
  mixedToImproper,
} from '../../../../types';
import { Button } from '../../../../components/Button';
import { Select } from '../../../../components/Select';
import { FractionVisual } from '../FractionVisual';
import styles from './QuizMode.module.css';

interface QuizModeProps {
  shapeType: ShapeType;
  onShapeTypeChange: (type: ShapeType) => void;
}

const generateRandomFraction = (): {
  improper: ImproperFraction;
  mixed: MixedFraction;
} => {
  const denominator = Math.floor(Math.random() * 8) + 2; // 2-9
  const whole = Math.floor(Math.random() * 4) + 1; // 1-4
  const remainder = Math.floor(Math.random() * denominator);
  const numerator = whole * denominator + remainder;

  return {
    improper: { numerator, denominator },
    mixed: { whole, numerator: remainder, denominator },
  };
};

const generateQuestion = (
  id: number,
  type: QuizType,
  shapeType: ShapeType
): QuizQuestion => {
  const { improper, mixed } = generateRandomFraction();
  return {
    id,
    type,
    improperFraction: improper,
    mixedFraction: mixed,
    shapeType,
  };
};

export const QuizMode: FC<QuizModeProps> = ({
  shapeType,
  onShapeTypeChange,
}) => {
  const [quizType, setQuizType] = useState<QuizType>('visual-to-number');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [userImproperAnswer, setUserImproperAnswer] = useState<ImproperFraction>(
    { numerator: 0, denominator: 1 }
  );
  const [userMixedAnswer, setUserMixedAnswer] = useState<MixedFraction>({
    whole: 0,
    numerator: 0,
    denominator: 1,
  });
  const [answerResult, setAnswerResult] = useState<'correct' | 'incorrect' | null>(
    null
  );
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [isAnswered, setIsAnswered] = useState(false);

  const quizTypeOptions = Object.entries(QUIZ_TYPE_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  const shapeTypeOptions = Object.entries(SHAPE_TYPE_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  const startNewQuestion = useCallback(() => {
    const newQuestion = generateQuestion(
      score.total + 1,
      quizType,
      shapeType
    );
    setCurrentQuestion(newQuestion);
    setUserImproperAnswer({ numerator: 0, denominator: newQuestion.improperFraction.denominator });
    setUserMixedAnswer({
      whole: 0,
      numerator: 0,
      denominator: newQuestion.mixedFraction.denominator,
    });
    setAnswerResult(null);
    setIsAnswered(false);
  }, [quizType, shapeType, score.total]);

  const checkAnswer = useCallback(() => {
    if (!currentQuestion) return;

    let isCorrect = false;

    if (quizType === 'visual-to-number') {
      const correctImproper = currentQuestion.improperFraction;
      const correctMixed = currentQuestion.mixedFraction;

      const improperCorrect =
        userImproperAnswer.numerator === correctImproper.numerator &&
        userImproperAnswer.denominator === correctImproper.denominator;

      const mixedCorrect =
        userMixedAnswer.whole === correctMixed.whole &&
        userMixedAnswer.numerator === correctMixed.numerator &&
        userMixedAnswer.denominator === correctMixed.denominator;

      isCorrect = improperCorrect || mixedCorrect;
    } else {
      // Conversion quiz
      const userConverted = mixedToImproper(userMixedAnswer);
      const correctImproper = currentQuestion.improperFraction;
      isCorrect =
        userConverted.numerator === correctImproper.numerator &&
        userConverted.denominator === correctImproper.denominator;
    }

    setAnswerResult(isCorrect ? 'correct' : 'incorrect');
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setIsAnswered(true);
  }, [currentQuestion, quizType, userImproperAnswer, userMixedAnswer]);

  const resetQuiz = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    setCurrentQuestion(null);
    setAnswerResult(null);
    setIsAnswered(false);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>クイズモード</h2>
        <div className={styles.score}>
          正解: {score.correct} / {score.total}
        </div>
      </div>

      <div className={styles.settings}>
        <Select
          label="クイズの種類"
          options={quizTypeOptions}
          value={quizType}
          onChange={(e) => setQuizType(e.target.value as QuizType)}
        />
        <Select
          label="図形の種類"
          options={shapeTypeOptions}
          value={shapeType}
          onChange={(e) => onShapeTypeChange(e.target.value as ShapeType)}
        />
      </div>

      <AnimatePresence mode="wait">
        {!currentQuestion ? (
          <motion.div
            key="start"
            className={styles.startScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className={styles.instruction}>
              {quizType === 'visual-to-number'
                ? '表示された図形を見て、仮分数または帯分数で答えてください。'
                : '表示された分数を変換してください。'}
            </p>
            <Button variant="primary" size="lg" onClick={startNewQuestion}>
              クイズを開始
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestion.id}
            className={styles.questionArea}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className={styles.questionNumber}>
              問題 {currentQuestion.id}
            </div>

            {quizType === 'visual-to-number' ? (
              <>
                <FractionVisual
                  fraction={currentQuestion.improperFraction}
                  shapeType={shapeType}
                  showAnimation={false}
                  showFractionText={false}
                />
                <div className={styles.answerSection}>
                  <div className={styles.answerGroup}>
                    <span className={styles.answerLabel}>仮分数で答える:</span>
                    <div className={styles.fractionInputRow}>
                      <input
                        type="number"
                        className={styles.answerInput}
                        value={userImproperAnswer.numerator}
                        onChange={(e) =>
                          setUserImproperAnswer((prev) => ({
                            ...prev,
                            numerator: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={isAnswered}
                        min={0}
                      />
                      <span className={styles.divider}>/</span>
                      <input
                        type="number"
                        className={styles.answerInput}
                        value={userImproperAnswer.denominator}
                        onChange={(e) =>
                          setUserImproperAnswer((prev) => ({
                            ...prev,
                            denominator: parseInt(e.target.value) || 1,
                          }))
                        }
                        disabled={isAnswered}
                        min={1}
                      />
                    </div>
                  </div>

                  <div className={styles.answerGroup}>
                    <span className={styles.answerLabel}>または帯分数で答える:</span>
                    <div className={styles.fractionInputRow}>
                      <input
                        type="number"
                        className={styles.answerInput}
                        value={userMixedAnswer.whole}
                        onChange={(e) =>
                          setUserMixedAnswer((prev) => ({
                            ...prev,
                            whole: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={isAnswered}
                        min={0}
                      />
                      <span className={styles.wholeLabel}>と</span>
                      <input
                        type="number"
                        className={styles.answerInput}
                        value={userMixedAnswer.numerator}
                        onChange={(e) =>
                          setUserMixedAnswer((prev) => ({
                            ...prev,
                            numerator: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={isAnswered}
                        min={0}
                      />
                      <span className={styles.divider}>/</span>
                      <input
                        type="number"
                        className={styles.answerInput}
                        value={userMixedAnswer.denominator}
                        onChange={(e) =>
                          setUserMixedAnswer((prev) => ({
                            ...prev,
                            denominator: parseInt(e.target.value) || 1,
                          }))
                        }
                        disabled={isAnswered}
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.conversionQuestion}>
                  <span className={styles.questionText}>
                    {currentQuestion.improperFraction.numerator}/
                    {currentQuestion.improperFraction.denominator} を帯分数に変換
                  </span>
                </div>
                <div className={styles.answerSection}>
                  <div className={styles.answerGroup}>
                    <span className={styles.answerLabel}>帯分数:</span>
                    <div className={styles.fractionInputRow}>
                      <input
                        type="number"
                        className={styles.answerInput}
                        value={userMixedAnswer.whole}
                        onChange={(e) =>
                          setUserMixedAnswer((prev) => ({
                            ...prev,
                            whole: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={isAnswered}
                        min={0}
                      />
                      <span className={styles.wholeLabel}>と</span>
                      <input
                        type="number"
                        className={styles.answerInput}
                        value={userMixedAnswer.numerator}
                        onChange={(e) =>
                          setUserMixedAnswer((prev) => ({
                            ...prev,
                            numerator: parseInt(e.target.value) || 0,
                          }))
                        }
                        disabled={isAnswered}
                        min={0}
                      />
                      <span className={styles.divider}>/</span>
                      <input
                        type="number"
                        className={styles.answerInput}
                        value={userMixedAnswer.denominator}
                        onChange={(e) =>
                          setUserMixedAnswer((prev) => ({
                            ...prev,
                            denominator: parseInt(e.target.value) || 1,
                          }))
                        }
                        disabled={isAnswered}
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {answerResult && (
              <motion.div
                className={`${styles.resultMessage} ${
                  answerResult === 'correct' ? styles.correct : styles.incorrect
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {answerResult === 'correct' ? '正解!' : '不正解'}
                {answerResult === 'incorrect' && (
                  <div className={styles.correctAnswer}>
                    正解: {currentQuestion.improperFraction.numerator}/
                    {currentQuestion.improperFraction.denominator} ={' '}
                    {currentQuestion.mixedFraction.whole}
                    {currentQuestion.mixedFraction.numerator > 0 &&
                      ` と ${currentQuestion.mixedFraction.numerator}/${currentQuestion.mixedFraction.denominator}`}
                  </div>
                )}
              </motion.div>
            )}

            <div className={styles.controls}>
              {!isAnswered ? (
                <Button variant="primary" onClick={checkAnswer}>
                  回答する
                </Button>
              ) : (
                <>
                  <Button variant="primary" onClick={startNewQuestion}>
                    次の問題
                  </Button>
                  <Button variant="secondary" onClick={resetQuiz}>
                    リセット
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
