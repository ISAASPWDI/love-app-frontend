import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Pencil, Trash2, Save, X, Plus, Check, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import PageHeader from '../components/PageHeader';
import ActionButton from '../components/ActionButton';
import ConfirmDialog from '../components/ConfirmDialog';

const Quiz: React.FC = () => {
  const { 
    quizQuestions, 
    addQuizQuestion, 
    updateQuizQuestion, 
    deleteQuizQuestion,
    evaluateQuizAnswers,
    loading,
    error,
    refreshQuizQuestions
  } = useData();
  
  useEffect(() => {
    refreshQuizQuestions();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Quiz game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Array<{
    questionId: number;
    userAnswer: string;
    question: string;
    correctAnswer: string;
  }>>([]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddQuestion = async () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      try {
        await addQuizQuestion(newQuestion.trim(), newAnswer.trim());
        setNewQuestion('');
        setNewAnswer('');
        setShowForm(false);
        showNotification('Pregunta agregada correctamente', 'success');
      } catch (err: unknown) {
        showNotification('No se pudo agregar la pregunta', 'error');
      }
    }
  };

  const handleEditClick = (question: any) => {
    setEditingId(question.id);
    setEditQuestion(question.question);
    setEditAnswer(question.answer);
  };

  const handleSaveEdit = async () => {
    if (editingId && editQuestion.trim() && editAnswer.trim()) {
      try {
        await updateQuizQuestion(editingId, editQuestion.trim(), editAnswer.trim());
        setEditingId(null);
        showNotification('Pregunta actualizada correctamente', 'success');
      } catch (error) {
        showNotification('Algo salió mal al actualizar la pregunta', 'error');
      }
    }
  };
  
  const handleDeleteQuestion = async (id: number) => {
    try {
      await deleteQuizQuestion(id);
      setDeleteId(null);
      showNotification('Pregunta eliminada correctamente', 'success');
    } catch (error) {
      showNotification('Algo salió mal al eliminar la pregunta', 'error');
    }
  };
  
  const startQuiz = () => {
    setIsPlaying(true);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setGameOver(false);
    setQuizResult(null);
    setUserAnswers([]);
  };
  
  const checkAnswer = async () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
    
    // Update user answers
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id!,
      question: currentQuestion.question,
      correctAnswer: currentQuestion.answer,
      userAnswer: userAnswer.trim()
    };
    setUserAnswers(updatedUserAnswers);
    
    setTimeout(async () => {
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
    setQuizResult(null);
    setUserAnswers([]);
  };

  if (loading && quizQuestions.length === 0) {
    return (
      <div className="page-container">
        <PageHeader 
        title="Prueba" 
        subtitle="Una prueba para saber cuanto sabemos del otro dx" 
        icon={<BrainCircuit size={24} />} 
      />
        <div className="flex justify-center">
          <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>Cargando cumplidos...</p>
        </div>
      </div>
    );
  }
  
  if (error && quizQuestions.length === 0) {
    return (
      <div className="page-container">
        <PageHeader 
        title="Prueba" 
        subtitle="Una prueba para saber cuanto sabemos del otro dx" 
        icon={<BrainCircuit size={24} />} 
      />
        <div className="flex-wrap justify-center items-center h-64">
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">Error: {error}</p>
          <div className="flex justify-center">
            <ActionButton onClick={refreshQuizQuestions} className="ml-4">
              Reintentar
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader 
        title="Prueba" 
        subtitle="Una prueba para saber cuanto sabemos del otro dx" 
        icon={<BrainCircuit size={24} />} 
      />
      
      {/* Notification Modal */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className="fixed inset-0 flex justify-center items-start pt-12 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`rounded-lg shadow-xl p-4 flex items-center ${
                notification.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
              initial={{ y: -50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.9 }}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="mr-2" />
              ) : (
                <AlertCircle className="mr-2" />
              )}
              <span>{notification.message}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlaying ? (
        <>
          {/* Main quiz management UI */}
          <motion.div 
            className="mb-8 bg-primary-100 rounded-xl shadow-md p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className=" text-xl font-bold text-primary-800 mb-4">Juega una pequeña prueba</h2>
            <p className="text-primary-700 mb-6">Prueba tu conocimiento sobre el otro con preguntas interesantes xd...</p>
            
            {quizQuestions.length > 0 ? (
              <div className="flex justify-center">
                <ActionButton 
                onClick={startQuiz}
                className="px-8 py-3 text-lg"
              >
                <BrainCircuit size={20} />
                Iniciar prueba
              </ActionButton>
              </div>
            ) : (
              <p className="text-primary-500 italic">Agrega algunas preguntas debajo para iniciar con la prueba!</p>
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
                Agregar nueva pregunta
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
                  <h2 className=" text-xl text-primary-700">Agregar una nueva pregunta</h2>
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
                      Pregunta
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Ingresa tu pregunta..."
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Respuesta
                    </label>
                    <input
                      type="text"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Ingresa tu respuesta..."
                      className="input w-full"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <ActionButton 
                      variant="secondary" 
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </ActionButton>
                    <ActionButton 
                      onClick={handleAddQuestion}
                    >
                      <Plus size={18} />
                      Agregar pregunta
                    </ActionButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Questions list */}
          <div className="space-y-4">
            <h2 className=" text-xl text-primary-700 mb-4">Preguntas</h2>
            
            {quizQuestions.length === 0 ? (
              <div className="flex justify-center">
              <p className='bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded mb-4'>
                Aún no hay preguntas, agrega tu primera pregunta!
              </p>
            </div>
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
              Pregunta
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
              Respuesta
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
              Cancelar
            </ActionButton>
            <ActionButton 
              onClick={handleSaveEdit}
            >
              <Save size={16} />
              Guardar
            </ActionButton>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-2">
            <h3 className="font-medium text-primary-800">{question.question}</h3>
            <p className="text-primary-600 text-sm mt-1 blur-sm transition-all">
              Respuesta: {question.answer}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <ActionButton 
              variant="secondary" 
              onClick={() => handleEditClick(question)}
              className="px-2 py-1"
            >
              <Pencil size={16} />
              Editar
            </ActionButton>
            <ActionButton 
              variant="danger" 
              onClick={() => setDeleteId(question.id!)}
              className="px-2 py-1"
            >
              <Trash2 size={16} />
              Eliminar
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
                  Pregunta {currentQuestionIndex + 1} de {quizQuestions.length}
                </div>
                <h2 className="text-2xl  font-bold text-primary-800">
                  {quizQuestions[currentQuestionIndex].question}
                </h2>
              </div>
              
              <div className="mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Escribe tu respuesta..."
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
                      <span>Correcto 😊!</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle size={20} className="mr-2" />
                      <span>
                        No exactamente 💔. La repuesta correcta es: <strong>{quizQuestions[currentQuestionIndex].answer}</strong>
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
                  Salir
                </ActionButton>
                
                {isCorrect === null ? (
                  <ActionButton 
                    onClick={checkAnswer}
                    className={!userAnswer.trim() ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Revisar respuesta
                  </ActionButton>
                ) : (
                  <div></div>
                )}
              </div>
              
              <div className="mt-6 text-center text-primary-500">
                Puntuación: {score} / {currentQuestionIndex + (isCorrect !== null ? 1 : 0)}
              </div>
            </>
          ) : (
            /* Game over screen */
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl  font-bold text-primary-800 mb-4">Prueba completada!</h2>
              
              <div className="text-6xl font-bold my-8">
                {quizResult?.score ?? score} / {quizQuestions.length}
              </div>
              
              <p className="text-lg text-primary-600 mb-8">
                {quizResult ? (
                  quizResult.correctAnswers === quizResult.totalQuestions 
                    ? "Puntaje perfecto, tu si ah xd" 
                    : quizResult.correctAnswers > quizResult.totalQuestions / 2 
                      ? "Casi perfecto, pero aún asi duele 😂"
                      : "Rompiste el corazón de la pulga 💔🥲"
                ) : (
                  score === quizQuestions.length 
                    ? "Puntaje perfecto, tu si ah xd" 
                    : score > quizQuestions.length / 2 
                      ? "Casi perfecto, pero aún asi duele 😂"
                      : "Rompiste el corazón de la pulga 💔🥲"
                )}
              </p>
              
              <div className="flex justify-center gap-4">
                <ActionButton 
                  variant="secondary" 
                  onClick={quitQuiz}
                >
                  Volver a las preguntas
                </ActionButton>
                <ActionButton onClick={restartQuiz}>
                  Jugar otra vez
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
          if (deleteId !== null) {
            handleDeleteQuestion(deleteId);
          }
        }}
        title="Eliminar pregunta"
        message="¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default Quiz;