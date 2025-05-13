import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Pencil, Trash2, Save, X, Plus, Check, XCircle } from 'lucide-react';
import { useData, QuizQuestion } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Quiz: React.FC = () => {
  const { quizQuestions, addQuizQuestion, updateQuizQuestion, deleteQuizQuestion } = useData();
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Quiz game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      addQuizQuestion(newQuestion, newAnswer);
      setNewQuestion('');
      setNewAnswer('');
      setShowForm(false);
    }
  };

  const handleEditClick = (question: QuizQuestion) => {
    setEditingId(question.id);
    setEditQuestion(question.question);
    setEditAnswer(question.answer);
  };

  const handleSaveEdit = () => {
    if (editingId && editQuestion.trim() && editAnswer.trim()) {
      updateQuizQuestion(editingId, editQuestion, editAnswer);
      setEditingId(null);
    }
  };
  
  const startQuiz = () => {
    setIsPlaying(true);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setGameOver(false);
  };
  
  const checkAnswer = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };
  
  const restartQuiz = () => {
    startQuiz();
  };
  
  const quitQuiz = () => {
    setIsPlaying(false);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="page-container">
      <PageHeader 
        title="Prueba" 
        subtitle="Una prueba para saber cuanto sabemos del otro dx" 
        icon={<BrainCircuit size={24} />} 
      />
      
      {!isPlaying ? (
        <>
          {/* Main quiz management UI */}
          <motion.div 
            className="mb-8 bg-primary-100 rounded-xl shadow-md p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-serif text-xl font-bold text-primary-800 mb-4">Play the Love Quiz</h2>
            <p className="text-primary-700 mb-6">Test your knowledge about your relationship with this fun quiz!</p>
            
            {quizQuestions.length > 0 ? (
              <ActionButton 
                onClick={startQuiz}
                className="px-8 py-3 text-lg"
              >
                <BrainCircuit size={20} />
                Start Quiz
              </ActionButton>
            ) : (
              <p className="text-primary-500 italic">Add some questions below to start the quiz!</p>
            )}
          </motion.div>
          
          {/* Toggle Add Form */}
          {!showForm && (
            <div className="mb-6 flex justify-center">
              <ActionButton 
                onClick={() => setShowForm(true)}
                className="px-6"
              >
                <Plus size={18} />
                Add New Question
              </ActionButton>
            </div>
          )}
          
          {/* Add new question form */}
          <AnimatePresence>
            {showForm && (
              <motion.div 
                className="mb-8 bg-white rounded-xl shadow-md p-5"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-serif text-xl text-primary-700">Add a New Question</h2>
                  <button 
                    className="text-gray-400 hover:text-gray-600" 
                    onClick={() => setShowForm(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Enter your question..."
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer
                    </label>
                    <input
                      type="text"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Enter the answer..."
                      className="input w-full"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <ActionButton 
                      variant="secondary" 
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </ActionButton>
                    <ActionButton 
                      onClick={handleAddQuestion}
                    >
                      <Plus size={18} />
                      Add Question
                    </ActionButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Questions list */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-primary-700 mb-4">Your Questions</h2>
            
            {quizQuestions.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">No questions yet. Add your first question!</p>
            ) : (
              <AnimatePresence>
                {quizQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    className="card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -3 }}
                  >
                    {editingId === question.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question
                          </label>
                          <input
                            type="text"
                            value={editQuestion}
                            onChange={(e) => setEditQuestion(e.target.value)}
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Answer
                          </label>
                          <input
                            type="text"
                            value={editAnswer}
                            onChange={(e) => setEditAnswer(e.target.value)}
                            className="input w-full"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <ActionButton 
                            variant="secondary" 
                            onClick={() => setEditingId(null)}
                          >
                            <X size={16} />
                            Cancel
                          </ActionButton>
                          <ActionButton 
                            onClick={handleSaveEdit}
                          >
                            <Save size={16} />
                            Save
                          </ActionButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-2">
                          <h3 className="font-medium text-primary-800">{question.question}</h3>
                          <p className="text-primary-600 text-sm mt-1">Answer: {question.answer}</p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <ActionButton 
                            variant="secondary" 
                            onClick={() => handleEditClick(question)}
                            className="px-2 py-1"
                          >
                            <Pencil size={16} />
                            Edit
                          </ActionButton>
                          <ActionButton 
                            variant="danger" 
                            onClick={() => setDeleteId(question.id)}
                            className="px-2 py-1"
                          >
                            <Trash2 size={16} />
                            Delete
                          </ActionButton>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </>
      ) : (
        /* Quiz gameplay UI */
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {!gameOver ? (
            <>
              <div className="text-center mb-6">
                <div className="bg-primary-100 text-primary-800 rounded-full px-4 py-1 inline-block mb-2">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </div>
                <h2 className="text-2xl font-serif font-bold text-primary-800">
                  {quizQuestions[currentQuestionIndex].question}
                </h2>
              </div>
              
              <div className="mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="input w-full text-lg p-4"
                  disabled={isCorrect !== null}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userAnswer.trim() && isCorrect === null) {
                      checkAnswer();
                    }
                  }}
                />
              </div>
              
              {isCorrect !== null && (
                <motion.div 
                  className={`p-4 rounded-lg mb-6 ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-accent-100 text-accent-800'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {isCorrect ? (
                    <div className="flex items-center">
                      <Check size={20} className="mr-2" />
                      <span>Correct! Well done!</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle size={20} className="mr-2" />
                      <span>
                        Not quite. The correct answer is: <strong>{quizQuestions[currentQuestionIndex].answer}</strong>
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
              
              <div className="flex justify-between">
                <ActionButton 
                  variant="secondary" 
                  onClick={quitQuiz}
                >
                  Quit Quiz
                </ActionButton>
                
                {isCorrect === null ? (
                  <ActionButton 
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim()}
                    className={!userAnswer.trim() ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Check Answer
                  </ActionButton>
                ) : (
                  <div></div>
                )}
              </div>
              
              <div className="mt-6 text-center text-primary-500">
                Current score: {score} / {currentQuestionIndex + (isCorrect !== null ? 1 : 0)}
              </div>
            </>
          ) : (
            /* Game over screen */
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl font-serif font-bold text-primary-800 mb-4">Quiz Complete!</h2>
              
              <div className="text-6xl font-bold my-8">
                {score} / {quizQuestions.length}
              </div>
              
              <p className="text-lg text-primary-600 mb-8">
                {score === quizQuestions.length 
                  ? "Perfect score! You know your partner so well!" 
                  : score > quizQuestions.length / 2 
                    ? "Great job! You know your partner quite well!"
                    : "Keep learning about your partner! There's always more to discover."}
              </p>
              
              <div className="flex justify-center gap-4">
                <ActionButton 
                  variant="secondary" 
                  onClick={quitQuiz}
                >
                  Back to Questions
                </ActionButton>
                <ActionButton onClick={restartQuiz}>
                  Play Again
                </ActionButton>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteQuizQuestion(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
      />
    </div>
  );
};

export default Quiz;