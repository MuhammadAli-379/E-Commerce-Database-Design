import React, { useState } from 'react';
import { NormalizationLab } from '../components/NormalizationLab';
import { DependencyExplorer } from '../components/DependencyExplorer';
import {
  SlidersHorizontal,
  Network,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const NormalizationPage: React.FC = () => {
  const [subTab, setSubTab] = useState<'lab' | 'dependencies' | 'quiz' | 'axioms'>('lab');

  // Interactive Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      question: 'Which Normal Form specifically eliminates partial functional dependencies in tables with composite candidate keys?',
      options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
      correct: 1,
      explanation: '2NF requires that the table is already in 1NF and every non-prime attribute is fully functionally dependent on the whole candidate key, eliminating partial dependencies.',
    },
    {
      id: 2,
      question: 'In the Product table, ProductID → CategoryID → CategoryName represents what type of dependency?',
      options: ['Trivial Functional Dependency', 'Partial Key Dependency', 'Transitive Dependency', 'Multi-Valued Dependency'],
      correct: 2,
      explanation: 'ProductID determines CategoryID, and CategoryID determines CategoryName (where CategoryID is not a candidate key of Product). This transitive chain (X → Y → Z) violates 3NF.',
    },
    {
      id: 3,
      question: 'Why did the monolithic Orders table with columns (Product1, Qty1, Product2, Qty2) violate 1NF?',
      options: [
        'Because ProductID was not indexed.',
        'Because it contained repeating groups and non-atomic attribute columns.',
        'Because OrderDate had a timestamp format.',
        'Because foreign keys cannot be nullable.',
      ],
      correct: 1,
      explanation: '1NF demands that all attributes have atomic, indivisible domains and that repeating groups (like Product1, Product2...) are decomposed into atomic rows in a separate relation (Order Items).',
    },
    {
      id: 4,
      question: 'What is the primary benefit of decomposing Brand and Category out of the Product catalog into independent tables?',
      options: [
        'It makes SQL SELECT queries faster without JOINs.',
        'It eliminates update anomalies (modifying brand name in one place) and deletion anomalies.',
        'It removes the need for primary keys.',
        'It reduces the number of tables in the database.',
      ],
      correct: 1,
      explanation: 'Normalizing to 3NF ensures that editing a brand name only requires updating a single record in the Brand table rather than thousands of catalog products, completely preventing update anomalies.',
    },
  ];

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const score = Object.entries(selectedAnswers).filter(
    ([qIdx, ans]) => quizQuestions[Number(qIdx)].correct === ans
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-purple-400 font-semibold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              Relational Theory &amp; Practice
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs text-slate-400">Section 05</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <SlidersHorizontal className="w-5 h-5 text-purple-400" />
            <span>Database Normalization Suite</span>
          </h1>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSubTab('lab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              subTab === 'lab'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>1NF–3NF Lab</span>
          </button>
          <button
            onClick={() => setSubTab('dependencies')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              subTab === 'dependencies'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Dependency Explorer</span>
          </button>
          <button
            onClick={() => setSubTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              subTab === 'quiz'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Viva Quiz</span>
          </button>
          <button
            onClick={() => setSubTab('axioms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              subTab === 'axioms'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Armstrong Axioms</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: 1NF - 3NF Lab */}
      {subTab === 'lab' && <NormalizationLab />}

      {/* SUB-TAB 2: Functional Dependency Explorer */}
      {subTab === 'dependencies' && <DependencyExplorer />}

      {/* SUB-TAB 3: Viva Self-Test Quiz */}
      {subTab === 'quiz' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                  <span>Normalization &amp; Relational Theory Examination Quiz</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Test your understanding of 1NF, 2NF, 3NF, candidate keys, and relational anomaly prevention.
                </p>
              </div>

              {quizSubmitted && (
                <div className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-sm font-bold">
                  Score: {score} / {quizQuestions.length} ({Math.round((score / quizQuestions.length) * 100)}%)
                </div>
              )}
            </div>

            <div className="space-y-6 mt-6">
              {quizQuestions.map((q, qIdx) => {
                const userAns = selectedAnswers[qIdx];
                const isAnswered = userAns !== undefined;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center shrink-0">
                        {q.id}
                      </span>
                      <h3 className="font-semibold text-sm text-white leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    <div className="space-y-2 pl-9">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAns === optIdx;
                        const isCorrect = q.correct === optIdx;

                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';
                        if (quizSubmitted) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-red-950/60 border-red-500/60 text-red-300';
                          }
                        } else if (isSelected) {
                          btnStyle = 'bg-purple-900/40 border-purple-500 text-purple-200';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {quizSubmitted && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-3 ml-9 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                        <span className="font-semibold text-cyan-300 block mb-0.5">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {Object.keys(selectedAnswers).length} of {quizQuestions.length} answered
              </span>

              <div className="flex items-center gap-3">
                {quizSubmitted ? (
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                  >
                    Reset Quiz
                  </button>
                ) : (
                  <button
                    disabled={Object.keys(selectedAnswers).length === 0}
                    onClick={() => setQuizSubmitted(true)}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all"
                  >
                    Submit Answers
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Armstrong Axioms & Mathematical Foundations */}
      {subTab === 'axioms' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Armstrong&apos;s Axioms &amp; Inference Rules</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Sound and complete inference rules developed by William W. Armstrong (1974) for proving functional dependencies in relational databases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Axiom 1</span>
                <h3 className="font-bold text-sm text-white">Reflexivity Rule</h3>
                <div className="p-2 rounded bg-slate-900 font-mono text-xs text-cyan-300">
                  If Y ⊆ X, then X → Y
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  If an attribute set Y is a subset of X, then X functionally determines Y. Example: {'{ProductID, ProductName}'} → ProductID.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Axiom 2</span>
                <h3 className="font-bold text-sm text-white">Augmentation Rule</h3>
                <div className="p-2 rounded bg-slate-900 font-mono text-xs text-emerald-300">
                  If X → Y, then XZ → YZ
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Adding attributes to both sides of a functional dependency preserves the dependency relation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">Axiom 3</span>
                <h3 className="font-bold text-sm text-white">Transitivity Rule</h3>
                <div className="p-2 rounded bg-slate-900 font-mono text-xs text-purple-300">
                  If X → Y and Y → Z, then X → Z
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Functional dependencies can be chained. Normalization to 3NF explicitly decomposes these chains to prevent data anomalies.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Secondary Derived Inference Rules
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">Union (Additive)</span>
                  <div className="text-slate-300">X → Y and X → Z ⇒ X → YZ</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-blue-400 font-bold block mb-1">Decomposition</span>
                  <div className="text-slate-300">X → YZ ⇒ X → Y and X → Z</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Pseudotransitivity</span>
                  <div className="text-slate-300">X → Y and WY → Z ⇒ WX → Z</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
