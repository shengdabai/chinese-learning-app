import React, { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Eye, EyeOff, Volume2, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { SRSStatsPanel } from './SRSStats';
import { playChineseTTS } from '../../utils/tts';
import {
  SRSCard,
  loadSRSCards,
  saveSRSCards,
  getDueCards,
  gradeCard,
  updateCard,
  computeStats,
} from './srsEngine';

const GRADE_OPTIONS = [
  { grade: 1, label: 'Blackout', color: 'bg-red-500 hover:bg-red-600', shortLabel: '1' },
  { grade: 2, label: 'Wrong', color: 'bg-orange-500 hover:bg-orange-600', shortLabel: '2' },
  { grade: 3, label: 'Hard', color: 'bg-yellow-500 hover:bg-yellow-600', shortLabel: '3' },
  { grade: 4, label: 'Good', color: 'bg-blue-500 hover:bg-blue-600', shortLabel: '4' },
  { grade: 5, label: 'Easy', color: 'bg-green-500 hover:bg-green-600', shortLabel: '5' },
] as const;

export const SRSReviewPage: React.FC = () => {
  const [allCards, setAllCards] = useState<readonly SRSCard[]>(() => loadSRSCards());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const dueCards = useMemo(() => getDueCards(allCards), [allCards]);
  const stats = useMemo(() => computeStats(allCards), [allCards]);
  const currentCard = dueCards[currentIndex] ?? null;

  const handleGrade = useCallback((grade: number) => {
    if (!currentCard) return;

    const updated = gradeCard(currentCard, grade);
    const newAllCards = updateCard(allCards, updated);
    setAllCards(newAllCards);
    saveSRSCards(newAllCards);

    setShowAnswer(false);
    setReviewedCount(prev => prev + 1);

    // Re-check due cards from the updated list
    const remainingDue = getDueCards(newAllCards);
    if (currentIndex >= remainingDue.length) {
      setSessionCompleted(true);
    } else {
      // Stay at same index or adjust if needed
      setCurrentIndex(Math.min(currentIndex, remainingDue.length - 1));
    }
  }, [currentCard, allCards, currentIndex]);

  const handleReset = useCallback(() => {
    setAllCards(loadSRSCards());
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionCompleted(false);
    setReviewedCount(0);
  }, []);

  if (allCards.length === 0) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-12 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="text-slate-400" size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Cards Yet</h2>
          <p className="text-slate-500 text-sm">
            Use Snap &amp; Learn to discover vocabulary. Words you learn will automatically
            appear here for spaced repetition review.
          </p>
        </div>
      </div>
    );
  }

  if (sessionCompleted || dueCards.length === 0) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-8 space-y-6">
        <SRSStatsPanel stats={stats} />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {reviewedCount > 0 ? 'Review Complete!' : 'All Caught Up!'}
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            {reviewedCount > 0
              ? `You reviewed ${reviewedCount} card${reviewedCount !== 1 ? 's' : ''} this session.`
              : 'No cards are due for review right now. Check back later!'}
          </p>
          <p className="text-xs text-slate-400">
            Total: {stats.totalCards} cards | Mastered: {stats.masteredCards}
          </p>
          {reviewedCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleReset} className="mt-4">
              <RotateCcw size={14} className="mr-1" />
              Refresh
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-6 space-y-4">
      <SRSStatsPanel stats={stats} />

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Card {currentIndex + 1} of {dueCards.length} due</span>
        <span>Reviewed: {reviewedCount}</span>
      </div>

      {/* Flashcard */}
      <Card className="relative overflow-visible">
        <div className="p-6 min-h-[240px] flex flex-col items-center justify-center text-center">
          {/* Front: Chinese word */}
          <h2 className="text-5xl font-bold text-slate-900 font-chinese mb-3">
            {currentCard.word}
          </h2>

          {currentCard.hskLevel && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-blue-100 text-blue-700 mb-4">
              HSK {currentCard.hskLevel}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => playChineseTTS(currentCard.word)}
            className="mb-4"
          >
            <Volume2 size={16} className="mr-1" />
            Listen
          </Button>

          {/* Answer reveal */}
          {showAnswer ? (
            <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="border-t border-slate-100 pt-4">
                <p className="text-lg text-blue-600 font-medium">{currentCard.pinyin}</p>
                <p className="text-base text-slate-600">{currentCard.english}</p>
              </div>

              {currentCard.sentence && (
                <div className="bg-slate-50 rounded-xl p-3 text-left">
                  <p className="text-sm font-chinese text-slate-800">{currentCard.sentence}</p>
                  {currentCard.sentencePinyin && (
                    <p className="text-xs text-blue-500 mt-1">{currentCard.sentencePinyin}</p>
                  )}
                  {currentCard.sentenceEnglish && (
                    <p className="text-xs text-slate-500 mt-0.5 italic">{currentCard.sentenceEnglish}</p>
                  )}
                </div>
              )}

              {/* Grade buttons */}
              <div className="pt-2">
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-bold">
                  How well did you remember?
                </p>
                <div className="flex gap-2">
                  {GRADE_OPTIONS.map(({ grade, label, color }) => (
                    <button
                      key={grade}
                      onClick={() => handleGrade(grade)}
                      className={`flex-1 py-2.5 rounded-lg text-white text-xs font-bold transition-all active:scale-95 ${color}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={() => setShowAnswer(true)}
              className="mt-2"
            >
              <Eye size={16} className="mr-2" />
              Show Answer
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
